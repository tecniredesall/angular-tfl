export interface ILotCommodityTypeModel {
  id: string;
  name: string;
  transformationTypeId: string;
}

export class LotCommodityTypeModel implements ILotCommodityTypeModel {
  public id: string = null;
  public name: string = '';
  public transformationTypeId: string = null;

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = isAPIData ? (item.cmdty_transformation_id ?? this.id) : (item.id ?? this.id);
      this.name = item.name ?? this.name;
      this.transformationTypeId = isAPIData ? (item.transformation_type_id ?? this.transformationTypeId) : (item.transformationTypeId ?? this.transformationTypeId);
    }
    else {
      Object.assign(this, {});
    }
  }
}
