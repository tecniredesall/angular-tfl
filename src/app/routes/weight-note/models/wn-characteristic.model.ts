import { IWNDeductionModel, WNDeductionModel } from "./wn-deduction.model";

export interface IWNCharacteristicModel {
  id: string;
  name: string;
  slug: string;
  mandatory: boolean;
  defaultValue: any;
  deduction: IWNDeductionModel;
  disabled: boolean;
  isFilterable: boolean;
}

export class WNCharacteristicModel implements IWNCharacteristicModel {
  public id: string = null;
  public name: string = '';
  public slug: string = '';
  public mandatory: boolean = false;
  public defaultValue: any = null;
  public deduction: IWNDeductionModel = null;
  public disabled: boolean = false;
  public isFilterable: boolean = false;

  constructor(item?: any, isAPIData: boolean = false) {    
    if (item) {
      this.id = item.id ?? this.id;
      this.name = item.name ?? this.name;
      this.slug = item.slug ?? this.slug;
      this.mandatory = (1 == item.mandatory);
      this.defaultValue = isAPIData ? (item.default_value ?? this.defaultValue) : (item.defaultValue ?? this.defaultValue);
      this.deduction = item.deduction ? new WNDeductionModel(item.deduction, isAPIData) : this.deduction;
      this.disabled = isAPIData ? this.disabled : item.disabled;
      this.isFilterable = isAPIData ? item.is_filterable ?? item.isFilterable : this.isFilterable;
    }
    else {
      Object.assign(this, {});
    }
  }
}