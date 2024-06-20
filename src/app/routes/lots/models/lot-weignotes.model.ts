import { ILotFilterStatusModel } from './lot-filter-status.model';
import { IWeightModel } from './weigth-note.model.ts';
export interface ILotWeignotesModel {
    notes: Array<IWeightModel>;
    params: ILotFilterStatusModel;
    factorConvertion?: number;
}

