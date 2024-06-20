import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';

interface IContractTrumodityDetailModel {
    contract_id: string;
    weight: number;
    pricing: {
        price_per_hundred: number;
        weight_mode: string;
    };
    contract_type: string;
    weight_threshold: number;
    commodity: string;
    commodity_id: number;
    current_total_weight: number;
}

export class ContractTrumodityDetailModel {
    public contractId: string = null;
    public weight: number = 0;
    public weightQQ: number = 0;
    public pricing: {
        priceUnit: number;
        weightMode: string;
    } = {
            priceUnit: 0,
            weightMode: null,
        };
    public contractType: string = null;
    public weightThreshold: number = 0;
    public commodity: string = null;
    public commodityId: number = null;
    public currentTotalWeight : number = 0;
    public currentTotalWeightOut : number = 0;
    constructor(item?: IContractTrumodityDetailModel) {
        if (item) {
            this.contractId = item.contract_id ?? this.contractId;
            this.weight = item.weight ?? this.weight;
            this.weightQQ = convertLbtoQQ(this.weight);
            this.pricing = item.pricing
                ? {
                    priceUnit: (item.pricing.price_per_hundred / 100),
                    weightMode: item.pricing.weight_mode,
                }
                : this.pricing;
            this.contractType = item.contract_type ?? this.contractType;
            this.weightThreshold = item.weight_threshold
                ? convertLbtoQQ(item.weight_threshold)
                : this.weightThreshold;
            this.commodity = item.commodity ? item.commodity.replace('resource:io.grainchain.Commodity#',''): this.commodity;
            this.commodityId = item.commodity_id ?? this.commodityId;
            this.currentTotalWeight = item.current_total_weight ?? this.currentTotalWeight
            this.currentTotalWeightOut = convertLbtoQQ(item.current_total_weight) ?? this.currentTotalWeight
        }
    }

    public getContractWeigthBeforeSelectNoted(selectedNoteWeigth): number {
        return this.currentTotalWeightOut - (selectedNoteWeigth ?? 0)
    }
}
