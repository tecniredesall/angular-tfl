export interface IScaleListenerEvent {
    code: string;
    weight?: number;
    unityMeasurement?: string;
  }

  export class ScaleListenerEvent implements IScaleListenerEvent {
    public code: string = null;
    public weight: number = 0;
    public unityMeasurement: string = '';

    constructor(item?: any) {
      if (item) {
        this.code = item.code ?? this.code;
        this.weight = item.weight ?? this.weight;
        this.unityMeasurement = item.unityMeasurement ?? this.unityMeasurement;
      }
      else {
        Object.assign(this, {});
      }
    }
  }
