import { IWNWeightModel } from "./wn-weight.model";
import { IWNPenaltyModel } from "./wn-penalty.model";
import { IWNDescriptionModel } from "./wn-description.model";
import { IWNWeightValidatorModel, WNWeightValidatorModel } from "./wn-weight-validator.model";
import { IWNPenaltyValidatorModel, WNPenaltyValidatorModel } from "./wn-penalty-validator.model";
import { CONSTANTS } from "../../../shared/utils/constants/constants";
import * as moment from "moment";

export interface IWNDescriptionValidatorModel {
  weightNoteId: string;
  date: moment.Moment;
  commodityId: number;
  commodityTypeId: string;
  commodityTransformationId: string;
  containerId: string;
  driverId: string;
  truckId: string;
  deliveredByProducer: boolean;
  farmId: number;
  blockId: string;
  weights: Array<IWNWeightValidatorModel>;
  penalties: Array<IWNPenaltyValidatorModel>;
  textNote: string;
  status: number;
}

export class WNDescriptionValidatorModel implements IWNDescriptionValidatorModel {
  public weightNoteId: string = null;
  public date: moment.Moment = null;
  public status: number = CONSTANTS.WEIGHT_NOTE_STATUS.OPEN;
  public commodityId: number = null;
  public commodityTypeId: string = null;
  public commodityTransformationId: string = null;
  public containerId: string = null;
  public driverId: string = null;
  public truckId: string = null;
  public deliveredByProducer: boolean = false;
  public farmId: number = null;
  public blockId: string = null;
  public weights: Array<IWNWeightValidatorModel> = [];
  public penalties: Array<IWNPenaltyValidatorModel> = [];
  public textNote: string = '';

  constructor(item?: IWNDescriptionModel) {
    if (item) {
      this.weightNoteId = item.hasOwnProperty('weightNoteId') ? item.weightNoteId : this.weightNoteId;
      this.date = item.date ? moment(item.date) : this.date;
      this.status = item.status ?? this.status;
      this.commodityId = item.commodity ? item.commodity.id : this.commodityId;
      this.commodityTypeId = item.commodityType ? item.commodityType.id : this.commodityTypeId;
      this.commodityTransformationId = item.commodityTransformation ? item.commodityTransformation.id : this.commodityTransformationId;
      this.containerId = item.container ? item.container.id : this.containerId;
      this.driverId = item.driver ? item.driver.id : this.driverId;
      this.truckId = item.truck ? item.truck.id : this.truckId;
      this.deliveredByProducer = item.hasOwnProperty('deliveredByProducer') ? item.deliveredByProducer : this.deliveredByProducer;
      this.farmId = item.farm ? item.farm.id : this.farmId;
      this.blockId = item.block ? item.block.id : this.blockId;
      item.weights.forEach((w: IWNWeightModel) => {
        this.weights.push(new WNWeightValidatorModel(w));
      });
      item.penalties.forEach((p: IWNPenaltyModel) => {
        this.penalties.push(new WNPenaltyValidatorModel(p));
      });
      this.textNote = item.textNote ?? this.textNote;
    }
    else {
      Object.assign(this, {});
    }
    if (0 == this.weights.length) {
      this.weights.push(new WNWeightValidatorModel());
    }
    if (0 == this.penalties.length) {
      this.penalties.push(new WNPenaltyValidatorModel());
    }
  }
}