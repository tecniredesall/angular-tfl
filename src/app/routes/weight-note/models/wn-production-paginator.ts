import { map } from 'rxjs/operators';
import { IPaginator } from 'src/app/shared/models/paginator.model';
import { PaginationModel, Paginator } from './../../../shared/utils/models/paginator.model';
import { WNProductionModel } from "./wn-production.model";

export interface IWNProductionPaginatorModel {

    listWNProductionModel: Array<WNProductionModel>;
}


export class ProductionPaginatorModel implements IWNProductionPaginatorModel, IPaginator {

    firstPageUrl: string = null;
    lastPageUrl: string = null;
    previousPageUrl: string = null;
    nextPageUrl: string = null;
    currentPage: number = 0;
    totalPages: number = 0;
    itemsPerPage: number = 0;
    totalItems: number = 0;
    listWNProductionModel: WNProductionModel[] = [];
    constructor(data?: any, isAPIData: boolean = false) {
        if (data) {
            this.firstPageUrl = isAPIData ? (data.links.first ?? this.firstPageUrl) : (data.firstPageUrl ?? this.firstPageUrl);
            this.lastPageUrl = isAPIData ? (data.links.last ?? this.lastPageUrl) : (data.lastPageUrl ?? this.lastPageUrl);
            this.previousPageUrl = isAPIData ? (data.links.prev ?? this.previousPageUrl) : (data.previousPageUrl ?? this.previousPageUrl);
            this.nextPageUrl = isAPIData ? (data.links.next ?? this.nextPageUrl) : (data.nextPageUrl ?? this.nextPageUrl);
            this.currentPage = isAPIData ? (data.meta.current_page ?? this.currentPage) : (data.currentPage ?? this.currentPage);
            this.totalPages = isAPIData ? (data.meta.last_page ?? this.totalPages) : (data.totalPages ?? this.totalPages);
            this.itemsPerPage = isAPIData ? (data.meta.per_page ?? this.itemsPerPage) : (data.itemsPerPage ?? this.itemsPerPage);
            this.totalItems = isAPIData ? (data.meta.total ?? this.totalItems) : (data.totalItems ?? this.totalItems);
            this.listWNProductionModel = isAPIData ? ((data.data as Array<any>)).map((x: any) => { return new WNProductionModel(x, true) }) : this.listWNProductionModel;
        }
        else {
            Object.assign(this, {});
        }
    }



}
