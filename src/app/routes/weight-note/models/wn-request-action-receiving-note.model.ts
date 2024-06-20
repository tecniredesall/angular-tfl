import { convertQQtoLb } from './../../../shared/utils/functions/convert-qq-to-lb';
import { IWNWeightModel } from "../models/wn-weight.model";
import { IWNPenaltyModel } from "../models/wn-penalty.model";
import { IReceivingNoteModel } from "../models/receiving-note.model";
import { IWNDescriptionModel } from "./wn-description.model";
import { IWNBlockModel } from "./wn-block.model";
import { trimSpaces } from "../../../shared/utils/functions/trim-spaces";
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { IWNCertificationModel } from "./wn-certification.model";
import * as moment from 'moment';

export interface IWNRequestCertificationModel {
    certification_id: string;
}

export class WNRequestCertificationModel implements IWNRequestCertificationModel {
    public certification_id: string = null;
    constructor(id?: string) {
        if (id) {
            this.certification_id = id;
        }
        else {
            Object.assign(this, {});
        }
    }
}

export interface IWNRequestBlockModel {
    block_id: string;
}

export class WNRequestBlockModel implements IWNRequestBlockModel {
    public block_id: string = null;
    constructor(item?: IWNBlockModel) {
        if (item) {
            this.block_id = item.id;
        }
        else {
            Object.assign(this, {});
        }
    }
}

export interface IWNRequestWeightModel {
    weight_index: number;
    weight_sacks_number: number;
    weight: number;
    tare: number;
    weight_tare_aditional: number;
}

export class WNRequestWeightModel implements IWNRequestWeightModel {
    public weight_index: number = null;
    public weight_sacks_number: number = null;
    public weight: number = null;
    public tare: number = null;
    public weight_tare_aditional: number = null;


    constructor(item?: IWNWeightModel) {
        if (item) {
            this.weight_index = item.index;
            this.weight_sacks_number = convertStringToNumber(item.sacksNumber?.toString());
            this.weight = convertStringToNumber(item.grossWeight?.toString());
            this.tare = convertStringToNumber(item.tare?.toString());
            this.weight_tare_aditional = convertStringToNumber(item.tareAditional?.toString());
        }
        else {
            Object.assign(this, {});
        }
    }
}

export interface IWNRequestPenaltyModel {
    id: string;
    value: string;
    penalty_index: number;
}

export class WNRequestPenaltyModel implements IWNRequestPenaltyModel {
    public id: string = null;
    public value: string = null;
    public penalty_index: number;

    constructor(item?: IWNPenaltyModel) {
        if (item) {
            this.id = item.characteristic.deduction.id;
            this.value = String(item.value).replace(' %', '');
            this.penalty_index = item.index;
        }
        else {
            Object.assign(this, {});
        }
    }
}

export interface IWNRequestWeightNoteModel {
    start_date: string;
    weight_note_id: string;
    transaction_in_id: number;
    commodity: number;
    commodity_transformation_id: string;
    transformation_type_id: string;
    production_tank_id: string;
    driver_id: string;
    truck_id: string;
    delivered_by: number;
    farm: number;
    block: string;
    weight_note_certifications: Array<IWNRequestCertificationModel>;
    weights: Array<IWNRequestWeightModel>;
    weight_notes_panalties: Array<IWNRequestPenaltyModel>;
    note: string;
    weight: number;
    tare: number;
    penalties: number;
    addition: number;
    net: number;
    netdrywt: number;
    status: number;
    comment?: string;
    tare_aditional: number;
}

export class WNRequestWeightNoteModel implements IWNRequestWeightNoteModel {
    public start_date: string = null;
    public weight_note_id: string = null;
    public transaction_in_id: number = null;
    public commodity: number = null;
    public commodity_transformation_id: string = null;
    public transformation_type_id: string = null;
    public production_tank_id: string = null;
    public driver_id: string = null;
    public truck_id: string = null;
    public delivered_by: number = 0;
    public farm: number = null;
    public block: string = null;
    public weight_note_certifications: Array<IWNRequestCertificationModel> = [];
    public weights: Array<IWNRequestWeightModel> = [];
    public weight_notes_panalties: Array<IWNRequestPenaltyModel> = [];
    public note: string = '';
    public weight: number = null;
    public tare: number = null;
    public penalties: number = null;
    public addition: number = null;
    public net: number = null;
    public netdrywt: number = null;
    public status: number = CONSTANTS.WEIGHT_NOTE_STATUS.OPEN;
    public comment?: string;
    public tare_aditional: number;

    constructor(item?: IWNDescriptionModel) {
        if (item) {
            let tmpIndex: number = 0;
            let selectedDate: moment.Moment = item.date;
            if (selectedDate) {
                let timeObject: any = moment(selectedDate).isSame(item.localDateCapture, 'day') ?
                    { hour: item.localDateCapture.hours(), minute: item.localDateCapture.minutes(), second: item.localDateCapture.seconds() } :
                    { hour: 0, minute: 0, second: 0 };
                selectedDate = moment(selectedDate).set(timeObject);
            }
            this.start_date = selectedDate ? selectedDate.utc().format('YYYY-MM-DD HH:mm:ss') : this.start_date;
            this.weight_note_id = item.weightNoteId;
            this.transaction_in_id = item.transactionInId;
            this.commodity = item.commodity?.id;
            this.commodity_transformation_id = null == item.commodityType ? '' : item.commodityType.id;
            this.transformation_type_id = null == item.commodityTransformation ? '' : item.commodityTransformation.id;
            this.production_tank_id = item.container?.id;
            this.driver_id = item.driver?.id;
            this.truck_id = item.truck?.id;
            this.delivered_by = item.deliveredByProducer ? 1 : 0;
            if (null != item.farm) {
                this.farm = item.farm.id;
            }
            if (null != item.block) {
                this.block = item.block.id;
            }
            this.weight_note_certifications = item.certifications.map((c: IWNCertificationModel) => new WNRequestCertificationModel(c.id));
            item.weights.forEach((w: IWNWeightModel) => {
                let weightObject: IWNRequestWeightModel = new WNRequestWeightModel(w);
                weightObject.weight_index = tmpIndex;
                tmpIndex++;
                this.weights.push(weightObject);
            });
            tmpIndex = 0;
            item.penalties.forEach((p: IWNPenaltyModel) => {
                if (null != p.characteristic) {
                    p.index = tmpIndex;
                    this.weight_notes_panalties.push(new WNRequestPenaltyModel(p));
                    tmpIndex++;
                }
            });
            this.note = trimSpaces(item.textNote);
            this.weight = item.totalGross;
            this.tare = item.totalTare;
            this.penalties = item.totalDiscount;
            this.addition = item.totalAddition;
            this.net = item.totalNet;
            this.netdrywt = item.totalNetDryWt;
            this.status = item.status;
            this.comment = item.comment;
            this.tare_aditional = item.totalTareAditional;
        }
        else {
            Object.assign(this, {});
        }
    }
}

export interface IWNRequestActionReceivingNoteModel {
    id: string;
    start_date: string;
    seller: number;
    season_id: number;
    orgticket: string;
    contractid: string;
    weight_notes: Array<IWNRequestWeightNoteModel>;
    is_close: number;
}

export class WNRequestActionReceivingNoteModel implements IWNRequestActionReceivingNoteModel {
    public id: string = null;
    public start_date: string = null;
    public seller: number = null;
    public season_id: number = null;
    public orgticket: string = '';
    public contractid: string = '';
    public weight_notes: Array<IWNRequestWeightNoteModel> = [];
    public is_close: number = CONSTANTS.RECEIVING_NOTE_STATUS.OPEN;

    constructor(item?: IReceivingNoteModel) {
        if (item) {
            this.id = item.information.id;
            this.start_date = item.information.date ? moment(item.information.date, 'YYYY-MM-DD HH:mm:ss').utc().format('YYYY-MM-DD HH:mm:ss') : this.start_date;
            this.seller = item.information.producer?.id;
            this.season_id = item.information.season.id;
            this.orgticket = item.information.fieldTicket;
            this.contractid = item.information.contractId;
            item.description.forEach((d: IWNDescriptionModel) => {
                this.weight_notes.push(new WNRequestWeightNoteModel(d));
            });
            this.is_close = item.information.status;
        }
        else {
            Object.assign(this, {});
        }
    }
}
