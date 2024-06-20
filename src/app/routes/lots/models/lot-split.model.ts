import { CONSTANTS } from "src/app/shared/utils/constants/constants";
import { convertQQtoLb } from "src/app/shared/utils/functions/convert-qq-to-lb";
import { convertStringToNumber } from "src/app/shared/utils/functions/string-to-number";
import { ILotListWeightNoteGrouper } from "./lot-list-weight-note-grouper.model";
import { NotesModel } from "./lot-request-ation-create.model";

export class LotSplitModel {
    lotId: string;
    percentage: number;
    weight: number | string;
}
export class SplitLotRequestCreate {
    lots: ILotRequest[];
    constructor(original: ILotListWeightNoteGrouper, splitLots: LotSplitModel[]) {
        //set original first
        this.lots = [];
        const originalForSave: ILotRequest = new LotRequest(original, null);
        this.lots.push(originalForSave);
        splitLots.forEach(
            lot => {
                if (convertStringToNumber(String(lot.weight).replace(/q/g, "")) > 0) {
                    this.lots.push(
                        new LotRequest(original, lot)
                    );
                }
            }
        );
    }
}
export interface ILotRequest {
    lot_id: string;
    notes: NotesModel[];
    workflow_id: string;
    commodity_transformation_id;
    weight: number | string;
    current_process_id: string;
    production_tanks: ProductionTanks[];
    create: boolean;
}
export class LotRequest implements ILotRequest {
    public lot_id: string = null;
    public notes: NotesModel[] = [];
    public workflow_id: string;
    public commodity_transformation_id: any;
    public weight: number | string;
    public current_process_id: string;
    public production_tanks: ProductionTanks[] = [];
    public create: boolean = false;

    constructor(original: ILotListWeightNoteGrouper, splitLot: LotSplitModel) {
        this.lot_id = splitLot ? null : original.id;
        original.weightNotes.forEach(
            note => {
                this.notes.push({
                    id: note.id
                })
            }
        );
        this.workflow_id = original.workflowId;
        this.commodity_transformation_id = original.transformationTypeId;
        this.weight = splitLot ? convertStringToNumber(String(splitLot.weight).replace(/q/g, "")) : original.currentWeightQQ ?? original.weightQQ;
        this.weight = convertQQtoLb(this.weight);
        this.current_process_id = original.processId === CONSTANTS.LOT_PENDING_PROCESS ? null : original.processId;

        original.productionTanks.forEach(item => {
            this.production_tanks.push(
                {
                    production_tank_id: item.id
                }
            );
        });
    }
}

export class ProductionTanks {
    production_tank_id: string;
}


