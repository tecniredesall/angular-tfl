import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { IWNWeightModel } from "./wn-weight.model";

export interface IWNWeightValidatorModel {
  sacksNumber: number;
  grossWeight: number;
  tare: number;
  index: number;
}

export class WNWeightValidatorModel implements IWNWeightValidatorModel {
  public sacksNumber: number = null;
  public grossWeight: number = null;
  public tare: number = null;
  public tareAditional: number = null;
  public index: number = 0;

  constructor(item?: IWNWeightModel) {
    if (item) {
      this.sacksNumber = convertStringToNumber((item.sacksNumber ?? this.sacksNumber) as any, true);
      this.grossWeight = convertStringToNumber((item.grossWeight ?? this.grossWeight) as any, true);
      this.tare = convertStringToNumber((item.tare ?? this.tare) as any, true);
      this.tareAditional = convertStringToNumber((item.tareAditional ?? this.tareAditional) as any, true);
      this.index = item.index ?? this.index;
    }
    else {
      Object.assign(this, {});
    }
  }
}