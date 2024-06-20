import { IWNSellerModel, WNSellerModel } from "./wn-seller.model";

export interface IWNSellerListPaginatorModel {
  sellers: Array<IWNSellerModel>;
  initialSellers: Array<IWNSellerModel>;
  nextPageUrl: string;
  initialNextPageUrl: string;
  isDataLoading: boolean;
  searchTerm: string;
  isExecutingSearch: boolean;
  wasInitialDataLoaded: boolean;
}

export class WNSellerListPaginatorModel implements IWNSellerListPaginatorModel {
  public sellers: Array<IWNSellerModel> = [];
  public initialSellers: Array<IWNSellerModel> = [];
  public nextPageUrl: string = null;
  public initialNextPageUrl: string = null;
  public isDataLoading: boolean = true;
  public searchTerm: string = '';
  public isExecutingSearch: boolean = false;
  public wasInitialDataLoaded: boolean = false;

  constructor(item?: any) {
    if (item) {
      this.sellers = item.sellers ? item.sellers : item.data ? item.data : this.sellers;
      this.initialSellers = item.initialSellers ? item.initialSellers : this.initialSellers;
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
    for (let s = 0; s < this.sellers.length; s++) {
      this.sellers[s] = new WNSellerModel(this.sellers[s]);
    }
  }
}