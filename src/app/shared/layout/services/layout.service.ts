import { URIS_CONFIG } from './../../config/uris-config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { CompanyInfoModel } from '../models/company-info.model';
import { IdleService } from '../../services/idle/idle.service';

@Injectable()
export class LayoutService {
  public isMobile: boolean = window.innerWidth < 540;
  showDescMenu: boolean = window.innerWidth >= 540;
  showIconMenu: boolean = window.innerWidth >= 540;

  public season: Subject<any> = new Subject();
  public languaje: Subject<any> = new Subject();
  public metric: Subject<any> = new Subject();
  public company: Subject<any> = new Subject();
  public header: Subject<any> = new Subject();
  public hideLayout: Subject<any> = new Subject();
  public application: Subject<any> = new Subject();
  public applicationModule: Subject<any> = new Subject();
  /**
   * ctr
   * @param _http http client
   */
  // tslint:disable-next-line: variable-name
  constructor(
    private _http: HttpClient,
    private _idleService: IdleService
  ) {}

  /**
   * change season model
   * @param season season to change
   */
  public setSeasson(season: string): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SEASON}`;
    const model = { selTemp: season };
    return this._http.post(uri, model);
  }
  /**
   * logout session
   */
  public logout(): Observable<any> {
    this._idleService.onDestroyIdle();
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.SIGN_OUT}`;
    return this._http.post(uri, null);
  }
  /**
   * Get company info
   */
  public getCompanyInfo(): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.GET_COMPANY_INFO}`;
    return this._http.get(uri);
  }
  /**
   * Create company info
   */
  public createCompanyInfo(companyInfo: CompanyInfoModel): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMPANY_INFO}`;
    return this._http.post(uri, companyInfo);
  }
  /**
   * get available location
   */
  public getLocation(): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.GET_LOCATION}`;
    return this._http.get(uri);
  }
}
