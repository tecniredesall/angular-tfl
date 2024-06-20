import { SealModel } from '../../../shared/utils/models/seal.model';

export interface ISealListResponseModel {
    seals: Array<SealModel>;
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
    federated: boolean;
}

export class SealListResponseModel implements ISealListResponseModel {
    public seals: Array<SealModel> = [];
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
    public federated: boolean = false;

    constructor(item?: any) {
        if (item) {
            this.seals = item.seals ?? item.data ?? this.seals;
            this.from = item.from ?? this.from;
            this.to = item.to ?? this.to;
            this.total = item.total ?? this.total;
            this.perPage = item.perPage ?? item.per_page ?? this.perPage;
            this.currentPage =
                item.currentPage ?? item.current_page ?? this.currentPage;
            this.lastPage = item.lastPage ?? item.last_page ?? this.lastPage;
            this.firstPageUrl =
                item.firstPageUrl ?? item.first_page_url ?? this.firstPageUrl;
            this.lastPageUrl =
                item.lastPageUrl ?? item.last_page_url ?? this.lastPageUrl;
            this.nextPageUrl =
                item.nextPageUrl ?? item.next_page_url ?? this.nextPageUrl;
            this.prevPageUrl =
                item.prevPageUrl ?? item.prev_page_url ?? this.prevPageUrl;
            this.path = item.path ?? this.path;
            this.federated = item.federated == 1;
        } else {
            Object.assign(this, item);
        }
    }
}
