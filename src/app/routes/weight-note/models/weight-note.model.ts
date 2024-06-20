export class WeightNotes {
    start_date: string;
    end_date: string;
    email: string;
    transaction_in_id = '----';
    weight_note_id: string;
    producer_name = '----';
    ct_name: string;
    vtank_name: string;
    net: string;
    is_close: number;
    certifications: Array<any> = [];
    weight: Array<{
        groos_weight: string;
        penalizations: string;
        tare_units: string;
        tare_weight: string;
    }> = [];
}
