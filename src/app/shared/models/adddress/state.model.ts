import { ITRGenericModel } from "../tr-generic.model";

export interface IStateModel extends ITRGenericModel{}

export class StateModel implements IStateModel {
    public id: number = null;
    public name: string = '';

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.name = item.name ?? this.name;
        } else {
            Object.assign(this, {});
        }
    }
}

