import { WNWeightModel, IWNWeightModel } from '../../routes/weight-note/models/wn-weight.model';


export interface IWeighingTableModel {
    weights: Array<IWNWeightModel>;
    totalSacks: number;
    totalNet: number;
    totalNetQQ: number;
    totalTare: number;
    totalGross: number;
    totalTareAditional: number;
    lotId?: string;

}

export class WeighingTableModel implements IWeighingTableModel {
    public weights: Array<IWNWeightModel> = [];
    public totalSacks: number = 0;
    public totalNet: number = 0;
    public totalNetQQ: number = 0;
    public totalTare: number = 0;
    public totalGross: number = 0;
    public totalTareAditional: number = 0;
    public lotId: string;
    constructor() {
        if (this.weights.length == 0) {
            this.weights.push(new WNWeightModel());
        }
    }
}
