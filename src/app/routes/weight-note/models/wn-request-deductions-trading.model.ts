import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { IWNPenaltyModel } from "./wn-penalty.model";

export interface IWNDeductionsTradingModel {
  timestamp: number;
  weight: number;
  deductions: Array<{ id: string, value: string }>;
}

export class WNDeductionsTradingModel implements IWNDeductionsTradingModel {
  public timestamp: number = 0;
  public weight: number = null;
  public deductions: Array<{ id: string, value: string }> = [];

  constructor(data?: { weight: number, penalties: Array<IWNPenaltyModel>}) {
    if (data) {
      this.timestamp = Date.now();
      this.weight = data.weight ?? this.weight;
      data.penalties.forEach((p: IWNPenaltyModel) => {
        this.deductions.push({
          id: p.characteristic.deduction.id,
          value: CONSTANTS.DEDUCTION_TYPE.TABLE == p.characteristic?.deduction?.type || CONSTANTS.DEDUCTION_TYPE.INPUT == p.characteristic?.deduction?.type ? convertStringToNumber(p.value).toString() : p.value
        })
      });
    }
    else {
      Object.assign(this, {});
    }
  }
}