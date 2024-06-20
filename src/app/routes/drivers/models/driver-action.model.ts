import { ITDriverModel, TDriverModel } from "./driver.model";

export interface ITDriverActionModel {
  driver: ITDriverModel;
  index: number;
  hasDuplicateLicense: boolean;
}

export class TDriverActionModel implements ITDriverActionModel {

  public driver: ITDriverModel = new TDriverModel();
  public index: number = 0;
  public hasDuplicateLicense: boolean = false;

  constructor(item: Partial<ITDriverActionModel> = {}) {

    Object.assign(this, item);

    this.driver = new TDriverModel(this.driver);

  }

}