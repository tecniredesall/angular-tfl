

export interface IWeighingTableWeightConfigurationModel {
  allowEmpty: boolean;
  tareWeight?: number;
  defaultValue?: number;
}

export class WeighingTableWeightConfigurationModel implements IWeighingTableWeightConfigurationModel {
  public allowEmpty: boolean;
  public tareWeight?: number = 0;
  public defaultValue?: number;

  constructor(item: any) {
      this.allowEmpty = item.allow_empty ?? item.allowEmpty ?? this.allowEmpty;
      this.defaultValue = item.default_value ?? item.defaultValue ?? this.defaultValue;
      if(item.tare_weight) {
          this.tareWeight = item.tare_weight ?? item.tareWeight;
      }
  }
}

export interface IWeighingTableConfigurationModel{
  tare: IWeighingTableWeightConfigurationModel;
  transportTare: IWeighingTableWeightConfigurationModel;
  container: IWeighingTableWeightConfigurationModel;
  featuredWeightOut: boolean;
}

export class WeighingTableConfigurationModel implements IWeighingTableConfigurationModel{
  public tare: IWeighingTableWeightConfigurationModel;
  public transportTare: IWeighingTableWeightConfigurationModel;
  public container: IWeighingTableWeightConfigurationModel;
  public featuredWeightOut: boolean = true;

  constructor(item: any) {
      this.tare = item.tare ? new WeighingTableWeightConfigurationModel(item.tare) : this.tare;
      this.transportTare = item.transport_tare ? new WeighingTableWeightConfigurationModel(item.transport_tare) : item.transportTare ?? this.transportTare;
      this.container = item.container ? new WeighingTableWeightConfigurationModel(item.container) : this.container;
      this.featuredWeightOut = item.netweight_out ?? this.featuredWeightOut;
  }
}
