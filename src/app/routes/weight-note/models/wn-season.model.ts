import * as moment from "moment";

export interface IWNSeasonModel {
  id: number;
  name: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
}

export class WNSeasonModel implements IWNSeasonModel {
  public id: number = null;
  public name: string = '';
  public startDate: moment.Moment = null;
  public endDate: moment.Moment = null;

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = isAPIData ? (item.season_id ?? this.id) : (item.id ?? this.id);
      this.name = isAPIData ? (item.season ?? this.name) : (item.name ?? this.name);
      this.startDate = isAPIData ?
        (item.start_date ? moment(`${item.start_date} 00:00:00`, 'YYYY-MM-DD HH:mm:ss') : this.startDate) :
        (item.startDate ? moment(item.startDate) : this.startDate);
      this.endDate = isAPIData ?
        (item.end_date ? moment(`${item.end_date} 23:59:59`, 'YYYY-MM-DD HH:mm:ss') : this.endDate) :
        (item.endDate ? moment(item.endDate) : this.endDate);
    }
    else {
      Object.assign(this, {});
    }
  }
}
