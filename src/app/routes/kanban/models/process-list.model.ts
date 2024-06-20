export interface IProcessListModel {
    id: string;
    name: string;
    color: string;
    level: number;
    transformationTypes: ITransformationTypeModel[];
}

export class ProcessListModel implements IProcessListModel {
    public id: string;
    public name: string;
    public color: string;
    public level: number;
    public transformationTypes: ITransformationTypeModel[] = [];

    constructor(item: any) {
        this.id = item.process_id ?? this.id;
        this.name = item.process_name ?? this.name;
        this.color = item.style.replace('stroke: ', '') ?? this.color;
        this.level = item.level ?? this.level;
        this.transformationTypes = item.transformation_types ?? this.transformationTypes;
    }
}

export interface ITransformationTypeModel {
    id: string;
    flow: string;
    name: string;
}

export class TransformationTypeModel implements ITransformationTypeModel {
    public id: string;
    public flow: string;
    public name: string;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ? item.id : this.id;
            this.flow = item.flow ? item.flow : this.flow;
            this.id = item.name ? item.name : this.name;
        }
    }
}
