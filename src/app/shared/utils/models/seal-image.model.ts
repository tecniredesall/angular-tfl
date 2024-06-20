export interface ITRSealImage {
  id: string;
  name: string;
  image: any;
}

export class TRSealImage implements ITRSealImage {
  public id: string = null;
  public name: string = null;
  public image: any = null;

  constructor(item: any) {
    if (item) {
      this.id = item.certification_id ?? item.id ?? this.id;
      this.name = item.name ??  this.name;
      this.image = item.photo ??  item.image ?? this.image;
    }
    else {
      Object.assign(this, {});
    }
  }
}
