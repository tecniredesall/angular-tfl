import { IWNGeneralInformationValidatorModel, WNGeneralInformationValidatorModel } from './wn-general-information-validator.model';
import { IWNDescriptionValidatorModel, WNDescriptionValidatorModel } from './wn-description-validator.model';
import { IReceivingNoteModel } from "./receiving-note.model";
import { sortBykey } from "../../../shared/utils/functions/sortFunction";
import { IWNDescriptionModel } from './wn-description.model';

export interface IReceivingNoteValidatorModel {
  information: IWNGeneralInformationValidatorModel;
  description: Array<IWNDescriptionValidatorModel>;
}

export class ReceivingNoteValidatorModel implements IReceivingNoteValidatorModel {
  public information: IWNGeneralInformationValidatorModel = new WNGeneralInformationValidatorModel();
  public description: Array<IWNDescriptionValidatorModel> = [];

  constructor(item?: IReceivingNoteModel) {
    if (item) {
      this.information = item.information ? new WNGeneralInformationValidatorModel(item.information) : this.information;
      item.description.forEach((d: IWNDescriptionModel) => {
        this.description.push(new WNDescriptionValidatorModel(d));
      });
    }
    else {
      Object.assign(this, {});
    }
    this.description = sortBykey(this.description, 'indexSort');
  }
}
