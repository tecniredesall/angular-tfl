import { NotifierService } from 'angular-notifier';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { IActionDataModel } from 'src/app/routes/producers/models/action-data.model';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { sortAlphanumerical } from 'src/app/shared/utils/functions/sortFunction';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';

import { TBlockModel } from '../../models/block.model';
import { IInputDataActionsBlockModel } from '../../models/input-data-actions-block.model';
import { TBlockService } from '../../services/block.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FarmRequestFromBlockFederatedModel, TFarmModel } from 'src/app/routes/t-farms/models/farm.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { UnitMeasuresService } from 'src/app/routes/unit-measures/services/units-measure.service';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { UnitMeasureModel } from 'src/app/routes/unit-measures/models/unit-measure.model';

@Component({
    selector: 'app-block-edit-federated',
    templateUrl: './block-edit-federated.component.html',
    styleUrls: ['./block-edit-federated.component.scss'],
})
export class BlockEditFederatedComponent implements OnInit {
    @Input() data: IInputDataActionsBlockModel | IActionDataModel = null;
    @Input() blocks: TBlockModel[];
    @BlockUI('modal-block-container') blockUIModal: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    @Output() eventCancel = new EventEmitter();
    @Output() eventRefresh = new EventEmitter();
    @Output() backToList = new EventEmitter();
    public producer: TProducerModel;
    public actions = CONSTANTS.CRUD_ACTION;
    public blocksToSave: TBlockModel[] = [];
    public form: UntypedFormGroup;
    public orderStatusAsc: {
        name: boolean;
        farmName: boolean;
    } = {
            name: true,
            farmName: false,
        };
    public showCompletedAlert: boolean = false;
    public isBlockOnEdition: boolean = false
    public permissionTag = CONSTANTS.PERMISSIONS.BLOCKS;
    public permissionType = CONSTANTS.PERMISSION_TYPES.CREATE;
    private _measurenmentUnitId: string;
    constructor(
        private _builder: UntypedFormBuilder,
        private _blockService: TBlockService,
        private _alertService: AlertService,
        private _responseErrorHandlerService: ResponseErrorHandlerService,
        private _notifierService: NotifierService,
        private _i18nPipe: I18nPipe,
        private _unitMeasureService: UnitMeasuresService
    ) { }

    ngOnInit() {
        this._getMeasurenmentUnit();
        this.producer = (this.data as IActionDataModel).producer;
        this.blocks = this.blocks.sort((a, b) => {
            let aValue: any = a['name'];
            let bValue: any = b['name'];
            return sortAlphanumerical(
                aValue.toLowerCase().replace(' ', ''),
                bValue.toLowerCase().replace(' ', ''),
                true
            );
        });
        this.createFormArray(this.blocks);
    }

    private _getMeasurenmentUnit() {
        this.blockUIModal.start();
        this._unitMeasureService
            .getAreaUnitMeasures()
            .pipe(
                take(1),
                filter((u) => !!u),
                map((u: any) => u.data as Array<UnitMeasureModel>)
            )
            .subscribe(
                (u: UnitMeasureModel[]) => {
                    this._measurenmentUnitId = u[0].measurement_unit_id;
                    this.blockUIModal.stop();
                },
                (e) => {
                    this._alertService.showAlert(e.status, e.message);
                    this.blockUIModal.stop();
                }
            );
    }

    public sortBlocks(propertie: string): void {
        for (const key in this.orderStatusAsc) {
            if (
                Object.prototype.hasOwnProperty.call(this.orderStatusAsc, key)
            ) {
                if (propertie !== key) {
                    this.orderStatusAsc[key] = false;
                }
            }
        }
        this.orderStatusAsc[propertie] = !this.orderStatusAsc[propertie];
        this.blocks = this.blocks.sort((a, b) => {
            let aValue: any = a[propertie] || '';
            let bValue: any = b[propertie] || '';

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortAlphanumerical(
                    aValue.toLowerCase().replace(' ', ''),
                    bValue.toLowerCase().replace(' ', ''),
                    this.orderStatusAsc[propertie]
                );
            }
            return 0;
        });
    }

    public onOpenedPanelEvent(block: TBlockModel) { }
    public onClosedPanelEvent(block: TBlockModel) {
        const foundBlock = this.blocks.find(b => b.id === block.id);
        foundBlock.isExpanded = false;
    }
    public onBackClick() {
        this.backToList.emit(this.blocks);
    }
    public onCancelClick() {
        this.eventCancel.emit();
    }
    public onPanelActionClicked(action: number, id: string, index) {
        if (action === this.actions.UPDATE) {
            const blocks = this.blocks;
            const selectedBlock = blocks[blocks.findIndex((b) => b.id === id)];
            selectedBlock.isEditing = !selectedBlock.isEditing;
            selectedBlock.isExpanded = true;
            selectedBlock.isCompleted = false;
            this.blocks = blocks;
            this.blocksToSave = blocks;
            this.isBlockOnEdition = this.blocks.filter(b => b.isEditing).length > 0;
        }

        if (action === this.actions.DELETE) {
            const selectedBlock = this.blocks[this.blocks.findIndex((b) => b.id === id)];
            selectedBlock.isSelected = false;
            this.blocks = this.blocks.filter((b) => b.id !== id);
            this.createFormArray(this.blocks);
            if (this.blocks.length === 0) {
                this.backToList.emit([]);
            }
        }
    }
    public onSaveBlockEdit(block: any) {
        const persistFarm = this.blocks.find(b => b.id === block.id).farm;
        const editedBlock = new TBlockModel(block, block.federated_id);
        if (persistFarm) {
            editedBlock.farm = persistFarm;
            editedBlock.farmName = persistFarm.name;
            editedBlock.farmId = persistFarm.id;
        }
        const blocks = this.blocks;
        editedBlock.isEditing = false;
        editedBlock.isCompleted = true;
        this.isBlockOnEdition = false;
        blocks[blocks.findIndex((b) => b.id === editedBlock.id)] = editedBlock;
        if (!this.blocksToSave.find((b) => b.id === editedBlock.id)) {
            this.blocksToSave.push(editedBlock);
        } else {
            this.blocksToSave[
                this.blocksToSave.findIndex((b) => b.id === editedBlock.id)
            ] = editedBlock;
        }
        this.blocks = blocks;
        this.createFormArray(this.blocks);
    }

    public createFormArray(blocks: TBlockModel[]) {
        this.form = this._builder.group({
            items: this._builder.array(
                blocks.map((b) => this.getFormGroupForBlock(b))
            ),
        });
    }

    public getFormGroupForBlock(block: TBlockModel) {
        return this._builder.group({
            name: [
                block.name,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(CONSTANTS.NAME_PATTERN),
                    Validators.maxLength(255),
                ]),
            ],
            farm: [block.farm ? block.farm : block.farmId],
            country: [block.countryId],
            state: [block.stateId],
            city: [block.cityId],
            town: [block.townId],
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
            extensionUnit: [block.extensionMeasurementUnitId],
            shadeVariety: [block.shadeVariety.map((s) => s.shadeVarietyId)],
            soilType: [block.soilType.map((so) => so.soilTypeId)],
            coffeeType: [block.coffeeVariety.map((c) => c.coffeeVarietyId)],
            federatedId: [block.federatedId]
        });
    }


    public onCreateClick() {
        if (this.form.valid) {
            const payload = this.getPayloadForCreate(this.form.getRawValue());
            this.blockUIModal.start();
            this._blockService.createBlock(payload).subscribe(
                (response: any) => {
                    let blocksName: Array<string> = [];
                    (payload.items as Array<any>).forEach(x => {
                        if (x.blocks) {
                            (x.blocks as Array<any>).forEach(block => {
                                blocksName.push(' ' + block.name);
                            });
                        }
                    });
                    this._notifierService.notify('success',
                        this._i18nPipe.transform('blocks-success-created-federated')
                            .replace('blocksValue', blocksName));
                    this.blockUIModal.stop();
                    this.eventRefresh.emit();
                },
                (error: HttpErrorResponse) => {
                    const message = this._responseErrorHandlerService.handleError(
                        error,
                        't-blocks'
                    );
                    this.blockUIModal.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            );
        } else {
            this._openEditBlocksForm();
        }
    }

    private _openEditBlocksForm() {

        this.blocks.forEach(block => {
            if (!block.isCompleted) {
                block.isEditing = true;
                block.isExpanded = true;
                this.isBlockOnEdition = true;
            }
        });
        this.showCompletedAlert = this.blocks.filter(b => b.isCompleted === false).length > 0;
        setTimeout(() => {
            this.showCompletedAlert = false;
        }, 10000);
    }

    public getPayloadForCreate(blocks: any): any {
        const values = blocks.items.map((i) => ({
            seller: this.data.producerId,
            farm: i.farm ? (i.farm.code === CONSTANTS.FEDERATE_APPS_CODE.SILOSYS ? i.farm.id : null) : null,
            height: i.height,
            extensionBlock: convertStringToNumber(i.extension),
            measurement_type_id: 2,
            measurement_unit_id: this._measurenmentUnitId,
            variety_id: null,
            blocks: [
                {
                    name: i.name,
                    country_id: i.country,
                    state_id: i.state,
                    city_id: i.city,
                    village_id: i.town,
                    address: i.address,
                    latitude: i.latitude,
                    longitude: i.longitude,
                    federated_id: i.federatedId,
                    shade_variety: i.shadeVariety.map((s: Number) => ({
                        id: s,
                    })),
                    zip_code:i.zip_code,
                    soil_type: i.soilType.map((s: Number) => ({ id: s })),
                    variety_coffee: i.coffeeType.map((s: Number) => ({
                        id: s,
                    })),
                    farm: i.farm && i.farm.code === CONSTANTS.FEDERATE_APPS_CODE.SILOSYS ? null :
                        typeof i.farm === 'object' && i.farm !== null
                            ? new FarmRequestFromBlockFederatedModel(i.farm, this.producer.id, this._measurenmentUnitId)
                            : null
                },
            ],
        }));

        return {
            items: values,
        };
    }
}

