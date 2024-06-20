import { IWNDriverModel, WNDriverModel } from "./wn-driver.model";

export interface IWNDriverListPaginatorModel {
  drivers: Array<IWNDriverModel>;
  initialDrivers: Array<IWNDriverModel>;
  nextPageUrl: string;
  initialNextPageUrl: string;
  isDataLoading: boolean;
  searchTerm: string;
  isExecutingSearch: boolean;
  wasInitialDataLoaded: boolean;
}

export class WNDriverListPaginatorModel implements IWNDriverListPaginatorModel {
  public drivers: Array<IWNDriverModel> = [];
  public initialDrivers: Array<IWNDriverModel> = [];
  public nextPageUrl: string = null;
  public initialNextPageUrl: string = null;
  public isDataLoading: boolean = true;
  public searchTerm: string = '';
  public isExecutingSearch: boolean = false;
  public wasInitialDataLoaded: boolean = false;

  constructor(item?: any) {
    if (item) {
      this.drivers = item.drivers ? item.drivers : item.data ? item.data : this.drivers;
      this.initialDrivers = item.initialDrivers ? item.initialDrivers : this.initialDrivers;
      this.nextPageUrl = item.nextPageUrl ? item.nextPageUrl : item.next_page_url ? item.next_page_url : this.nextPageUrl;
      this.initialNextPageUrl = item.initialNextPageUrl ? item.initialNextPageUrl : this.initialNextPageUrl;
      this.isDataLoading = item.hasOwnProperty('isDataLoading') ? item.isDataLoading : this.isDataLoading;
      this.searchTerm = item.searchTerm ? item.searchTerm : this.searchTerm;
      this.isExecutingSearch = item.hasOwnProperty('isExecutingSearch') ? item.isExecutingSearch : this.isExecutingSearch;
      this.wasInitialDataLoaded = item.hasOwnProperty('wasInitialDataLoaded') ? item.wasInitialDataLoaded : this.wasInitialDataLoaded;
    }
    else {
      Object.assign(this, {});
    }
    for (let d = 0; d < this.drivers.length; d++) {
      this.drivers[d] = new WNDriverModel(this.drivers[d]);
    }
  }
}