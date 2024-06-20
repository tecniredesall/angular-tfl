import { ISealFarm, SealFarm } from './seal-farm.model';

export interface ISealSeller {
  id: number;
  name: string;
  farms: Array<ISealFarm>;
  isShowing: boolean;
  isDisabled: boolean;
  numberSelectedFarms: number;
}

export class SealSeller implements ISealSeller{
  
  public id: number = null;
  public name: string = '';
  public farms: Array<SealFarm> = [];
  public isShowing: boolean = false;
  public isDisabled: boolean = false;
  public numberSelectedFarms: number = 0;

  constructor(control: Partial<SealSeller> = {}) {
   
    Object.assign(this, control);

    for (let f = 0; f < this.farms.length; f++) {
      
      this.farms[f] = new SealFarm(this.farms[f]);
      
    }

  }

}