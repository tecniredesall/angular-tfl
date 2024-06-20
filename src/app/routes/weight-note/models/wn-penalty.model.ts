import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { IWNCharacteristicModel, WNCharacteristicModel } from './wn-characteristic.model';
import { WNDeductionModel } from './wn-deduction.model';
import { IWNOptionChoiceDeductionModel, WNOptionChoiceDeductionModel } from './wn-option-choice-deduction.model';

export interface IWNPenaltyModel {
  characteristic: IWNCharacteristicModel;
  choiceDeduction: IWNOptionChoiceDeductionModel;
  sign: string;
  value: string;
  total: number;
  characteristicsEnabled: Array<IWNCharacteristicModel>;
  index: number;
  totalQQ: number;
}

export class WNPenaltyModel implements IWNPenaltyModel {
  public characteristic: IWNCharacteristicModel = null;
  public choiceDeduction: IWNOptionChoiceDeductionModel = null;
  public sign: string = null;
  public value: string = null;
  public total: number = null;
  public characteristicsEnabled: Array<IWNCharacteristicModel> = [];
  public index: number = 0;
  public totalQQ: number = null;

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      if (isAPIData) {
        this.index = item.penalty_index;
        this.characteristic = new WNCharacteristicModel({
          deduction: new WNDeductionModel({
            id: item.commodity_feature_id,
            name: item.name,
            type: item.type,
          }, isAPIData),
          id: item.id,
          name: item.name,

        });
        if (CONSTANTS.DEDUCTION_TYPE.CHOICE == this.characteristic.deduction.type) {
          this.choiceDeduction = new WNOptionChoiceDeductionModel({
            name: item.value,
            coefficient: item.coefficient
          });
        }
      }
      else {
        this.index = item.index;
        this.characteristic = item.characteristic ? new WNCharacteristicModel(item.characteristic) : this.characteristic;
        this.choiceDeduction = item.choiceDeduction ? new WNOptionChoiceDeductionModel(item.choiceDeduction) : this.choiceDeduction;
        if (item.characteristicsEnabled) {
          for (let c = 0; c < item.characteristicsEnabled.length; c++) {
            this.characteristicsEnabled[c] = new WNCharacteristicModel(item.characteristicsEnabled[c]);
          }
        }
      }
      this.sign = item.sign ?? this.sign;
      this.value = item.value ?? this.value;
      this.total = convertStringToNumber(item.total ?? this.total, true);
    }
    else {
      Object.assign(this, {});
    }
  }
}
