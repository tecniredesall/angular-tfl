export interface ILotWarehouseModel {
  id: string;
  name: string;
}

export class LotWarehouseModel implements ILotWarehouseModel {
  public id: string = null;
  public name: string = '';

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = isAPIData ? (item.production_tank_id ?? this.id) : (item.id ?? this.id);
      this.name = item.name ?? this.name;
    }
    else {
      Object.assign(this, {});
    }
  }
}
