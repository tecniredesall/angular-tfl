import { NotifierService } from 'angular-notifier';
import { ResizedEvent } from 'angular-resize-event';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, Subscription } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { deepCompareIsEqual } from 'src/app/shared/utils/functions/object-compare';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import {
    validatorDuplicateDataFormArray
} from 'src/app/shared/validators/validator-duplicate-data-form-array';
import { ThemeService } from 'src/theme/theme.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import {
    Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AddressModel, IAddressModel } from 'src/app/shared/models/address.model';
import { TFarmModel } from '../../models/farm.model';
import { TIBlockModel } from 'src/app/routes/t-blocks/models/block.model';
import { ModalDeleteFarmComponent } from '../../modal-delete-farm/modal-delete-farm.component';
import { UnitMeasureModel } from 'src/app/routes/unit-measures/models/unit-measure.model';
import { FarmService } from '../../services/farm.service';
import { UnitMeasuresService } from 'src/app/routes/unit-measures/services/units-measure.service';
import { TIRequestActionFarmModel, TRequestActionFarmModel } from '../../models/request-action-farm.model';

declare const $: any;

@Component({
    selector: 'app-form-data',
    templateUrl: './form-data.component.html',
    styleUrls: ['./form-data.component.scss'],
})
export class FormDataComponent implements OnInit, OnDestroy {
    @Output() closeEvent = new EventEmitter();
    @Output() deleteEvent = new EventEmitter();
    @Output() emitEvent = new EventEmitter<TFarmModel>();
    @Output() emitReadonlyEvent = new EventEmitter();
    @Input() farm: TFarmModel = new TFarmModel();
    @Input() seller: TProducerModel;
    @Input() action: number;
    @Input() isEdit = false;
    @Input() isMultiple = true;
    @Input() isFromModal = false;
    @Input() allowedBlocks: Array<TIBlockModel> = [];
    @Input() isReadonly: boolean = false;
    @Input() fromFederated: boolean = false;
    @BlockUI('action-farm-container') blockUI: NgBlockUI;

    private _subscription: Subscription = new Subscription();
    private idxItem = 0;
    private dialogRef: MatDialogRef<ModalDeleteFarmComponent, any> = null;

    public ALPHANUMERIC_REGEXP: RegExp = CONSTANTS.ADDRESS_PATTERN;
    public MAX_LENGTH_FARM_NAME: number = CONSTANTS.MAX_LENGTH_FARM_NAME;
    public MAX_LENGTH_SHOW_FARM_NAME: number = CONSTANTS.MAX_LENGTH_SHOW_FARM_NAME;
    public MAX_LENGTH_FARM_ADDRESS: number = CONSTANTS.MAX_LENGTH_FARM_ADDRESS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public PERMISSION_TAG = CONSTANTS.PERMISSIONS;
    public arrayForm = new UntypedFormArray([]);
    public isLoadingAllowedBlocks = true;
    public isDarkTheme: boolean;
    public dataWasMadeModified: boolean;
    public destroy$ = new Subject<boolean>();

    public isVisibletextButtonDelete = false;
    public originalForm: any;

    public style: {
        containerButtonSubmit: any;
        containerButtonCancel: any;
        containerButtonDelete: any;
    } = {
            containerButtonSubmit: { width: '0', padding: '0', margin: '0' },
            containerButtonCancel: { width: '0', padding: '0', margin: '0' },
            containerButtonDelete: { width: '0', padding: '0', margin: '0' },
        };

    public extensionNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 13,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false,
    });
    public address: IAddressModel = new AddressModel();
    public addressByFarm: { farm: number, address: IAddressModel };
    public measurenmentUnits: Array<UnitMeasureModel>
    public completeAddress: boolean = false;
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(
        localStorage.getItem('decimals')
    ).general : 2;
    constructor(
        private i18n: I18nPipe,
        private farmService: FarmService,
        private alertService: AlertService,
        private notifierService: NotifierService,
        private handleErrors: ResponseErrorHandlerService,
        private _themeService: ThemeService,
        public _dialog: MatDialog,
        private _unitMeasureService: UnitMeasuresService
    ) {
        this._subscription.add(
            this._themeService.theme.subscribe((theme) => {
                if (theme) {
                    this.isDarkTheme = 'dark' === theme;
                }
            })
        );
    }

    ngOnInit(): void {
        this.getMeasurenmentUnits();
    }
    private _initialiceForm() {
        this.isLoadingAllowedBlocks = false;
        this.arrayForm = new UntypedFormArray(
            [this.createForm()],
            validatorDuplicateDataFormArray('name')
        );
        if (this.isEdit) {
            this.arrayForm.controls[0].patchValue({
                name: this.farm.name,
                blocks: this.farm.blocks,
                extensionArea: this.farm.extension,
                extensionUnit: this.measurenmentUnits[0],
                wastelandArea: this.farm.wastelandArea,
                wastelandUnit: this.measurenmentUnits[0],
                productiveArea: this.farm.productiveArea,
                productiveUnit: this.measurenmentUnits[0],
                country: this.farm.countryId,
                countryName: this.farm.country,
                state: this.farm.stateId,
                stateName: this.farm.state,
                city: this.farm.cityId,
                cityName: this.farm.city,
                village: this.farm.villageId,
                villageName: this.farm.village,
                address: this.farm.address,
                zip_code: this.farm.zipCode
            });
            this.address = {
                address: this.farm.address,
                country: this.farm.countryId,
                countryName: this.farm.country,
                state: this.farm.stateId,
                stateName: this.farm.state,
                city: this.farm.cityId,
                cityName: this.farm.city,
                village: this.farm.villageId,
                villageName: this.farm.village,
                zip_code: this.farm.zipCode,

            }
        }
        if (this.fromFederated) {
            this.arrayForm.markAllAsTouched();
            this.arrayForm.markAsDirty();
        }
        this.farm.extensionUnit = this.measurenmentUnits[0].abbreviation;
        this.farm.extensionUnitId = this.measurenmentUnits[0].measurement_unit_id;
        this.originalForm =this.arrayForm.controls[0].value;
        if (String(this.originalForm.extensionArea).includes(',')) {
            this.originalForm.extensionArea = String(this.originalForm.extensionArea).replace(
                ',',
                ''
            );
        };
        this._detectChanges();
    }

    private _detectChanges() {
        this.arrayForm.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.isEdit)
            )
            .subscribe((v) => {
                const newValue = this.arrayForm.controls[0].value;
                
                if (String(newValue.extensionArea).includes(',')) {
                    newValue.extensionArea = String(newValue.extensionArea).replace(
                        ',',
                        ''
                    );
                };
                this.dataWasMadeModified = !deepCompareIsEqual(
                    newValue,
                    this.originalForm
                );
            });

    }
    private getMeasurenmentUnits() {
        this.blockUI.start();
        this._unitMeasureService
            .getAreaUnitMeasures()
            .pipe(
                take(1),
                filter((u) => !!u),
                map((u: any) => u.data as Array<UnitMeasureModel>) // Return data as typed array
            )
            .subscribe(
                (u) => {
                    this.measurenmentUnits = u;
                    this._initialiceForm();
                },
                (e) => {
                    this.alertService.showAlert(e.status, e.message);
                    this.blockUI.stop();
                },
                () => this.blockUI.stop()
            );
    }

    public addNewFarm() {
        this.arrayForm.insert(this.arrayForm.length, this.createForm());
    }

    public deleteForm(index?: number) {
        this.arrayForm.removeAt(index);
        this.completeAddress = this.arrayForm.valid;
    }

    public deleteFarm(): void {
        if (this.fromFederated) {
            this.deleteEvent.emit();
        } else {
            if (this.isEdit) {
                this.dialogRef = this._dialog.open(ModalDeleteFarmComponent, {
                    autoFocus: false,
                    disableClose: true,
                    data: this.farm,
                });
                this._subscription.add(
                    this.dialogRef.afterClosed().subscribe((response) => {
                        this.dialogRef = null;
                        if (response.refresh) {
                            this.emitEvent.emit();
                        }
                    })
                );
            }
        }
    }

    public submit() {
        this.blockUI.start();
        if (this.isEdit) {
            this.farm.name = this.arrayForm.value[0].name;
            this.farm.extension = this.arrayForm.value[0].extensionArea;
            this.farm.blocks = this.arrayForm.value[0].blocks;
            this.farm.measurementUnit = this.arrayForm.value[0].extensionUnit;
            this.farm.extensionUnit = this.arrayForm.value[0].extensionUnit;
            this.farm.wastelandArea = this.arrayForm.value[0].wastelandArea;
            this.farm.productiveArea = this.arrayForm.value[0].productiveArea;
            this.farm.address = this.arrayForm.value[0].address;
            this.farm.country = this.arrayForm.value[0].countryName;
            this.farm.countryId = this.arrayForm.value[0].country;
            this.farm.state = this.arrayForm.value[0].stateName;
            this.farm.stateId = this.arrayForm.value[0].state;
            this.farm.village = this.arrayForm.value[0].villageName;
            this.farm.villageId = this.arrayForm.value[0].village;
            this.farm.city = this.arrayForm.value[0].cityName;
            this.farm.cityId = this.arrayForm.value[0].city;
            this.farm.zipCode = this.arrayForm.value[0].zip_code;
            if (this.fromFederated) {
                this.blockUI.stop();
                this.emitEvent.emit(this.farm);
            } else {
                const requestData: TIRequestActionFarmModel = new TRequestActionFarmModel(
                    this.farm
                );
                this._subscription.add(
                    this.farmService.updateFarm(requestData).subscribe(
                        (response) => {
                            this.blockUI.stop();
                            this.notifierService.notify(
                                'success',
                                this.i18n.transform('t-farms-notify-edit-farm')
                            );
                            this.emitEvent.emit();
                        },
                        (error) => {
                            const message = this.handleErrors.handleError(
                                error,
                                't-farm'
                            );
                            this.alertService.errorTitle(
                                this.i18n.transform('error-msg'),
                                message
                            );
                            this.blockUI.stop();
                        }
                    )
                );
            }
        } else {
            const requestData: Array<TIRequestActionFarmModel> = [];
            this.arrayForm.value.forEach((farm: any) => {
                farm.extension = farm.extensionArea;
                requestData.push(new TRequestActionFarmModel(farm));
            });
            this._subscription.add(
                this.farmService.createFarm(requestData).subscribe(
                    (response: any) => {
                        this.blockUI.stop();
                        this.notifierService.notify(
                            'success',
                            this.i18n.transform('t-farms-notify-add-farm')
                        );
                        this.emitEvent.emit(new TFarmModel(response.data[0]));
                    },
                    (error) => {
                        const message = this.handleErrors.handleError(
                            error,
                            't-farm'
                        );
                        this.alertService.errorTitle(
                            this.i18n.transform('error-msg'),
                            message
                        );
                        this.blockUI.stop();
                    }
                )
            );
        }
    }

    public cancel() {
        this.closeEvent.emit();
    }

    public onFooterResize(event: ResizedEvent): void {
        if (event.newWidth < 275) {
            this.style.containerButtonSubmit = {
                width: '100%',
                padding: '0',
                margin: '0 0 16px 0',
            };
            this.style.containerButtonCancel = {
                width: '100%',
                padding: '0',
                margin: '0',
            };
            this.style.containerButtonDelete = {
                width: '100%',
                padding: '0',
                margin: '0 0 16px 0',
            };
            this.isVisibletextButtonDelete = true;
        } else if (event.newWidth < 430) {
            this.style.containerButtonSubmit = {
                width: 'auto',
                padding: '0',
                margin: '0',
            };
            this.style.containerButtonCancel = {
                width: 'auto',
                padding: '0 16px',
                margin: '0',
            };
            this.style.containerButtonDelete = {
                width: '40px',
                padding: '0',
                margin: '0',
            };
            this.isVisibletextButtonDelete = false;
        } else if (event.newWidth < 488) {
            this.style.containerButtonSubmit = {
                width: '160px',
                padding: '0',
                margin: '0',
            };
            this.style.containerButtonCancel = {
                width: '192px',
                padding: '0 16px',
                margin: '0',
            };
            this.style.containerButtonDelete = {
                width: '40px',
                padding: '0',
                margin: '0',
            };
            this.isVisibletextButtonDelete = false;
        } else {
            this.style.containerButtonSubmit = {
                width: '160px',
                padding: '0',
                margin: '0',
            };
            this.style.containerButtonCancel = {
                width: '176px',
                padding: '0 16px 0 0',
                margin: '0',
            };
            this.style.containerButtonDelete = {
                width: 'auto',
                padding: '0 16px 0 0',
                margin: '0',
            };
            this.isVisibletextButtonDelete = true;
        }
    }

    private createForm(): UntypedFormGroup {
        this.address = new AddressModel();
        const fg: UntypedFormGroup = new UntypedFormGroup({
            seller: new UntypedFormControl(this.seller.id, Validators.required),
            name: new UntypedFormControl('', [Validators.required, Validators.maxLength(CONSTANTS.MAX_LENGTH_FARM_NAME)]),
            extensionArea: new UntypedFormControl(''),
            extensionUnit: new UntypedFormControl(this.measurenmentUnits[0]),
            wastelandArea: new UntypedFormControl(''),
            wastelandUnit: new UntypedFormControl(this.measurenmentUnits[0]),
            productiveArea: new UntypedFormControl(''),
            productiveUnit: new UntypedFormControl(this.measurenmentUnits[0]),
            blocks: new UntypedFormControl([]),
            country: new UntypedFormControl('',  Validators.required),
            countryName:new UntypedFormControl(''),
            state: new UntypedFormControl('', Validators.required),
            stateName:new UntypedFormControl(''),
            city: new UntypedFormControl('', Validators.required),
            cityName: new UntypedFormControl(''),
            village: new UntypedFormControl(''),
            villageName: new UntypedFormControl(''),
            zip_code: new UntypedFormControl(''),
            address: new UntypedFormControl('', [
                Validators.pattern(CONSTANTS.ADDRESS_PATTERN),
                Validators.maxLength(CONSTANTS.MAX_LENGTH_ADDRESS)]),
            index: new UntypedFormControl(this.idxItem),
        });
        this.idxItem++;
        return fg;
    }

    public onFormAddressReady(form: UntypedFormGroup, index: number) {
        form.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(
                (address: AddressModel) => {
                    this.completeAddress = form.valid;
                    this.arrayForm.controls[index].patchValue({
                        zipCode: address.zip_code,
                        ...form.getRawValue(),
                    });
                    this.arrayForm.controls[index].markAsDirty();
                }
            )
    }

    public onEditFormEvent(): void {
        this.isReadonly = false;
        this.emitReadonlyEvent.emit(true);
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
        this.destroy$.next(true);
    }
}
