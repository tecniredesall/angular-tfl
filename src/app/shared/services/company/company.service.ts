import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from '../../config/uris-config';
import { CompanyModel, ICompanyModel, ICompanyRequestModel } from '../../models/company.model';
import { IPaginator, Paginator } from '../../models/paginator.model';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(
        private _http: HttpClient
    ) { }

    public postCompany(company: ICompanyRequestModel) {
        let url: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSPORT_COMPANY}`;
        return this._http.post(url, company)
    }

    public getTransportCompanies(url?: string): Observable<{data: ICompanyModel[], paginator: IPaginator}> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSPORT_COMPANY}`;
        return this._http.get(uri).pipe(map((result: any) => {
            let data = result.data.data.map(d => new CompanyModel(d));
            let paginator = new Paginator(result.data, true)
            return {data, paginator}
        }));
    }
}
