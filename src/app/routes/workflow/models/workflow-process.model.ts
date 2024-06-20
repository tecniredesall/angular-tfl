import { ITransformationTypeModel, TransformationTypeModel } from './transformation_types.model';

export interface IWorkflowProcessModel {
    style: string;
    level: number;
    xPosition: number;
    yPosition: number;
    processId: string;
    workflowId: string;
    processName: string;
    transformationTypes: {
        in: ITransformationTypeModel[],
        out: ITransformationTypeModel[],
    }
    workflowsProcessId?: string;
}

export interface IWorkflowProcessRequestModel {
    style: string;
    level: number;
    axis_x: number;
    axis_y: number;
    process_id: string;
    workflow_id: string;
    workflows_process_id: string;
    transformation_types: {
        in: string[],
        out: string[]
    }
}

export class WorkflowProcessModel implements IWorkflowProcessModel {
    public style: string = null;
    public level: number = 0;
    public xPosition: number = 2.5;
    public yPosition: number = 2.5;
    public processId: string = '';
    public workflowId: string = '';
    public processName: string = '';
    public transformationTypes: {
        in: ITransformationTypeModel[],
        out: ITransformationTypeModel[],
    }
    public workflowsProcessId?: string = null;

    constructor(item: any, isFromApi = false) {
        this.style              = item.style ?  item.style.replace('stroke: ', '') : this.style;
        this.level              = item.level ?? this.level;
        this.xPosition          = isFromApi  ?  item.axis_x : item.xPosition
        this.yPosition          = isFromApi  ?  item.axis_y : item.yPosition,
        this.processId          = isFromApi  ?  item.process_id : item.processId;
        this.processName        = isFromApi  ?  item.process_name : item.processName;
        this.workflowId         = isFromApi  ?  item.workflow_id : item.workflowId;
        this.workflowsProcessId = isFromApi  ?  item.workflows_process_id : item.workflowsProcessId;
        let transformationTypes = {
            in: [],
            out: []
        }
        if (isFromApi) {
            item.transformation_types.forEach((transformationType: any) => {
                transformationTypes[transformationType.flow].push(new TransformationTypeModel(transformationType))
            });
        }
        this.transformationTypes = isFromApi ? transformationTypes : item.transformationTypes
    }

    public getRequets(): IWorkflowProcessRequestModel {
        let request: IWorkflowProcessRequestModel = {
            style: typeof (this.style) == 'string' ? this.style : `stroke: ${this.style['stroke']}`,
            level: this.level,
            axis_x: this.xPosition,
            axis_y: this.yPosition,
            process_id: this.processId,
            workflow_id: this.workflowId,
            workflows_process_id: this.workflowsProcessId ?? null,
            transformation_types: {
                in: this.transformationTypes.in.map(t => t.id),
                out: this.transformationTypes.out.map(t => t.id)
            },
        }
        return request;
    }
}
