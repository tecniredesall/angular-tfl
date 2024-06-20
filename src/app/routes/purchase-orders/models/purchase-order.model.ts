import * as moment from 'moment';
import { AttachSession } from 'protractor/built/driverProviders';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { roundDecimal } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';

import { convertStringToNumber } from '../../../shared/utils/functions/string-to-number';
import { IWeightNoteModel, WeightNoteModel } from './reception-note-purchase-order.model';

export interface SettlingStatus {
    id: number;
    slug: string;
    status: string;
}

export class SettlingStatusModel implements SettlingStatus {
    id: number;
    slug: string;
    status: string;
    constructor(item) {
        this.id = item?.id ?? this.id
        this.slug = item?.slug ?? this.slug
        this.status = item?.status ?? this.status
    }

    getLabelForSettlingStatus(){
        switch (this.id) {
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.RECEIVED:
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.READ:
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.DUPLICATED:
                return 'settling-received'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.SETTLED:
                return 'settling-settled'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.CANCELLED:
                return 'settling-cancelled'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.CREATED:
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.PAID:
                return 'settling-created'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.PENDING:
                return 'settling-pending'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.SENT:
                return 'settling-sent'
            break;
            default:
                break;
        }
        return 'purchase-order-open'
    }

    getStyleForSettlingStatus(){
        switch (this.id) {
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.RECEIVED:
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.DUPLICATED:
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.READ:
                return 'note-close'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.SETTLED:
                return 'note-settling'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.CANCELLED:
                return 'note-cancelled'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.PAID:
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.CREATED:
                return 'note-process'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.PENDING:
                return 'note-pending'
            break;
            case CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.SENT:
                return 'note-send'
            break;
            default:
                break;
        }
        return 'note-open'
    }
}

export interface RequestResentSettling {
    purchase_order_id: string;
}

export class RequestResentSettlingModel implements RequestResentSettling{
    purchase_order_id: string;
    constructor(item){
        this.purchase_order_id = item?.purchase_order_id ?? item?.id ?? this.purchase_order_id
    }
}

export class IPurchaseOrderModel {
    contract: string;
    commodityId: number;
    creationDate: moment.Moment;
    creationEmail: string;
    id: string;
    folio: string;
    producerName: string;
    producer: string;
    producerId: string;
    producerAddress: string;
    totalNotes: number;
    totalPayment: number;
    totalWeightQQ: number;
    weight: number;
    contractWeightQQ: number;
    status: number;
    productorType: string;
    settling: number;
    weightNotes: IWeightNoteModel[];
    note: string;
    settlingStatus: SettlingStatus;
}

export class PurchaseOrderModel implements IPurchaseOrderModel {
    public contract: string = null;
    public commodityId: number = null;
    public creationDate: moment.Moment = null;
    public creationEmail: string = null;
    public id: string = null;
    public folio: string = null;
    public producerName: string = '-';
    public producer: string = '-';
    public totalNotes: number = 0;
    public totalPayment: number = 0;
    public totalWeightQQ: number = 0;
    public status: number;
    public producerId: string;
    public productorType: string;
    public producerAddress: string;
    public weight: number;
    public contractWeightQQ: number;
    public settling: number = 0;
    public weightNotes: WeightNoteModel[] = [];
    public note: string = null;
    public settlingStatus: SettlingStatus;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals'))?.general;
    constructor(item?: any) {

        if (item) {
            this.contract = item.contract_id ? item.contract_id : this.contract;
            this.creationDate = item.creation_date
                ? moment(item.creation_date, 'YYYY-MM-DD HH:mm:ss')
                : this.creationDate;
            this.creationEmail = item.creation_email
                ? item.creation_email
                : this.creationEmail;
            this.id = item.id ? item.id : this.id;
            this.folio = item.folio ? item.folio.toString().padStart(2, '0') : this.folio;
            this.producerName = item.producer_name ?? this.producerName;
            this.producer = item.producer ?? this.producer;
            this.producerId = item.producer_id ?? this.producerId;
            this.totalNotes = item.total_notes
                ? item.total_notes
                : this.totalNotes;
            this.totalPayment = item.total_payment
                ? convertStringToNumber(item.total_payment)
                : this.totalPayment;
            this.totalWeightQQ = convertStringToNumber(item.total_qq) ?? this.totalWeightQQ;
            this.weight = item.weight ? convertStringToNumber(item.weight) : this.weight;
            this.contractWeightQQ = convertLbtoQQ(this.weight);
            this.status =
                item.status === 1
                    ? CONSTANTS.PURCHASE_ORDER_STATUS.CREATED
                    : item.status === 2
                        ? CONSTANTS.PURCHASE_ORDER_STATUS.LIQUIDATE
                        : null;
            this.productorType = item.productor_type ?? null;
            this.producerAddress = item.producer_address ?? null;
            this.settling = item.settling ?? this.settling;
            this.weightNotes = item.purchase_orders_weight_notes
                ? item.purchase_orders_weight_notes.map(
                    (n: any) => new WeightNoteModel(n, null)
                )
                : [];
            this.weightNotes.forEach( (w: IWeightNoteModel) => {
                w.netDryWeightOut = roundDecimal(convertLbtoQQ(w.netDryWeight),this.DECIMAL_DIGITS)
            }
            )
            this.note = item.note ?? this.note;
            this.commodityId = item.commodity_id ? item.commodity_id.toString() : this.commodityId;
            this.settlingStatus = new SettlingStatusModel(item.settling_status)
        } else {
            Object.assign(this, {});
        }
    }

    canToResent(){
        return this.settlingStatus?.id && this.settlingStatus?.id !== CONSTANTS.PURCHASE_ORDER_SETTLING_STATUS.SETTLED
    }
}
