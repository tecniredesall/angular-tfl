import { TProducerModel } from 'src/app/shared/models/sil-producer';

import { TBlockModel, TIBlockModel } from '../../t-blocks/models/block.model';
import { TFarmModel, TIFarmModel } from '../../t-farms/models/farm.model';
import { ActionDataTypeEnum } from './action-data-type.enum';

export interface IActionDataModel {
    action: ActionDataTypeEnum;
    isEdit: boolean;
    producerId?: number;
    producer?: TProducerModel;
    farm?: TIFarmModel;
    blocks?: Array<TIBlockModel>;
    allowedBlocks?: Array<TIBlockModel>;
    isReadOnly: boolean;
}

export class ActionDataModel implements IActionDataModel {

    public action: ActionDataTypeEnum = null;
    public isEdit: boolean = false;
    public producerId?: number = null;
    public farm?: TIFarmModel = new TFarmModel();
    public blocks?: Array<TIBlockModel> = [];
    public allowedBlocks?: Array<TIBlockModel> = [];
    public producer: TProducerModel = null;
    public isReadOnly: boolean = false;
    constructor(item: Partial<IActionDataModel> = {}) {

        Object.assign(this, item);

        this.farm = this.farm;
        for (let b = 0; b < this.blocks.length; b++) {
            this.blocks[b] = new TBlockModel(this.blocks[b]);
        }

        for (let b = 0; b < this.allowedBlocks.length; b++) {
            this.allowedBlocks[b] = new TBlockModel(this.allowedBlocks[b]);
        }

    }

}
