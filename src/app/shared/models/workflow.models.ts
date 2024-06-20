import { TransformationTypeModel } from "./transformation-type.model";

export interface IWorkflowModel {
  id: string;
  lots: number;
  name: string;
  userId: number;
  isDraft: boolean;
  isEnabled: boolean;
  locationId: number;
  createdDate: string;
  commodityId: number;
  totalProcess: number;
  commodityName: string;
  productionTypeId: string;
  productionTypeName: string;
  transformationType: TransformationTypeModel;
  originCommodityTypeId: string;
  description?: string;
}

export interface IWorkflowRequestModel {
  name: string;
  user_id: number;
  commodity_id: number;
  production_type_id: string;
  commodity_transformation_id: string;
  lots: number;
  is_draft?: boolean;
  is_enabled?: boolean;
  description?: string;
  workflow_id?: string;
  location_id?: number;
  storage_date?: string;
  total_processes?: number;
}

export class WorkflowModel implements IWorkflowModel {
  public id: string;
  public name: string;
  public lots: number;
  public userId: number;
  public isDraft: boolean;
  public isEnabled: boolean;
  public locationId: number;
  public createdDate: string;
  public commodityId: number;
  public totalProcess: number;
  public commodityName: string;
  public productionTypeId: string;
  public productionTypeName: string;
  public transformationType: TransformationTypeModel;
  public originCommodityTypeId: string;
  public description?: string;

  constructor(item: any, isFromAPI = true ){
    this.id = isFromAPI ? item.workflow_id : item.id ;
    this.lots = item.lots;
    this.name = isFromAPI ? item.workflow_name : item.name;
    this.userId = isFromAPI ? item.user_id : item.userId;
    this.isDraft = item.is_draft;
    this.isEnabled = item.is_enabled;
    this.locationId = item.location_id;
    this.createdDate = item.storage_date;
    this.commodityId = isFromAPI ? item.commodity_id : item.commodityId;
    this.totalProcess = item.total_processes;
    this.productionTypeId = isFromAPI ? item.production_type_id : item.productionTypeId;
    this.productionTypeName = isFromAPI ? item.production_type_name : item.productionTypeName;
    this.transformationType = isFromAPI ? new TransformationTypeModel(item.transformation_type) : item.transformationType;
    this.originCommodityTypeId = isFromAPI ? item.cmdty_transformation_id : item.originCommodityTypeId
    this.description = item.description;
  }

  public getRequets(): IWorkflowRequestModel {
    let request: IWorkflowRequestModel = {
      name: this.name,
      user_id: this.userId,
      workflow_id: this.id,
      commodity_id: this.commodityId,
      production_type_id: this.productionTypeId,
      commodity_transformation_id: this.originCommodityTypeId,
      description: this.description,
      lots: this.lots
    }
    return request;
  }

}
