// tslint:disable: variable-name
// tslint:disable: no-inferrable-types
// tslint:disable: no-use-before-declare
export class UnitMeasureModel {
    measurement_unit_id?: string;
    name?: string;
    abbreviation?: string;
    is_enabled?: boolean;
    user_id?: string;
    storage_date?: string;
    source_id?: number;
    branch_id?: number;
    mstatus?: string;
    units_converter?: Array<UnitConvertion> = [];
    convertions?: number;
    factor?: string;
    conversion_measurement_unit_id?: string;
    disabled: boolean = false;
}

export class UnitConvertion {
    base_measurement_unit_id: string;
    base_measurement_unit: string;
    branch_id: number;
    conversion_measurement_unit_id: string;
    conversion_measurement_unit: string;
    factor: string;
    mstatus: string;
    source_id: number;
    storage_date: string;
    unit_converter_id: string;
    user_id: number;
}
