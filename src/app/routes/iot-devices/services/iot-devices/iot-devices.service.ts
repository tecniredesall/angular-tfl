import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { ISocketConfig } from 'src/app/shared/models/socket-config';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IotDeviceBrand } from '../../models/iot-device-brand.model';
import { IotDevicesModel } from '../../models/iot-devices.model';
import { IIoTRecord, IoTRecord } from '../../models/iot-record.model';

@Injectable({
    providedIn: 'root',
})
export class IotDevicesService {
    constructor(private _http: HttpClient) {}

    public getIotDevicesConfiguration(): Observable<ISocketConfig> {
        const path: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_GET_CONFIG_COMPANY_INFO
        }`;
        return this._http.get(path).pipe(
            map((r: any) => {
                const config = r.data.config;
                const url = config.find(
                    (i) => i.name === CONSTANTS.SCALE_SOCKET_CONFIG_KEYS.URL
                );
                const port = config.find(
                    (i) => i.name === CONSTANTS.SCALE_SOCKET_CONFIG_KEYS.PORT
                );

                return {
                    url: url.value,
                    port: port.value,
                };
            })
        );
    }

    public getIotDevices(
        uri: string,
        params: any
    ): Observable<{ data: IotDevicesModel[]; pagination: IPaginator }> {
        let path: string =
            uri ??
            `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_IOTS}`;
        return this._http
            .get(path, { params: new HttpParams({ fromObject: params }) })
            .pipe(
                map((r: any) => {
                    let response: {
                        data: IotDevicesModel[];
                        pagination: IPaginator;
                    } = { data: [], pagination: new Paginator() };
                    response['data'] = r.data.map(
                        (d: any) => new IotDevicesModel(d)
                    );
                    response['pagination'] = new Paginator(r, true);
                    return response;
                })
            );
    }

    public exportIotDevicess(params: any): Observable<any> {
        let path: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS
        }/export`;
        return this._http
            .get(path, {
                params: new HttpParams({ fromObject: params }),
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(map((r) => r.body));
    }

    /**
     * Get scales by user
     * @param path for request
     * @returns observable object with data IotDevicess
     */
    public getScalesByUser(): Observable<IIoTRecord[]> {
        let uri: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS_USER_LIST
        }?device_type=scale`;
        return this._http.get(uri).pipe(
            map((response: any) => {
                return response.data.map((w: any) => new IoTRecord(w, true));
            })
        );
    }

    /**
     * Method invocked for change default IotDevices by user
     * @param data to request
     * @returns
     */
    public setDefaultIotDevicesByUser(data: any): Observable<any> {
        let uri: string = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_PROFILE_SETTINGS
        }`;
        return this._http.post(uri, data);
    }

    public getIotDevicesDetail(id: string): Observable<IotDevicesModel> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS
        }/${id}`;
        return this._http
            .get(uri)
            .pipe(map((r: any) => new IotDevicesModel(r.data)));
    }

    public getIotDevicesUsers(): Observable<AppUser[]> {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_USERS
        }`;
        return this._http
            .get(uri)
            .pipe(map((r: any) => r.data.map((u: any) => new AppUser(u))));
    }

    public postIotDevices(IotDevices: any) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS
        }`;
        return this._http.post(uri, IotDevices);
    }

    public putIotDevices(IotDevices: any) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS
        }/${IotDevices.id}`;
        return this._http.put(uri, IotDevices);
    }

    public patchIotDevicesStatus(id: string) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS
        }/${id}`;
        return this._http.patch(uri, id);
    }

    public deleteIotDevices(id: string) {
        const uri = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS
        }/${id}`;
        return this._http.delete(uri);
    }

    public getSortMachinesByUser() {
        const path = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS_USER_LIST
        }?device_type=sorter-machine`;
        return this._http.get(path).pipe(
            map((response: any) => {
                return response.data.map((w: any) => new IoTRecord(w, true));
            })
        );
    }

    public getIotDeviceBrands(type: string) {
        const devType = type ? `device_type=${type}` : '';
        const path = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS_BRANDS
        }?${devType}`;
        return this._http.get(path).pipe(
            map((r: any) => {
                return r.data.map((b) => new IotDeviceBrand(b));
            })
        );
    }

    public getAvailableIps(values: string[]): Observable<string[]> {
        const path = `${localStorage.getItem('uri-owner')}${
            URIS_CONFIG.API_IOTS_AVAILABLE_TO_CREATE
        }`;
        const payload = {
            connected_devices: values
        }

        return this._http.post(path, payload).pipe(map((r: any) => r.data));
    }
}
