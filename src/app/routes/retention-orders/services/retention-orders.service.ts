import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { RetentionOrder, RetentionOrderModel } from './../models/retention-orders-model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { map } from 'rxjs/operators';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { RetentionOrderWeightNotesModel } from '../models/retention-orders-weight-notes';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ITag } from 'src/app/shared/models/tags.model';
import { ITRFilter } from 'src/app/shared/models/filter-data.model';

@Injectable({
    providedIn: 'root'
})
export class RetentionOrdersService {
    socket: any;
    public searchTerm$ = new BehaviorSubject<string>('');
    private searchTerm: string;
    public currentFilterCreate: ITRFilter | undefined;
    public currentTagsCreate: ITag[] | undefined;
    readonly KEY_FILTER: string = `${CONSTANTS.PERMISSIONS.RETENTION_ORDERS}-${CONSTANTS.CRUD_ACTION.READ}-Filter`
    readonly KEY_TAGS: string = `${CONSTANTS.PERMISSIONS.RETENTION_ORDERS}-${CONSTANTS.CRUD_ACTION.READ}-Tags`
    constructor(private _http: HttpClient) { }

    public getRetentionOrders(url?: string, params = {}): Observable<{ data: RetentionOrderModel[], paginator: IPaginator }> {
        let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}?`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((response: any) => {
                let result: { data: RetentionOrderModel[], paginator: IPaginator } = {
                    data: [],
                    paginator: new Paginator()
                };
                result.data = response.data.data.map((d: any) => new RetentionOrderModel(d))
                result.paginator = new Paginator(response, true)
                return result
            }));
    }

    public getDetailRetentionOrders(id: string, url?: string): Observable<RetentionOrderModel> {
        let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}/${id}`;
        return this._http.get(uri)
            .pipe(map((response: any) => {
                return new RetentionOrderModel(response.data)
            }));
    }

    public createRetentionOrder(data: any): Observable<RetentionOrderModel> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}`;
        return this._http.post(uri, data).pipe(map((response: any) => {
            return new RetentionOrderModel(response.data)
        }));
    }

    public updateRetentionOrder(data: any, orderId: string): Observable<RetentionOrderModel> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}/${orderId}`;
        return this._http.put(uri, data).pipe(map((response: any) => {
            return new RetentionOrderModel(response.data)
        }));
    }

    public updateStatusRetentionOrder(orderId: any): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}/${orderId}/close`;
        return this._http.patch(uri, {});
    }

    public getWeighNotes(url?: string, params = {}): Observable<{ data: RetentionOrderWeightNotesModel[], paginator: IPaginator }> {
        let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}/weight-notes?`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((response: any) => {
                let result: { data: RetentionOrderWeightNotesModel[], paginator: IPaginator } = {
                    data: [],
                    paginator: new Paginator()
                };
                result.data = response.data.map((d: any) => new RetentionOrderWeightNotesModel(d))
                result.paginator = new Paginator(response, true)
                return result
            }));
    }

    public getProducersFiltered(params: any) {
        this.searchTerm = params.q;
        this.searchTerm$.next(this.searchTerm);
        return this.getProducers(null, params);
    }

    public getProducers(uri: string, params: any = {}): Observable<{ data: TProducerModel[], paginator: IPaginator }> {
        let path: string = uri ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCERS_WITH_FARMS}`;
        return this._http
            .get(path, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((r: any) => {
                let response: { data: TProducerModel[], paginator: IPaginator } = { data: [], paginator: new Paginator() };
                response['data'] = r.data.data.map((d: any) => new TProducerModel(d));
                response['paginator'] = new Paginator(r, true);
                return response
            })
            );
    }

    public reportRetentionOrder(id: string, format: string, lang: string = "es"): Promise<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}/${id}/report`;
        return this._http.post(uri, { format: format, lang: lang }).toPromise();
    }

    public voidRetentionOrder(orderId: any, reason: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}/${orderId}/cancel`;
        return this._http.patch(uri, { reason });
    }

    public deleteRetentionOrder(orderId: any): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RETENTION_ORDERS}/${orderId}`;
        return this._http.delete(uri);
    }

    //#region  GET CURRENT CONFIGURATION
    public getConfiguration(): Observable<ITRConfiguration> {
        const config = this.getConfigFromLocalStorage();
        if (config) {
            let configAsObservable = new Observable<ITRConfiguration>((observer) => {
                const res = new TRConfiguration(config);
                observer.next(res);
                observer.complete();
            });
            return configAsObservable;
        } else {
            const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION}`;
            return this._http.get(uri).pipe(map((r: any) => new TRConfiguration(r)));
        }
    }

    private getConfigFromLocalStorage() {
        return localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : false;
    }
    //#endregion

    public getFilterStorage() {
        const filter = this.currentFilterCreate ??
            localStorage.getItem(this.KEY_FILTER) ? JSON.parse(localStorage.getItem(this.KEY_FILTER)) as ITRFilter : undefined;
        this.currentFilterCreate = filter
        return this.currentFilterCreate
    }

    public getTagsStorage() {
        const filter = this.currentTagsCreate ??
            localStorage.getItem(this.KEY_TAGS) ? JSON.parse(localStorage.getItem(this.KEY_TAGS)) as Array<ITag> : undefined;
        this.currentTagsCreate = filter
        return this.currentTagsCreate
    }
}
