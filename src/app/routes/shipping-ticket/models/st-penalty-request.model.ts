import { IWNPenaltyModel } from "../../weight-note/models/wn-penalty.model";

export interface ISTPenaltyRequestModel {
    shipping_penalty_id: string;
    penalty_index: number;
    id: string;
    value: string;
}

export class STPenaltyRequestModel implements ISTPenaltyRequestModel {
    public shipping_penalty_id: string;
    public penalty_index: number;
    public id: string;
    public value: string;

    constructor(penalty: IWNPenaltyModel, index: number) {
        this.penalty_index = index;
        this.id = penalty.characteristic?.deduction?.id;
        this.value = penalty.value.toString().replace(' %', '');
    }
}