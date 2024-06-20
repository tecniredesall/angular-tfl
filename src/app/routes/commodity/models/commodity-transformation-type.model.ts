export interface ICommodityTransformationTypeModel {
  id: string;
  name: string;
}

export class CommodityTransformationTypeModel implements ICommodityTransformationTypeModel {
  public id: string = null;
  public name: string = '';

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      if (isAPIData) {
        this.id = item.transformation_type_id ?? this.id;  
      } 
      else {
        this.id = item.id ?? this.id;
      }
      this.name = item.name ?? this.name;
    }
    else {
      Object.assign(this, {});
    }
  }
}