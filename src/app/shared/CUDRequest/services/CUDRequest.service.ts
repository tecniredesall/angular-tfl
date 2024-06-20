import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URIS_CONFIG } from '../../config/uris-config';

@Injectable({
  providedIn: 'root'
})
export class CUDRequestService {

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient) { }
  /**
   * get all Request
   */
  public getResquest(entity: string): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CUDREQUEST}/${entity}`;
    return this._http.get(uri);
  }
  /**
   * Create new request
   * @param model new request to will be create
   */
  public createResquest(model: any): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CUDREQUEST}`;
    return this._http.post(uri, model);
  }
  /**
   * Update request
   * @param model request to will be update
   */
  public updateResquest(model: any): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CUDREQUEST}`;
    return this._http.put(uri, model);
  }
  /**
   * Delete Request
   * @param idRequest id request to will be delete
   */
  public deleteResquest(idRequest): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CUDREQUEST}/${idRequest}`;
    return this._http.delete(uri);
  }
}
