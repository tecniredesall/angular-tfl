import { IReceptionNotePurchaseOrderModel, ReceptionNotePurchaseOrderModel } from './reception-note-purchase-order.model';
export interface IReceptionNotePaginatorModel {
    firstPageUrl: string;
    lastPageUrl: string;
    previousPageUrl: string;
    nextPageUrl: string;
    currentPageUrl: string;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    data: IReceptionNotePurchaseOrderModel[];
}
export class ReceptionNotePaginatorModel implements IReceptionNotePaginatorModel {
    public firstPageUrl: string = '';
    public lastPageUrl: string = '';
    public previousPageUrl: string = '';
    public nextPageUrl: string = '';
    public currentPageUrl: string = '';
    public currentPage: number = 0;
    public totalPages: number = 0;
    public itemsPerPage: number = 0;
    public totalItems: number = 0;
    public data: IReceptionNotePurchaseOrderModel[] = [];

    constructor(data?: any, factor?: number) {
        if (data) {
            this.firstPageUrl = data.links ? data.links.first : this.firstPageUrl;
            this.lastPageUrl = data.links ? data.links.last : this.lastPageUrl;
            this.previousPageUrl = data.links ? data.links.prev : this.previousPageUrl;
            this.nextPageUrl = data.links ? data.links.next : this.nextPageUrl;
            this.currentPage = data.meta ? data.meta.current_page : this.currentPage;
            this.totalPages = data.meta ? data.meta.last_page : this.totalPages;
            this.itemsPerPage = data.meta ? data.meta.per_page : this.itemsPerPage;
            this.totalItems = data.meta ? data.meta.total : this.totalItems;
            this.data = data.data ? (data.data as Array<any>)
                .map((d: any) => new ReceptionNotePurchaseOrderModel(d, factor)) : this.data;
        }
        else {
            Object.assign(this, {});
        }
    }
}
