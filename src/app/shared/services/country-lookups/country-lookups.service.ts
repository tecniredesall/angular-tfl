import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URIS_CONFIG } from '../../config/uris-config';
import { PaginationModel } from '../../utils/models/paginator.model';
import { PaginationService } from '../pagination/pagination.service';
import { IPaginator, Paginator } from '../../models/paginator.model';

@Injectable({
    providedIn: 'root',
})
export class CountryLookupsService {
    private uri_owner = `${localStorage.getItem('uri-owner')}`;
    private baseCountriesUri = `${this.uri_owner}${URIS_CONFIG.API_COUNTRIES_LOOKUP}`;
    private formByCountry = `${this.uri_owner}${URIS_CONFIG.API_FORM_ADDRESS}`;
    private countries = null;
    constructor(
        private http: HttpClient
    ) { }

    public getCountries(): Observable<any[]> {
        return this.countries ? of(this.countries) : this.http
            .get(`${this.baseCountriesUri}`)
            .pipe(map((r: any) => {
                this.countries = r.data;
                return this.countries;
            }));
    }

    public getFormCountry( countryId: string ) {
        let params = new HttpParams();
        params = params.append('id_column', countryId);
        return this.http.get(this.formByCountry, { params } )
    }

    public getCatalog( url: string, page: number, search?: string ): Observable<{data: any[], paginator: IPaginator}> {
        let params = new HttpParams();
        params = params.append('page', page);
        if(search) {
            params = params.append('q', search.toLowerCase() )
        }
        return this.http.get( `${this.uri_owner}${url}`, { params } )
            .pipe(map( (result: any) => {
                let data: any[] = result.data;
                let paginator = new Paginator(result, true);
                return { data, paginator}
            }));
    }

    public getItemFromCatalog( url: string ): Observable<any> {
        return this.http.get( `${this.uri_owner}${url}` )
            .pipe(map( (result: any) => result.data));
    }
}
