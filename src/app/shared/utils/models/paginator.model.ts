export class Paginator {
    public nextPage: number;
    public lastPage: number;
    public firstPage: number;
    public totalItems: number;
    public currentPage: number;
    public itemsPerPage: number;

    public lastPageUrl: string;
    public nextPageUrl: string;
    public firstPageUrl: string;
    public currentPageUrl: string;
    public previousPageUrl: string;

    constructor(data: PaginationModel) {
        this.nextPage = data.to;
        this.lastPage = data.last_page;
        this.firstPage = data.from;
        this.totalItems = data.total;
        this.currentPage = data.current_page;
        this.itemsPerPage = data.per_page;

        this.lastPageUrl = data.last_page_url;
        this.nextPageUrl = data.next_page_url;
        this.firstPageUrl = data.first_page_url;
        this.currentPageUrl = `${data.path}?page=${this.currentPage}&`;
        this.previousPageUrl = data.prev_page_url;
    }
}

export interface PaginationModel {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
}
