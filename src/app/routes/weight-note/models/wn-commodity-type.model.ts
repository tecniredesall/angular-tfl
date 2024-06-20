export interface IWNCommodityTypeModel {
  id: string;
  name: string;
  transformationTypeId: string;
  transformationTypeName: string;
}

export class WNCommodityTypeModel implements IWNCommodityTypeModel {
  public id: string = null;
  public name: string = '';
  public transformationTypeId: string = null;
  public transformationTypeName: string = '';

  constructor(item?: any) {
    if (item) {
      this.id = item.cmdty_transformation_id ?? item.id ?? this.id;
      this.name = item.name ?? this.name;
      this.transformationTypeId = item.transformation_type_id ?? item.transformationTypeId ?? this.transformationTypeId;
      this.transformationTypeName = item.transformation_type ?? item.transformationTypeName ?? this.transformationTypeName;
    }
    else {
      Object.assign(this, {});
    }
  }
}
