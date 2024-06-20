export interface ILotCommodityModel {
  id: number;
  name: string;
}

export class LotCommodityModel implements ILotCommodityModel {
  public id: number = null;
  public name: string = '';

  constructor(item?: any) {
    if (item) {
      this.id = item.id ?? this.id;
      this.name = item.name ?? this.name;
    }
    else {
      Object.assign(this, {});
    }
  }
}