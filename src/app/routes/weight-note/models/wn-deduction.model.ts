import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { IWNOptionChoiceDeductionModel } from "./wn-option-choice-deduction.model";

export interface IWNDeductionAllowedActionsModel {

}

export interface IWNDeductionModel {
  id: string;
  name: string;
  type: string;
  min: number;
  max: number;
  options: Array<IWNOptionChoiceDeductionModel>;
  allowedActions: {[key: string]: string[]};
}

export class WNDeductionModel implements IWNDeductionModel {
  public id: string = null;
  public name: string = '';
  public type: string = null;
  public min: number = null;
  public max: number = null;
  public options: Array<IWNOptionChoiceDeductionModel> = [];
  public allowedActions: {[key: string]: string[]};

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = item.id ?? this.id;
      this.name = item.name ?? this.name;
      this.type = item.type ?? this.type;
      this.min = item.min ?? this.min;
      this.max = item.max ?? this.max;
      this.allowedActions = item.allowed_actions ?? item.allowedActions ?? this.allowedActions;
      if (CONSTANTS.DEDUCTION_TYPE.CHOICE == this.type) {
        if (isAPIData && item.rows) {
          item.rows.forEach((r: any) => {
            let weightCriteria: Array<any> = r.criteria.filter((c: any) => 'weight' == c.variable);
            this.options.push({
              name: r.choice_name,
              coefficient: 0 == weightCriteria.length ? null : weightCriteria[0].coefficient
            });
          });
        }
        else if (item.options) {
          this.options = [...item.options];
        }
      }
    }
    else {
      Object.assign(this, {});
    }
    this.options = sortByStringValue(this.options, "name");
  }
}