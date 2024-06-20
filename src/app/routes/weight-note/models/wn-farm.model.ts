export interface IWNFarmModel {
  id: number;
  name: string;
  address?: string;
}

export class WNFarmModel implements IWNFarmModel {
  public id: number = null;
  public name: string = '';
  public address?: string = ''

  constructor(item?: any) {
    if (item) {
      this.id = item.id ?? this.id;
      this.name = item.name ?? this.name;
      this.address = item.address ?? this.address;
    }
    else {
      Object.assign(this, {});
    }
  }
}
