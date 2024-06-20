export interface IWNCertificationModel {
  id: string;
  image: any;
}

export class WNCertificationModel implements IWNCertificationModel {
  public id: string = null;
  public image: any = null;

  constructor(item?: any) {
    if (item) {
      this.id = item.certification_id ?? (item.id ?? this.id);
      this.image = item.image ?? this.image;
    }
    else {
      Object.assign(this, {});
    }
  }
}