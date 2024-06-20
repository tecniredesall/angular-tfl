import { IWNCommodityModel, WNCommodityModel } from "../../weight-note/models/wn-commodity.model";
import { ITransformationTypeModel, TransformationTypeModel } from "./transformation-type.model";

export interface ITransformationModel {
    cmdtyTransformationId: string;
    commodityId: number;
    transformationTypeId: string;
    externalId: string;
    name: string;
    isEnabled: number;
    userId: number;
    storageDate: string;
    locationId: number;
    federatedId: string;
    commodity: IWNCommodityModel;
    type: ITransformationTypeModel;
}
export class TransformationModel implements ITransformationModel {
    public cmdtyTransformationId: string = null;
    public commodityId: number = null;
    public transformationTypeId: string = null;
    public externalId: string = null;
    public name: string = null;
    public isEnabled: number = null;
    public userId: number = null;
    public storageDate: string = null;
    public locationId: number = null;
    public federatedId: string = null;
    public commodity: IWNCommodityModel = new WNCommodityModel();
    public type: ITransformationTypeModel = new TransformationTypeModel();

    constructor(item?: any) {
        if (item) {
            this.cmdtyTransformationId = item.cmdty_transformation_id ?? item.cmdtyTransformationId ?? this.cmdtyTransformationId;
            this.commodityId = item.commodity_id ?? item.commodityId ?? this.commodityId;
            this.transformationTypeId = item.transformation_type_id ?? item.transformationTypeId ?? this.transformationTypeId;
            this.externalId = item.external_id ?? item.externalId ?? this.externalId;
            this.name = item.name ?? this.name;
            this.isEnabled = item.is_enabled ?? item.isEnabled ?? this.isEnabled;
            this.userId = item.user_id ?? item.userId ?? this.userId;
            this.storageDate = item.storage_date ?? item.storageDate ?? this.storageDate;
            this.locationId = item.location_id ?? item.locationId ?? this.locationId;
            this.federatedId = item.federated_id ?? item.federatedId ?? this.federatedId;
            this.commodity = item.commodity ? new WNCommodityModel(item.commodity): this.commodity;
            this.type = item.type ? new TransformationTypeModel(item.type): this.type;
        } else {
            Object.assign(this, {});
        }
    }
}