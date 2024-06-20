import { CommodityModel, ICommodityModel } from "../../commodity/models/commodity.model";

export interface ICommodityTypeModel {
    id: string;
    name: string;
    transformationTypeId: string;
    transformationTypeName: string;
    commodity: ICommodityModel;
}

export class CommodityTypeModel implements ICommodityTypeModel {
    public id: string = null;
    public name: string = '';
    public transformationTypeId: string = null;
    public transformationTypeName: string = '';
    public commodity: ICommodityModel = new CommodityModel();

    constructor(item?: any) {
        if (item) {
            this.id = item.cmdty_transformation_id ?? item.id ?? this.id;
            this.name = item.name ?? this.name;
            this.transformationTypeId = item.transformation_type_id ?? item.transformationTypeId ?? this.transformationTypeId;
            this.transformationTypeName = item.transformation_type ?? item.transformationTypeName ?? this.transformationTypeName;
            this.commodity = item.commodity ? new CommodityModel(item.commodity): this .commodity;
        }
        else {
            Object.assign(this, {});
        }
    }
}
