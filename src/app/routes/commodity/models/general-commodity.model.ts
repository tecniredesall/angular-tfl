export interface IGeneralCommodityModel {
  id: string;
  name: string;
}

export class GeneralCommodityModel implements IGeneralCommodityModel {
  public id: string = null;
  public name: string = '';

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = isAPIData ? item.commodity_general_id : item.id ?? this.id;
      this.name = item.name ?? this.name;
    }
    else {
      Object.assign(this, {});
    }
  }
}
