import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { IWNPenaltyModel } from './wn-penalty.model';

export interface IWNPenaltyValidatorModel {
  deductionId: string;
  value: string;
  sign: string;
  total: number;
}

export class WNPenaltyValidatorModel implements IWNPenaltyValidatorModel {
  public deductionId: string = null;
  public sign: string = null;
  public value: string = null;
  public total: number = null;

  constructor(item?: IWNPenaltyModel) {
    if (item) {
      this.deductionId = item.characteristic && item.characteristic.deduction ? item.characteristic.deduction.id : this.deductionId;
      this.value = item.value ?? this.value;
      this.sign = item.sign ?? this.sign;
      this.total = convertStringToNumber((item.total ?? this.total) as any, true);
    }
    else {
      Object.assign(this, {});
    }
  }
}