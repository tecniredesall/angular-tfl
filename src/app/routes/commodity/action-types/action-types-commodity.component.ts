import { Component, OnInit, Output, EventEmitter, Input, ViewChild, OnDestroy } from '@angular/core';
import { CommodityService } from '../services/commodity.service';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { NotifierService } from 'angular-notifier';
import { CommodityTypeModel, ICommodityTypeModel } from '../models/commodity-type.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResizedEvent } from 'angular-resize-event';
import { ICSVProperty } from 'src/app/shared/utils/models/csv-properties.model';
import { CSVActionsService } from 'src/app/shared/utils/csv-actions/csv-actions.service';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { validatorDuplicateDataFormArray } from 'src/app/shared/validators/validator-duplicate-data-form-array';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/theme/theme.service';
import { CommodityTransformationTypeModel, ICommodityTransformationTypeModel } from '../models/commodity-transformation-type.model';
import { HttpErrorResponse } from '@angular/common/http';
import { removeAccents } from 'src/app/shared/utils/functions/remove-accents';
import { CommodityTypeActionRequestModel, ICommodityTypeActionRequestModel } from '../models/commodity-type-action-request.model';
import { ModalDeleteCommodityTypeComponent } from '../modal-delete-commodity-type/modal-delete-commodity-type.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { trimLeadingTrailingComma } from "../../../shared/utils/functions/trim-leading-trailing-comma";
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

@Component({
  selector: 'app-action-types-commodity',
  templateUrl: './action-types-commodity.component.html',
  styleUrls: ['./action-types-commodity.component.scss']
})
export class ActionTypesCommodityComponent implements OnInit, OnDestroy {

  @Input() isEdit: boolean = false;
  @Input() commodityType: ICommodityTypeModel = new CommodityTypeModel();
  @Output() eventActionSelected: EventEmitter<any> = new EventEmitter();
  @ViewChild('csvReader') csvReader: any;
  @BlockUI('commodity-container') blockUI: NgBlockUI;

  readonly CONSTANTS: any = CONSTANTS;
  public isDarkTheme: boolean = false;
  public responsiveClass: string = '';
  public commodityTypeForm: UntypedFormArray = new UntypedFormArray([this.createForm()], validatorDuplicateDataFormArray('name'));
  public isLoadingTransformations: boolean = true;
  public transformations: Array<ICommodityTransformationTypeModel> = [];
  public dataWasMadeModified: boolean = false;
  private initialReferenceCommodityTypeEdit: any = new CommodityTypeModel();
  private dialogRef: MatDialogRef<ModalDeleteCommodityTypeComponent, any> = null;
  private _subscription: Subscription = new Subscription();

  constructor(
    private _commodityService: CommodityService,
    private _alertService: AlertService,
    private _i18nPipe: I18nPipe,
    private _notifierService: NotifierService,
    private _csvActionsService: CSVActionsService,
    private _themeService: ThemeService,
    private _dialog: MatDialog,
    private _errorHandler: ResponseErrorHandlerService
  ) {
    this._subscription.add(this._themeService.theme.subscribe(theme => this.isDarkTheme = ('dark' === theme)));
  }
  /**
   * init component
   */
  ngOnInit(): void {
    if (this.isEdit) {
      this.initialReferenceCommodityTypeEdit = new CommodityTypeModel(this.commodityType);
      delete this.initialReferenceCommodityTypeEdit.commodityId;
      delete this.initialReferenceCommodityTypeEdit.commodityName;
      this.transformations = [new CommodityTransformationTypeModel(this.commodityType.transformationType)];
      this.commodityTypeForm.at(0).patchValue({
        id: this.commodityType.id,
        name: this.commodityType.name,
        transformationType: this.commodityType.transformationType
      });
      this._subscription.add(
        this.commodityTypeForm.at(0).valueChanges.subscribe((data: any) => {
          this.dataWasMadeModified = (JSON.stringify(this.initialReferenceCommodityTypeEdit) != JSON.stringify(data));
        })
      );
    }
    this.getTransformationTypes();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public onEventContainerResized(event: ResizedEvent): void {
    this.responsiveClass = (event.newWidth < 535) ? 'action-types-commodity-xs' : 'action-types-commodity-lg';
  }

  /**
   * open file explorer
   */
  public openFileExplorer(): void {
    this.csvReader.nativeElement.click();
  }

  /**
   * Download Layout
   */
  public downloadLayout(): void {
    this._csvActionsService.downloadLayout(this._i18nPipe.transform('commodity-type'), this.generateProperties());
  }

  /**
   * upload file
   * @param event file
   */
  public uploadFile(event: any): void {
    this.blockUI.start();
    let properties: Array<ICSVProperty> = this.generateProperties();
    this._csvActionsService.uploadFile(event, properties, (data: Array<any>): boolean => { return true; }).then(
      (response: Array<ICommodityTypeModel>) => {
        this.csvReader.nativeElement.value = '';
        if (null != response) {
          this.commodityTypeForm.clear();
          response.forEach((item: ICommodityTypeModel) => {
            let transformationNameCSV: string = removeAccents(item.transformationTypeNameCSV.toLowerCase());
            let idxTransformationMatch: number = this.transformations.findIndex((t: ICommodityTransformationTypeModel) => removeAccents(t.name.toLowerCase()) == transformationNameCSV);
            item.commodityId = this.commodityType.commodityId;
            if (idxTransformationMatch > -1) {
              item.transformationType = new CommodityTransformationTypeModel(this.transformations[idxTransformationMatch]);
              item.transformationTypeNameCSV = '';
            }
            this.commodityTypeForm.push(this.createForm(item, true));
          });
        }
        this.blockUI.stop();
      }
    );
  }

  private generateProperties(): Array<ICSVProperty> {
    return [
      {
        property: 'name',
        column: `${this._i18nPipe.transform('comm-type-name')}*`,
      },
      {
        property: 'transformationTypeNameCSV',
        column: `${this._i18nPipe.transform('transformation-type-name')}*`
      }
    ];
  }

  private createForm(item: ICommodityTypeModel = new CommodityTypeModel(), markAsDirty: boolean = false): UntypedFormGroup {
    let formGroup: UntypedFormGroup = new UntypedFormGroup({
      id: new UntypedFormControl(item.id),
      name: new UntypedFormControl(item.name, [Validators.required, Validators.maxLength(CONSTANTS.MAX_LENGTH_COMMODITY_TYPE_NAME), Validators.pattern(CONSTANTS.ALPHANUMERIC_REGEXP)]),
      transformationType: new UntypedFormControl(item.transformationType, [Validators.required]),
      transformationTypeNameCSV: new UntypedFormControl(item.transformationTypeNameCSV)
    });
    if (markAsDirty) {
      formGroup.get('name').markAsDirty();
      formGroup.get('transformationType').markAsDirty();
    }
    return formGroup;
  }

  public addItem(): void {
    this.commodityTypeForm.push(this.createForm());
  }

  public removeItem(index: number): void {
    this.commodityTypeForm.removeAt(index);
  }

  public searchTransformation(term: string, item: ICommodityTransformationTypeModel): boolean {
    let searchText: string = removeAccents(term.toLowerCase());
    return removeAccents(item.name.toLowerCase()).includes(searchText);
  }

  public setTransformation(index: number): void {
    if (!this.isEdit) {
      this.commodityTypeForm.at(index).patchValue({ transformationTypeNameCSV: '' });
    }
  }

  private getTransformationTypes(): void {
    if (!this.isEdit) {
      this.blockUI.start();
    }
    this._subscription.add(
      this._commodityService.getTransformationTypes().subscribe(
        (response: Array<ICommodityTransformationTypeModel>) => {
          if (response) {
            this.transformations = response;
          }
          else {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          }
          this.isLoadingTransformations = false;
          this.blockUI.stop();
        },
        (error: HttpErrorResponse) => {
          this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          this.isLoadingTransformations = false;
          this.blockUI.stop();
        }
      )
    );
  }

  private getCommodityTypesActionRequestData(): Array<ICommodityTypeActionRequestModel> {
    let data: Array<ICommodityTypeActionRequestModel> = [];
    this.commodityTypeForm.getRawValue().forEach((item: ICommodityTypeModel) => {
      item.commodityId = this.commodityType.commodityId;
      data.push(new CommodityTypeActionRequestModel(item))
    });
    return data;
  }

  /**
   * Cancel an action
   */
  private cancel(): void {
    this.eventActionSelected.emit(CONSTANTS.CRUD_ACTION.CANCEL);
  }

  private createCommodityType(): void {
    this.blockUI.start();
    let data: Array<ICommodityTypeActionRequestModel> = this.getCommodityTypesActionRequestData();
    this._subscription.add(
      this._commodityService.createCommodityType(data).subscribe(
        (response: any) => {
          if (response.status) {
            let msg: string = 1 == data.length ? 'success-commodity-type-create' : 'success-commodity-types-create';
            this._notifierService.notify('success', this._i18nPipe.transform(msg));
            this.eventActionSelected.emit(CONSTANTS.CRUD_ACTION.CREATE);
          }
          else {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          }
          this.blockUI.stop();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 406) {
            let msg = this._i18nPipe.transform('duplicate-register');
            error.error.data.duplicate.forEach((dup) => { msg += `${dup}, `; });
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), trimLeadingTrailingComma(msg));
          }
          else {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          }
          this.blockUI.stop();
        }
      )
    );
  }

  /**
   * Save update commodity
   */
  private editCommodityType(): void {
    this.blockUI.start();
    let data: ICommodityTypeActionRequestModel = this.getCommodityTypesActionRequestData()[0];
    this._subscription.add(
      this._commodityService.editCommodityType(data).subscribe(
        (response: any) => {
          if (response.status) {
            this._notifierService.notify('success', this._i18nPipe.transform('success-commodity-type-edit'));
            this.eventActionSelected.emit(CONSTANTS.CRUD_ACTION.UPDATE);
          }
          else {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          }
          this.blockUI.stop();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 406) {
            let msg: string = '';
            if (error.error.data.name) {
              msg = `${this._i18nPipe.transform('duplicate-register')} ${data.name}`;
            }
            else if ('related_weight_note' == error.error.data) {
              msg = this._i18nPipe.transform('commodity-type-related-weight-note');
            }
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
          } else if (error.status == 403){
            let msg = this._errorHandler.handleError(error, 'commodity-type');
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
          }
          else {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          }
          this.blockUI.stop();
        }
      )
    );
  }

  /**
   * Delete commodity type
   */
  public deleteCommodityType(): void {
    this.dialogRef = this._dialog.open(ModalDeleteCommodityTypeComponent, {
      autoFocus: false,
      disableClose: true,
      data: this.commodityType
    });
    this._subscription.add(
      this.dialogRef.afterClosed().subscribe((response) => {
        this.dialogRef = null;
        if (response.refresh) {
          this.eventActionSelected.emit(CONSTANTS.CRUD_ACTION.DELETE);
        }
      })
    );
  }

  public onActionFooterSelected(action: number): void {
    switch (action) {
      case CONSTANTS.CRUD_ACTION.CREATE:
        this.createCommodityType();
        break;
      case CONSTANTS.CRUD_ACTION.UPDATE:
        this.editCommodityType();
        break;
      case CONSTANTS.CRUD_ACTION.DELETE:
        this.deleteCommodityType();
        break;
      case CONSTANTS.CRUD_ACTION.CANCEL:
        this.cancel();
        break;
      default:
        break;
    }
  }

}
