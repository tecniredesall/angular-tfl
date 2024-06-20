export interface ILotProductionFlowModel {
  id: string;
  name: string;
  productionTypeId: string;
  productionTypeName: string;
  originCommodityTypeId: string;
  totalProcess: number;
}

export class LotProductionFlowModel implements ILotProductionFlowModel {
  public id: string = null;
  public name: string = '';
  public productionTypeId: string = null;
  public productionTypeName: string = '';
  public originCommodityTypeId: string = '';
  public totalProcess = 0;

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = isAPIData ? (item.workflow_id ?? this.id) : (item.id ?? this.id);
      this.name = isAPIData ? (item.workflow_name ?? this.name) : (item.name ?? this.name);
      this.productionTypeId = isAPIData ? (item.production_type_id ?? this.productionTypeId) : (item.productionTypeId ?? this.productionTypeId);
      this.productionTypeName = isAPIData ? (item.production_type_name ?? this.productionTypeName) : (item.productionTypeName ?? this.productionTypeName);
      this.originCommodityTypeId = isAPIData ? (item.cmdty_transformation_id ?? this.originCommodityTypeId) : (item.originCommodityTypeId ?? this.originCommodityTypeId);
      this.totalProcess = isAPIData ? (item.total_processes ?? this.totalProcess) : (item.totalProcess ?? this.totalProcess);
    }
    else {
      Object.assign(this, {});
    }
  }
}
