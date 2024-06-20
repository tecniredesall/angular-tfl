export interface IPaginator {
  firstPageUrl: string;
  lastPageUrl: string;
  previousPageUrl: string;
  nextPageUrl: string;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export class Paginator implements IPaginator {
  public firstPageUrl: string = null;
  public lastPageUrl: string = null;
  public previousPageUrl: string = null;
  public nextPageUrl: string = null;
  public currentPage: number = 0;
  public totalPages: number = 0;
  public itemsPerPage: number = 0;
  public totalItems: number = 0;

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      if (item.links && Array.isArray(item.links) === false) {
        this.firstPageUrl = isAPIData ? (item.links.first ?? this.firstPageUrl) : (item.firstPageUrl ?? this.firstPageUrl);
        this.lastPageUrl = isAPIData ? (item.links.last ?? this.lastPageUrl) : (item.lastPageUrl ?? this.lastPageUrl);
        this.previousPageUrl = isAPIData ? (item.links.prev ?? this.previousPageUrl) : (item.previousPageUrl ?? this.previousPageUrl);
        this.nextPageUrl = isAPIData ? (item.links.next ?? this.nextPageUrl) : (item.nextPageUrl ?? this.nextPageUrl);
      }
      else {
        this.firstPageUrl = isAPIData ? (item.data.first_page_url ?? item.first_page_url ?? this.firstPageUrl) : (item.firstPageUrl ?? this.firstPageUrl);
        this.lastPageUrl = isAPIData ? (item.data.last_page_url ?? item.last_page_url ?? this.lastPageUrl) : (item.lastPageUrl ?? this.lastPageUrl);
        this.previousPageUrl = isAPIData ? (item.data.prev_page_url ?? item.prev_page_url ?? this.previousPageUrl) : (item.previousPageUrl ?? this.previousPageUrl);
        this.nextPageUrl = isAPIData ? (item.data.next_page_url ?? item.next_page_url ?? this.nextPageUrl) : (item.nextPageUrl ?? this.nextPageUrl);
      }
      if (item.meta) {
        this.currentPage = isAPIData ? (item.meta.current_page ?? this.currentPage) : (item.currentPage ?? this.currentPage);
        this.totalPages = isAPIData ? (item.meta.last_page ?? this.totalPages) : (item.totalPages ?? this.totalPages);
        this.itemsPerPage = isAPIData ? (item.meta.per_page ?? this.itemsPerPage) : (item.itemsPerPage ?? this.itemsPerPage);
        this.totalItems = isAPIData ? (item.meta.total ?? this.totalItems) : (item.totalItems ?? this.totalItems);
      }
      else {
        this.currentPage = isAPIData ? (item.data.current_page ?? item.current_page ?? this.currentPage) : (item.currentPage ?? this.currentPage);
        this.totalPages = isAPIData ? (item.data.last_page ?? item.last_page ?? this.totalPages) : (item.totalPages ?? this.totalPages);
        this.itemsPerPage = isAPIData ? (item.data.per_page ?? item.per_page ?? this.itemsPerPage) : (item.itemsPerPage ?? this.itemsPerPage);
        this.totalItems = isAPIData ? (item.data.total ?? item.total ?? this.totalItems) : (item.totalItems ?? this.totalItems);
      }
    }
    else {
      Object.assign(this, {});
    }
  }
}