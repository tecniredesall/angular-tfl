export interface ITransformationTypeModel {
    id: string;
    name: string;
}

export class TransformationTypeModel implements ITransformationTypeModel {
    public id: string;
    public name: string;

    constructor(item: any) {
        this.id = item.transformation_type_id ?? item.id ?? this.id;
        this.name = item.name ?? this.name;
    }
}