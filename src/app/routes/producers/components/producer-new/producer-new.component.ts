import { Component, HostBinding, OnDestroy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { conformToMask } from 'angular2-text-mask';;
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { TIProducerModel, TProducerModel } from 'src/app/shared/models/sil-producer';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { InternationalPhoneConfigurationEnum } from 'src/app/shared/utils/models/international-phones-configuration.enum';
import { ProducersService } from '../../services/producer/producers.service';
import { IProducerFederatedModel } from '../../models/producer-federated.model';
import { deepCompareIsEqual } from 'src/app/shared/utils/functions/object-compare';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';

@Component({
  selector: 'app-producer-new',
  templateUrl: './producer-new.component.html',
  styleUrls: ['./producer-new.component.scss']
})
export class ProducerNewComponent implements OnDestroy {

  @BlockUI('hello') blockUI: NgBlockUI;
  @HostBinding('class') hostClasses = 'sil-overflow-container sil-overflow-container--padded';
  readonly CONSTANTS = CONSTANTS;
  public producerForm: UntypedFormGroup = new UntypedFormGroup({
    identity: new UntypedFormControl('', [
      Validators.minLength(CONSTANTS.IDENTITY_MASK.length),
      Validators.required
    ]),
    email: new UntypedFormControl('', [
      Validators.email,
      Validators.maxLength(
        CONSTANTS.MAX_LENGTH_EMAIL
      ),
    ]),
    phone: new UntypedFormControl('', Validators.pattern(
      CONSTANTS.INTERNATIONAL_PHONES[InternationalPhoneConfigurationEnum.DEFAULT_COUNTRY].REGEXP
    )),
    phoneCountry: new UntypedFormControl(''),
  })
  public enableCreateProducer = false;
  public isViewSelectPlatform: boolean = false;
  public onCreate$: Subject<boolean> = new Subject();
  public currentStep: number = CONSTANTS.NEW_PRODUCER_TABS.REFERENCE;
  public appsFederated: TIProducerModel[] = []
  public producer: TIProducerModel;
  public openApps = {};
  public federatedId: string;
  public hasPlatform: boolean = false;
  public initialForm: any;
  public formHasChanges: boolean = false;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private _alert: AlertService,
    private _router: Router,
    private _i18nPipe: I18nPipe,
    private _producerService: ProducersService,
    private _handlerError: ResponseErrorHandlerService,
  ) {
    this.producerForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((changes) => {
        if (this.initialForm) {
          this.formHasChanges = !deepCompareIsEqual(this.initialForm, changes);
        }
      });
    this.onCountryChanged(InternationalPhoneConfigurationEnum.DEFAULT_COUNTRY);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onProducerFormReady(form: UntypedFormGroup): void {
    form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.enableCreateProducer = form.valid;
    });
  }

  public onCountryChanged(country: string): void {
    if (country !== this.producerForm.get('phoneCountry').value) {
      this._changePhoneMask(country);
    }
  }

  private _changePhoneMask(country: string): void {
    const phoneControl = this.producerForm.get('phone');
    const phoneRegExp: RegExp =
      CONSTANTS.INTERNATIONAL_PHONES[country].REGEXP;
    const phoneValue: string = this._applyPhoneMask(
      country,
      phoneControl.value
    );
    this.producerForm.get('phoneCountry').setValue(country);
    phoneControl.clearValidators();
    phoneControl.setValue(phoneValue);
    phoneControl.setValidators(Validators.pattern(phoneRegExp));
    phoneControl.updateValueAndValidity();
  }

  private _applyPhoneMask(country: string, phone: string): string {
    return conformToMask(
      this._sanitizeInternationalPhoneNumber(phone),
      CONSTANTS.INTERNATIONAL_PHONES[country].MASK,
      { guide: false }
    ).conformedValue;
  }

  private _sanitizeInternationalPhoneNumber(phone: string): string {
    return phone ? phone.replace(/[^0-9\+]/gm, '') : phone;
  }

  private validateExistsProducer() {
    this._producerService.validateExistsProducer(this.producerForm.value)
      .pipe(take(1))
      .subscribe(
        () => this.searchFederated(),
        (error: HttpErrorResponse) => {
          const message: string = this._handlerError.handleError(
            error,
            't-producer'
          );
          this._alert.errorTitle(this._i18nPipe.transform('error-msg'), message);
        }
      )
  }

  private searchFederated() {
    this._producerService.searchProducerFederated(
      this.producerForm.get('identity').value,
      this.producerForm.get('email').value,
      this.producerForm.get('phone').value,
      this.producerForm.get('phoneCountry').value,
    )
      .pipe(take(1))
      .subscribe(
        (response: IProducerFederatedModel) => {
          if (response.apps.length > 0) {
            this.federatedId = response.federatedId;
            this.isViewSelectPlatform = true;
            this.appsFederated = response.apps;
          } else {
            this.producer = new TProducerModel(this.producerForm.value)
            this.currentStep = CONSTANTS.NEW_PRODUCER_TABS.GENERAL;
          }
        },
        error => {
          this.producer = new TProducerModel(this.producerForm.value)
          this.currentStep = CONSTANTS.NEW_PRODUCER_TABS.GENERAL;
        }
      )
  }

  public onCancel() {
    this._router.navigate(['routes', 'producers']);
  }

  public onSkip() {
    this.federatedId = null;
    this.isViewSelectPlatform = false;
    this.producer = new TProducerModel(this.producerForm.value);
    this.currentStep = CONSTANTS.NEW_PRODUCER_TABS.GENERAL;
  }

  public onNext() {
    this.initialForm = null;
    if (this.currentStep == + CONSTANTS.NEW_PRODUCER_TABS.REFERENCE) {
      if (this.isViewSelectPlatform) {
        this.currentStep = CONSTANTS.NEW_PRODUCER_TABS.GENERAL;
        this.isViewSelectPlatform = false;
      } else {
        this.validateExistsProducer();
      }
    } else {
      this.onCreate$.next(true);
    }
  }

  public toogleApp(app: any) {
    this.openApps[app.code] = this.openApps[app.code] ? !this.openApps[app.code] : true;
  }

  public onSelectPlatform(event: any) {
    this.producer = event.value;
    this.hasPlatform = true;
  }

  public onBack() {
    this.federatedId = null;
    this.producer = null;
    if (this.currentStep == CONSTANTS.NEW_PRODUCER_TABS.GENERAL) {
      this.currentStep = CONSTANTS.NEW_PRODUCER_TABS.REFERENCE;
    } else {
      this.isViewSelectPlatform = false;
    }
  }

  public goToReferenceData(producer: TIProducerModel) {
    this.producerForm.patchValue(producer);
    this.currentStep = CONSTANTS.NEW_PRODUCER_TABS.REFERENCE;
    this.initialForm = this.producerForm.value;
  }

}
