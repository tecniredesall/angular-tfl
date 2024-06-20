export interface ILotDelete {
  id: string;
  name: string;
}

export class LotDelete implements ILotDelete {
  public id: string = null;
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