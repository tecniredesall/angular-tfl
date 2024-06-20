import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TIProducerModel, TIProducerRequestModel, TProducerModel } from 'src/app/shared/models/sil-producer';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ProducerFederatedModel, IProducerFederatedModel } from '../../models/producer-federated.model';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';

@Injectable({
    providedIn: 'root',
})
export class ProducersService {
    private searchTerm: string;
    public searchTerm$ = new BehaviorSubject<string>('');
    private currentLanguage: string;
    private uri_owner = `${localStorage.getItem('uri-owner')}`;
    private baseProducersUri = `${this.uri_owner}${URIS_CONFIG.API_PRODUCERS}`;
    private baseProducersCsvUri = `${this.uri_owner}${URIS_CONFIG.API_CSV_PRODUCERS}`;

    constructor(
        private http: HttpClient,
        private _paginationService: PaginationService,
        private _i18nService: I18nService
    ) {
        this._i18nService.lang.subscribe((l) => (this.currentLanguage = l));
    }

    public getProducers(
        uri?: string | PageEvent,
        params: any = {}
    ): Observable<TIProducerModel[]> {
        uri = this.getUri(uri);
        return this.http
            .get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(
                map((d: any) => {
                    this._paginationService.setPagination(d.data);
                    return d.data.data.map(d => new TProducerModel(d));
                })
            );
    }
    public getProducersFiltered(params: any) {
        this.searchTerm = params.q;
        this.searchTerm$.next(this.searchTerm);
        return this.getProducers(this.baseProducersUri, params);
    }

    // Will be removed when IProducer is changed to TProducerModel
    public getProducer(id: number): Observable<TIProducerModel> {
        const uri = `${this.baseProducersUri}/${id}`;
        return this.http
            .get(uri)
            .pipe(map((d: any) => d.data.data as TIProducerModel));
    }


    public fetchProducer(id: number): Observable<TProducerModel> {
        const uri = `${this.baseProducersUri}/${id}`;
        return this.http.get(uri).pipe(
            map((result) => {
                let data = result['data']['data'][0];
                let producer: TProducerModel = new TProducerModel(data);
                return producer;
            })
        );
    }

    public getCSVProducers(params: any): Observable<any> {
        params['lang'] = this.currentLanguage;
        return this.http
            .get(this.baseProducersCsvUri, {
                params: new HttpParams({ fromObject: params }),
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(map((r) => r.body));
    }

    public deleteProducer(id: number): Observable<any> {
        const uri = `${this.baseProducersUri}/${id}`;
        return this.http.delete(uri);
    }

    public createProducers(data: TIProducerModel | Partial<TIProducerModel>): Observable<any> {
        return this.http.post(this.baseProducersUri, data);
    }

    public updateProducer(data: any): Observable<any> {
        const uri = `${this.baseProducersUri}/${data.id}`;
        return this.http.put(uri, data);
    }

    private getUri(uri: string | PageEvent) {
        if (typeof uri === 'string' || !uri) {
            uri =
                uri ??
                this._paginationService.getPageUri(null) ??
                this.baseProducersUri;
        } else {
            uri =
                this._paginationService.getPageUri(uri) ??
                this.baseProducersUri;
        }
        return uri as string;
    }

    public searchProducerFederated(identifier: string, email: string, phone: string, phoneCode: string): Observable<IProducerFederatedModel> {
        const url = `${CONSTANTS.API_WORKER_SYNC}/producers/apps`;
        let params: HttpParams = new HttpParams();
        if(identifier) {
            params = params.set('identifier', identifier.replace(/\s/g, ''));
            params = params.set('identifier_name', CONSTANTS.WORKER_SYNC_IDENTIFIER);
        }
        if(email) {
            params = params.set('email', email);
        }
        if(phone) {
            params = params.set('phone', phone.replace(/-/g, ''));
            params = params.set('calling_code', CONSTANTS.INTERNATIONAL_PHONES[phoneCode].PREFIX);
        }
        return this.http.get(url, {params: params}).pipe(map((response: any) => new ProducerFederatedModel(response.data)))
    }

    public validateExistsProducer(producer: TIProducerModel){
        const url = `${this.uri_owner}/web/validate-producer-fields`;
        let body: Partial<TIProducerRequestModel> = {
            email: producer.email,
            population_identifier: producer.identity.replace(/\s/g, ''),
            phone: producer.phone.replace(/-/g, ''),
            calling_code: CONSTANTS.INTERNATIONAL_PHONES[producer.phoneCountry].PREFIX
        };
        return this.http.post(url, body)
    }
}
