import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URIS_CONFIG } from '../../shared/config/uris-config';
import { SealModel } from '../../shared/utils/models/seal.model';
import { CertificationFarmsModel } from './models/certification-farms.model';
import { ISealListResponseModel, SealListResponseModel } from './models/seal-list-response';
import {
    ISealProducerPaginatorModel, SealProducerModel, SealProducerPaginatorModel
} from './models/seal-producer.model';
import { ResponseSealsModel } from './models/seal-response.model';

@Injectable({
    providedIn: 'root',
})
export class SealsService {
    constructor(private http: HttpClient) {}
    /**
     * create new seal
     * @param seal model to add
     */

    public createSeal(seal: SealModel) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_CERTIFICATION
        }`;
        return this.http.post(uri, seal);
    }

    /**
     * Get availables seals
     */
    public getSeals(
        uri: string,
        params?: any
    ): Observable<ISealListResponseModel> {
        let opts: any = {};
        if (null == uri) {
            uri = `${localStorage.getItem('uri-owner')}${
                URIS_CONFIG.API_CERTIFICATION
            }`;
            opts = { params: new HttpParams({ fromObject: params }) };
        }
        return this.http.get(uri, opts).pipe(
            map((result: any) => {
                let response: ISealListResponseModel = null;
                if (result.status) {
                    response = new SealListResponseModel(result.data);
                }
                return response;
            })
        );
    }

    /**
     * Get seal
     */

    public getSeal(id: string): Observable<ResponseSealsModel> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_CERTIFICATION
        }/${id}`;
        return this.http.get<ResponseSealsModel>(uri);
    }

    public getProductorFarms(id: string): Observable<CertificationFarmsModel> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.CERTIFICATION_FARMS
        }/${id}`;
        return this.http.get<CertificationFarmsModel>(uri);
    }
    /**
     * Update new tank
     * @param seal model to edit
     */

    public updateSeal(seal: SealModel) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_CERTIFICATION
        }/${seal.certification_id}`;
        return this.http.put(uri, seal);
    }

    public deleteSeal(id: string) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_CERTIFICATION
        }/${id}`;
        return this.http.delete(uri);
    }

    public getSellers(
        page: number,
        search?: string
    ): Observable<ISealProducerPaginatorModel> {
        let uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PRODUCERS_WITH_FARMS
        }?`;
        if (search) {
            uri = uri + `q=${search}`;
        } else {
            uri = uri + `page=${page}`;
        }
        return this.http.get(uri).pipe(
            map((result: any) => {
                let response: ISealProducerPaginatorModel = null;
                if (result.status) {
                    response = new SealProducerPaginatorModel();
                    response.lastPage = result.data.last_page;
                    result.data.data.forEach((item: any) => {
                        response.producers.push(
                            new SealProducerModel(item, true)
                        );
                    });
                }
                return response;
            })
        );
    }

    addRelatedFarms(data) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.CERTIFICATION_FARMS
        }`;
        return this.http.post(uri, data);
    }

    discardFarmFromSeal(sealId: string, farmId: string) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.CERTIFICATION_FARMS
        }/${sealId}?farm_id=${farmId}`;
        return this.http.delete(uri);
    }
}
