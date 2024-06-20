import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TIRequestCreateBlockModel } from '../models/request-create-block.model';
import { TIRequestEditBlockModel } from '../models/request-edit-block.model';

@Injectable({
    providedIn: 'root',
})
export class TBlockService {
    constructor(private http: HttpClient) {}

    public createBlock(data: {
        items: Array<TIRequestCreateBlockModel>;
    }): Observable<any> {
        let uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_BLOCKS
        }`;

        return this.http.post(uri, data);
    }

    public editBlock(data: TIRequestEditBlockModel): Observable<any> {
        let uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_BLOCKS
        }/${data.id}`;

        return this.http.put(uri, data);
    }

    public deleteBlock(id: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_BLOCKS
        }/${id}`;

        return this.http.delete(uri);
    }

    public getFederatedBlocks(
        identifier: string,
        email: string,
        phone: string,
        phoneCode: string
    ) {
        const uri = `${CONSTANTS.API_WORKER_SYNC}/blocks/apps`;
        let params: HttpParams = new HttpParams();

        if (identifier) {
            params = params.set('identifier', identifier.replace(/\s/g, ''));
            params = params.set('identifier_name', 'IDENTIDAD');
        }
        if (email) {
            params = params.set('email', email);
        }
        // if (phone) {
        //     params = params.set('phone', phone.replace(/-/g, ''));
        //     if (
        //         CONSTANTS.INTERNATIONAL_PHONES[phoneCode] !==
        //         CONSTANTS.INTERNATIONAL_PHONES.UNKNOWN_COUNTRY
        //     ) {
        //         params = params.set(
        //             'calling_code',
        //             CONSTANTS.INTERNATIONAL_PHONES[phoneCode].PREFIX
        //         );
        //     }
        // }

        return this.http
            .get(uri, { params: params })
            .pipe(map((r: any) => r.data));
    }
}
