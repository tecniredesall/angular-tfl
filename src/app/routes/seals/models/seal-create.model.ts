import { ISealImage, SealImage } from './seal-image.model';
import { ISealSeller, SealSeller } from "./seal-seller.model";

export interface ISealCreateModel {
  name: string;
  image: ISealImage;
  related_sellers: Array<ISealSeller>;
  number_related_farms: number;
  user_id: number;
  certification_id?: string;
}

export class SealCreateModel implements ISealCreateModel {
  public name: string = '';
  public image: SealImage = new SealImage();
  public related_sellers: Array<SealSeller> = [];
  public number_related_farms: number = 0;
  public user_id: number = null;
  public certification_id?: string = null;

  constructor(control: Partial<SealCreateModel> = {}) {
    Object.assign(this, control);
    this.image = new SealImage(this.image);
  }
}