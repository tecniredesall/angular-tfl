import * as moment from 'moment';
export interface IVehicleTypeModel {
    active: boolean;
    createdAt: moment.Moment;
    id: number;
    type: string;
}

export class VehicleTypeModel implements IVehicleTypeModel {
    public active: boolean = true;
    public createdAt: moment.Moment = null;
    public id: number = null;
    public type: string = null;
    constructor(item?: any) {
        if (item) {
            this.active = item.hasOwnProperty('active') ? item.active : this.active;
            this.createdAt = item.creates_at ?? this.createdAt;
            this.id = item.id ?? this.id;
            this.type = item.type ?? this.type;
        } else {
            Object.assign(this, {});
        }
    }

}

