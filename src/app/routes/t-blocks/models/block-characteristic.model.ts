export interface IBlockCharacteristicModel {
    id: number;
    name: string;
    status: number;
}

export class BlockCharacteristicModel implements IBlockCharacteristicModel {
    public id: number = null;
    public name: string = '';
    public status: number = null;

    constructor(item?: IBlockCharacteristicModel) {
        if (item) {
            this.id = item.id ?? this.id;
            this.name = item.name ?? this.name;
            this.status = item.status ?? this.status;
        } else {
            Object.assign(this, {});
        }
    }
}
