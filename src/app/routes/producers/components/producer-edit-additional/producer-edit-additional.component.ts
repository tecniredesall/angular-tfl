import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { conformToMask } from 'angular2-text-mask';
import * as moment from 'moment';
import { Subject, forkJoin, of } from 'rxjs';
import { filter, takeUntil, take, tap } from 'rxjs/operators';
import { TIProducerModel } from 'src/app/shared/models/sil-producer';
import { CatalogsService } from 'src/app/shared/services/catalogs/catalogs.service';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { PaginationModel } from 'src/app/shared/utils/models/paginator.model';

@Component({
  selector: 'app-producer-edit-additional',
  templateUrl: './producer-edit-additional.component.html',
  styleUrls: ['./producer-edit-additional.component.scss']
})
export class ProducerEditAdditionalComponent implements OnInit, OnChanges {

  @Input() producer: TIProducerModel;
  @Input() action: number;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  public form: UntypedFormGroup;
  public ACTIONS = CONSTANTS.CRUD_ACTION;
  public CONSTANTS = CONSTANTS;
  public schoolarships = [];
  public professions = [];
  public maritalStatuses = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private multiPagination: {
    [key: string]: PaginationModel;
  };

  public loadingState = {
    schoolarships: false,
    professions: false,
    maritalStatuses: false
  };

  public noEvent = {
    emitEvent: false,
  };
  public genders = [
    {id: CONSTANTS.GENDERS.MALE, label: 'producer-gender-male'},
    {id: CONSTANTS.GENDERS.FEMALE, label: 'producer-gender-female'},
    {id: CONSTANTS.GENDERS.OTHER, label: 'producer-gender-other'},
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private catalogsService: CatalogsService,
    private paginationService: PaginationService
  ) { }

  public ngOnInit() {
    this.setLookups(this.producer);
    this.setForm(this.producer);
    this.paginationService.multipagination$
      .pipe(
        filter(p => !!p),
        takeUntil(this.destroy$)
      )
      .subscribe(p => this.multiPagination = p);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes.producer && !changes.producer?.firstChange){
      if(changes.producer.currentValue.birthdate != changes.producer.previousValue.birthdate){
        let age =  this.producer.birthdate?.diff(moment(), 'years') * -1;
        this.form.patchValue({age: age})
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private setForm(producer: TIProducerModel) {
    this.form = this.formBuilder.group({
      age: [
        {
          value: this.producer.birthdate ? this.producer.birthdate.diff(moment(), 'years') * -1 : producer.age,
          disabled: true
        }
      ],
      scholarshipId: [
        producer.scholarshipId
      ],
      professionId: [
        producer.professionId
      ],
      contactName: [
        producer.contactName,
        [
          Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
          Validators.maxLength(CONSTANTS.MAX_LENGTH_PRODUCER_NAME),
        ]
      ],
      contactPhone: [
        producer.contactPhone
            ? this.applyPhoneMask(producer.contactPhoneCountry, producer.contactPhone)
            : '',
        [
            Validators.pattern(
                CONSTANTS.INTERNATIONAL_PHONES[producer.contactPhoneCountry].REGEXP
            ),
        ],
      ],
      contactPhoneCountry: [producer.contactPhoneCountry],
      maritalStatusId: [
        producer.maritalStatusId
      ],
      gender: producer.gender
    });
    this.formReady.emit(this.form);
    this.onCountryChanged(producer.contactPhoneCountry);
  }

  private setLookups(producer: TIProducerModel) {
    this.getSchoolarships(null);
    this.getProfessions(null, producer.professionId);
    this.getMaritalStatus(null);
  }

  public onValueChanged(value: any, control: string) {
    this.form.get(control).setValue(value.id);
  }


  private getSchoolarships(query?: string) {
    this.loadingState.schoolarships = true;
    this.catalogsService.getSchoolarships(query)
      .pipe(take(1))
      .subscribe((schoolarships) => {
        this.schoolarships = schoolarships;
        this.loadingState.schoolarships = false;
      });
  }


  private getProfessions(query?: string, currentProfessionId?: number) {
    this.loadingState.professions = true;
    forkJoin([
      this.catalogsService.getProfessions(query),
      currentProfessionId
        ? this.catalogsService.getProfession(currentProfessionId)
        : of(null),
    ])
      .pipe(take(1))
      .subscribe(([professions, profession]) => {
        const newProfessions =
          profession && profession.length > 0
            ? professions.filter((s) => s.id !== profession.id)
            : professions;
        this.professions = profession ? [...newProfessions, profession] : newProfessions;
        this.loadingState.professions = false;
      });
  }

  private getMaritalStatus(query?: string) {
    this.loadingState.maritalStatuses = true;
    this.catalogsService.getMaritalStatuses(query)
      .pipe(take(1))
      .subscribe((maritalStatuses) => {
        this.maritalStatuses = maritalStatuses;
        this.loadingState.maritalStatuses = false;
      });
  }


  public onCountryChanged(country: string): void {
    if (country !== this.form.get('contactPhoneCountry').value) {
      this.changePhoneMask(country);
    }
  }

  public onPhoneChanged(event: any): void {
    const country: string = this.form.get('contactPhoneCountry').value;
    if (country !== this.form.get('contactPhoneCountry').value) {
      const cursorStart = event.target.selectionStart;
      const cursorEnd = event.target.selectionEnd;
      this.changePhoneMask(country);
      event.target.setSelectionRange(cursorStart, cursorEnd);
    }
  }

  private sanitizeInternationalPhoneNumber(phone: string): string {
    return phone ? phone.replace(/[^0-9\+]/gm, '') : phone;
  }

  private applyPhoneMask(country: string, phone: string): string {
    return conformToMask(
      this.sanitizeInternationalPhoneNumber(phone),
      CONSTANTS.INTERNATIONAL_PHONES[country].MASK,
      { guide: false }
    ).conformedValue;
  }

  private changePhoneMask(country: string): void {
    const phoneControl = this.form.get('contactPhone');
    const phoneRegExp: RegExp =
      CONSTANTS.INTERNATIONAL_PHONES[country].REGEXP;
    const phoneValue: string = this.applyPhoneMask(
      country,
      phoneControl.value
    );
    this.form.get('contactPhoneCountry').setValue(country);
    phoneControl.clearValidators();
    phoneControl.setValidators(Validators.pattern(phoneRegExp));
    phoneControl.setValue(phoneValue);
    phoneControl.updateValueAndValidity();
  }

  public onDropdownReachedEnd(control: string) {
    const pageEvent = new PageEvent();
    let uri: string;
    pageEvent.previousPageIndex = this.multiPagination[control].current_page;
    pageEvent.pageIndex = this.multiPagination[control].current_page + 1;
    if (pageEvent.pageIndex <= this.multiPagination[control].last_page) {
      uri = this.paginationService.getMultipagedPageUri(
        control,
        pageEvent
      );
      this.loadingState[control] = true;
      this.catalogsService
        .appendData(uri, control)
        .pipe(
          take(1),
          tap(() => (this.loadingState[control] = false))
        )
        .subscribe((d) => (this[control] = [...this[control], ...d]));
    }
  }

  public onDropdownSearch(query: any, control: string) {
    const term: string = query?.term ?? '';
    switch (control) {
      case 'schoolarships':
        this.getSchoolarships(term);
        break;
      case 'professions':
        this.getProfessions(term);
        break;
      case 'maritalStatus':
        this.getMaritalStatus(term);
        break;
    }
  }

}
