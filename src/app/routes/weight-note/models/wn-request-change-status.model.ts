import { IWNDescriptionModel } from "./wn-description.model";
import { IReceivingNoteModel } from "./receiving-note.model";

export interface IWNWeightNotesData {
  weight_note_id: string;
  status: number;
}

export class WNWeightNotesData implements IWNWeightNotesData {
  public weight_note_id: string = null;
  public status: number = null;

  constructor(item?: IWNDescriptionModel) {
    if (item) {
      this.weight_note_id = item.weightNoteId;
      this.status = item.status;
    }
    else {
      Object.assign(this, {});
    }
  }
}

export interface IWNRequestChangeStatusModel {
  reception_id: string;
  weight_notes: Array<IWNWeightNotesData>;
  status: number;
}

export class WNRequestChangeStatusModel implements IWNRequestChangeStatusModel {
  public reception_id: string = null;
  public weight_notes: Array<IWNWeightNotesData> = [];
  public status: number = null;

  constructor(item?: IReceivingNoteModel) {
    if (item) {
      this.reception_id = item.information.id;
      this.status = item.information.status;
      item.description.forEach((d: IWNDescriptionModel) => {
        this.weight_notes.push(new WNWeightNotesData(d));
      });
    }
    else {
      Object.assign(this, {});
    }
  }
}