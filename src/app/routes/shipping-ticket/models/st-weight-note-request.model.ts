import { ISTWeightRequestModel, STWeightRequestModel } from './st-weight-request.model';
import { ISTPenaltyRequestModel, STPenaltyRequestModel } from './st-penalty-request.model';
import { ISTWeightCaptureModel } from './st-weight-capture.model';

export interface ISTWeightNoteRequestModel {
    shipping_note_id: string;
    commodity_id: number;
    commodity_transformation_id: string;
    transformation_type_id: string;
    production_tank_id: string;
    weights: ISTWeightRequestModel[];
    penalties: ISTPenaltyRequestModel[];
    close: boolean;
    note_description: string
}

export class STWeightNoteRequestModel implements ISTWeightNoteRequestModel {
    public shipping_note_id: string = '';
    public commodity_id: number;
    public commodity_transformation_id: string = '';
    public transformation_type_id: string = '';
    public production_tank_id: string = '';
    public weights: ISTWeightRequestModel[];
    public penalties: ISTPenaltyRequestModel[];
    public close: boolean;
    public note_description: string = '';


    constructor(weightCapture: ISTWeightCaptureModel) {
        this.shipping_note_id = weightCapture.shippingNoteId;
        this.commodity_id = weightCapture.commodityId;
        this.commodity_transformation_id = weightCapture.commodityTypeId;
        this.transformation_type_id = weightCapture.commodityTransformationId;
        this.production_tank_id = weightCapture.warehouseId;
        this.weights = weightCapture.weights.map((w, i) => new STWeightRequestModel(w, i));
        let penalties = weightCapture.penalties.filter(penalty => penalty.value != null);
        this.penalties = penalties.map((p, i) => new STPenaltyRequestModel(p, i));
        this.close = weightCapture.close;
        this.note_description = weightCapture.noteDescription ?? this.note_description;
    }
}