export interface IWNTruckModel {
  id: string;
  name: string;
  plate: string;
}

export class WNTruckModel implements IWNTruckModel {
  public id: string = null;
  public name: string = '';
  public plate: string = '';

  constructor(item?: any) {
    if (item) {
      this.id = item.id ?? item.truck_id ?? this.id;
      this.name = item.name ?? item.first_name ?? this.name;
      this.plate = item.plate ?? item.license ?? this.plate;
    }
    else {
      Object.assign(this, {});
    }
  }
}
