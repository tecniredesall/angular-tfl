export interface IAssociatesModel {
  id: string;
  sellerId: number;
  name: string;
}

export class AssociatesModel implements IAssociatesModel {

  public id: string = '';
  public sellerId: number = 0;
  public name: string = '';

  constructor(item?: any) {
    if (item) {
      
      this.id = item.id ? item.id : this.id;
      this.sellerId = item.seller_id ? item.seller_id : this.sellerId;
      this.name = item.seller_name ? item.seller_name : this.name;

    } else {
      Object.assign(this, {});
    }
  }
}
