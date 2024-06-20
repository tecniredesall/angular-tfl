export interface TownModel {
}

import { ITRGenericModel } from "../tr-generic.model";

export interface ITownModel extends ITRGenericModel{
    sector: string;
}
export class TownModel implements ITownModel {
    public id: number = null;
    public name: string = '';
    public sector: string = '';

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.name = item.name ?? this.name;
            this.sector = item.sector ?? this.sector;
        } else {
            Object.assign(this, {});
        }
    }
}

