import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import * as moment from "moment";
import { WeightNoteModel } from '../../purchase-orders/models/reception-note-purchase-order.model';
import { RetentionOrderWeightNotes, RetentionOrderWeightNotesModel } from './retention-orders-weight-notes';

export interface RetentionOrder {
    id: string;
    folio: string;
    sellerId: number;
    cvIhcafe: string;
    note: string;
    total: number;
    totalNet: number;
    totalGold: number;
    status: string;
    createdBy: string;
    updatedBy: string;
    deletedAt: moment.Moment;
    deletedBy: string;
    retentionDate: moment.Moment;
    createdAt: moment.Moment;
    updatedAt: moment.Moment;
    sellerName: string;
    createdName: string;
    sacks: number;
    notes: Array<RetentionOrderWeightNotes>;
    isVoided?: boolean;
    cancellationReason?: string;
    totalOut: number;
    totalNetOut: number;
    totalGoldOut: number;

}

export class RetentionOrderModel implements RetentionOrder {
    private cssClass: any = {
        [CONSTANTS.RETENTION_ORDER_STATUS.OPEN]: { css: 'orders-status__status--open', icon: 'icon-note-open', label: 'purchase-order-open' },
        [CONSTANTS.RETENTION_ORDER_STATUS.DISABLED]: { css: 'orders-status__status--void', icon: 'icon-note-canceled', label: 'retention-order-status-voided' },
        [CONSTANTS.RETENTION_ORDER_STATUS.CLOSED]: { css: 'orders-status__status--close', icon: 'icon-note-close', label: 'retention-order-status-close' },
    }
    id: string;
    folio: string;
    sellerId: number;
    cvIhcafe: string;
    note: string;
    total: number;
    totalNet: number;
    totalGold: number;
    status: string;
    createdBy: string;
    updatedBy: string;
    deletedAt: moment.Moment = null;;
    deletedBy: string;
    retentionDate: moment.Moment = null;
    createdAt: moment.Moment = null;
    updatedAt: moment.Moment = null;
    sellerName: string;
    createdName: string;
    updatedName: string;
    sacks: number;
    notes: Array<RetentionOrderWeightNotesModel>;
    isVoided?: boolean;
    isOpen?: boolean;
    isClose?: boolean;
    cancellationReason?: string;
    totalOut: number;
    totalNetOut: number;
    totalGoldOut: number;
    constructor(item) {
        if (item) {
            this.id = item.id ?? this.id;
            this.folio = item.folio ?? this.folio;
            this.sellerId = item.seller_id ?? item.sellerId ?? item.seller?.id ?? this.sellerId;
            this.sellerName = item.seller_name ?? this.sellerName;
            this.cvIhcafe = item.cv_ihcafe ?? item.ihcafe ?? this.cvIhcafe;
            this.note = item.note ?? item.textNote ?? this.note;
            this.total = item.total ?? this.total;
            this.totalNet = item.total_net ?? this.totalNet;
            this.totalGold = item.total_gold ?? this.totalGold;
            this.status = item.status ?? this.status;
            this.createdBy = item.created_by ?? this.createdBy;
            this.createdName = item.created_by_name ?? this.createdName;
            this.updatedName = item.created_by_name ?? this.updatedName;
            this.updatedBy = item.updated_by ?? this.updatedBy;
            this.updatedBy = item.updated_by ?? this.updatedBy;
            this.deletedAt = moment(item.deleted_at, 'YYYY-MM-DD HH:mm:ss') ?? this.deletedAt;
            this.deletedBy = item.deleted_by ?? this.deletedBy;
            this.retentionDate = item.retention_date ? moment(item.retention_date) : moment(item.retention_date, 'YYYY-MM-DD HH:mm:ss') ?? this.retentionDate;
            this.createdAt = moment(item.created_at, 'YYYY-MM-DD HH:mm:ss') ?? this.createdAt;
            this.updatedAt = moment(item.updated_at, 'YYYY-MM-DD HH:mm:ss') ?? this.updatedAt;
            this.sacks = item.sacks ?? this.sacks
            this.notes = item.weight_notes ? item.weight_notes.map((n) => new RetentionOrderWeightNotesModel(n)) : item.notes ?? this.notes
            this.isVoided = Number(this.status) == CONSTANTS.RETENTION_ORDER_STATUS.DISABLED
            this.isOpen = Number(this.status) == CONSTANTS.RETENTION_ORDER_STATUS.OPEN
            this.isClose = Number(this.status) == CONSTANTS.RETENTION_ORDER_STATUS.CLOSED
            this.cancellationReason = item.cancellation_reason ?? this.cancellationReason;
            this.totalOut = item.total_out ?? this.totalOut;
            this.totalNetOut = item.total_net_out ?? this.totalNetOut;
            this.totalGoldOut = item.total_gold_out ?? this.totalGoldOut;
        }
    }

    public set _notes(notes: Array<RetentionOrderWeightNotesModel>) {
        this.notes = notes
    }

    get classStatus() {
        return this.cssClass[this.status]
    }

    get TotalNet() {
        return this.notes?.length > 0 ? this.notes.reduce((sum, item) => sum + item.netWeightOut, 0) : 0;
    }

    get TotalGoldNet() {
        return this.notes?.length > 0 ? this.notes.reduce((sum, item) => sum + item.goldNetWeightOut, 0) : 0;
    }


    get Total() {
        return this.notes?.length > 0 ? this.notes.reduce((sum, item) => sum + (item.netWeightOut * item.price), 0) : 0;
    }

    get CvIhcafe() {
        return this.cvIhcafe && this.cvIhcafe.length > 0 ? this.cvIhcafe : `---`
    }

    get Note() {
        return this.note && this.note.length > 0 ? this.note : `---`
    }

    get CountSelectedNotes() {
        const digits: number = 2
        return this.notes && this.notes.length > 0 ? this.notes.length.toString().padStart(digits, '0') : ''
    }

    requestCreationOrder(weightNotes: string[]) {
        const postData =
        {
            "seller_id": this.sellerId,
            "ih_cafe": this.cvIhcafe ?? '',
            "note": this.note ?? '',
            "weight_notes": weightNotes,
            "retention_date": this.retentionDate,
            "status": this.status
        }
        return postData
    }

}



