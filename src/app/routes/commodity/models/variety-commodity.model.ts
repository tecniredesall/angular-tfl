export interface IVarietyCommodityModel {
  id: string;
  name: string;
}

export class VarietyCommodityModel implements IVarietyCommodityModel {
  public id: string = null;
  public name: string = '';

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = isAPIData ? item.variety_id : item.id ?? this.id;
      this.name = item.name ?? this.name;
    }
    else {
      Object.assign(this, {});
    }
  }
}
