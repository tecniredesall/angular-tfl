import { FarmFederateModel, IFarmFederateModel } from './../models/farm-federate.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { sortBykey } from 'src/app/shared/utils/functions/sortFunction';
import { TFarmModel, TIFarmModel } from '../models/farm.model';
import { TIRequestActionFarmModel } from '../models/request-action-farm.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FarmService {

    constructor(
        private http: HttpClient
    ) { }

    public createFarm(data: Array<TIRequestActionFarmModel>) {
        let uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCERS_FARMS}`;
        return this.http.post(uri, { items: data });
    }

    public updateFarm(data: TIRequestActionFarmModel) {
        let uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCERS_FARMS}/${data.id}`;
        return this.http.put(uri, { items: [data] });
    }

    public deleteFarm(id: number) {
        let uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCERS_FARMS}/${id}`
        return this.http.delete(uri);
    }

    public fetchFarm(id: number): Promise<TFarmModel> {
        let uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCERS_FARMS}/${id}`
        return this.http.get(uri)
            .pipe(
                map(
                    result => {
                        let data = result['data'][0]
                        let farm: TFarmModel = new TFarmModel(data);
                        return farm;
                    }
                )
            ).toPromise();
    }

    public getFarmsByProducer(producerId: number): Observable<Array<TIFarmModel>> {

        let uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_FARMS_BY_PRODUCER}/${producerId}`

        return this.http.get(uri)
            .pipe(
                map(
                    (result: any) => {

                        let data: Array<any> = result[0].farms;

                        let farms: Array<TIFarmModel> = [];

                        data.forEach((f: any) => {
                            farms.push(new TFarmModel(f));
                        });

                        return sortBykey(farms, 'name');

                    }
                )
            );
    }
    /**
     *
     * @param identifier
     * @param email
     * @param phone
     * @param phoneCode
     * @returns
     */
    public getFarmFederatedByProducer(identifier: string, email: string, phone: string, phoneCode: string): Observable<Array<IFarmFederateModel>> {
        const url = `${environment.API_WORKER_SYNC}/farms/apps`;
        let params: HttpParams = new HttpParams();
        if (identifier) {
            params = params.set('identifier', identifier.replace(/\s/g, ''));
            params = params.set('identifier_name', CONSTANTS.WORKER_SYNC_IDENTIFIER);
        }
        if (email) {
            params = params.set('email', email);
        }
        return this.http.get(url, { params: params })
            .pipe(
                map(
                    (response: any) => {
                        let data: Array<any> = response.data;
                        let farms: Array<IFarmFederateModel> = [];
                        data.forEach(d => {
                            d.apps.forEach(element => {
                                 if (element.code !== CONSTANTS.FEDERATE_APPS_CODE.SILOSYS) {
                                    farms.push(new FarmFederateModel(d.federated_id, element));
                                 }
                            });
                        });
                        return farms;
                    }
                )
            )

    }
}
