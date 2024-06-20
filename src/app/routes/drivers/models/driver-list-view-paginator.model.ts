import { ITDriverModel, TDriverModel } from "./driver.model";

export interface IDriverListViewPaginatorModel {
  drivers: Array<ITDriverModel>;
  totalItems: number;
  itemsPerPage: number;
  itemsPerPageOptions: Array<number>;
  totalPages: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string;
  prevPageUrl: string;
  currentPage: number;
}

export class DriverListViewPaginatorModel implements IDriverListViewPaginatorModel {

  public drivers: Array<ITDriverModel> = [];
  public totalItems: number = 0;
  public itemsPerPage: number = 0;
  public itemsPerPageOptions: Array<number> = [0];
  public totalPages: number = 0;
  public firstPageUrl: string = null;
  public lastPageUrl: string = null;
  public nextPageUrl: string = null;
  public prevPageUrl: string = null;
  public currentPage: number = 0;

  constructor(item: Partial<IDriverListViewPaginatorModel> = {}) {

    Object.assign(this, item);

    for (let d = 0; d < this.drivers.length; d++) {
      this.drivers[d] = new TDriverModel(this.drivers[d]);
    }

  }

}