import { TIProducerModel, TProducerModel } from 'src/app/shared/models/sil-producer';

import { ActionsProducerTypeEnum } from './actions-producer-type.enum';

export interface IInputDataActionsProducerModel {
  actionType: ActionsProducerTypeEnum;
  producer: TIProducerModel;
  index: number;
}

export class InputDataActionsProducerModel implements IInputDataActionsProducerModel {

  public actionType: ActionsProducerTypeEnum = null;
  public producer: TIProducerModel = new TProducerModel();
  public index: number = 0;

  constructor(item: Partial<InputDataActionsProducerModel> = {}) {

    Object.assign(this, item);

    this.producer = new TProducerModel(this.producer);

  }

}
