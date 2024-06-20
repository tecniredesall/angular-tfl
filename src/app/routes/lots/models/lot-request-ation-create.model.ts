import { ILotWarehouseModel } from './lot-warehouse.model';
import { IWeightModel } from './weigth-note.model.ts';
export interface ILotRequestAtionCreateModel {
    lot_id: string;
    notes: NotesModel[];
    workflow_id: string;
    commodity_transformation_id: string;
    weight: number;
    production_tanks: ProductionTanks[];
    create: boolean;
    current_process_id: string;
    decrease: boolean;
}

export class LotRequestAtionCreateModel implements ILotRequestAtionCreateModel {
    lot_id: string = null;
    notes: NotesModel[] = [];
    workflow_id: string = '';
    commodity_transformation_id: string = '';
    weight: number = 0;
    production_tanks: ProductionTanks[] = [];
    current_process_id: string = null;
    create: boolean = false;
    decrease: boolean = false;


    /**
     * CTR for create model
     * @param warehouseId
     * @param weightNotes
     * @param processId
     * @param productionFlowId
     * @param commodityTransformationId
     */
    constructor(weightNotes: IWeightModel[],
        productionFlowId: string,
        commodityTransformationId: string,
        productionTanks: ILotWarehouseModel[]) {
        this.workflow_id = productionFlowId;
        this.commodity_transformation_id = commodityTransformationId;
        weightNotes.forEach(nt => {
            let note: NotesModel = {
                id: nt.weightNoteId
            }
            this.notes.push(note);
        });
        productionTanks.forEach(pt => {
            let tank: ProductionTanks = {
                production_tank_id: pt.id
            }
            this.production_tanks.push(tank);
        });
    }
}
/**
 * notes model request
 */
export class NotesModel {
    id: string;
}

export class ProductionTanks {
    production_tank_id: string;
}
