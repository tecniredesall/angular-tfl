export interface IWNCommodityTransformationModel {
  id: string;
  name: string;
}

export class WNCommodityTransformationModel implements IWNCommodityTransformationModel {
  public id: string = null;
  public name: string = '';

  constructor(item?: any) {
    if (item) {
      this.id = item.id ?? item.transformation_type_id ?? this.id;
      this.name = item.name ?? this.name;
    }
    else {
      Object.assign(this, {});
    }
  }
}