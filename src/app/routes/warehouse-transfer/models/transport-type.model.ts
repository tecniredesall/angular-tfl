export interface ITransportTypeModel {
    id: number;
    type: string;
    active: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
export class TransportTypeModel implements ITransportTypeModel {
    public id: number = null;
    public type: string = null;
    public active: number = null;
    public createdBy: string = null;
    public createdAt: string = null;
    public updatedAt: string = null;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.type = item.type ?? this.type;
            this.active = item.active ?? this.active;
            this.createdBy = item.created_by ?? item.createdBy ?? this.createdBy;
            this.createdAt = item.created_at ?? item.createdAt ?? this.createdAt;
            this.updatedAt = item.updated_at ?? item.updatedAt ?? this.updatedAt;
        } else {
            Object.assign(this, {});
        }
    }
}