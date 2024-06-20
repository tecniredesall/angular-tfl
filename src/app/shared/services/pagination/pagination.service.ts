import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { PaginationModel } from '../../utils/models/paginator.model';

@Injectable({
    providedIn: 'root',
})
export class PaginationService {
    private _multiPagination: {
        [key: string]: PaginationModel;
    };
    private _pagination: PaginationModel;
    public pagination$ = new BehaviorSubject<PaginationModel>(null);
    public multipagination$ = new BehaviorSubject<{
        [key: string]: PaginationModel;
    }>(null);

    constructor() {}
    public clearPagination() {
        this._pagination = null;
    }
    public setPagination(
        value: PaginationModel,
        links?: {
            first: string;
            last: string;
            next: string;
            prev: string;
        }
    ) {
        this._pagination = !links
            ? { ...value }
            : this.setPaginationWithLinks(value, links);
        this.pagination$.next(this._pagination);
    }
    public setPaginationWithLinks(
        value: PaginationModel,
        links: {
            first: string;
            last: string;
            next: string;
            prev: string;
        }
    ) {
        let pagination: PaginationModel = { ...value };

        pagination.next_page_url = links.next;
        pagination.prev_page_url = links.prev;
        pagination.last_page_url = links.last;
        pagination.first_page_url = links.first;

        return pagination;
    }
    public setMultipagination(value: { [key: string]: PaginationModel }) {
        this._multiPagination = { ...this._multiPagination, ...value };
        this.multipagination$.next(this._multiPagination);
    }

    public getPageUri(page?: PageEvent): string {
        let uri: string;
        if (!this._pagination) {
            return null;
        }
        if (!page) {
            return this._pagination.path;
        }
        if (page.pageIndex === 0) {
            return this._pagination.first_page_url;
        } else if (page.pageIndex === (this._pagination.last_page - 1 )) {
            return this._pagination.last_page_url;
        } else if (
            page.pageIndex > page.previousPageIndex
        ) {
            return this._pagination.next_page_url;
        } else {
            return this._pagination.prev_page_url;
        }
    }
    public getMultipagedPageUri(control: string, page?: PageEvent): string {
        let uri: string;
        if (!this._multiPagination[control]) {
            return null;
        }
        if (!page) {
            return this._multiPagination[control].path;
        }
        if (page.pageIndex === 0) {
            uri = this._multiPagination[control].first_page_url;
        } else if (page.pageIndex > page.previousPageIndex) {
            uri = this._multiPagination[control].next_page_url;
        } else {
            uri = this._multiPagination[control].prev_page_url;
        }
        return uri;
    }
}
