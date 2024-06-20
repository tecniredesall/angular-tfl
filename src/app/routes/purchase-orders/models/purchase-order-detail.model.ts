import * as moment from 'moment';
import { IPurchaseOrderWeightNotesModel, PurchaseOrderWeightNotesModel } from './purchase-order-weight-notes.model';
import { convertStringToNumber } from './../../../shared/utils/functions/string-to-number';
import { convertLbtoQQ, convertQQtoLb } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { SettlingStatus, SettlingStatusModel } from './purchase-order.model';

export interface IPurchaseOrderDetailModel {
    buyer: string;
    commodityId: number;
    commodityName: string
    contract: string;
    createdAt: moment.Moment;
    date: moment.Moment;
    creationDate: moment.Moment;
    updateDate: moment.Moment;
    creationMail: string;
    creationUserId: number;
    folio: string;
    creationUser: string;
    id: string;
    note: string;
    totalPayment: number;
    priceType: string;
    producerName: string;
    producerId: number;
    producerAddress: string;
    producerType: string;
    status: number;
    total: number;
    totalQQ: number;
    totalDelivered: number;
    totalDeliveredQQ: number;
    weight: number;
    // weightQQ: number;
    percentage: number;
    averagePrice: number;
    weightNotes: IPurchaseOrderWeightNotesModel[];
    settling : number;
    settlingStatus: SettlingStatusModel;
}

export class PurchaseOrderDetailModel implements IPurchaseOrderDetailModel {
    public buyer: string = '';
    public commodityId: number = null;
    public commodityName: string = '';
    public contract: string = '';
    public createdAt: moment.Moment = null;
    public date: moment.Moment = null;
    public creationDate: moment.Moment = null;
    public updateDate: moment.Moment = null;
    public creationMail: string = '';
    public creationUserId: number = null;
    public folio: string = '';
    public creationUser: string = '';
    public id: string = '';
    public note: string = '';
    public totalPayment: number = null;
    public priceType: string = '';
    public producerName: string = '';
    public producerId: number = null;
    public producerAddress: string = '';
    public producerType: string = '';
    public status: number = null;
    public total: number = null;
    public totalQQ: number = null;
    public totalDelivered: number = null;
    public totalDeliveredQQ: number = null;
    public weight: number = null;
    // public weightQQ: number = null;
    public percentage: number = null;
    public averagePrice: number = null;
    public weightNotes: IPurchaseOrderWeightNotesModel[] = [];
    public settling : number = null
    public settlingStatus: SettlingStatusModel;
    constructor(item?: any) {
        if (item) {
            this.buyer = item.buyer ? item.buyer : this.buyer;
            this.commodityId = item.commodity_id ? item.commodity_id : this.commodityId;
            this.commodityName = item.commodity_name ? item.commodity_name : this.commodityName;
            this.contract = item.contract_id ? item.contract_id : this.contract;
            this.createdAt = item.created_at ? moment(item.closed_at, 'YYYY-MM-DD HH:mm:ss') : this.createdAt;
            this.date = item.date ? moment(item.date, 'YYYY-MM-DD HH:mm:ss') : this.date;
            this.creationDate = item.creation_date ? moment(item.creation_date, 'YYYY-MM-DD HH:mm:ss') : this.creationDate;
            this.updateDate = item.edition_date ? moment(item.edition_date, 'YYYY-MM-DD HH:mm:ss') : this.updateDate;
            this.creationMail = item.creation_email ? item.creation_email : this.creationMail;
            this.creationUserId = item.creation_user ? item.creation_user : this.creationUserId;
            this.folio = item.folio ? String(item.folio).padStart(5, '0') : this.folio;
            this.creationUser = item.fullname ? item.fullname : this.creationUser;
            this.id = item.id ? item.id : this.id;
            this.note = item.note ? item.note : this.note;
            this.totalPayment = item.total_payment ? convertStringToNumber(item.total_payment) : this.totalPayment;
            this.priceType = item.pricing_type ? item.pricing_type : this.priceType;
            this.producerAddress = item.producer_address ? item.producer_address : this.producerAddress;
            this.producerName = item.producer_name ? item.producer_name : this.producerName;
            this.producerId = item.producer_id ? item.producer_id : this.producerId;
            this.producerType = item.productor_type ? item.productor_type : this.producerType;
            this.status = item.status ? item.status : this.status;
            this.total = item.total ? item.total : this.total;
            this.totalDelivered = item.total_delivered ? convertStringToNumber(item.total_delivered) : this.totalDelivered;
            this.totalDeliveredQQ = convertLbtoQQ(this.totalDelivered)
            this.weight = item.weight ? convertStringToNumber(item.weight) : this.weight;
            this.totalQQ = item.total_qq ? item.total_qq : this.totalQQ;
            // this.weightQQ = convertLbtoQQ(this.weight);
            this.percentage = (this.totalQQ * 100) / this.weight;
            item.purchase_orders_weight_notes.forEach(element => {
                this.weightNotes.push(new PurchaseOrderWeightNotesModel(element))
            });
            this.averagePrice = this.calculateAveragePrice(this.weightNotes);
            this.settling = item.settling ?? this.settling;
            this.settlingStatus = new SettlingStatusModel(item.settling_status)
        } else {
            Object.assign({}, this)
        }
    }

    calculateAveragePrice(weightNotes: IPurchaseOrderWeightNotesModel[]): number {
        let totalPrice: number = 0;
        weightNotes.forEach((element, index) => {
            totalPrice += element.price;
        });
        return totalPrice / weightNotes.length;
    }

}
