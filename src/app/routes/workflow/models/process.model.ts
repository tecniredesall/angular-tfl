import { ITransformationTypeModel, TransformationTypeModel } from './transformation_types.model';
import * as moment from 'moment';

export interface IProcessModel {
    id?: string;
    name: string;
    color: string;
    isDisabled: boolean;
    createdDate: moment.Moment;
    creatorUser: string;
    transformationTypes: {
        in: ITransformationTypeModel[],
        out: ITransformationTypeModel[]
    }
}

export interface IProcessRequestModel {
    name: string;
    color: string;
    process_id: string;
}

export class ProcessModel implements IProcessModel {
    public id?: string;
    public name: string = '';
    public color: string = '';
    public isDisabled: boolean = false;
    public createdDate: moment.Moment = null;
    public creatorUser: string = '';
    public transformationTypes: {
        in: ITransformationTypeModel[],
        out: ITransformationTypeModel[]
    }

    constructor(item: any, isFromApi = true) {
        this.id = isFromApi ? item.process_id : item.processId ?? item.id ?? this.id;
        this.name = item.name ?? item.processName ?? this.name;
        this.color = item.color ?? item.style ?? this.color;
        this.isDisabled = item.isDisabled ?? this.isDisabled;
        this.createdDate = isFromApi
                ? item.storage_date ? moment(item.storage_date, 'YYYY-MM-DD HH:mm:ss') : this.createdDate
                : item.createdDate ? moment(item.createdDate) : this.createdDate;
        this.creatorUser = isFromApi
            ? item.fullName ?? this.creatorUser
            : item.creatorUser ?? this.creatorUser;
        this.transformationTypes = isFromApi && item.transformation_types ? 
            item.transformation_types.map(t => new TransformationTypeModel(t)):
            item.transformationTypes ?? {in: item.transformationTypesIn ?? [], out: item.transformationTypesOut ?? []}
    }

    public getRequest(): IProcessRequestModel {
        let request: IProcessRequestModel = {
            name: this.name,
            color: this.color,
            process_id: this.id
        }
        return request
    }
}