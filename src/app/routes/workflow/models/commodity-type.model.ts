import { IProcessModel } from '../models/process.model';

export interface ICommodityTypeModel {
    id: string;
    name: string;
    opened: boolean;
    processes: IProcessModel[];
    commodity: string;
    externalId: string;
    commodityId: number;
    transformationTypeId: string;
    transformationTypeName: string;
    isEnabled?: boolean;
    locationId?: number;
    userId?: number;
}

export class CommodityTypeModel implements ICommodityTypeModel {
    public id: string;
    public name: string;
    public opened: boolean;
    public processes: IProcessModel[];
    public commodity: string;
    public externalId: string;
    public commodityId: number;
    public transformationTypeId: string;
    public transformationTypeName: string;
    public isEnabled?: boolean;
    public locationId?: number;
    public userId?: number;

    constructor(item: any) {
        this.id = item.cmdty_transformation_id;
        this.name = item.name;
        this.opened = false;
        this.processes = [];
        this.commodity = item.commodity;
        this.commodityId = item.commodity_id;
        this.externalId = item.external_id;
        this.transformationTypeId = item.transformation_type_id;
        this.transformationTypeName = item.transformation_type;
    }
}
