import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URIS_CONFIG } from '../../../shared/config/uris-config';
import { Observable } from 'rxjs';
import { IDriverActionRequestModel } from '../models/driver-action-request.model';
import { map } from 'rxjs/operators';
import { DriverListResponseModel, IDriverListResponseModel } from '../models/driver-list-response';

@Injectable()
export class DriversService {

  constructor(private _http: HttpClient) { }

  /**
   * get drivers
   */
  public getDrivers(uri: string, params: any = {}): Observable<IDriverListResponseModel> {
    let path: string = uri ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DRIVERS}`;
    return this._http.get(path, { params: new HttpParams({fromObject: params}) })
      .pipe(
        map(
          (result: any) => {
            let response: IDriverListResponseModel = null;
            if (result.status) {
              response = new DriverListResponseModel(result.data, true);
            }
            return response;
          }
        )
      );

  }

  /**
   * Save new Location
   * @param data Location to save
   */
  public saveDrivers(data: Array<IDriverActionRequestModel>): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DRIVERS}`;
    return this._http.post(uri, { items: data });
  }
  /**
   * Update Location
   * @param model Location to edit
   */
  public editDrivers(data: IDriverActionRequestModel) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DRIVERS}/${data.driver_id}`;
    return this._http.put(uri, data);
  }
  /**
   * delete Location
   * @param id id Location to delete
   */
  public deleteDrivers(id: string): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DRIVERS}/${id}`;
    return this._http.delete(uri);
  }

}
