
import { Component, Output, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { CommodityModel, ICommodityModel } from '../models/commodity.model';
import { CommodityService } from '../services/commodity.service';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { NotifierService } from 'angular-notifier';
import { GeneralCommodityModel } from '../models/general-commodity.model';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/theme/theme.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ICommodityActionRequestModel, CommodityActionRequestModel } from "../models/commodity-action-request.model";
import { validatorDuplicateDataFormArray } from 'src/app/shared/validators/validator-duplicate-data-form-array';
import { IVarietyCommodityModel, VarietyCommodityModel } from '../models/variety-commodity.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalDeleteCommodityComponent } from '../modal-delete-commodity/modal-delete-commodity.component';
import { trimLeadingTrailingComma } from 'src/app/shared/utils/functions/trim-leading-trailing-comma';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { UnitMeasureModel, IUnitMeasureModel } from '../models/unit-measure.model';
import {UnitConvertion} from './../models/unit-convertion.model'
import { take } from 'rxjs/operators';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrdersService } from '../../purchase-orders/services/purchase-orders.service';
@Component({
    selector: 'app-action-commodity',
    templateUrl: './action-commodity.component.html',
    styleUrls: ['./action-commodity.component.scss']
})
export class ActionCommodityComponent implements OnInit, OnDestroy {

    @Input() isEdit: boolean = false;
    @Input() commodity: ICommodityModel = new CommodityModel();
    @Output() eventActionSelected: EventEmitter<any> = new EventEmitter();
    @BlockUI('commodity-container') blockUI: NgBlockUI;

    readonly CONSTANTS: any = CONSTANTS;
    public commodityForm: UntypedFormGroup = this.createCommodityFormGroup();
    public indexVarietyDelete: number = null;
    public dataWasMadeModified: boolean = false;
    public commodities: Array<GeneralCommodityModel> = [];
    public isLoadingCommodities = true;
    public isLoadingUnitsMeasure = true;
    public wasRemovedVarieties: boolean = false;
    public isDarkTheme: boolean = false;
    public units: Array<UnitMeasureModel> = [];
    public unitsForTotals: Array<UnitConvertion> = [];
    private initialReferenceCommodityEdit: ICommodityModel = new CommodityModel();
    private dialogRef: MatDialogRef<ModalDeleteCommodityComponent, any> = null;
    private _configuration: ITRConfiguration;
    private _subscription: Subscription = new Subscription();

    constructor(
        private _commodityService: CommodityService,
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _notifierService: NotifierService,
        private _themeService: ThemeService,
        private _dialog: MatDialog,
        private _errorHandler: ResponseErrorHandlerService,
        private _purchaseService: PurchaseOrdersService,
    ) {
        this._subscription.add(this._themeService.theme.subscribe(theme => this.isDarkTheme = ('dark' === theme)));
    }

    /**
     * init component
     */
    ngOnInit(): void {
        this._getUnitsMeasure();
        this.getCommoditiesGeneral();
        this._getConfiguration();
        this.commodityForm.controls.measureUnitOutId.disable();
        this.commodityForm.updateValueAndValidity();
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    // TODO: Delete _getConfiguration for version 21
    private _getConfiguration() {
        this._purchaseService.getConfiguration()
        .pipe(take(1))
        .subscribe(
            (response: ITRConfiguration) => {
                this._configuration =  response;
                this.commodityForm.patchValue({
                    measureUnitInId: this._configuration.measurementUnitId,
                    measureUnitOutId: this._configuration.conversionMeasurementUnitId
                });
            },
            (error: HttpErrorResponse) => {
                let message = this._errorHandler.handleError(error, 'commodity');
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
            }
        )
    }

    private createCommodityFormGroup(): UntypedFormGroup {
        let formGroup: UntypedFormGroup = new UntypedFormGroup({
            id: new UntypedFormControl(null),
            generalCommodity: new UntypedFormControl(null, [Validators.required]),
            name: new UntypedFormControl('', [Validators.maxLength(CONSTANTS.MAX_LENGTH_COMMODITY_ALIAS_NAME), Validators.pattern(CONSTANTS.ALPHANUMERIC_REGEXP)]),
            measureUnitInId: new UntypedFormControl(null,[Validators.required]),
            measureUnitOutId: new UntypedFormControl(null,[Validators.required])
            // variety: new FormArray([this.createVarietyFormGroup(new VarietyCommodityModel())], validatorDuplicateDataFormArray('name'))
        });
        return formGroup;
    }

    private createVarietyFormGroup(item: IVarietyCommodityModel): UntypedFormGroup {
        let formGroup: UntypedFormGroup = new UntypedFormGroup({
            id: new UntypedFormControl(item.id),
            name: new UntypedFormControl(item.name, [Validators.required, Validators.maxLength(CONSTANTS.MAX_LENGTH_VARIETY_NAME), Validators.pattern(CONSTANTS.ALPHANUMERIC_REGEXP)])
        });
        return formGroup;
    }

    /**
     * get list from comodities general
     */
    private getCommoditiesGeneral(): void {
        this._subscription.add(
            this._commodityService.getCommoditiesGeneral().subscribe(
                (response: Array<GeneralCommodityModel>) => {
                    if (response) {
                        this.commodities = response;
                    }
                    else {
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
                    }
                    this.isLoadingCommodities = false;
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
                    this.isLoadingCommodities = false;
                }
            )
        );
    }

    /**
     * Add new variety record
     */
    public addVariety(): void {
        (this.commodityForm.get('variety') as UntypedFormArray).push(this.createVarietyFormGroup(new VarietyCommodityModel()));
    }

    public onWigthReception(item : any) : void{

        this.commodityForm.patchValue({measureUnitOutId : null});
        if(item){
            this.unitsForTotals  = Array.from(item.unitsConverter)
            this.commodityForm.controls.measureUnitOutId.enable();
        }else{
            this.commodityForm.controls.measureUnitOutId.disable();
        }
        this.commodityForm.updateValueAndValidity();
    }

    /**
     * Remove variety record
     * @param index of record in the list
     */
    public removeVariety(index: number): void {
        if (null == (this.commodityForm.get('variety') as UntypedFormArray).at(index).get('id').value) {
            (this.commodityForm.get('variety') as UntypedFormArray).removeAt(index);
        }
        else {
            this.deleteVariety(index);
        }
    }

    /**
     * Delete variety record
     * @param index of record in the list
     */
    private deleteVariety(index: number): void {
        (this.commodityForm.get('variety') as UntypedFormArray).at(index).get('name').disable();
        let id: string = (this.commodityForm.get('variety') as UntypedFormArray).at(index).get('id').value;
        this.indexVarietyDelete = index;
        this._subscription.add(
            this._commodityService.deleteVariety(id).subscribe(
                (response: any) => {
                    if (response.status) {
                        this.indexVarietyDelete = null;
                        this.wasRemovedVarieties = true;
                        (this.commodityForm.get('variety') as UntypedFormArray).removeAt(index);
                        this._notifierService.notify('success', this._i18nPipe.transform('success-variety-delete'));
                    }
                    else {
                        this.indexVarietyDelete = null;
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
                    }
                    (this.commodityForm.get('variety') as UntypedFormArray).enable();
                },
                (error: HttpErrorResponse) => {
                    this.indexVarietyDelete = null;
                    (this.commodityForm.get('variety') as UntypedFormArray).enable();
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
                }
            )
        );
    }

    private getVarieties(): void {
        this.blockUI.start();
        this._subscription.add(
            this._commodityService.getVarietiesByCommodity(this.commodity.id).subscribe(
                (response: Array<IVarietyCommodityModel>) => {
                    if (response) {
                        (this.commodityForm.get('variety') as UntypedFormArray).clear();
                        response.forEach((variety: IVarietyCommodityModel) => {
                            (this.commodityForm.get('variety') as UntypedFormArray).push(this.createVarietyFormGroup(variety));
                        });
                    }
                    else {
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
                    }
                    this.initialReferenceCommodityEdit = this.commodityForm.getRawValue();
                    this.commodityForm.updateValueAndValidity();
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    this.initialReferenceCommodityEdit = this.commodityForm.getRawValue();
                    this.commodityForm.updateValueAndValidity();
                    if (400 == error.error.code) {
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('varieties-related-commodity-not-found'));
                    }
                    else {
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
                    }
                    this.blockUI.stop();
                }
            )
        );
    }

    private getCommodityActionRequestData(): ICommodityActionRequestModel {
        let commodityData: ICommodityModel = this.commodityForm.getRawValue();
        if (0 == commodityData.name.length) {
            commodityData.name = commodityData.generalCommodity.name;
        }
        let commodityRequestData: ICommodityActionRequestModel = new CommodityActionRequestModel(commodityData);
        return commodityRequestData;
    }

    /**
     * Cancel action
     */
    private cancel(): void {
        this.eventActionSelected.emit(this.wasRemovedVarieties ? CONSTANTS.CRUD_ACTION.UPDATE : CONSTANTS.CRUD_ACTION.CANCEL);
    }


    private _getUnitsMeasure(): void {
        this._commodityService.getUnitsMeasurement().subscribe((data: Array<UnitMeasureModel>) => {
            this.units = data
            this.isLoadingUnitsMeasure =false;
            this._setEditView();
        }, (error: HttpErrorResponse) => {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
            this.isLoadingUnitsMeasure =false;
        })

    }

    private _setEditView():void
    {
        if (this.isEdit) {

           this.commodities = [new GeneralCommodityModel(this.commodity.generalCommodity)];
           let currentUnitMeasure =  this.units.find(x=> x.measurementUnitId == this.commodity.measureUnitInId);
           this.unitsForTotals =  Array.from(currentUnitMeasure.unitsConverter)
           this.commodityForm.patchValue({
               id: this.commodity.id,
               generalCommodity: this.commodity.generalCommodity,
               name: this.commodity.name,
               measureUnitInId: this.commodity.measureUnitInId,
               measureUnitOutId : this.commodity.measureUnitOutId
           });

           this._subscription.add(
               this.commodityForm.valueChanges.subscribe((data: any) => {
                   this.dataWasMadeModified = (JSON.stringify(this.initialReferenceCommodityEdit) != JSON.stringify(data));
               })
           );
           this.commodityForm.controls.measureUnitOutId.enable();
           this.commodityForm.updateValueAndValidity();
       }

    }

    /**
     * Create commodity
     */
    public createCommodity(): void {
        this.blockUI.start();
        let commodityRequestData: ICommodityActionRequestModel = this.getCommodityActionRequestData();
        this._subscription.add(
            this._commodityService.createCommodity(commodityRequestData).subscribe(
                (response: any) => {
                    if (response.status) {
                        this._notifierService.notify('success', this._i18nPipe.transform('success-commodity-create'));
                        this.eventActionSelected.emit(CONSTANTS.CRUD_ACTION.CREATE);
                    }
                    else {
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
                    }
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    let findCommodity = this.commodities.find(commodity => commodity.id == commodityRequestData.commodity_general_id);
                    let message = this._errorHandler.handleError(error, 'commodity');
                    message = message.replace(findCommodity.id, findCommodity.name)
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
        );
    }

    /**
     * Save update commodity
     */
    public editCommodity(): void {
        this.blockUI.start();
        let commodityRequestData: ICommodityActionRequestModel = this.getCommodityActionRequestData();
        this._subscription.add(
            this._commodityService.editCommodity(commodityRequestData).subscribe(
                (response: any) => {
                    if (response.status) {
                        this._notifierService.notify('success', this._i18nPipe.transform('success-commodity-edit'));
                        this.eventActionSelected.emit(CONSTANTS.CRUD_ACTION.UPDATE);
                    }
                    else {
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
                    }
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    let findCommodity = this.commodities.find(commodity => commodity.id == commodityRequestData.commodity_general_id);
                    let message = this._errorHandler.handleError(error, 'commodity');
                    message = message.replace(findCommodity.id, findCommodity.name)
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
        );
    }

    /**
     * Delete commodity
     */
    public deleteCommodity(): void {
        this.dialogRef = this._dialog.open(ModalDeleteCommodityComponent, {
            autoFocus: false,
            disableClose: true,
            data: this.commodity
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
                this.createCommodity();
                break;
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this.editCommodity();
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.deleteCommodity();
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL:
                this.cancel();
                break;
            default:
                break;
        }
    }

}
