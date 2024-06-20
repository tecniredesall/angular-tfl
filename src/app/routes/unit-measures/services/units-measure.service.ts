import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URIS_CONFIG } from '../../../shared/config/uris-config';
import { UnitMeasureModel } from '../models/unit-measure.model';

@Injectable()
export class UnitMeasuresService {
    private _unitMeasures: UnitMeasureModel[];
    get unitMeasures(): UnitMeasureModel[] {
        return this._unitMeasures;
    }
    constructor(private _http: HttpClient) {}
    /**
     * Load all unit measures from API
     */
    public getUnitMeasures() {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_UNITS_MEASURE
        }`;
        return this._http
            .get(uri)
            .pipe(tap((u: any) => (this._unitMeasures = u.data)));
    }
    public getAreaUnitMeasures() {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_UNITS_MEASURE
        }?measurement_type=2`;
        return this._http
            .get(uri)
            .pipe(tap((u: any) => (this._unitMeasures = u.data)));
    }
    /**
     * Save new Unit Measurenment
     * @param model Unit Measurenment to save
     */
    public saveUnitMeasure(model: UnitMeasureModel): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_UNITS_MEASURE
        }`;
        return this._http.post(uri, model);
    }
    /**
     * Update Unit Measurenment
     * @param model Unit Measurenment to edit
     */
    public editUnitMeasure(model: UnitMeasureModel) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_UNITS_MEASURE
        }/${model.measurement_unit_id}`;
        return this._http.put(uri, model);
    }
    /**
     * delete Unit Measurenment
     * @param id id Unit Measurenment to delete
     */
    public deleteUnitMeasure(id: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_UNITS_MEASURE
        }/${id}`;
        return this._http.delete(uri);
    }
    /**
     * delete Unit Measurenment
     * @param id id Unit Measurenment to delete
     */
    public deleteConvertion(id: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_REMOVE_CONVERTION
        }?id=${id}`;
        return this._http.post(uri, null);
    }
}
