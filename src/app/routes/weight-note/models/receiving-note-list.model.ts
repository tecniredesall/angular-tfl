import * as moment from 'moment-timezone';
import { IWNProductionModel, WNProductionModel } from './wn-production.model'

export interface IWNPurchaseOrderModel {
    id: string;
    folio: number;
    weightNotes: any[];
}

export class WNPurchaseOrderModel implements IWNPurchaseOrderModel {
    public id: string = '';
    public folio: number = null;
    public weightNotes: any[] = [];

    constructor(item: any) {
        this.id = item.purchase_order_id ?? item.id ?? this.id;
        this.folio = item.folio ?? this.folio;
        this.weightNotes = item.weight_notes ?? item.weightNotes ?? this.folio;
    }
}

export interface IReceivingNoteListModel {
    associated: IWNPurchaseOrderModel[]
    batchedComplete: number;
    creationEmail: string
    creationName: string;
    creationStorageDate: moment.Moment;
    editionEmail: string;
    editionStorageDate: moment.Moment;
    folio: number;
    isClose: boolean;
    net: number;
    netQQ: number;
    netWeight: number;
    notes: number;
    penalties: number;
    print: number;
    receptionCode: number;
    id: string;
    startDate: moment.Moment;
    tanks: number;
    transformations: number;
    weightNotes: IWNProductionModel[];
    tanksMessage: string;
    transformationsMessage: string;
    isAllowedCloseNote: boolean;
    isColapse?: boolean;
}

export class ReceivingNoteListModel implements IReceivingNoteListModel {
    public associated: IWNPurchaseOrderModel[] = [];
    public batchedComplete: number;
    public creationEmail: string = '';
    public creationName: string = '';
    public creationStorageDate: moment.Moment;
    public editionEmail: string = '';
    public editionStorageDate: moment.Moment;
    public folio: number;
    public isClose: boolean;
    public net: number;
    public netQQ: number;
    public netWeight: number = 0;
    public notes: number;
    public penalties: number;
    public print: number;
    public receptionCode: number;
    public id: string;
    public startDate: moment.Moment;
    public tanks: number;
    public transformations: number;
    public weightNotes: IWNProductionModel[] = [];
    public tanksMessage: string = '';
    public transformationsMessage: string = '';
    public isAllowedCloseNote: boolean = true;

    constructor(item?: any) {
        this.associated = item ? item.associated.map((p: any) => new WNPurchaseOrderModel(p)) : this.associated;
        this.batchedComplete = item?.batched_complete ?? item?.batchedComplete ?? this.batchedComplete;
        this.creationEmail = item.creation_email ?? item?.creationEmail ?? this.creationEmail;
        this.creationName = item.creation_name ?? item?.creationName ?? this.creationName;
        this.creationStorageDate = item?.creation_storage_date ?
            moment(item.creation_storage_date, 'YYYY-MM-DD HH:mm:ss') :
            item.creationStorageDate ?? this.creationStorageDate;
        this.editionEmail = item?.edition_email ?? item?.editionEmail ?? this.editionEmail;
        this.editionStorageDate = item?.edition_storage_date ?
            moment(item.edition_storage_date, 'YYYY-MM-DD HH:mm:ss') :
            item.editionStorageDate ?? this.editionStorageDate;
        this.folio = item?.folio ?? this.folio;
        this.isClose = item?.is_close == 1 ?? item?.isClose ?? this.isClose;
        this.net = item?.net ?? this.net;
        this.netQQ = item?.net_qq ?? item?.netQQ ?? this.netQQ;
        this.netWeight = item?.net_weight ?? item?.netWeight ?? this.netWeight;
        this.notes = item?.notes ?? this.notes;
        this.penalties = item?.penalities ?? item.penalties ?? this.penalties;
        this.print = item?.print ?? this.print;
        this.receptionCode = item?.reception_code ?? item?.receptionCode ?? this.receptionCode;
        this.id = item?.reception_id ?? item?.id ?? this.id;
        this.startDate = item?.start_date ?
            moment(item.start_date, 'YYYY-MM-DD HH:mm:ss') :
            item.startDate ?? this.startDate;
        this.tanks = item?.tanks ?? this.tanks;
        this.transformations = item?.transformations ?? this.transformations;
        this.weightNotes = item?.weight_notes ? item.weight_notes.map(w => new WNProductionModel(w, true)) : item.weightNotes ?? this.weightNotes;
    }

}