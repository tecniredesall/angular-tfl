import { IPaginator } from './../../models/paginator.model';
import { PageEvent } from '@angular/material/paginator';
export function eventPaginatorFunction(event: PageEvent, paginator: IPaginator): string {
    let selectedPage: number = event.pageIndex + 1;
    let uri: string = null;
    if (paginator.currentPage != selectedPage) {
        if (paginator.currentPage + 1 == selectedPage) {
            uri = paginator.nextPageUrl;
        } else if (paginator.currentPage - 1 == selectedPage) {
            uri = paginator.previousPageUrl;
        } else if (1 == selectedPage) {
            uri = paginator.firstPageUrl;
        } else if (paginator.totalPages == selectedPage) {
            uri = paginator.lastPageUrl;
        }
        return uri;
    }
}
