export interface ICommodityModel {
  id: number;
  name: string;
  totalModels: number;
  totalVariety: number;
  transformations: number;
}

export class CommodityModel implements ICommodityModel {
  public id: number;
  public name: string;
  public totalModels: number;
  public totalVariety: number;
  public transformations: number;

  constructor(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.totalModels = item.total_models;
    this.totalVariety = item.total_variety
    this.transformations = item.transformations
  }
}
