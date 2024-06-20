import { ITRSealImage } from "./seal-image.model";

// Date range
export interface ITRFilterDate {
  start: Date;
  end: Date;
}

export class TRFilterDate implements ITRFilterDate {
  public start: Date = null;
  public end: Date = null;

  constructor(item?: ITRFilterDate) {
    if (item) {
      this.start = item.start ? new Date(item.start) : this.start;
      this.end = item.end ? new Date(item.end) : this.end;
    }
    else {
      Object.assign(this, {});
    }
  }
}

// Seals
export interface ITRFilterSeals {
  selected: Array<string>;
  lookups: Array<ITRSealImage>;
}

export class TRFilterSeals implements ITRFilterSeals {
  public selected: Array<string> = [];
  public lookups: Array<ITRSealImage> = [];

  constructor(item?: ITRFilterSeals) {
    if (item) {
      this.selected = item.selected ? [...item.selected] : this.selected;
      this.lookups = item.lookups ? [...item.lookups] : this.lookups;
    } 
    else {
      Object.assign(this, {});
    }
  }
}

// Status
export interface ITRFilterStatus {
  selected: number[];
  lookups: { [key: string]: number; };
}

export class TRFilterStatus implements ITRFilterStatus {
  public selected: number[] = [];
  public lookups: { [key: string]: number } = {};

  constructor(item?: ITRFilterStatus) {
    if (item) {
      this.selected = item.selected ? [...item.selected] : this.selected;
      if (item.lookups) {
        Object.assign(item.lookups, this.lookups);
      }
    }
    else {
      Object.assign(this, {});
    }
  }
}

// Filter object
export interface ITRFilter {
  date: ITRFilterDate;
  seals: ITRFilterSeals;
  status: ITRFilterStatus;
}

export class TRFilter implements ITRFilter {
  public date: ITRFilterDate = new TRFilterDate();
  public seals: ITRFilterSeals = new TRFilterSeals();
  public status: ITRFilterStatus = null;

  constructor(item?: ITRFilter) {
    if (item) {
      this.date = item.date ? new TRFilterDate(item.date) : this.date;
      this.seals = item.seals ? new TRFilterSeals(item.seals) : this.seals;
      this.status = item.status ? new TRFilterStatus(item.status) : this.status;
    }
    else {
      Object.assign(this, {});
    }
  }
}
