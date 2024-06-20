import { BuyerModel, TIBuyerModel } from './../models/buyer.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';

@Injectable({
    providedIn: 'root'
})
export class BuyersService {

    constructor(private _http: HttpClient) { }

    /**
     * get buyers
     */
    public getBuyers(url?: string, params = {}): Observable<{ data: TIBuyerModel[], paginator: IPaginator }> {
        let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_BUYERS}?`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((response: any) => {
                let result: { data: TIBuyerModel[], paginator: IPaginator } = {
                    data: [],
                    paginator: new Paginator()
                };
                result.data = response.data.data.map((d: any) => new BuyerModel(d))
                result.paginator = new Paginator(response, true)
                return result
            }));
    }

    /**
     * get buyers
     */
    public exportCsv(url?: string, params = {}): Observable<any> {
        let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_BUYERS_CSV}?`;
        return this._http
        .get(uri, {
            params: new HttpParams({ fromObject: params }),
            observe: 'response',
            responseType: 'blob',
        })
        .pipe(map((r) => r.body));
    }
}
