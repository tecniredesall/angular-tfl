import { map, tap } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LotEventsService {
    public uriOwner = localStorage.getItem('uri-owner');
    constructor(
        private http: HttpClient,
        private paginationService: PaginationService
    ) {}

    public getLotEvents(id: string, pageUri?: string) {
        const url = pageUri
            ? `${pageUri}&lot_id=${id}`
            : `${this.uriOwner}${URIS_CONFIG.API_LOT_EVENTS}?lot_id=${id}`;
        return this.http.get(url).pipe(
            tap((r: any) =>
                this.paginationService.setPagination(r.meta, r.links)
            ),
            map((r: any) => r.data)
        );
    }

    public postLotEvent(event: {
        lot_id: string;
        damaged?: boolean;
        note?: string;
    }) {
        const url = `${this.uriOwner}${URIS_CONFIG.API_LOT_EVENTS}`;
        return this.http.post(url, event);
    }

    public deleteLotEvent(id: string) {
        const url = `${this.uriOwner}${URIS_CONFIG.API_LOT_EVENTS}/${id}`;
        return this.http.delete(url);
    }
}
