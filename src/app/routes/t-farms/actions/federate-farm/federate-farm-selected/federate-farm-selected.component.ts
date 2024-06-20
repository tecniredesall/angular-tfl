import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { IFarmFederateModel } from '../../../models/farm-federate.model';
import { TIFarmModel } from '../../../models/farm.model';
import { TIRequestActionFarmModel, TRequestActionFarmModel } from '../../../models/request-action-farm.model';
import { FarmService } from '../../../services/farm.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-federate-farm-selected',
    templateUrl: './federate-farm-selected.component.html',
    styleUrls: ['./federate-farm-selected.component.scss']
})
export class FederateFarmSelectedComponent implements OnInit {
    @Input() farms: Array<IFarmFederateModel> = [];
    @Input() seller: TProducerModel;
    @Output() backEmiter = new EventEmitter();
    @Output() cancelEmiter = new EventEmitter();
    @Output() updateEmiter = new EventEmitter();
    @BlockUI('farm-federation-container') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public wasUpdated: boolean = false;
    private farmsForCreate: Array<TIFarmModel> = [];
    public iscompleted: boolean = false;
    public showCompletedAlert: boolean = false;
    public isFarmOnEdition: boolean = false;
    constructor(private farmService: FarmService,
        private alertService: AlertService,
        private notifierService: NotifierService,
        private handleErrors: ResponseErrorHandlerService,
        private i18n: I18nPipe
    ) { }
    ngOnInit() {
        this._validateCompleteBlocks();
    }
    private _validateCompleteBlocks() {
        this.farms.forEach(item => {
            item.farm.blocks = item.farm.blocks.filter(b => b.name !== null
                && b.countryId !== null
                && b.stateId !== null
                && b.address !== null
                && b.cityId !== null);
        });
    }
    public onChangeStatusFarm(farm: IFarmFederateModel, opened: boolean, event) {
        farm.edit = opened;
        this.isFarmOnEdition = opened;
        farm.farm.seller = this.seller.id;
        if (opened) {
            event.stopPropagation();
        }
    }
    public onRemoveFarmSelected(farm: IFarmFederateModel) {
        const index = this.farms.findIndex(x => x.farm.id === farm.farm.id);
        this.farms.splice(index, 1);
        if (this.farms.length == 0) {
            this.onBackToList();
        }
        this._validateCompleted();
    }
    public onBackToList(): void {
        this.farms.forEach(
            f => {
                f.edit = false;
            }
        );
        this.backEmiter.emit(this.farms);
    }
    public onSetFarmData(farm: TIFarmModel, completeData: IFarmFederateModel): void {
        completeData.edit = false;
        completeData.farm = farm;
        completeData.farm.measurementUnit = farm.extensionUnit.abbreviation;
        completeData.completed = true;
        farm.federatedId = completeData.federatedId;
        this.isFarmOnEdition = false;
        this.showCompletedAlert = this.farms.filter(x => x.completed === false).length > 0;
        this.farms[this.farms.findIndex(x => x.federatedId === completeData.federatedId)] = completeData;
        this.wasUpdated = true;
        const index = this.farmsForCreate.findIndex(x => x.id === farm.id);
        if (index >= 0) {
            this.farmsForCreate[index] = farm;
        } else {
            this.farmsForCreate.push(farm);
        }
        this._validateCompleted();
    }
    private _validateCompleted() {
        this.iscompleted = this.farms.filter(x => x.completed === false).length === 0;
    }
    public onActionFooterSelected(action) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.CANCEL: {
                this.cancelEmiter.emit();
                break;
            }
            case CONSTANTS.CRUD_ACTION.CREATE: {
                if (this.iscompleted) {
                    this._submitFarms();
                } else {
                    this._openFarmsForEdit();
                }
                break;
            }
        }
    }
    private _openFarmsForEdit() {
        this.farms.forEach(farm => {
            if (!farm.completed) {
                farm.edit = true;
                this.isFarmOnEdition = true;
            }
        });
        this.showCompletedAlert = this.farms.filter(x => x.completed === false).length > 0;
        setTimeout(() => {
            this.showCompletedAlert = false;
        }, 10000);
    }
    private _submitFarms() {
        this.blockUI.start();
        const requestData: Array<TIRequestActionFarmModel> = [];
        let farmsName: Array<string> = [];
        this.farmsForCreate.forEach((farm: any) => {
            delete farm.id;
            requestData.push(new TRequestActionFarmModel(farm, true, this.seller));
            farmsName.push(' ' + farm.name);
        });
        this.farmService.createFarm(requestData)
            .pipe(take(1))
            .subscribe(
                (response: any) => {
                    this.blockUI.stop();
                    this.notifierService.notify('success',
                        this.i18n.transform('farms-success-created-federated').replace('farmsValue', farmsName));
                    this.updateEmiter.emit();
                },
                (error) => {
                    this.blockUI.stop();
                    const message = this.handleErrors.handleError(
                        error,
                        't-farm'
                    );
                    this.alertService.errorTitle(
                        this.i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }
}
