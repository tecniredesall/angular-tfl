
export interface TIVarietyModel {
  id: string;
  name: string;
  commodityId: number;
}

export class TVarietyModel implements TIVarietyModel {

  public id: string = null;
  public name: string = '';
  public commodityId: number = null;

  constructor(item?: any) {

    if (item) {

      this.id = item.id ? item.id : item.variety_id ? item.variety_id : this.id;

      this.name = item.name ? item.name : this.name;

      this.commodityId = item.commodityId ? item.commodityId : item.commodity_id ? item.commodity_id : this.commodityId;
      
    }
    else {

      Object.assign(this, {});
      
    }

  }

}