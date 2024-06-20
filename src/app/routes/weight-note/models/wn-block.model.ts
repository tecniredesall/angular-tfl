export interface IWNBlockModel {
  id: string;
  name: string;
  farmId: number;
}

export class WNBlockModel implements IWNBlockModel{
  public id: string = null;
  public name: string = '';
  public farmId: number = null;

  constructor(item?: any) {
    if (item) {
      this.id = item.block_id ?? item.id ?? this.id;
      this.name = item.name ?? (item.block_name ?? this.name);
      this.farmId = item.farm_id ?? item.farmId ?? this.farmId;
    }
    else {
      Object.assign(this, {});
    }
  }
}