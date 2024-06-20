import { ITransformationTypeModel, TransformationTypeModel } from "./transformation_types.model";

export interface IShapeModel {
    id: string;
    name: string;
    color: string;
    type: string;
    xPosition: number;
    yPosition: number;
    transformationTypes: {
        in: ITransformationTypeModel[],
        out: ITransformationTypeModel[]
    }
    level?: number;
}

export class ShapeModel implements IShapeModel {
    public id: string;
    public name: string;
    public type: string;
    public color: string;
    public xPosition: number = 0;
    public yPosition: number = 0;
    public level?: number;
    public transformationTypes: {
        in: ITransformationTypeModel[],
        out: ITransformationTypeModel[]
    }

    constructor(item: any, positionCount = 0.5) {
        this.id = item.id ?? item.process_id ?? item.processId;
        this.type = 'shape'
        this.name = item.name ?? item.processName;
        this.color = item.color ?? item.style ?? this.color;
        this.xPosition = item.xPosition ?? this.xPosition;
        this.yPosition = item.yPosition ?? this.yPosition + positionCount;
        this.transformationTypes = item.transformationTypes ? 
            item.transformationTypes : 
            (
                {
                    in: item.transformationTypesIn ?? [],
                    out: item.transformationTypesOut ?? []
                }
            );
        this.level = item.level ?? null;
    }
}