import { SealModel } from '../../../shared/utils/models/seal.model';

export interface ISealListViewPaginatorModel {
    seals: Array<SealModel>;
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

export class SealListViewPaginatorModel implements ISealListViewPaginatorModel {
    public seals: Array<SealModel> = [];
    public totalItems: number = 0;
    public itemsPerPage: number = 0;
    public itemsPerPageOptions: Array<number> = [0];
    public totalPages: number = 0;
    public firstPageUrl: string = null;
    public lastPageUrl: string = null;
    public nextPageUrl: string = null;
    public prevPageUrl: string = null;
    public currentPage: number = 0;

    constructor(item: Partial<ISealListViewPaginatorModel> = {}) {
        Object.assign(this, item);
    }
}
