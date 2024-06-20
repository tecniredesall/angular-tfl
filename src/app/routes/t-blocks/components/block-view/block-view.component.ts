import { IActionDataModel } from 'src/app/routes/producers/models/action-data.model';
import { IAddressModel } from 'src/app/shared/models/address.model';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { getGeneralDecimalPlaces } from 'src/app/shared/utils/functions/decimals-configuration';

import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

import { TBlockModel } from '../../models/block.model';
import { IInputDataActionsBlockModel } from '../../models/input-data-actions-block.model';

@Component({
    selector: 'app-block-view',
    templateUrl: './block-view.component.html',
    styleUrls: ['./block-view.component.scss'],
})
export class BlockViewComponent implements OnInit {
    @HostBinding('class.is-for-fed-item') federatedItemClass = false;
    @Input() data: IInputDataActionsBlockModel | IActionDataModel = null;

    @Input() isForFederatedItem: boolean = false;
    @Input() federatedBlock: TBlockModel;
    @Input() federatedProducer: TProducerModel;

    @Output() eventEdit = new EventEmitter();
    @Output() eventCancel = new EventEmitter();

    public block: TBlockModel;
    public producer: TProducerModel;
    public address: IAddressModel;
    public action: number;
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public PERMISSION_TAG = CONSTANTS.PERMISSIONS;
    readonly DECIMAL_PLACES: number = getGeneralDecimalPlaces();

    constructor() {}

    ngOnInit() {
        if (this.isForFederatedItem) {
            this.action = this.ACTIONS.READ;
            this.block = this.federatedBlock;
            this.producer = this.federatedProducer;
            this.federatedItemClass = true;
        } else {
            if (this.data) {
                this.action = this.ACTIONS.READ;
                this.block = new TBlockModel(
                    (this.data as IActionDataModel).blocks[0]
                );
            }
            this.producer = (this.data as IActionDataModel).producer;
        }
        this.address = {
            country: this.block.countryId,
            state: this.block.stateId,
            city: this.block.cityId,
            village: this.block.townId,
            address: this.block.address,
            zip_code: this.block.zipCode
        };
    }

    public onEditClick() {
        this.eventEdit.emit();
    }

    public onCloseClick() {
        this.eventCancel.emit();
    }

}
