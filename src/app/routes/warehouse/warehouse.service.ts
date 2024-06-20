import { IProdExternalWarehouseModel, ProdExternalWarehouseModel } from './models/prod-external-warehouse.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URIS_CONFIG } from '../../shared/config/uris-config';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { WarehouseModel } from './models/warehouse.model';
import { SubtankModel } from './models/subtank.model';
import { TypeTankModel } from './models/type-tanks';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { CommodityModel, ICommodityModel } from '../commodity/models/commodity.model';

@Injectable({
    providedIn: 'root'
})
export class WarehouseService {
    private typeTanks = null;
    constructor(
        private http: HttpClient
    ) { }

    public getTanks(url?: string, search: string = '', params = {}): Observable<any> {
        let uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TANKS}`;
        if (search != '') {
            uri = `${uri}q=${search}`
        }
        return this.http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(
                map(
                    (response: any) => {
                        let data: Array<any> = response.data;
                        response.data = data.map(d => new WarehouseModel(d))
                        return response
                    }
                )
            )
    }

    getMeasurementUnit() {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_UNITS_MEASURE}`;
        return this.http.get(uri);
    }

    public getConfiguration(): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION}`;
        return this.http.get(uri);
    }

    getTank(id: string) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.WAREHOUSE_TANKS}/${id}`;
        return this.http.get(uri);
    }

    getSubtanks(tankId: number): Observable<SubtankModel[]> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_VIRTUAL_TANKS}/${tankId}`;
        return this.http.get(uri)
            .pipe(
                map(
                    (result: Array<any>) => {
                        let subtanks: SubtankModel[] = result.map(r => new SubtankModel(r))
                        return subtanks
                    }
                )
            )
    }

    getSubtank(subTankId: string) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SUBTANK}/${subTankId}`;
        return this.http.get(uri);
    }

    postTanks(tanks) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.WAREHOUSE_TANKS}`;
        return this.http.post(uri, tanks);
    }

    putTank(tank) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.WAREHOUSE_TANKS}/${tank.tank_id}`;
        return this.http.put(uri, tank);
    }

    postVirtualTanks(tanks) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TANKS}`;
        return this.http.post(uri, tanks);
    }

    putVirtualTanks(tank) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TANKS}/${tank.production_tank_id}`;
        return this.http.put(uri, tank);
    }

    getTransformationsTypes() {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFORMATION_TYPES}`;
        return this.http.get(uri);
    }

    deleteTank(id: string) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.WAREHOUSE_TANKS}/${id}`;
        return this.http.delete(uri);
    }

    deleteSubTank(id: string) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TANKS}/${id}`;
        return this.http.delete(uri);
    }

    getUnits() {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_UNITS_MEASURE}`;
        return this.http.get(uri);
    }

    getDefaultUnit(tankId: string | number) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.VIRTUAL_TANKS_MEASUREMENT_ID}/${tankId}`;
        return this.http.get(uri);
    }
    getExternals(): Observable<Array<IProdExternalWarehouseModel>> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSES_EXTERNAL}`;
        return this.http.get(uri)
            .pipe(
                map(
                    (result: any) => {
                        let subtanks: IProdExternalWarehouseModel[] = result.data.map(r => new ProdExternalWarehouseModel(r))
                        return subtanks
                    }
                )
            )
    }

    getTypeTanks(): Observable<TypeTankModel[]> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TANKS_TYPES}`;
        return this.typeTanks ? of(this.typeTanks) : this.http.get(uri)
            .pipe(
                map(
                    (result: any) => {
                        this.typeTanks = result.data.map(r => new TypeTankModel(r))
                        return this.typeTanks
                    }
                )
            )
    }

    public getCommodity(): Observable<Array<ICommodityModel>> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}`;
        return this.http.get(uri).pipe(map(
            (result: any) => {
                let response: Array<ICommodityModel> = null;
                if (result.status) {
                    response = [];
                    result.data.forEach((item: any) => {
                        response.push(new CommodityModel(item, true));
                    });
                    response = sortByStringValue(response, 'name');
                }
                return response;
            }
        ));
    }
}
