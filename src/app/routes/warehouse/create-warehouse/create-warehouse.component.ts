import { TypeTankModel } from './../models/type-tanks';
import { Component, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { I18nPipe } from '../../../shared/i18n/i18n.pipe';
import { WarehouseService } from '../warehouse.service';
import { IWarehouseDataDeleteModel, IWarehouseRequestModel, WarehouseModel } from '../models/warehouse.model';
import { NotifierService } from 'angular-notifier';
import { IDataCreateWarehouseModel } from '../models/create-warehouse.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ICSVProperty } from 'src/app/shared/utils/models/csv-properties.model';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { validatorDuplicateDataFormArray } from 'src/app/shared/validators/validator-duplicate-data-form-array';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ThemeService } from 'src/theme/theme.service';
import { ISubtankModel, ISubtankRequestModel, SubtankModel } from '../models/subtank.model';
import { IProdExternalWarehouseModel } from '../models/prod-external-warehouse.model';
import { take } from 'rxjs/operators';
import { sortByStringValue } from '../../../shared/utils/functions/sortFunction';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ICommodityModel } from '../../commodity/models/commodity.model';

@Component({
    selector: 'app-create-warehouse',
    templateUrl: './create-warehouse.component.html',
    styleUrls: ['./create-warehouse.component.css']
})
export class CreateWarehouseComponent implements OnChanges, OnDestroy {

    @Input() data: IDataCreateWarehouseModel = null;
    @Input() config: ITRConfiguration = new TRConfiguration();
    @Output() deleteWarehouseEvent: EventEmitter<IWarehouseDataDeleteModel> = new EventEmitter();
    @Output() cancelEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() refreshEvent: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('csvReader') csvReader: any;
    @BlockUI('create-warehouse') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public title: string;
    public isTankOperation: boolean;
    public isEditting: boolean;
    public isDarkTheme: boolean;
    public tanks: UntypedFormArray;
    public transformationTypes: Array<any>;
    public typesTanks: Array<TypeTankModel> = [];
    public dataWasMadeModified = false;
    private _originalEditItem: any;
    private _subtank: ISubtankModel;
    private _subscription = new Subscription()
    public externalWarehouses: Array<IProdExternalWarehouseModel> = [];
    public commodities: Array<ICommodityModel> = [];
    constructor(
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _themeService: ThemeService,
        private _notifierService: NotifierService,
        private _warehouseService: WarehouseService,
        private _errorHandlerService: ResponseErrorHandlerService,
    ) {
        this._subscription.add(this._themeService.theme.subscribe(theme => this.isDarkTheme = ('dark' === theme)));
        this.initializeValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('data') && this.data) {
            this.initializeValues();

            switch (this.data.actionType) {
                case CONSTANTS.ACTION_MODE_WAREHOUSE.CREATE_TANK:
                    this._getExternalWarehouses();
                    break;
                case CONSTANTS.ACTION_MODE_WAREHOUSE.CREATE_SUBTANK:
                    this.createSubtankSetup();
                    break;
                case CONSTANTS.ACTION_MODE_WAREHOUSE.EDIT_TANK:
                    this._getExternalWarehouses(true);
                    break;
                case CONSTANTS.ACTION_MODE_WAREHOUSE.EDIT_SUBTANK:
                    this.editSubtankSetup();
                    break;
                default:
                    this.cancelEvent.emit(true);
                    break;
            }
        }
    }

    public _getExternalWarehouses(isForEdit = false) {

        this._warehouseService.getExternals().pipe(take(1)).subscribe(
            result => {
                this.externalWarehouses = sortByStringValue(result, 'name');
                if (isForEdit) {
                    this.editTankSetup();
                } else {
                    this.createTankSetup();
                }
            },
            error => {
                this.blockUI.stop();
                let msg: string = this._errorHandlerService.handleError(error, 'warehouse')
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
            }
        );
        this._getTypeTanks();
        this._getCommodity();
    }

    private initializeValues(): void {
        this.tanks = new UntypedFormArray([], validatorDuplicateDataFormArray('name'));
        this.title = 'new-warehouse';
        this.isEditting = false;
        this.isTankOperation = true;
        this._originalEditItem = {};
        this.transformationTypes = [];
        this.typesTanks = [];
    }

    private createFormTank() {
        let formGroup: UntypedFormGroup = new UntypedFormGroup({
            name: new UntypedFormControl('', [Validators.required, Validators.pattern(CONSTANTS.ALPHANUMERIC_REGEXP)]),
            externalId: new UntypedFormControl(null, Validators.required),
            idTypeTank: new UntypedFormControl(null, Validators.required),
            commodityId: new UntypedFormControl(null, Validators.required),
        })
        if (this.commodities.length == 1) {
            formGroup.get('commodityId').setValue(this.commodities[0].id)
        }
        return formGroup
    }

    private createFormSubtank() {
        let formGroup: UntypedFormGroup = new UntypedFormGroup({
            name: new UntypedFormControl('', [Validators.required, Validators.pattern(CONSTANTS.ALPHANUMERIC_REGEXP)]),
            transformationTypeId: new UntypedFormControl(null, Validators.required),
            capacityQQ: new UntypedFormControl('', [
                Validators.required,
                Validators.pattern(CONSTANTS.NUMBER_REGEXP),
                Validators.min(1),
                Validators.max(CONSTANTS.MAX_SAFE_INTEGER / this.config.conversionMeasurementUnitFactor)
            ]),
            lowLimit: new UntypedFormControl(0, [
                Validators.required,
                Validators.pattern(CONSTANTS.NUMBER_REGEXP),
                Validators.min(0),
                Validators.max(99)
            ]),
            highLimit: new UntypedFormControl(0, [
                Validators.required,
                Validators.pattern(CONSTANTS.NUMBER_REGEXP),
                Validators.min(1),
                Validators.max(100)
            ])
        })
        return formGroup
    }

    private createTankSetup() {
        this.blockUI.start()
        this.title = 'new-warehouse';
        this.isEditting = false;
        this.isTankOperation = true;
        this.addTankControl();
        this.blockUI.stop();

    }

    private createSubtankSetup() {
        this.blockUI.start();
        this.title = 'new-warehouse';
        this.isTankOperation = false;
        this.isEditting = false;
        this.addSubtankControl();
        this.getTransformationsTypes()
        this.blockUI.stop();
    }

    private editTankSetup(): void {
        this.blockUI.start()
        this.title = 'edit-warehouse';
        this.isTankOperation = true;
        this.isEditting = true;
        this._subscription.add(
            this.tanks.valueChanges.subscribe((data: any) => {
                if (data.length > 0) {
                    this.dataWasMadeModified = JSON.stringify(this._originalEditItem) != JSON.stringify(data[0]);
                }
            })
        );
        this._subscription.add(
            this._warehouseService.getTank(this.data.tankId.toString()).subscribe(
                (response: any) => {
                    if (response.status) {
                        if (response.data) {
                            let tank = new WarehouseModel(response.data[0], true);
                            let tankForm = this.createFormTank()
                            tankForm.patchValue({
                                name: tank.name,
                                externalId: tank.externalId,
                                idTypeTank: tank.idTypeTank,
                                commodityId: tank.commodityId,
                            })
                            this._originalEditItem = tankForm.value;
                            this.tanks.push(tankForm)
                            this._setCanChangeTypeTank(tank)
                            this.blockUI.stop();
                        }
                        else {
                            this.blockUI.stop();
                            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('register-not-found'));
                        }
                    }
                    else {
                        this.blockUI.stop();
                        let msg: string = this._errorHandlerService.handleError(response.message, 'warehouse')
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                    }
                },
                (error) => {
                    this.blockUI.stop();
                    let msg: string = this._errorHandlerService.handleError(error, 'warehouse')
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                }
            )
        )
    }


    private _setCanChangeTypeTank(tank: WarehouseModel) {
        if (!tank.canChangeTypeTank) {
            (this.tanks.at(0) as UntypedFormControl).get('idTypeTank').disable();
            (this.tanks.at(0) as UntypedFormControl).get('commodityId').disable();
        }
    }

    private editSubtankSetup() {
        this.blockUI.start();
        this.title = 'edit-warehouse';
        this.isTankOperation = false;
        this.isEditting = true;
        this._subscription.add(
            this.tanks.valueChanges.subscribe((data: any) => {
                if (data.length > 0) {
                    let subtank = data[0]
                    let stockQQ = (this._subtank.stock / this.data.config.conversion_measurement_unit_factor)
                    if (subtank.capacityQQ < stockQQ) {
                        this.tanks.at(0).get('capacityQQ').setErrors({ invalidCapacity: true })
                    }
                    this.dataWasMadeModified = JSON.stringify(this._originalEditItem) != JSON.stringify(subtank);
                }
            })
        );
        this._subscription.add(
            this._warehouseService.getSubtank(this.data.subTankId).subscribe(
                (response: any) => {
                    if (response.status) {
                        if (response.data) {
                            this._subtank = new SubtankModel(response.data);
                            let subtankForm = this.createFormSubtank()
                            subtankForm.patchValue({
                                name: this._subtank.name,
                                transformationTypeId: this._subtank.transformationTypeId,
                                capacityQQ: this._subtank.capacityQQ,
                                lowLimit: this._subtank.lowLimit,
                                highLimit: this._subtank.highLimit
                            })
                            this._originalEditItem = subtankForm.value;
                            this.tanks.push(subtankForm)
                            this.getTransformationsTypes();
                            this.blockUI.stop();
                        }
                        else {
                            this.blockUI.stop();
                            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('register-not-found'));
                        }
                    }
                    else {
                        this.blockUI.stop();
                        let msg: string = this._errorHandlerService.handleError(response.message, 'warehouse')
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                    }
                },
                (error) => {
                    this.blockUI.stop();
                    let msg: string = this._errorHandlerService.handleError(error, 'warehouse')
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                }
            )
        )
    }

    private generatePropertiesTank(): Array<ICSVProperty> {
        return [
            {
                property: 'name',
                column: `${this._i18nPipe.transform('name')}*`,
            }
        ];
    }

    private generatePropertiesSubtank(): Array<ICSVProperty> {
        return [
            {
                property: 'name',
                column: `${this._i18nPipe.transform('name')}*`,
            },
            {
                property: 'transformations_type_name',
                column: `${this._i18nPipe.transform('transformation-type')}*`,
            },
            {
                property: 'capacity',
                column: `${this._i18nPipe.transform('capacity')}*`
            },
            {
                property: 'low_limit',
                column: `${this._i18nPipe.transform('min-storage')}*`
            },
            {
                property: 'hight_limit',
                column: `${this._i18nPipe.transform('max-storage')}*`
            }
        ];
    }

    private _getTypeTanks(): void {

        this._warehouseService.getTypeTanks().pipe(take(1)).subscribe(
            (response: Array<TypeTankModel>) => {
                this.typesTanks = response;
            }, (error) => {
                this.typesTanks = [];
                let msg: string = this._errorHandlerService.handleError(error, 'warehouse')
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
            }
        )
    }

    public addTankControl(): void {
        this.tanks.push(this.createFormTank());
    }

    public addSubtankControl(): void {
        this.tanks.push(this.createFormSubtank());
    }

    public getTransformationsTypes(): void {
        this._subscription.add(
            this._warehouseService.getTransformationsTypes().subscribe(
                (response: Array<any>) => {
                    this.transformationTypes = response;
                }, (error) => {
                    this.transformationTypes = [];
                    let msg: string = this._errorHandlerService.handleError(error, 'warehouse')
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                }
            )
        )
    }

    private submitCreate(): void {
        if (this.isTankOperation) {
            let tanks: Array<IWarehouseRequestModel> = []
            for (let i = 0; i < this.tanks.value.length; i++) {
                let tank: IWarehouseRequestModel = new WarehouseModel(this.tanks.value[i], false).request(this.data)
                tanks.push(tank)
            }
            this.createTank(tanks);
        } else {
            let subtanks: Array<ISubtankRequestModel> = []
            for (let i = 0; i < this.tanks.value.length; i++) {
                let subtank: ISubtankRequestModel = new SubtankModel(this.tanks.value[i], false).request({...this.data , ...this.config})
                subtanks.push(subtank)
            }
            this.createSubtank(subtanks);
        }
    }

    private createTank(data: Array<IWarehouseRequestModel>): void {
        this.blockUI.start();
        this._subscription.add(
            this._warehouseService.postTanks({ items: data }).subscribe(
                response => {
                    this.blockUI.stop();
                    this._notifierService.notify('success', this._i18nPipe.transform('success-created-wharehouse-msg'));
                    this.refreshEvent.emit(true);
                }, error => {
                    this.blockUI.stop();
                    let message: string = this._errorHandlerService.handleError(error, 'warehouse');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
        )
    }

    private createSubtank(data: Array<ISubtankRequestModel>) {
        this.blockUI.start();
        this._subscription.add(
            this._warehouseService.postVirtualTanks({ items: data }).subscribe(
                response => {
                    this.blockUI.stop();
                    this._notifierService.notify('success', this._i18nPipe.transform('success-created-wharehouse-msg'));
                    this.refreshEvent.emit(true);
                }, (error) => {
                    let message: string = this._errorHandlerService.handleError(error, 'warehouse');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
        )
    }

    public updateTank() {
        this.blockUI.start();
        let values = this.tanks.value[0]
        let tank: IWarehouseRequestModel = new WarehouseModel(values, false).request(this.data)
        this._subscription.add(
            this._warehouseService.putTank(tank).subscribe(
                response => {
                    this.blockUI.stop();
                    this._notifierService.notify('success', this._i18nPipe.transform('success-updated-wharehouse-msg'));
                    this.refreshEvent.emit(true);
                }, (error) => {
                    let message: string = this._errorHandlerService.handleError(error, 'warehouse');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
        )
    }

    public updateSubtanks(): void {
        this.blockUI.start();
        let formTank = this.tanks.value[0]
        let subtank: ISubtankRequestModel = new SubtankModel(formTank, false).request(this.data)
        this._subscription.add(
            this._warehouseService.putVirtualTanks(subtank).subscribe(
                response => {
                    this.blockUI.stop();
                    this._notifierService.notify('success', this._i18nPipe.transform('success-updated-wharehouse-msg'));
                    this.refreshEvent.emit(true);
                }, (error) => {
                    let message: string = this._errorHandlerService.handleError(error, 'warehouse');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
        )
    }

    public removeControl(index: number) {
        this.tanks.removeAt(index);
    }

    public submitDelete(): void {
        if (this.isTankOperation) {
            this.deleteWarehouseEvent.emit({
                fromEditView: true,
                isTank: true,
                tankName: this.data.tankName,
                tankId: this.data.tankId,
                totalVirtualTanks: this.data.totalVirtualTanks,
                totalStorage: this.data.totalStorage
            });
        }
        else {
            this.deleteWarehouseEvent.emit({
                fromEditView: true,
                isTank: false,
                tankName: this.data.tankName,
                tankId: this.data.tankId,
                subtankId: this.data.subTankId,
                subtankName: this.tanks.value[0].name,
                amount: this._subtank.stock
            });
        }
    }
    public cancel(): void {
        this.cancelEvent.emit(true);
    }

    public submit(): void {
        switch (this.data.actionType) {
            case CONSTANTS.ACTION_MODE_WAREHOUSE.CREATE_TANK:
                this.submitCreate();
                break;
            case CONSTANTS.ACTION_MODE_WAREHOUSE.CREATE_SUBTANK:
                this.submitCreate();
                break;
            case CONSTANTS.ACTION_MODE_WAREHOUSE.EDIT_TANK:
                this.updateTank();
                break;
            case CONSTANTS.ACTION_MODE_WAREHOUSE.EDIT_SUBTANK:
                this.updateSubtanks();
                break;
            default:
                break;
        }
    }

    public onActionFooterSelected(action: number): void {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.submitDelete();
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL:
                this.cancel();
                break;
            case CONSTANTS.CRUD_ACTION.UPDATE:
            case CONSTANTS.CRUD_ACTION.CREATE:
                this.submit();
                break;
            default:
                break;
        }
    }

    private _getCommodity(): void {
        this.blockUI.start();
        this._subscription.add(
            this._warehouseService.getCommodity().pipe(take(1)).subscribe(
                (response: Array<ICommodityModel>) => {
                    if (response) {
                        this.commodities = response;
                    }
                    this.blockUI.stop();
                },
                (error) => {
                    let message: string = this._errorHandlerService.handleError(error, 'warehouse');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
        );
    }

    ngOnDestroy() {
        this._subscription.unsubscribe()
    }

}
