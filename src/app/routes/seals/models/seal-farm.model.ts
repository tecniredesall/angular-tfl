export interface ISealFarm {
  id: number;
  name: string;
  isRemoving: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export class SealFarm implements ISealFarm{
  
  public id: number = null;
  public name: string = '';
  public isRemoving: boolean = false;
  public isSelected: boolean = false;
  public isDisabled: boolean = false;

  constructor(control: Partial<SealFarm> = {}) {
   
    Object.assign(this, control);

  }

}