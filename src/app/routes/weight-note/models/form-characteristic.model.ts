import { IWNCharacteristicModel, WNCharacteristicModel } from "./wn-characteristic.model";

export interface IFormCharacteristicModel {
  characteristic: IWNCharacteristicModel;
  id: string;
  name: string;
  slug: string;
  type: string;
  choices: string[];
  selectedChoice: string;
  isLoadingCharacteristicChoices: boolean;
  operationType: number;
  value: number;
  maxValue: number;
}

export class FormCharacteristicModel implements IFormCharacteristicModel {
  public characteristic: IWNCharacteristicModel = new WNCharacteristicModel();
  public id: string = '';
  public name: string = '';
  public slug: string = '';
  public type: string = '';
  public choices: string[] = [];
  public selectedChoice: string = '';
  public isLoadingCharacteristicChoices: boolean = false;
  public operationType: number = 0;
  public value: number = null;
  public maxValue: number = null;

  constructor(item?: any) {
    if (item) {
      this.characteristic = item.characteristic ?? this.characteristic;
      this.id = item.id ?? this.id;
      this.name = item.name ?? this.name;
      this.slug = item.slug ?? this.slug;
      this.type = item.type ?? this.type;
      this.choices = item.choices ?? this.choices;
      this.selectedChoice = item.selectedChoice ?? this.selectedChoice;
      this.isLoadingCharacteristicChoices = item.isLoadingCharacteristicChoices ?? this.isLoadingCharacteristicChoices;
      this.operationType = item.selectedChoice ?? this.selectedChoice;
      this.value = item.selectedChoice ?? this.selectedChoice;
      this.maxValue = item.selectedChoice ?? this.selectedChoice;
    }
    else {
      Object.assign(this, {});
    }
  }
}