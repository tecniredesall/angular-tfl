export interface IProductionTypeModel {
  name: string;
  id: string;
}

export class ProductionTypeModel implements IProductionTypeModel {
  public name: string;
  public id: string;

  constructor(item: any) {
    this.name = item.name;
    this.id = item.production_type_id ?? item.id
  }
}
