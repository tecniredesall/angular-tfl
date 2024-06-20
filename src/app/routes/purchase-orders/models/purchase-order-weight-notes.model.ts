import { accurateDecimalMultiplication, accurateRoundDecimalMultiplication, roundDecimal } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { convertStringToNumber } from './../../../shared/utils/functions/string-to-number';

export interface IPurchaseOrderWeightNotesModel {
    commodityName: string;
    netDryWeight: number;
    price: number;
    total: number;
    weight: number;
    weightQQ: number;
    sacks: number;
    id: string;
    folio: string;
}

export class PurchaseOrderWeightNotesModel implements IPurchaseOrderWeightNotesModel {
    public commodityName: string = '';
    public netDryWeight: number = null;
    public price: number = null;
    public total: number = null;
    public weight: number = null;
    public weightQQ: number = null;
    public sacks: number = null;
    public id: string = null;
    public folio: string = null;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals'))?.general;
    constructor(item?: any) {
        if (item) {
            this.commodityName = item.ct_name ? item.ct_name : this.commodityName;
            this.netDryWeight = item.netdrywt ? convertStringToNumber(item.netdrywt) : this.netDryWeight;
            this.price = item.price ? convertStringToNumber(item.price) : this.price;
            this.weight = item.netdrywt ? convertStringToNumber(item.netdrywt) : this.weight;
            this.weightQQ = roundDecimal(convertLbtoQQ(this.weight),this.DECIMAL_DIGITS);
            this.sacks = item.weight_sacks_number ? item.weight_sacks_number : this.sacks;
            this.id = item.weight_note_id ? item.weight_note_id : this.id;
            this.folio = item.transaction_in_id ? item.transaction_in_id : this.folio;
            this.total = accurateRoundDecimalMultiplication([this.weightQQ , this.price], this.DECIMAL_DIGITS);
        }
    }
}
