import { TIProducerModel, TProducerModel } from 'src/app/shared/models/sil-producer';

export interface IOutputDataActionsProducerModel {
  producer: TIProducerModel;
  index: number;
  dataWasModified: boolean;
  isValid: boolean;
}

export class OutputDataActionsProducerModel implements IOutputDataActionsProducerModel {

  public producer: TIProducerModel = new TProducerModel();
  public index: number = 0;
  public dataWasModified: boolean = false;
  public isValid: boolean = false;

  constructor(item: Partial<OutputDataActionsProducerModel> = {}) {

    Object.assign(this, item);

    this.producer = new TProducerModel(this.producer);

  }

}