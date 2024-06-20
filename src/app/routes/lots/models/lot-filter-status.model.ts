import { ILotCommodityTypeModel } from "./lot-commodity-type.model";
import { ILotCommodityModel } from "./lot-commodity.model";
import { ILotProductionFlowModel } from "./lot-production-flow.model";
import { ILotWarehouseModel } from "./lot-warehouse.model";

export interface ILotFilterStatusModel {
  commodity?: ILotCommodityModel;
  commodityType?: ILotCommodityTypeModel;
  warehouses?: Array<ILotWarehouseModel>;
  productionFlow?: ILotProductionFlowModel;
  urlBackToList?: string;
}