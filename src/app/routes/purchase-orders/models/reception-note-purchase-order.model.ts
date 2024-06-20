import { roundDecimal, accurateRoundDecimalMultiplication } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import * as moment from 'moment';

import { accurateDecimalSum } from '../../../shared/utils/functions/accurate-decimal-operation';
import { convertStringToNumber } from '../../../shared/utils/functions/string-to-number';

export interface IReceptionNotePurchaseOrderModel {
    creationEmail: string;
    creationUserId: string;
    folio: number;
    id: string;
    startDate: moment.Moment;
    totalSacks: number;
    weightNotes: IWeightNoteModel[];
    selected: boolean;
    indeterminated: boolean;
    collapsed?: boolean;
    netQQ: number;
}
export class ReceptionNotePurchaseOrderModel
    implements IReceptionNotePurchaseOrderModel
{
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals')
        ? JSON.parse(localStorage.getItem('decimals')).general
        : 2;
    public creationEmail: string = '';
    public creationUserId: string = '';
    public folio: number = null;
    public id: string = '';
    public startDate: moment.Moment = null;
    public totalSacks: number = null;
    public weightNotes: IWeightNoteModel[] = [];
    public selected: boolean = false;
    public indeterminated: boolean = false;
    public collapsed: boolean = true;
    public netQQ: number = null;

    constructor(item: any, factor: number) {
        if (item) {
            this.creationEmail = item.creation_email
                ? item.creation_email
                : this.creationEmail;
            this.creationUserId = item.creation_user
                ? item.creation_user
                : this.creationUserId;
            this.folio = item.folio ? item.folio : this.folio;
            this.id = item.reception_id ? item.reception_id : this.id;
            this.startDate = item.start_date
                ? moment(item.start_date, 'YYYY-MM-DD HH:mm:ss')
                : this.startDate;
            this.totalSacks = item.totalSacks
                ? convertStringToNumber(item.totalSacks)
                : this.totalSacks;
            this.weightNotes = item.weight_notes
                ? item.weight_notes.map(
                      (data: any) => new WeightNoteModel(data, factor)
                  )
                : this.weightNotes;
            this.netQQ = convertStringToNumber(item.weight) ?? this.netQQ
            this.selected = false;
            this.indeterminated = false;
            this.collapsed = true;
        }
    }
    private getTotalWeighNotesQQ(weights: Array<IWeightNoteModel>): number {
        let totalsNet: number[] = [];
        weights.forEach((wn) => {
            totalsNet.push(wn.netDryWeight);
        });
        return accurateDecimalSum(totalsNet, this.DECIMAL_DIGITS);
    }
}
export interface IWeightNoteModel {
    creationEmail: string;
    commodityTypename: string;
    netDryWeight: number;
    receptionId: string;
    sellerId: number;
    startDate: moment.Moment;
    totalSacks: number;
    transactionInId: number;
    id: string;
    selected: boolean;
    price?: number;
    total?: number;
    netDryWeightOut?: number;
}

export class WeightNoteModel implements IWeightNoteModel {
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals')
        ? JSON.parse(localStorage.getItem('decimals')).general
        : 2;
    public creationEmail: string = '';
    public commodityTypename: string = '';
    public netDryWeight: number = null;
    public receptionId: string = '';
    public sellerId: number = null;
    public startDate: moment.Moment = null;
    public totalSacks: number = null;
    public transactionInId: number = null;
    public id: string = '';
    public selected = false;
    public price?: number = null;
    public total?: number = null;
    public netDryWeightOut?: number = null;

    constructor(item: any, factor: number) {
        if (item) {
            this.creationEmail = item.creation_email
                ? item.creation_email
                : this.creationEmail;
            this.commodityTypename = item.ct_name
                ? item.ct_name
                : this.commodityTypename;
            this.netDryWeight = item.netdrywt
                ? convertStringToNumber(item.netdrywt)
                : this.netDryWeight;
            this.receptionId = item.reception_id
                ? item.reception_id
                : this.receptionId;
            this.sellerId = item.seller_id ? item.seller_id : this.sellerId;
            this.startDate = item.start_date
                ? moment(item.start_date, 'YYYY-MM-DD HH:mm:ss')
                : this.startDate;
            this.totalSacks = item.totalSacks
                ? convertStringToNumber(item.totalSacks)
                : item.weight_sacks_number
                ? convertStringToNumber(item.weight_sacks_number)
                : this.totalSacks;
            this.transactionInId = item.transaction_in_id
                ? item.transaction_in_id
                : this.transactionInId;
            this.id = item.weight_note_id ? item.weight_note_id : this.id;
            this.selected = false;
            this.price = item.price ? Number(item.price) : this.price;
            this.total = item.total ? convertStringToNumber(item.total) : this.total;
            this.netDryWeightOut = item.netdrywt ? roundDecimal(convertLbtoQQ(convertStringToNumber(item.netdrywt)),this.DECIMAL_DIGITS) : this.netDryWeightOut;
        }
    }

}
