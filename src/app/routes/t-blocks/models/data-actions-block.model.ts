import { TBlockModel, TIBlockModel } from "./block.model";

export interface IDataActionsBlockModel {
  originalBlock: TIBlockModel;
  currentBlock: TIBlockModel;
  index: number;
}

export class DataActionsBlockModel implements IDataActionsBlockModel {

  public originalBlock: TIBlockModel = new TBlockModel();
  public currentBlock: TIBlockModel = new TBlockModel();
  public index: number = 0;

  constructor(item: Partial<DataActionsBlockModel> = {}) {

    Object.assign(this, item);

    this.originalBlock = new TBlockModel(this.originalBlock);

    this.currentBlock = new TBlockModel(this.currentBlock);

  }

}