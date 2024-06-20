import { CommodityTransformationTypeModel, ICommodityTransformationTypeModel } from "./commodity-transformation-type.model";

export interface ICommodityTypeModel {
  id: string;
  name: string;
  transformationType: ICommodityTransformationTypeModel;
  transformationTypeNameCSV: string;
  commodityId: number;
  commodityName: string;
}

export class CommodityTypeModel implements ICommodityTypeModel {
  public id: string = null;
  public name: string = '';
  public transformationType: ICommodityTransformationTypeModel = null;
  public transformationTypeNameCSV: string = '';
  public commodityId: number = null;
  public commodityName: string = '';

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.name = item.name ?? this.name;
      if (isAPIData) {
        this.id = item.cmdty_transformation_id ?? this.id;
        if (item.transformation_type_id) {
          this.transformationType = new CommodityTransformationTypeModel({
            id: item.transformation_type_id,
            name: item.transformation_type
          });
        }
        this.commodityId = item.commodity_id ?? this.commodityId;
        this.commodityName = item.commodity
      }
      else {
        this.id = item.id ?? this.id;
        this.transformationType = item.transformationType ? new CommodityTransformationTypeModel(item.transformationType) : this.transformationType;
        this.transformationTypeNameCSV = item.transformationTypeNameCSV ?? this.transformationTypeNameCSV;
        this.commodityId = item.commodityId ?? this.commodityId;
        this.commodityName = item.commodityName ?? this.commodityName;
      }
    }
    else {
      Object.assign(this, {});
    }
  }
}
