import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from '../../config/uris-config';
import { IWeighingTableConfigurationModel, WeighingTableConfigurationModel } from '../../models/weighing-table-configuration.model';
import { CONSTANTS } from '../../utils/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {

  public companyInfoValues: any;
  public weighingTableConfig: any;

  constructor(
    private _http: HttpClient
  ) { }

  public getCompanyInfo(): Observable<any[]> {
    return this.companyInfoValues ?
      of(this.companyInfoValues) :
      this._http.get(`${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_GET_CONFIG_COMPANY_INFO}`)
        .pipe(map((response: any) => {
          this.companyInfoValues = response?.data.config;
          return this.companyInfoValues;
        }));
  }

  public getConfigWeighingTable(component: string): Observable<IWeighingTableConfigurationModel> {
    return this.weighingTableConfig ?
      of( new WeighingTableConfigurationModel(this.weighingTableConfig.value[component]) ) :
      this._http.get(`${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_GET_CONFIG_COMPANY_INFO}`)
        .pipe(map((response: any) => {
          this.weighingTableConfig = response?.data.config.find((c: any) => c.id === CONSTANTS.CONFIGURATION_WEIGHING_TABLE_ID);
          const weighingTableConfiguration = new WeighingTableConfigurationModel(this.weighingTableConfig.value[component]);
          return weighingTableConfiguration;
        }));
  }
}
