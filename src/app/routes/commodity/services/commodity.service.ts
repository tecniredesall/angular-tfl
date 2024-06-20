import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URIS_CONFIG } from '../../../shared/config/uris-config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralCommodityModel } from '../models/general-commodity.model';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { ICommodityActionRequestModel } from '../models/commodity-action-request.model';
import { IVarietyCommodityModel, VarietyCommodityModel } from '../models/variety-commodity.model';
import { CommodityTypeModel, ICommodityTypeModel } from '../models/commodity-type.model';
import { ICommodityTypeActionRequestModel } from "../models/commodity-type-action-request.model";
import { CommodityTransformationTypeModel, ICommodityTransformationTypeModel } from '../models/commodity-transformation-type.model';
import { CommodityModel, ICommodityModel } from '../models/commodity.model';
import { UnitMeasureModel } from '../models/unit-measure.model';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Injectable()
export class CommodityService {

  constructor(private _http: HttpClient) { }
  /**
   * get commodity
   */
  public getCommodity(): Observable<Array<ICommodityModel>> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}`;
    return this._http.get(uri).pipe(map(
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
  public getTransformationTypes(): Observable<Array<ICommodityTransformationTypeModel>> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFORMATIONS}?order=name&sort=asc&pagination=0`;
    return this._http.get(uri).pipe(map(
      (result: any) => {
        let response: Array<ICommodityTransformationTypeModel> = null;
        if (result.status) {
          response = [];
          result.data.forEach((item: any) => {
            response.push(new CommodityTransformationTypeModel(item, true));
          });
          response = sortByStringValue(response, 'name');
        }
        return response;
      }
    ));
  }

  public getVarietiesByCommodity(commodityId: number): Observable<Array<IVarietyCommodityModel>> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_VARIETIES_BY_COMMODITY}/${commodityId}`;
    return this._http.get(uri).pipe(map(
      (result: any) => {
        let response: Array<IVarietyCommodityModel> = null;
        if (result.status) {
          response = [];
          result.data.forEach((item: any) => {
            response.push(new VarietyCommodityModel(item, true));
          });
          response = sortByStringValue(response, 'name');
        }
        return response;
      }
    ));
  }
  /**
   * Get commodity types
   * @param id commodity id
   */
  public getCommodityTypes(id: number): Observable<Array<ICommodityTypeModel>> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS}?commodity_id=${id}`;
    return this._http.get(uri).pipe(map(
      (result: any) => {
        let response: Array<ICommodityTypeModel> = null;
        if (result.status) {
          response = [];
          result.data.forEach((item: any) => {
            response.push(new CommodityTypeModel(item, true));
          });
          response = sortByStringValue(response, 'name');
        }
        return response;
      }
    ));
  }
  /**
   * Create commodity
   * @param model commodity to save
   */
  public createCommodity(model: ICommodityActionRequestModel): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}`;
    return this._http.post(uri, model);
  }
  /**
   * Save new commodity type
   * @param data commodity to save
   */
  public createCommodityType(data: Array<ICommodityTypeActionRequestModel>): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS}`;
    return this._http.post(uri, {items: data});
  }
  /**
   * Update comm
   * @param model commodity to edit
   */
  public editCommodity(model: ICommodityActionRequestModel): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}/${model.id}`;
    return this._http.put(uri, model);
  }
  /**
   * Update comm type
   * @param data commodity to edit
   */
  public editCommodityType(data: ICommodityTypeActionRequestModel) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS}/${data.commodity_transformation_id}`;
    return this._http.put(uri, data);
  }
  /**
   * delete commodity
   * @param id id commodity to delete
   */
  public deleteCommodity(id: number): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}/${id}`;
    return this._http.delete(uri);
  }
  /**
   * delete Variety
   * @param id id variety to will be delete
   */
  public deleteVariety(id: string): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_VARIETY}/${id}`;
    return this._http.delete(uri);
  }
  /**
   * delete commodity
   * @param id id commodity to delete
   */
  public deleteCommodityType(id: string): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS}/${id}`;
    return this._http.delete(uri);
  }
  /**
   * get commodities general
   */
  public getCommoditiesGeneral(): Observable<Array<GeneralCommodityModel>> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.GET_COMMODITIES_GENERAL}`;
    return this._http.get(uri).pipe(map(
      (result: any) => {
        let response: Array<GeneralCommodityModel> = null;
        if (result.status) {
          response = [];
          result.data.forEach((item: any) => {
            response.push(new GeneralCommodityModel(item, true));
          });
          response = sortByStringValue(response, 'name');
        }
        return response;
      }
    ));
  }

  public getUnitsMeasurement(): Observable<Array<UnitMeasureModel>> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_UNITS_MEASURE}`;
    return this._http.get(uri).pipe(map(
      (result: any) => {
        let response: Array<UnitMeasureModel> = [];
        result.data.map((item: any) => {
            response.push(new UnitMeasureModel(item));
        });
        response = sortByStringValue(response, 'name');
        return response;
      }
    ));
   }

   public getConfiguration(): Observable<ITRConfiguration> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION}`;
    return this._http.get(uri)
        .pipe(map((result: any) => new TRConfiguration(result)));
  }
}
