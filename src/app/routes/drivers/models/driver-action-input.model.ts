import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ITDriverModel, TDriverModel } from "./driver.model";

export interface ITDriverActionInputModel {
  action: number;
  driver: ITDriverModel;
  isFromExternalModule: boolean;
}

export class TDriverActionInputModel implements ITDriverActionInputModel {

  public action: number = CONSTANTS.ACTIONS_MODE.NEW;
  public driver: ITDriverModel = new TDriverModel();
  public isFromExternalModule: boolean = false;

  constructor(item: Partial<ITDriverActionInputModel> = {}) {

    Object.assign(this, item);

    this.driver = new TDriverModel(item.driver);

  }

}