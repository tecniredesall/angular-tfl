export interface IWNOptionChoiceDeductionModel {
  name: string;
  coefficient: number;
}

export class WNOptionChoiceDeductionModel implements IWNOptionChoiceDeductionModel{
  public name: string = '';
  public coefficient: number = null;

  constructor(item?: any) {
    if (item) {
      this.name = item.name ?? this.name;
      this.coefficient = item.coefficient ?? this.coefficient;
    }
    else {
      Object.assign(this, {});
    }
  }
}