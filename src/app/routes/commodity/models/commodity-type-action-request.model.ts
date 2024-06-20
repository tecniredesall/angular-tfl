import { ICommodityTypeModel } from "../models/commodity-type.model";
export interface ICommodityTypeActionRequestModel {
  commodity_transformation_id: string;
  commodity_id: number;
  name: string;
  transformation_type_id: string;
}

export class CommodityTypeActionRequestModel implements ICommodityTypeActionRequestModel {
  public commodity_transformation_id: string = null;
  public commodity_id: number = null;
  public name: string = '';
  public transformation_type_id: string = null;

  constructor(item: ICommodityTypeModel) {
    if (item) {
      this.commodity_transformation_id = item.id ?? this.commodity_transformation_id;
      this.commodity_id = item.commodityId ?? this.commodity_id;
      this.name = item.name ?? this.name;
      this.transformation_type_id = item.transformationType ? item.transformationType.id : this.transformation_type_id;
    }
    else {
      Object.assign(this, {});
    }
  }
}
