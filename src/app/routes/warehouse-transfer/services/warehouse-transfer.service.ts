import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { IUserModel, UserModel } from 'src/app/shared/models/user.model';
import { IWarehouseModel, WarehouseModel } from '../../warehouse/models/warehouse.model';
import { IWarehouseTransferModel, WarehouseTransferModel } from '../models/warehouse-transfer-list.model';

@Injectable({
    providedIn: 'root'
})
export class warehouseTransferService {

    socket: any;
    public searchTerm$ = new BehaviorSubject<string>('');
    private searchTerm: string;

    constructor(private _http: HttpClient) { }


    public createOutputTransfer(data): Observable<any> {
        const path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFER_MOVEMENTS}`;
        return this._http.post(path, data);
    }


    public getWareHouse(param, commodity: string) {
        const params = {
            Type_id: param
        }
        const path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TANK_COMMODITY}/${commodity}`;
        return this._http.get(path, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => (result)));
    }

    public getMovementByID(id: string) {
        const path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFER_MOVEMENTS}/${id}`;
        return this._http.get(path)
    }

    public getWarehouseTransfer(operation_type: string, status: string, pending = true) {

        const params = {
            operation_type,
            status,
            pending
        }
        const path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFER_MOVEMENTS}`;
        return this._http.get(path, { params: new HttpParams({ fromObject: params }) })
    }



    /**
     * get weight notes
     */
    public getWarehouseTransference(
        url?: string,
        params = {}
    ): Observable<{ data: IWarehouseTransferModel[]; paginator: IPaginator }> {
        let uri: string =
            url ??
            `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TRANSFER
            }?`;
        return this._http
            .get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(
                map((response: any) => {
                    let result: {
                        data: IWarehouseTransferModel[];
                        paginator: IPaginator;
                    } = {
                        data: [],
                        paginator: new Paginator(),
                    };
                    result.data = response.data.map(
                        (data: any) => new WarehouseTransferModel(data)
                    );
                    result.paginator = new Paginator(response, true);
                    return result;
                })
            );
    }

    public getWarehouseTransferenceFiltered(params: any) {
        this.searchTerm = params.search;
        this.searchTerm$.next(this.searchTerm);
        return this.getWarehouseTransference(null, params);
    }

    public getUsers(url?: string): Observable<IUserModel[]> {
        let uri: string =
            url ??
            `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_USERS}?`;
        return this._http.get(uri)
            .pipe(map((result: any) => result.data.map((d: IUserModel) => new UserModel(d))));
    }

    public getTanks(url?: string, search?: string, params = {}): Observable<IWarehouseModel[]> {
        let uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TANKS}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) =>  result.data.map((d: IWarehouseModel) => new WarehouseModel(d))));
    }

    public getWarehouseTransferenceByID(id: string) {
        let uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TRANSFER}/${id}`;
        return this._http.get(uri)
            .pipe(map((result: any) => new WarehouseTransferModel(result.data)));
    }

    public reportReceptionNote(id: string, format: string, lang: string = "es"): Promise<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TRANSFER}/${id}/report`;
        return this._http.post(uri, { format: format, lang: lang }).toPromise();
    }

    public deleteWarehouseTransferMovement(id: string, reason: string): Observable<any> {
        const options = {};
        if (reason) {
            options['deletion_reason'] = reason
        }

        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WAREHOUSE_TRANSFER}/${id}/cancel`;
        return this._http.post(uri, options);
    }

}
