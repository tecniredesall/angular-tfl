
import { ITRGenericModel } from "../tr-generic.model";

export interface ICityModel extends ITRGenericModel {
    stateId: string;
}

export class CityModel implements ICityModel {
    public id: number = null;
    public name: string = '';
    public stateId: string = null;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.name = item.name ?? this.name;
            this.stateId = item.state_id ?? this.stateId;
        } else {
            Object.assign(this, {});
        }
    }
}

