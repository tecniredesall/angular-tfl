import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { IWeightNoteModel } from './../models/reception-note-purchase-order.model'

export class PurchaseOrderSettledRequestModel {
    public weight_notes: WeightNotesSettleModel[] = [];
    constructor(notes: IWeightNoteModel[]) {
        if (notes.length > 0) {
            notes.forEach(current => {
                this.weight_notes.push(
                    {
                        price: current.price,
                        weight: current.netDryWeight,
                        weight_note_id: current.id
                    }
                );
            });
        }
    }
}

export class WeightNotesSettleModel {
    weight_note_id: string;
    weight: number;
    price: number;
}
