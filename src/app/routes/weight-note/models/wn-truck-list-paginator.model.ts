import { IWNTruckModel, WNTruckModel } from "./wn-truck.model";

export interface IWNTruckListPaginatorModel {
  trucks: Array<IWNTruckModel>;
  initialTrucks: Array<IWNTruckModel>;
  nextPageUrl: string;
  initialNextPageUrl: string;
  isDataLoading: boolean;
  searchTerm: string;
  isExecutingSearch: boolean;
  wasInitialDataLoaded: boolean;
}

export class WNTruckListPaginatorModel implements IWNTruckListPaginatorModel {
  public trucks: Array<IWNTruckModel> = [];
  public initialTrucks: Array<IWNTruckModel> = [];
  public nextPageUrl: string = null;
  public initialNextPageUrl: string = null;
  public isDataLoading: boolean = true;
  public searchTerm: string = '';
  public isExecutingSearch: boolean = false;
  public wasInitialDataLoaded: boolean = false;

  constructor(item?: any) {
    if (item) {
      this.trucks = item.trucks ? item.trucks : item.data ? item.data : this.trucks;
      this.initialTrucks = item.initialTrucks ? item.initialTrucks : this.initialTrucks;
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
    for (let t = 0; t < this.trucks.length; t++) {
      this.trucks[t] = new WNTruckModel(this.trucks[t]);
    }
  }
}