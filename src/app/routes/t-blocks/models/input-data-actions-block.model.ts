import { TBlockModel, TIBlockModel } from "./block.model";

export interface IInputDataActionsBlockModel {
  isFromBlockModule: boolean;
  isEdit: boolean;
  block: Array<TIBlockModel>;
  producerId: number;
}

export class InputDataActionsBlockModel implements IInputDataActionsBlockModel {

  public isFromBlockModule: boolean = true;
  public isEdit: boolean = false;
  public block: Array<TIBlockModel> = [];
  public producerId: number = null;

  constructor(item: Partial<IInputDataActionsBlockModel> = {}) {

    Object.assign(this, item);

    for (let b = 0; b < this.block.length; b++) {
      this.block[b] = new TBlockModel(this.block[b]);
    }

  }

}
