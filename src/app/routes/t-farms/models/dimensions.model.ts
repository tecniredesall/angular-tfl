export interface IDimensionsModel {
    measurementUnitId: string;
    name: string;
    value: number;
}

export class DimensionsModel implements IDimensionsModel {
    public measurementUnitId: string = null;
    public name: string = null;
    public value: number = 0;
    constructor(item: any) {
        if (item) {
            this.measurementUnitId = item.measurement_unit_id ?? this.measurementUnitId;
            this.name = item.name ?? this.name;
            this.value = item.value ?? this.value;
        } else {
            Object.assign(this, {});
        }

    }
}


