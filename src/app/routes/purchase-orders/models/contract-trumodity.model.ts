import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';

export interface IProducerContract {
    id: string;
    buyer_name: string;
    commodity_name: string;
    weight: string;
    total_delivered: string;
    date: string;
    company_name: string;
    current_total_weight: string;
}

export interface IContractTrumodityModel {
    id: string;
    producerId: number;
    producerName: string;
    weightQQ: number;
    deliveredWeight: number;
    creationDate: Date;
    commodityName: string;
    companyName: string;
}

export class ContractTrumodityModel implements IContractTrumodityModel {
    public id: string = null;
    public producerId: number = null;
    public producerName: string = null;
    public weightQQ: number = 0;
    public deliveredWeight: number = 0;
    public creationDate: Date = new Date();
    public commodityName: string = null;
    public companyName: string = null;
    constructor(item?: IProducerContract) {
        if (item) {
            this.id = item.id ?? this.id;
            this.producerName = item.buyer_name ?? this.producerName;
            this.weightQQ = convertLbtoQQ(Number(item.weight)) ?? this.weightQQ;
            this.deliveredWeight = item.current_total_weight
                ? convertLbtoQQ(Number(item.current_total_weight))
                : this.deliveredWeight;
            this.creationDate = item.date ? new Date(item.date) : this.creationDate;
            this.commodityName = item.commodity_name ?? this.commodityName;
            this.companyName = item.company_name ?? this.commodityName;
        }
    }
}
