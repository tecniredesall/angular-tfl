import { IWNGeneralInformationModel, WNGeneralInformationModel } from './wn-general-information-model.model';
import { IWNDescriptionModel, WNDescriptionModel } from "./wn-description.model";
import { sortBykey } from 'src/app/shared/utils/functions/sortFunction';
import { IWNConfigurationModel } from './wn-configuration.model';

export interface IReceivingNoteModel {
  information: IWNGeneralInformationModel;
  description: Array<IWNDescriptionModel>;
}

export class ReceivingNoteModel implements IReceivingNoteModel {
  public information: IWNGeneralInformationModel = new WNGeneralInformationModel();
  public description: Array<IWNDescriptionModel> = [];
  readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;

  constructor(item?: any, isAPIData: boolean = false, config?: IWNConfigurationModel) {
    if (item) {
      let weightNotesData: Array<any> = isAPIData ? (item.weight_notes ?? this.description) : (item.description ?? this.description);
      this.information = isAPIData ? new WNGeneralInformationModel(item, isAPIData) : item.information ? new WNGeneralInformationModel(item.information) : this.information;
      weightNotesData.forEach((w: any) => {
        let newItem: IWNDescriptionModel = new WNDescriptionModel(w, isAPIData, this.DECIMAL_DIGITS, config);
        this.description.push(newItem);
      });
    }
    else {
      Object.assign(this, {});
    }
    if (0 == this.description.length) {
      this.description.push(new WNDescriptionModel());
    }
    this.description = sortBykey(this.description, 'indexSort');
    this.description.forEach((d: IWNDescriptionModel) => {
      d.weights = sortBykey(d.weights, 'index');
      d.penalties = sortBykey(d.penalties, 'index');
    });
  }
}
