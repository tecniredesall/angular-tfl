import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URIS_CONFIG } from '../../../shared/config/uris-config';
import { Observable } from 'rxjs';
import { ITrucksModel, TrucksModel, TruksRequestModel } from '../models/trucks.model';
import { map } from 'rxjs/operators';
import { IVehicleTypeModel, VehicleTypeModel } from '../models/vehicle-type.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';

@Injectable()
export class TrucksService {

    // tslint:disable-next-line: variable-name
    constructor(private _http: HttpClient) { }
    /**
     * get trucks
     */
    public getTrucks(url: string, params: any = {}): Observable<{paginator: IPaginator, data: ITrucksModel[]}> {
        let uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRUCKS}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => {
                let paginator = new Paginator(result.data, true);
                let data = (result.data.data as Array<any>).map((item: any) => new TrucksModel(item));
                return {paginator, data}
            }));
    }
    /**
     * Save new Location
     * @param model Location to save
     */
    public saveTrucks(model: any): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRUCKS}`;
        return this._http.post(uri, model);
    }
    /**
     * Update Location
     * @param model Location to edit
     */
    public editTrucks(model: TruksRequestModel) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRUCKS}/${model.truck_id}`;
        return this._http.put(uri, model);
    }
    /**
     * delete Location
     * @param id id Location to delete
     */
    public deleteTrucks(id: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRUCKS}/${id}`;
        return this._http.delete(uri);
    }
    public getVehicleType(): Observable<Array<IVehicleTypeModel>> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_VEHICLE_TYPES}`;
        return this._http.get(uri).pipe(
            map((result: any) => {
                return result ? (result.data as Array<any>).map(item => new VehicleTypeModel(item)) : []
            })
        );

    }
}
