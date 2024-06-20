import {
    ReceptionNotePurchaseOrderModel,
} from './../models/reception-note-purchase-order.model';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    IWNCharacteristicModel,
    WNCharacteristicModel,
} from '../../weight-note/models/wn-characteristic.model';
import { ContractTrumodityDetailModel } from '../models/contract-tummodity-detail.model';
import { MatchFeatureRequestModel } from '../models/match-feature-request.model';
import { PurchaseOrderDetailModel } from '../models/purchase-order-detail.model';
import { IPurchaseOrderModel, PurchaseOrderModel, RequestResentSettling } from '../models/purchase-order.model';
import { IWeightNoteModel, WeightNoteModel } from '../models/reception-note-purchase-order.model';
import { TIProducerModel, TProducerModel } from 'src/app/shared/models/sil-producer';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Injectable({
    providedIn: 'root',
})
export class PurchaseOrdersService {
    public searchTerm$ = new BehaviorSubject<string>('');
    private searchTerm: string;

    constructor(private _http: HttpClient) {}
    public getCharacteristics(
        params?: string | Array<string>
    ): Observable<Array<IWNCharacteristicModel>> {
        let path: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_CHARACTERISTICS
        }`;
        if (params) {
            path = `${path}?view_in[]=${params}`;
        }
        return this._http.get(path).pipe(
            map((result: any) => {
                let response: Array<IWNCharacteristicModel> = [];
                result.data.forEach((item: any) => {
                    response.push(new WNCharacteristicModel(item, true));
                });
                return sortByStringValue(response, 'name');
            })
        );
    }

    public getContractsCharacteristics(contractId: string): Observable<any> {
        let path: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_CONTRACT_CHARACTERISTICS
        }/${contractId}`;
        return this._http.get(path);
    }

    public matchContractFeatures(
        matchModel: MatchFeatureRequestModel
    ): Observable<any> {
        let path: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_CONTRACT_CHARACTERISTICS
        }`;
        return this._http.post(path, matchModel);
    }

    public resendSettlement(requestResent: RequestResentSettling ): Observable<any> {
            let path: string = `${CONSTANTS.API_WORKER_SYNC}${URIS_CONFIG.API_PURCHASE_ORDERS_RESENT_SETTLEMENT
        }`;
        return this._http.post(path, requestResent);
    }


    public getWeightNotes(url: string, params: any, producerId: number, date: moment.Moment, commodityId: number): Observable<any> {
        let formatDate = moment(date).endOf('day').utc().format("YYYY-MM-DD HH:mm:ss");
        let path =
            url ??
            `${localStorage.getItem('uri-owner')}${
                URIS_CONFIG.API_PURCHASE_ORDERS_WEIGHT_NOTES
            }/${producerId}`;
        params.date = formatDate;
        params.commodity_id = commodityId;
        return this._http
            .get(path, {
                params: new HttpParams({ fromObject: params }),
            })
            .pipe(
                map((response: any) => {
                    let result: {
                        data: ReceptionNotePurchaseOrderModel[];
                        paginator: IPaginator;
                    } = {
                        data: [],
                        paginator: new Paginator(),
                    };
                    result.data = response.data.map(
                        (d: any) => new ReceptionNotePurchaseOrderModel(d, 0.01)
                    );
                    result.paginator = new Paginator(response, true);
                    return result;
                })
            );
    }

    public getPurchaseOrdersFiltered(uri,params: any) {
        this.searchTerm = params.search;
        this.searchTerm$.next(this.searchTerm);
        return this.getPurchaseOrders(uri,  params);
    }

    public getPurchaseOrders(
        uri: string,
        params: any
    ): Observable<{ data: IPurchaseOrderModel[]; pagination: IPaginator }> {
        let path: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS
        }`;
        uri = uri ?? path;
        if (params?.date_init) {
            params.date_init = moment(params.date_init)
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
        }
        if (params?.date_end) {
            params.date_end = moment(params.date_end)
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
        }
        return this._http
            .get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(
                map((result: any) => {
                    let response: {
                        data: IPurchaseOrderModel[];
                        pagination: IPaginator;
                    } = { data: [], pagination: null };
                    response['data'] = result.data.map(
                        (d: any) => new PurchaseOrderModel(d)
                    );
                    response['pagination'] = new Paginator(result, true);
                    return response;
                })
            );
    }
    public deletePurchaseOrder(id: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS
        }/${id}`;
        return this._http.delete(uri);
    }

    public getPurchaseOrder(id: string): Observable<PurchaseOrderModel> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS_DETAIL
        }/${id}`;
        return this._http
            .get(uri)
            .pipe(map((r: any) => new PurchaseOrderModel(r.data)));
    }
    public getContractsByProducer(
        prod_id: string
    ): Observable<TIProducerModel> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_CONTRACTS_BY_PRODUCER
        }?producer_id=${prod_id}`;

        return this._http
            .get(uri)
            .pipe(map((r: any) => r.data as TIProducerModel));
    }
    public getPurchaseOrdersCSV(params: any, lang: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS_CSV
        }`;
        if (params?.date_init) {
            params.date_init = moment(params.date_init)
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
        }
        if (params?.date_end) {
            params.date_end = moment(params.date_end)
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
        }
        params.lang = lang;
        return this._http
            .get(uri, {
                params: new HttpParams({ fromObject: params }),
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(map((r) => r.body));
    }
    public getPurchaseOrderPDF(id: string, lang: string) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS_PDF
        }/${id}`;

        return this._http.post(uri, {
            lang,
            format: 'pdf',
        });
    }

    public postPurchaseOrder(order: any) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS
        }`;
        return this._http.post(uri, order);
    }

    public putPurchaseOrder(order: any) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS
        }/${order.id}`;
        return this._http.put(uri, order);
    }

    public getConfiguration(): Observable<ITRConfiguration> {
        const config = this.getConfigFromLocalStorage();
        if(config){
            let configAsObservable = new Observable<ITRConfiguration>((observer) => {
                const res = new TRConfiguration(config);
                observer.next(res);
                observer.complete();
            });
            return configAsObservable;
        }else{
            const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION}`;
            return this._http.get(uri).pipe(map((r: any) => new TRConfiguration(r)));
        }
    }

    private getConfigFromLocalStorage(){
        return localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : false;
    }

    public getPurchaseOrderDetail(
        id: string
    ): Observable<PurchaseOrderDetailModel> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS_DETAIL
        }/${id}`;
        return this._http
            .get(uri)
            .pipe(map((r: any) => new PurchaseOrderDetailModel(r.data)));
    }
    public getCompanyInfo(): Observable<any> {
        const path: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_GET_CONFIG_COMPANY_INFO
        }`;
        return this._http.get(path);
    }

    public getContractDetail(id: string) {
        const path = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS_CONTRACTS
        }/${id}`;
        return this._http
            .get(path)
            .pipe(map((r: any) => new ContractTrumodityDetailModel(r.data)));
    }
    public settlePurchaseOrder(data: any, orderId: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS
        }/${orderId}/settle`;
        return this._http.post(uri, data);
    }

    public getWeightNoteByScan(
        producerId: number,
        code: number,
        queryParams: any
    ): Observable<IWeightNoteModel> {
        const path: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS_WEIGHT_NOTES
        }/${producerId}/${code}`;
        if (queryParams?.date) {
            queryParams.date = moment(queryParams.date)
                .utc()
                .format('YYYY-MM-DD HH:mm:ss');
        }
        return this._http
            .get(path, {
                params: new HttpParams({ fromObject: queryParams }),
            })
            .pipe(
                map((response: any) => new WeightNoteModel(response.data, 0.01))
            );
    }

    public deletePurchaseOrdersWeigthNote(id: string) {
        const url = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PURCHASE_ORDERS_WEIGHT_NOTES
        }/${id}`;
        return this._http.delete(url);
    }

    public getProducers( uri: string, params: any = {} ): Observable<{ data: TProducerModel[], paginator: IPaginator }> {
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

    public getProducersFiltered(params: any) {
        this.searchTerm = params.q;
        this.searchTerm$.next(this.searchTerm);
        return this.getProducers(null, params);
    }
}
