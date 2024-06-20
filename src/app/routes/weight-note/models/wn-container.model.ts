export interface IWNContainerModel {
  id: string;
  name: string;
  tankId: number;
  tankName: string;
}

export class WNContainerModel implements IWNContainerModel {
  public id: string = null;
  public name: string = '';
  public tankId: number = null;
  public tankName: string = '';

  constructor(item?: any) {
    if (item) {
      this.id = item.production_tank_id ?? item.id ?? this.id;
      this.name = item.name ?? this.name;
      this.tankId = item.tank_id ?? item.tankId ?? this.tankId;
      this.tankName = item.tank_name ?? item.tankName ?? this.tankName;
    }
    else {
      Object.assign(this, {});
    }
  }
}
