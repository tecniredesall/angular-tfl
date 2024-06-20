import { IWNGeneralInformationModel } from "./wn-general-information-model.model";
export interface IWNGeneralInformationValidatorModel {
  producerId: number;
  seasonId: number;
  fieldTicket: string;
  contractId: string;
}

export class WNGeneralInformationValidatorModel implements IWNGeneralInformationValidatorModel {
  public producerId: number = null;
  public seasonId: number = null;
  public fieldTicket: string = '';
  public contractId: string = '';

  constructor(item?: IWNGeneralInformationModel) {
    if (item) {
      this.producerId = item.producer ? item.producer.id : this.producerId;
      this.seasonId = item.season ? item.season.id : this.seasonId;
      this.fieldTicket = item.fieldTicket;
      this.contractId = item.contractId;
    }
    else {
      Object.assign(this, {});
    }
  }
}