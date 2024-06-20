import { ICommodityModel } from "../models/commodity.model";
import { IVarietyCommodityModel } from "../models/variety-commodity.model";

export interface IVarietyCommodityActionRequestModel {
  variety_id: string;
  name: string;
}

export class VarietyCommodityActionRequestModel implements IVarietyCommodityActionRequestModel {
  public variety_id: string = null;
  public name: string = '';

  constructor(item: IVarietyCommodityModel) {
    if (item) {
      this.variety_id = item.id ?? this.variety_id;
      this.name = item.name ?? this.name;
    }
    else {
      Object.assign(this, {});
    }
  }
}


export interface ICommodityActionRequestModel {
  id: number;
  commodity_general_id: string;
  name: string;
  variety: Array<IVarietyCommodityActionRequestModel>;
  measure_unit_in_id : string
 measure_unit_out_id : string;
}

export class CommodityActionRequestModel implements ICommodityActionRequestModel {
  public id: number = null;
  public commodity_general_id: string = null;
  public name: string = '';
  public variety: Array<IVarietyCommodityActionRequestModel> = [];
  public measure_unit_in_id : string = '';
  public measure_unit_out_id : string = '';
  constructor(item: ICommodityModel) {
    if (item) {
      this.id = item.id ?? this.id;
      this.commodity_general_id = item.generalCommodity ? item.generalCommodity.id : this.commodity_general_id;
      this.name = item.name ?? this.name;
      this.measure_unit_out_id  = item.measureUnitOutId ?? this.measure_unit_out_id
      this.measure_unit_in_id = item.measureUnitInId ?? this.measure_unit_in_id
    }
    else {
      Object.assign(this, {});
    }
  }
}
