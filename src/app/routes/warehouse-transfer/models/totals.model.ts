import { accurateDecimalSubtraction } from "src/app/shared/utils/functions/accurate-decimal-operation";
import { convertLbtoQQ } from "src/app/shared/utils/functions/convert-qq-to-lb";

export interface ITotalsModel {
    totalNetWeight: number;
    totalNetWeightOut: number;
    totalGrossWeight: number;
    totalWeightSacksNumber: number;
    totalTareWeight: number;
    totalWeightTareAdditional: number;
    totalPenalties: number;
    featuredWeight: number;
    featuredWeightOut: number;
    totalTares: number;
}
export class TotalsModel implements ITotalsModel {
    public totalNetWeight: number = 0;
    public totalNetWeightOut: number = 0;
    public totalGrossWeight: number = 0;
    public totalWeightSacksNumber: number = 0;
    public totalTareWeight: number = 0;
    public totalWeightTareAdditional: number = 0;
    public totalPenalties: number = 0;
    public featuredWeight: number = 0;
    public featuredWeightOut: number = 0;
    public totalTares: number = 0;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;

    constructor(item?: any) {
        if (item) {
            this.totalNetWeight = item.total_netweight ?? item.totalNetWeight ?? this.totalNetWeight;
            this.totalGrossWeight = item.total_groos_weight ?? item.totalGrossWeight ?? this.totalGrossWeight;
            this.totalWeightSacksNumber = item.total_weight_sacks_number ?? item.totalWeightSacksNumber ?? this.totalWeightSacksNumber;
            this.totalTareWeight = item.total_tare_weight ?? item.totalTareWeight ?? this.totalTareWeight;
            this.totalWeightTareAdditional = item.total_weight_tare_aditional ?? item.totalWeightTareAdditional ?? this.totalWeightTareAdditional;
            this.totalPenalties = item.total_penalties ?? item.totalPenalties ?? this.totalPenalties;
            this.featuredWeight = accurateDecimalSubtraction(
                [ this.totalGrossWeight, this.totalTareWeight, this.totalWeightTareAdditional],
                this.DECIMAL_DIGITS
            );
            this.totalNetWeightOut = convertLbtoQQ(this.totalNetWeight);
            this.featuredWeightOut = convertLbtoQQ(this.featuredWeight);
            this.totalTares = this.totalTareWeight + this.totalWeightTareAdditional;
        } else {
            Object.assign(this, {});
        }
    }
}
