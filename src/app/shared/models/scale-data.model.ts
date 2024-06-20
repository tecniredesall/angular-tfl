export interface IScaleData {
  action: number;
  weight: number;
  unityMeasurement: string;
}

export class ScaleData implements IScaleData {
  public action: number = null;
  public weight: number = 0;
  public unityMeasurement: string = 'lb';

  constructor(item?: any) {
    if (item) {
      this.action = item.action ?? this.action;
      this.weight = item.weight ?? this.weight;
      this.unityMeasurement = item.unityMeasurement ?? this.unityMeasurement;
    } 
    else {
      Object.assign(this, {});
    }
  }
}