import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { IProducerModel, ProducerModel } from 'src/app/shared/models/producer.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginator, Paginator } from '../../models/paginator.model';
import { IUserModel, UserModel } from 'src/app/shared/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class ProducerService {
    constructor(
        private http: HttpClient
    ) {}

    public getProducers( uri: string, params: any = {} ): Observable<{ data: IProducerModel[], paginator: IPaginator }> {
        let path: string = uri ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCERS_WITH_FARMS}`;
        return this.http
            .get(path, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((r: any) => {
                let response: { data: IProducerModel[], paginator: IPaginator } = { data: [], paginator: new Paginator() };
                response['data'] = r.data.data.map((d: any) => new ProducerModel(d));
                response['paginator'] = new Paginator(r, true);
                return response
            })
            );
    }

    public getUsers(url?: string): Observable<{ data: UserModel[], paginator: IPaginator }> {
        let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_USERS}?`;
        return this.http.get(uri)
        .pipe(map((r: any) => {
            let response: { data: UserModel[], paginator: IPaginator } = { data: [], paginator: new Paginator() };
            response['data'] = r.data.map((d: any) => new UserModel(d));
            response['paginator'] = new Paginator(r, true);
            return response

            }));
    }

}
