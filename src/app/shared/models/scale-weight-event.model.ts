export interface IScaleWeightEvent {
  eventType: string;
  data: IScaleWeightData | any;
}

export class ScaleWeightEvent implements IScaleWeightEvent {
  public eventType: string = null;
  public data: any = null;

  constructor(item?: any) {
    if (item) {
      this.eventType = item.eventType ?? this.eventType;
      this.data = item.data ?? this.data;
    }
    else {
      Object.assign(this, {});
    }
  }
}

export interface IScaleWeightData {
  date: string;
  ip_address: string;
  weights: any;
  unit: string;
}