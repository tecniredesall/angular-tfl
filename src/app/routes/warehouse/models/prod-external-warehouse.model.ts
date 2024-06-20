export interface IProdExternalWarehouseModel {
    description: string;
    id: number
    location: string;
    name: string;
}
export class ProdExternalWarehouseModel implements IProdExternalWarehouseModel {
    public description: string = null;
    public id: number = null;
    public location: string = null;
    public name: string = null;

    constructor(item?: any) {
        if (item) {
            this.description = item.description ?? this.description;
            this.id = item.id ?? this.id;
            this.location = item.location ?? this.location;
            this.name = `${this.id} - ${this.location}`

        } else {
            Object.assign(this, {});
        }
    }
}
