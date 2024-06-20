import { ITDriverModel, TDriverModel } from "./driver.model";

export interface IDriverListResponseModel {
  drivers: Array<ITDriverModel>;
  from: number;
  to: number;
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string;
  prevPageUrl: string;
  path: string;
}

export class DriverListResponseModel implements IDriverListResponseModel {

  public drivers: Array<ITDriverModel> = [];
  public from: number = 0;
  public to: number = 0;
  public total: number = 0;
  public perPage: number = 0;
  public currentPage: number = 0;
  public lastPage: number = 0;
  public firstPageUrl: string = '';
  public lastPageUrl: string = '';
  public nextPageUrl: string = '';
  public prevPageUrl: string = '';
  public path: string = '';

  constructor(item?: any, isAPIData: boolean = false) {

    if (item) {
      
      this.drivers = item.drivers ? item.drivers : item.data ? item.data : this.drivers;

      this.from = item.from ? item.from : this.from;

      this.to = item.to ? item.to : this.to;

      this.total = item.total ? item.total : this.total;

      this.perPage = item.perPage ? item.perPage : item.per_page ? item.per_page : this.perPage;

      this.currentPage = item.currentPage ? item.currentPage : item.current_page ? item.current_page : this.currentPage;

      this.lastPage = item.lastPage ? item.lastPage : item.last_page ? item.last_page : this.lastPage;

      this.firstPageUrl = item.firstPageUrl ? item.firstPageUrl : item.first_page_url ? item.first_page_url : this.firstPageUrl;

      this.lastPageUrl = item.lastPageUrl ? item.lastPageUrl : item.last_page_url ? item.last_page_url : this.lastPageUrl;

      this.nextPageUrl = item.nextPageUrl ? item.nextPageUrl : item.next_page_url ? item.next_page_url : this.nextPageUrl;

      this.prevPageUrl = item.prevPageUrl ? item.prevPageUrl : item.prev_page_url ? item.prev_page_url : this.prevPageUrl;

      this.path = item.path ? item.path : this.path;

    }
    else {

      Object.assign(this, item);

    }

    for (let d = 0; d < this.drivers.length; d++) {
      this.drivers[d] = new TDriverModel(this.drivers[d], isAPIData);        
    }


  }

}