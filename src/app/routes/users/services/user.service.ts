import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URIS_CONFIG } from '../../../shared/config/uris-config';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient) { }
  /**
   * get users
   */
  public getUsers(uri): Observable<any> {
    return this._http.get(uri);
  }
  /**
   * get permisiions array
   */
  public getPermisions(): Observable<any> {
    const uri =
      `${localStorage.getItem('uri-owner')}${URIS_CONFIG.GET_PERMISSIONS}lang=${localStorage.getItem('lang')}`;
    return this._http.get(uri);
  }
  /**
   * Save new user
   * @param model user
   */
  public saveUser(model: UserModel): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_USERS}`;
    return this._http.post(uri, model);
  }
  /**
   * Edit user
   * @param model user to edit
   */
  public editUser(model: UserModel): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_USERS}/${model.id}`;
    return this._http.put(uri, model);
  }
  /**
   * delete user
   * @param id id user to delete
   */
  public deleteUser(id: number): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_USERS}/${id}`;
    return this._http.delete(uri);
  }
  /**
   * Add grant
   * @param model security model
   */
  public addGrant(model: any): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SECURITY}`;
    return this._http.post(uri, model);
  }
  /**
   * update grant
   * @param model security model
   */
  public updateGrant(model: any): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SECURITY}`;
    return this._http.post(uri, model);
  }
  /**
   * remove grant
   * @param model security model
   */
  public removeGrant(model: any): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SECURITY}`;
    return this._http.post(uri, model);
  }
}
