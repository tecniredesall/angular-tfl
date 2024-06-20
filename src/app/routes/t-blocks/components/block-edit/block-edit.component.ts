import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { forkJoin } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { IActionDataModel } from 'src/app/routes/producers/models/action-data.model';
import { TIFarmModel } from 'src/app/routes/t-farms/models/farm.model';
import { FarmService } from 'src/app/routes/t-farms/services/farm.service';
import { UnitMeasureModel } from 'src/app/routes/unit-measures/models/unit-measure.model';
import { UnitMeasuresService } from 'src/app/routes/unit-measures/services/units-measure.service';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { deepCompareIsEqual } from 'src/app/shared/utils/functions/object-compare';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import {
    validatorDuplicateDataFormArray
} from 'src/app/shared/validators/validator-duplicate-data-form-array';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { HttpErrorResponse } from '@angular/common/http';
import {
    Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BlockCharacteristicModel } from '../../models/block-characteristic.model';
import { TBlockModel } from '../../models/block.model';
import { CoffeeVarietyModel } from '../../models/coffee-variety.model';
import { IInputDataActionsBlockModel } from '../../models/input-data-actions-block.model';
import { ShadeVarietyModel } from '../../models/shade-variety.model';
import { SoilTypeModel } from '../../models/soil-type.model';
import { TBlockService } from '../../services/block.service';
import { VarietyService } from '../../services/variety.service';
import { ModalDeleteBlockComponent } from '../modal-delete-block/modal-delete-block.component';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { AddressModel, IAddressModel } from 'src/app/shared/models/address.model';
import { state } from '@angular/animations';

@Component({
    selector: 'app-block-edit',
    templateUrl: './block-edit.component.html',
    styleUrls: ['./block-edit.component.scss'],
})
export class BlockEditComponent
    extends SubscriptionManagerDirective
    implements OnInit, OnDestroy {
    @HostBinding('class.is-for-fed-item') federatedItemClass = false;
    @Input() data: IInputDataActionsBlockModel | IActionDataModel = null;
    @Input() isForFederatedItem: boolean = false;
    @Input() federatedBlock: TBlockModel;
    @Input() federatedProducer: TProducerModel;

    @Output() eventCancel: EventEmitter<boolean> = new EventEmitter();
    @Output() backToList: EventEmitter<boolean> = new EventEmitter();
    @Output() removeBlock = new EventEmitter();
    @Output() eventRefresh = new EventEmitter();
    @Output() saveFederated = new EventEmitter();
    @Output() formIsValid = new EventEmitter();
    @BlockUI('hello') blockUI: NgBlockUI;
    @BlockUI('modal-container') blockUIModal: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public form: UntypedFormGroup;
    public block: TBlockModel;
    public blocks: TBlockModel[];
    public producer: TProducerModel;
    public farms: Array<TIFarmModel>;
    public soilTypes: Array<BlockCharacteristicModel>;
    public shadeVarieties: Array<BlockCharacteristicModel>;
    public coffeeVarieties: Array<BlockCharacteristicModel>;
    public action: number;
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public ALPHANUMERIC_REGEXP: RegExp = CONSTANTS.ALPHANUMERIC_REGEXP;
    public MAX_LENGTH_BLOCK_NAME: number = CONSTANTS.MAX_LENGTH_BLOCK_NAME;
    public measurenmentUnits: Array<UnitMeasureModel>;
    public get blocksFormArray(): UntypedFormArray {
        return this.form.get('items') as UntypedFormArray;
    }
    public originalValueChanged = false;
    public defaultSelectedUnit: string;

    public loadingState = {
        farms: false,
        units: false,
        shadeVariety: false,
        soilTypes: false,
        coffeeVariety: false,
    };

    public heightNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 13,
        requireDecimal: false,
        allowNegative: true,
        allowLeadingZeroes: false,
    });
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
    private dialogRef: MatDialogRef<ModalDeleteBlockComponent, any> = null;
    private _originalForm = {};
    public address: IAddressModel = new AddressModel();
    public completeAddress: boolean = false;
    public isEdit : boolean = false;


    constructor(
        private _builder: UntypedFormBuilder,
        private _farmsService: FarmService,
        private _unitMeasureService: UnitMeasuresService,
        private _alertService: AlertService,
        private _varietyService: VarietyService,
        private _blockService: TBlockService,
        private _responseErrorHandlerService: ResponseErrorHandlerService,
        private _notifierService: NotifierService,
        private _i18nPipe: I18nPipe,
        public _dialog: MatDialog
    ) {
        super();
    }

    ngOnInit() {
         this.isEdit = this.data?.isEdit;
        if (this.isForFederatedItem) {
            this.action = this.ACTIONS.UPDATE;
            this.block = this.federatedBlock;
            this.producer = this.federatedProducer;
            this.federatedItemClass = true;
        } else {
            if (!this.data.isEdit) {
                this.action = this.ACTIONS.CREATE;
                this.block = new TBlockModel();
            }
            if (this.data.isEdit) {
                this.action = this.ACTIONS.UPDATE;
                this.block = new TBlockModel(
                    (this.data as IActionDataModel).blocks[0]
                );
            }
            this.producer = (this.data as IActionDataModel).producer;
        }
        this.address = {
            address: this.block.address,
            country: this.block.countryId,
            state: this.block.stateId,
            city: this.block.cityId,
            village: this.block.townId,
            zip_code: this.block.zipCode,
        }

        this.loadFormCatalogues();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    public getFormGroupForCreation() {
        return this._builder.group({
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(CONSTANTS.NAME_PATTERN),
                    Validators.maxLength(255),
                ]),
            ],
            farm: [null],
            country: [null, Validators.required],
            state: [null, Validators.required],
            city: [null, Validators.required],
            village: [null],
            zip_code: [null],
            address: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(CONSTANTS.ADDRESS_PATTERN),
                    Validators.maxLength(255),
                ]),
            ],
            latitude: [{ value: 0, disabled: true }],
            longitude: [{ value: 0, disabled: true }],
            height: [0],
            extension: [0],
            extensionUnit: [this.defaultSelectedUnit],
            shadeVariety: [[]],
            soilType: [[]],
            coffeeType: [[]],
        });
    }

    public getFormGroupForEdit(block: TBlockModel) {
        return this._builder.group({
            name: [
                block.name,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(CONSTANTS.NAME_PATTERN),
                    Validators.maxLength(255),
                ]),
            ],
            farm: [block.farmId],
            country: [block.countryId, Validators.required],
            state: [block.state ?? block.stateId, Validators.required],
            city: [block.city ?? block.cityId, Validators.required],
            village: [block.town ?? block.townId],
            zip_code: [block.zipCode],
            address: [
                block.address,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(CONSTANTS.ADDRESS_PATTERN),
                ]),
            ],
            latitude: [{ value: block.latitude, disabled: true }],
            longitude: [{ value: block.longitude, disabled: true }],
            height: [block.height],
            extension: [block.extension ?? 0],
            extensionUnit: [
                block.extensionMeasurementUnitId ?? this.defaultSelectedUnit,
            ],
            shadeVariety: [block.shadeVariety.map((s) => s.shadeVarietyId)],
            soilType: [block.soilType.map((so) => so.soilTypeId)],
            coffeeType: [block.coffeeVariety.map((c) => c.coffeeVarietyId)],
            federatedId: [block.federatedId]
        });
    }

    public setBlocksFormForCreation() {
        this.form = this._builder.group({
            items: this._builder.array(
                [this.getFormGroupForCreation()],
                validatorDuplicateDataFormArray('name')
            ),
        });
        this._originalForm = this.form.getRawValue();
        this.handleFormChanges();
    }

    public setBlocksFormForEdit() {
        this.form = this._builder.group({
            items: this._builder.array([this.getFormGroupForEdit(this.block)]),
        });
        this._originalForm = this.form.getRawValue().items[0];
        this.handleFormChanges();
        if (this.isForFederatedItem) {
            this.form.markAllAsTouched();
            this.form.markAsDirty();
        }
    }

    public loadFarms() {
        this.blockUI.start();
        this._farmsService
            .getFarmsByProducer(this.data.producerId)
            .pipe(take(1))
            .subscribe(
                (f) => {
                    this.farms = f;
                    this.blockUI.stop();
                },
                (e) => {
                    this._alertService.showAlert(e.status, e.message);
                    this.blockUI.stop();
                }
            );
    }

    public loadUnitMeasures() {
        this.blockUI.start();
        this._unitMeasureService
            .getAreaUnitMeasures()
            .pipe(
                take(1),
                filter((u) => !!u),
                map((u: any) => u.data as Array<UnitMeasureModel>)
            )
            .subscribe(
                (u: UnitMeasureModel[]) => {
                    this.measurenmentUnits = u;
                    this.blockUI.stop();
                },
                (e) => {
                    this._alertService.showAlert(e.status, e.message);
                    this.blockUI.stop();
                }
            );
    }

    public loadSoilTypes(q?: string) {
        this.loadingState.soilTypes = true;
        this._varietyService
            .getSoilTypes(q)
            .pipe(
                take(1),
                filter((u) => !!u)
            )
            .subscribe(
                (soilTypes) => {
                    this.soilTypes = soilTypes;
                    this.loadingState.soilTypes = false;
                },
                () => {
                    this.loadingState.soilTypes = false;
                }
            );
    }
    public loadShadeVarieties(q?: string) {
        this.loadingState.shadeVariety = true;
        this._varietyService
            .getShadeVarieties(q)
            .pipe(
                take(1),
                filter((u) => !!u)
            )
            .subscribe(
                (shadeVarieties) => {
                    this.shadeVarieties = shadeVarieties;
                    this.loadingState.shadeVariety = false;
                },
                () => {
                    this.loadingState.shadeVariety = false;
                }
            );
    }
    public loadCoffeeVarieties(q?: string) {
        this.loadingState.coffeeVariety = true;
        this._varietyService
            .getCoffeeVarieties(q)
            .pipe(
                take(1),
                filter((u) => !!u)
            )
            .subscribe(
                (coffeeVarieties) => {
                    this.coffeeVarieties = coffeeVarieties;
                    this.loadingState.coffeeVariety = false;
                },
                () => {
                    this.loadingState.coffeeVariety = false;
                }
            );
    }
    public loadFormCatalogues() {
        this.blockUIModal.start();
        const producerId = this.data ? this.data.producerId : this.producer.id;
        forkJoin([
            this._farmsService.getFarmsByProducer(producerId),
            this._unitMeasureService
                .getAreaUnitMeasures()
                .pipe(map((r) => r.data)),
            this._varietyService.getSoilTypes(),
            this._varietyService.getShadeVarieties(),
            this._varietyService.getCoffeeVarieties(),
        ])
            .pipe(take(1))
            .subscribe(
                ([
                    farms,
                    units,
                    soilTypes,
                    shadeVarieties,
                    coffeeVarieties,
                ]) => {
                    this.measurenmentUnits = units;
                    this.soilTypes = soilTypes;
                    this.shadeVarieties = shadeVarieties;
                    this.coffeeVarieties = coffeeVarieties;
                    const measurenmentUnit = this.measurenmentUnits.find(
                        (u) => u.abbreviation === 'MZ'
                    );
                    this.defaultSelectedUnit = measurenmentUnit.measurement_unit_id;
                    if (this.isForFederatedItem) {
                        this.block.measuremnetUnitName = measurenmentUnit.abbreviation;
                        this.farms = [];
                        if (this.block.farm) {
                            this.farms.push(this.block.farm);
                        }
                    } else {
                        this.farms = farms;
                    }
                    if (this.action === this.ACTIONS.CREATE) {
                        this.setBlocksFormForCreation();
                    }
                    if (this.action === this.ACTIONS.UPDATE) {
                        this.setBlocksFormForEdit();
                    }
                    if(this.isForFederatedItem)
                        this.form.updateValueAndValidity();
                    this.formIsValid.emit(this.form.valid);
                    this.blockUIModal.stop();

                }
            );
    }
    public onAdressFormReady(form: UntypedFormGroup, index: number) {
        const item = this.blocksFormArray.at(index);
        // Subscribe to additional changes
        form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            item.patchValue({
                ...form.getRawValue(),
            });
            item.markAsDirty();
        });
    }

    public onAddressDescriptions(address: IAddressModel, index: number) {
        if (address) {
            this.completeAddress = true;
            this.blocksFormArray.at(index).patchValue({
                country: address.country,
                state: address.state,
                city: address.city,
                town: address.village,
                address: address.address,
                zip_code: address.zip_code
            });
            this.block.country = address.country;
            this.block.state = address.state;
            this.block.city = address.city;
            this.block.town = address.village;
        } else {
            this.completeAddress = false;
        }



    }
    public onAddNewBlockForm() {
        this.blocksFormArray.push(this.getFormGroupForCreation());
    }
    public onRemoveFormGroup(i: number) {
        this.blocksFormArray.removeAt(i);
    }
    public onActionSelected(action: number, index?: number): void {
        switch (action) {
            case this.ACTIONS.UPDATE:
                if (this.isForFederatedItem) {
                    this.saveFederated.emit(
                        this.getPayloadToSaveFederated(this.form.getRawValue())
                    );
                } else {
                    this.onUpdateBlock();
                }
                break;
            case this.ACTIONS.CREATE:
                this.onCreateClick();
                break;
            case this.ACTIONS.DELETE:
                if (this.isForFederatedItem) {
                    this.removeBlock.emit();
                } else {
                    if (!this.data.isEdit) {
                        this.onRemoveFormGroup(index);
                    }
                    if (this.data.isEdit) {
                        this.onDeleteBlock();
                    }
                }
                break;
            default:
                break;
        }
    }
    public onDropdownSearch(query: any, control: string) {
        const term: string = query?.term ?? null;
        switch (control) {
            case 'shadeVariety':
                this.loadShadeVarieties(term);
                break;
            case 'soilType':
                this.loadSoilTypes(term);
                break;
            case 'coffeeVariety':
                this.loadCoffeeVarieties(term);
                break;
        }
    }
    public onCancelClick() {
        this.eventCancel.emit(true);
    }
    public onCreateClick() {
        const payload = this.getPayloadToCreate(this.form.getRawValue());
        this.blockUI.start();
        this._blockService.createBlock(payload).subscribe(
            (response: any) => {
                const msg =
                    payload.items.length > 1
                        ? 't-success-blocks-created'
                        : 't-success-block-created';
                this._notifierService.notify(
                    'success',
                    this._i18nPipe.transform(msg)
                );
                this.blockUI.stop();
                this.eventRefresh.emit(response.data[0]);
            },
            (error: HttpErrorResponse) => {
                const message = this._responseErrorHandlerService.handleError(
                    error,
                    't-blocks'
                );
                this.blockUI.stop();
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );
            }
        );
    }
    public onUpdateBlock() {
        const payload = this.getPayloadToEdit(this.form.getRawValue());
        this._blockService.editBlock(payload).subscribe(
            () => {
                this._notifierService.notify(
                    'success',
                    this._i18nPipe.transform('t-success-block-edited')
                );
                this.blockUI.stop();
                this.eventRefresh.emit();
            },
            (error: HttpErrorResponse) => {
                const message = this._responseErrorHandlerService.handleError(
                    error,
                    't-blocks'
                );
                this.blockUI.stop();
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );
            }
        );
    }
    public onDeleteBlock() {
        this.dialogRef = this._dialog.open(ModalDeleteBlockComponent, {
            autoFocus: false,
            disableClose: true,
            data: this.block,
        });

        this.dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((response) => {
                this.dialogRef = null;
                if (response.refresh) {
                    this.eventRefresh.emit();
                }
            });
    }
    public getPayloadToCreate(blocks: any) {
        const values = blocks.items.map((i) => ({
            seller: this.data.producerId,
            farm: i.farm,
            height: i.height,
            extensionBlock: convertStringToNumber(i.extension),
            measurement_type_id: 2,
            measurement_unit_id: i.extensionUnit,
            variety_id: null,
            blocks: [
                {
                    name: i.name,
                    country_id: i.country,
                    state_id: i.state,
                    city_id: i.city,
                    village_id: i.village,
                    zip_code: i.zip_code,
                    address: i.address,
                    latitude: i.latitude,
                    longitude: i.longitude,
                    shade_variety: i.shadeVariety.map((s: Number) => ({
                        id: s,
                    })),
                    soil_type: i.soilType.map((s: Number) => ({ id: s })),
                    variety_coffee: i.coffeeType.map((s: Number) => ({
                        id: s,
                    })),
                },
            ],
        }));

        return {
            items: values,
        };
    }
    public getPayloadToEdit(blocks: any) {
        const value = blocks.items[0];
        return {
            id: this.block.id,
            name: value.name,
            farm_id: value.farm,
            variety_id: null,
            height: value.height,
            extension: convertStringToNumber(value.extension),
            measurement_type_id: 2,
            measurement_unit_id: value.extensionUnit,
            seller_id: this.data.producerId,
            country_id: value.country,
            state_id: value.state,
            city_id: value.city,
            village_id: value.village,
            zip_code: value.zip_code,
            address: value.address,
            latitude: value.latitude,
            longitude: value.longitude,
            shade_variety: value.shadeVariety.map((s: Number) => ({
                id: s,
            })),
            soil_type: value.soilType.map((s: Number) => ({ id: s })),
            variety_coffee: value.coffeeType.map((s: Number) => ({
                id: s,
            })),
        };
    }
    public getPayloadToSaveFederated(blocks: any) {
        const value = blocks.items[0];
        let dataBlock ={
            id: this.block.id,
            name: value.name,
            farm_id: value.farm,
            farm_name: this.farms.length > 0 ? this.farms.find((f) => f.id === value.farm_id) : null,
            variety_id: null,
            height: value.height,
            extension: convertStringToNumber(value.extension),
            measurement_type_id: 2,
            measurement_unit_id: this.defaultSelectedUnit,
            seller_id: this.producer.id,
            country_id: value.countryId ?? value.country,
            code: this.block.code,
            country: this.block.country,
            state_id: value.stateId ?? value.state,
            state: this.block.state,
            city_id: value.cityId ?? value.city,
            city: this.block.city,
            village_id: value.townId ?? value.village,
            village: this.block.town,
            zip_code: this.block.zipCode ?? value.zip_code,
            address: value.address,
            latitude: value.latitude,
            longitude: value.longitude,
            federated_id: value.federatedId,
            measurement_unit: this.block.measuremnetUnitName,
            shade_variety: value.shadeVariety.map(
                (s: Number) =>
                    new ShadeVarietyModel({
                        block_id: this.block.id,
                        shade_variety_id: s,
                        shade_variety_name: this.shadeVarieties.find(
                            (shade) => shade.id === s
                        ).name,
                    })
            ),
            soil_type: value.soilType.map(
                (s: Number) =>
                    new SoilTypeModel({
                        block_id: this.block.id,
                        soil_type_id: s,
                        soil_type_name: this.soilTypes.find(
                            (soil) => soil.id === s
                        ).name,
                    })
            ),
            variety_coffee: value.coffeeType.map(
                (s: Number) =>
                    new CoffeeVarietyModel({
                        block_id: this.block.id,
                        variety_coffee_id: s,
                        variety_coffee_name: this.coffeeVarieties.find(
                            (soil) => soil.id === s
                        ).name,
                    })
            ),
        };
        return dataBlock;
    }
    public handleFormChanges() {
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.originalValueChanged = !deepCompareIsEqual(
                this._originalForm,
                this.form.getRawValue().items[0]
            );
            this.formIsValid.emit(this.form.valid);
        });
    }
}
