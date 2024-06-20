import { convertStringToNumber } from "src/app/shared/utils/functions/string-to-number";
import { IWNWeightModel } from "../../weight-note/models/wn-weight.model";

export interface ISTWeightRequestModel {
    shipping_weight_id: string;
    weight_index: number;
    weight_sacks_number: number;
    weight_gross: number;
    weight_tare: number;
    weight_tare_aditional: number;
}

export class STWeightRequestModel implements ISTWeightRequestModel {
    public shipping_weight_id: string;
    public weight_index: number;
    public weight_sacks_number: number;
    public weight_gross: number;
    public weight_tare: number;
    public weight_tare_aditional: number;
    constructor(weight: IWNWeightModel, index: number) {
        this.weight_index = index;
        this.weight_sacks_number = weight.sacksNumber && convertStringToNumber(weight.sacksNumber.toString());
        this.weight_gross = weight.grossWeight && convertStringToNumber(weight.grossWeight.toString());
        this.weight_tare = weight.tare && convertStringToNumber(weight.tare.toString());
        this.weight_tare_aditional = weight.tareAditional ?? 0;
    }
}