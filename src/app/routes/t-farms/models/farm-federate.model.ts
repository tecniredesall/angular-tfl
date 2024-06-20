import { SealModel } from 'src/app/shared/utils/models/seal.model';
import { TIBlockModel } from '../../t-blocks/models/block.model';
import { IDimensionsModel } from './dimensions.model';
import { TIFarmModel, TFarmModel } from './farm.model';
export interface IFarmFederateModel {
    federatedId: string;
    farm: TIFarmModel;
    selected: boolean;
    edit: boolean;
    completed: boolean;
}

export class FarmFederateModel implements IFarmFederateModel {
    public federatedId: string = null;
    public farm: TIFarmModel = null;
    public selected: boolean = false;
    public edit: boolean = false;
    public completed: boolean = false;
    constructor(federateId, farm) {
            this.federatedId = federateId ?? this.federatedId;
            this.farm = farm ? new TFarmModel(farm, true) : this.farm;
    }
}
