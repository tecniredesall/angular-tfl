import { transition } from '@angular/animations';
export interface ILotListCatationModel {
    average: number;
    created_at: string;
    cupping_id: string;
    folio: number;
    process_name: string;
    prod_lot_id: string;
    producer: string;
    transition_id: string;
    user: string;
}

export class LotProcessModel implements ILotListCatationModel {
public average: number;
public created_at: string;
public cupping_id: string;
public folio: number;
public process_name: string;
public prod_lot_id: string;
public producer: string;
public transition_id: string;
public user: string;

    
}
