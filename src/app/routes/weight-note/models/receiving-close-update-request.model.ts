import { IWNRequestActionReceivingNoteModel, IWNRequestCertificationModel, IWNRequestWeightNoteModel } from './wn-request-action-receiving-note.model';

export interface IWNCloseUpdateModel {
    transaction_in_id: number,
    farm: number,
    block: string,
    weight_note_certifications: IWNRequestCertificationModel[]
}

export class WNCloseUpdateModel implements IWNCloseUpdateModel {
    public transaction_in_id: number;
    public farm: number;
    public block: string;
    public weight_note_certifications: IWNRequestCertificationModel[];

    constructor(item: IWNRequestWeightNoteModel) {
        this.transaction_in_id = item.transaction_in_id;
        this.farm = item.farm;
        this.block = item.block;
        this.weight_note_certifications = item.weight_note_certifications;
    }
}

export interface IReceivingCloseUpdateRequestModel {
    seller: number;
    contractid: string;
    weight_notes: IWNCloseUpdateModel[];
}

export class ReceivingCloseUpdateRequestModel implements IReceivingCloseUpdateRequestModel {
    public seller: number = null;
    public contractid: string = '';
    public weight_notes: IWNCloseUpdateModel[] = [];

    constructor(item: IWNRequestActionReceivingNoteModel) {
        this.seller = item.seller;
        this.contractid = item.contractid;
        this.weight_notes = item.weight_notes.map(weight_note => new WNCloseUpdateModel(weight_note))
    }
}