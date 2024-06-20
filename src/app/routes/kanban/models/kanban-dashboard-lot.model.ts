import * as moment from 'moment';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';

import { ITRSealImage, TRSealImage } from '../../../shared/utils/models/seal-image.model';

export interface IKanbanDashboardLot {
  id: string;
  folio: string;
  index: number;
  name: string;
  date: moment.Moment;
  warehouse: string;
  weightQQ: number;
  currentWeight: string;
  currentWeightQQ: number;
  producers: Array<string>;
  seals: ITRSealImage[];
  isDamaged: boolean;
  hasClosedData: boolean;
}

export class KanbanDashboardLot implements IKanbanDashboardLot {
  public id: string = null;
  public folio: string = null;
  public index: number = null;
  public name: string = null;
  public date: moment.Moment = null;
  public warehouse: string = null;
  public weightQQ: number = null;
  public currentWeight: string = null;
  public currentWeightQQ: number = null;
  public producers: Array<string> = [];
  public seals: ITRSealImage[] = [];
  public isDamaged: boolean = false;
  public hasClosedData: boolean = false;

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = item.id ?? this.id;
      this.folio = item.folio ?? this.folio;
      this.index = convertStringToNumber(this.folio);
      this.name = `ID ${this.folio}`;
      this.date = isAPIData ? (item.date ? moment(item.date, 'YYYY-MM-DD HH:mm:ss') : this.date) : (item.date ? (item.date as moment.Moment).clone() : this.date);
      this.warehouse = item.warehouse ?? this.warehouse;
      this.weightQQ = isAPIData ? (item.net_weight_qq ?? this.weightQQ) : (item.weightQQ ?? this.weightQQ);
      this.currentWeight = isAPIData ? (item.current_weight ?? this.currentWeight) : (item.currentWeight ?? this.currentWeight);
      this.currentWeightQQ = isAPIData ? (item.current_weight_qq ?? item.net_weight_qq ?? this.currentWeightQQ) : (item.currentWeightQQ ?? this.currentWeightQQ);
      this.producers = isAPIData ? (item.producers ?? this.producers) : (item.producers ?? this.producers);
      this.seals = isAPIData ?
        (
          item.seals ?
            item.seals.map((c: any) => new TRSealImage({
              id: c.certification_id,
              name: c.name,
              image: c.photo
            })) :
            this.seals
        ) :
        (item.seals ? [...item.seals] : this.seals);
      this.isDamaged = !!(isAPIData ? (item.hasOwnProperty('is_damaged') ? item.is_damaged : this.isDamaged) : (item.hasOwnProperty('isDamaged') ? item.isDamaged : this.isDamaged));
      this.hasClosedData = isAPIData ? ( item.dates ?? this.hasClosedData) : (item.hasClosedData ?? this.hasClosedData);
    }
    else {
      Object.assign(this, {});
    }
  }
}