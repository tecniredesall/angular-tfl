import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { parseRegex } from 'src/app/shared/utils/functions/string-to-regex';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ModalCancelTastingComponent } from '../modal-cancel-tasting/modal-cancel-tasting.component';
import { TastingService } from '../services/tasting.service';

@Component({
  selector: 'app-create-tasting',
  templateUrl: './create-tasting.component.html',
  styleUrls: ['./create-tasting.component.scss']
})
export class CreateTastingComponent implements OnInit {

  @BlockUI('tasting-frame') blockUILayout: NgBlockUI;
  readonly templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;

  public lote;
  public loteId;
  public formJson: any = {};
  public lang = 'es';
  public generateForm = {};
  public maxDate: moment.Moment = moment();
  public payLoad = [];
  public generateDynamic: boolean = true;
  public positiveDecimalNumberMask: any = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: this.DECIMAL_DIGITS
  });

  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private _i18nService: I18nService,
    private http: HttpClient,
    private _tastingService: TastingService,
    private _notifierService: NotifierService,
    private _i18nPipe: I18nPipe,
    private _dialog: MatDialog
  ) {
    this.blockUILayout.start();
    this._Activatedroute.paramMap.subscribe(params => {
      this.lote = params.get('lote');
      this.loteId = params.get('lote_id');
    });
    this.maxDate = moment();
    this._getDynamicTastingForm();
  }

  private _getDynamicTastingForm() {
    this._tastingService.getDynamicForm().subscribe(resp => {
      this.formJson = resp;
      this._generateSections();
    });
  }

  ngOnInit(): void {

    this._i18nService.langChanged.subscribe((resp) => {
      this.lang = resp;
    });

    this.maxDate = moment();
  }

  private _generateSections() {
    this.formJson.data.forEach(item => {
      this.generateForm[item.section.name] = new UntypedFormGroup(this._generateFormGroup(item.section));
    });



    this.generateDynamic = false;

    this.blockUILayout.stop();
  }


  private _generateFormGroup(item) {

    const isAverage = item.fields.find(o => o.name === CONSTANTS.TYPE_FIELDS_TASTING.AVERAGE || o.name === CONSTANTS.TYPE_FIELDS_TASTING.DAMAGE_AVERAGE);

    let formSectionControl = {};


    item.fields.forEach(formControl => {
      let validation = [];
      formControl.rules && formControl.rules.forEach(rules => {
        const { rule } = rules;
        rule.required == true && validation.push(Validators.required);
        rule.min ?? validation.push(Validators.min(rule.min));
        rule.max && validation.push(Validators.max(rule.max));

        rule.pattern && validation.push(Validators.pattern(parseRegex(rule.pattern)));
      });


      if (formControl?.extras && formControl.extras.is_catalog) {
        this._getCatalogSelects(formControl.extras.uri).subscribe(resp => {
          formControl.extras.options = resp;
        });
      }

      let defaultValue = '';

      if (formControl.default) {
        defaultValue = this.setDefaultValues(formControl);
      }

      formSectionControl[formControl.name] = new UntypedFormControl(defaultValue, validation);
      isAverage != undefined ? item[CONSTANTS.TYPE_FIELDS_TASTING.AVERAGE] = true : false;

      formControl.rules && formControl.rules.forEach(rules => {
        const { rule } = rules;
        rule.disabled && formSectionControl[formControl.name].disable();

      });

      formSectionControl[formControl.name]['id'] = formControl.id;
      formSectionControl[formControl.name]['name'] = formControl.name;
      formSectionControl[formControl.name]['type'] = formControl.type;
      formSectionControl[formControl.name]['negative'] = formControl?.extras && formControl?.extras.negative ? true : false;
    });


    if (item.name === CONSTANTS.TYPE_FIELDS_TASTING.LAB_DETAILS) {
      formSectionControl[CONSTANTS.TYPE_FIELDS_TASTING.OTHER] = new UntypedFormControl('');
    }

    return formSectionControl;
  }

  private setDefaultValues(formControl) {
    return formControl.default['id'] ? formControl.default['id'] : formControl.default[formControl.name];
  }

  public findRule(field: any, param) {
    const rule = field.rules.find((r: any) => !!r.rule[param]);
    return !!rule;
  }

  public backLote() {
    this._router.navigateByUrl(`/routes/weight-note/lots/lot/${this.loteId}`);
  }

  public disabledAceptBtn() {
    for (let value of Object.values(this.generateForm)) {
      if (value['status'] == 'INVALID') {
        return true;
      }
    }
    return false;
  }

  private _getCatalogSelects(url: string): Observable<any[]> {
    const uri_owner = `${localStorage.getItem('uri-owner')}`;
    const baseCountriesUri = `${uri_owner}${url}`;
    return this.http.get(`${baseCountriesUri}`).pipe(map((r: any) => r.data));

  }

  public getMeError(sectionName: string, field: any) {
    if (!this.generateForm[sectionName].get(field.name).errors) {
      return
    }

    const errorDynamicForm: Array<any> = this.generateForm[sectionName].get(field.name)?.errors;
    const keyRule: string = Object.keys(errorDynamicForm)[0];

    const rule = field.rules.find((r: any) => !!r.rule[keyRule]);
    return rule?.errors;
  }

  public setDate() {
    this.maxDate = moment();
  }

  public validateTypeNumber(event) {
    return event.keyCode == 69 ? false : true;
  }

  public getDate() {
    this.maxDate = moment();
  }

  public setNewTasting() {
    Object.values(this.generateForm).forEach((elem: any) => {
      this._getindividualValues(elem.controls);
    });

    const send = {
      "lot_id": this.loteId,
      "fields": this.payLoad
    }

    this._tastingService.createTasting(send).subscribe(resp => {
      this._notifierService.notify('success', this._i18nPipe.transform("save-tasting").replace('value', this.lote));
      this.backLote();
    }, err => {
      this._notifierService.notify('error', this._i18nPipe.transform("unknow-error"));
    });

  }

  private _getindividualValues(controls) {

    Object.values(controls).forEach((key: any) => {

      if (key.name === CONSTANTS.TYPE_FIELDS_TASTING.ROAST && key.value == 3) {
        const newRoast = this.generateForm[CONSTANTS.TYPE_FIELDS_TASTING.LAB_DETAILS].get('other').value;
        key.value = newRoast;
      }
      if (key.name) {
        this.payLoad.push({
          id_configuration: key.id,
          value: key.value,
          name: key.name
        });
      }

    });
  }

  public sumAvarage(section) {
    const fielAverageName = section === CONSTANTS.TYPE_FIELDS_TASTING.DAMAGE ? this.generateForm[section].get('damage_average') : this.generateForm[section].get('average');

    fielAverageName.patchValue(0);
    let total = 0;
    const valuesSection = this.generateForm[section].getRawValue();

    const controls = this.generateForm[section].controls;

    Object.keys(valuesSection).forEach(el => {
      controls[el].name !== CONSTANTS.TYPE_FIELDS_TASTING.DEFECT && valuesSection[el] !== null && valuesSection[el] !== '' ? total += parseFloat(valuesSection[el]) : total -= valuesSection[el];
    });

    fielAverageName.patchValue(total && total.toFixed(2));

  }

  private cancelTastingModalRef: MatDialogRef<any> = null;


  public cancelTasting() {
    this.cancelTastingModalRef = this._dialog.open(
      ModalCancelTastingComponent,
      {
        autoFocus: false,
        disableClose: true,
        data: "",
      }
    );

    this.cancelTastingModalRef.afterClosed().subscribe(resp => {
      if (resp.cancel) {
        this.backLote();
      }
    });
  }

}
