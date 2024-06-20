import * as moment from 'moment';
import { ILotHistoryAuthorModel, LotHistoryAuthorModel } from './lot-history-author.model'
import { ILotHistoryPayloadModel, LotHistoryPayloadModel } from './lot-history-payload.model'

export interface ILotHistoryModel {
    id: string;
    type: string;
    author: ILotHistoryAuthorModel;
    folio: string;
    lotId: string;
    payload: ILotHistoryPayloadModel;
    createdAt: moment.Moment;
    deletedAt: moment.Moment;
    updatedAt: moment.Moment;
}

export class LotHistoryModel implements ILotHistoryModel {
    public id: string = '';
    public type: string = '';
    public author: ILotHistoryAuthorModel = null;
    public folio: string = '';
    public lotId: string = '';
    public payload: ILotHistoryPayloadModel = null;
    public createdAt: moment.Moment = null;
    public deletedAt: moment.Moment = null;
    public updatedAt: moment.Moment = null;

    constructor(item?: any) {
        if(item) {
            this.id = item.id;
            this.type = item.type;
            this.author = new LotHistoryAuthorModel(item.author);
            this.folio = item.folio;
            this.lotId = item.lot_id;
            this.payload = item.payload ? new LotHistoryPayloadModel(item.payload): this.payload;
            this.createdAt = item.created_at;
            this.deletedAt = item.deleted_at;
            this.updatedAt = item.updated_at;
        }
    }
}