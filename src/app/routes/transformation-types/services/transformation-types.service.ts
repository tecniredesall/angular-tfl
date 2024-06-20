import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransformationTypesModel } from 'src/app/shared/utils/models/transformation-types.model';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URIS_CONFIG } from '../../../shared/config/uris-config';

@Injectable()
export class TransformationTypesService {
    private _transformations: TransformationTypesModel[];
    get transformations(): TransformationTypesModel[] {
        return this._transformations;
    }
    // tslint:disable-next-line: variable-name
    constructor(private _http: HttpClient) {}
    /**
     * get transformation-types
     */
    public getTransformationTypes(uri: string) {
        return this._http
            .get(uri)
            .pipe(tap((d: any) => (this._transformations = d.data.data)));
    }
    /**
     * Save new Location
     * @param model Location to save
     */
    public saveTransformationTypes(model: any): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_TRANSFORMATIONS
        }`;
        return this._http.post(uri, model);
    }
    /**
     * Update Location
     * @param model Location to edit
     */
    public editTransformationTypes(model: TransformationTypesModel) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_TRANSFORMATIONS
        }/${model.transformation_type_id}`;
        return this._http.put(uri, model);
    }
    /**
     * delete Location
     * @param id id Location to delete
     */
    public deleteTransformationTypes(id: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_TRANSFORMATIONS
        }/${id}`;
        return this._http.delete(uri);
    }
}
