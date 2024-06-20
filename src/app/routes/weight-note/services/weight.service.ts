import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URIS_CONFIG } from '../../../shared/config/uris-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { IWNRequestActionReceivingNoteModel } from '../models/wn-request-action-receiving-note.model';
import { IReceivingNoteModel, ReceivingNoteModel } from '../models/receiving-note.model';
import { IWNRequestChangeStatusModel } from "../models/wn-request-change-status.model";
import { IWNFarmModel, WNFarmModel } from '../models/wn-farm.model';
import { IWNCommodityModel, WNCommodityModel } from '../models/wn-commodity.model';
import { IWNCommodityTypeModel, WNCommodityTypeModel } from '../models/wn-commodity-type.model';
import { IWNCommodityTransformationModel, WNCommodityTransformationModel } from '../models/wn-commodity-transformation.model';
import { IWNContainerModel, WNContainerModel } from '../models/wn-container.model';
import { IWNBlockModel, WNBlockModel } from '../models/wn-block.model';
import { IWNCharacteristicModel, WNCharacteristicModel } from '../models/wn-characteristic.model';
import { IWNDriverListPaginatorModel, WNDriverListPaginatorModel } from '../models/wn-driver-list-paginator.model';
import { IWNSellerListPaginatorModel, WNSellerListPaginatorModel } from '../models/wn-seller-list-paginator.model';
import { IWNTruckListPaginatorModel, WNTruckListPaginatorModel } from '../models/wn-truck-list-paginator.model';
import { IWNDeductionsTradingModel } from '../models/wn-request-deductions-trading.model';
import { IWNSeasonModel, WNSeasonModel } from "../models/wn-season.model";
import * as moment from 'moment';
import { IContractTrumodityModel, ContractTrumodityModel } from '../../purchase-orders/models/contract-trumodity.model';
import { IWCompanyInfoModel, WCompanyInfoModel } from '../models/company-info.model';
import { IReceivingNoteListModel, ReceivingNoteListModel } from '../models/receiving-note-list.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { IWNProductionModel, WNProductionModel } from '../models/wn-production.model';
import { IReceivingCloseUpdateRequestModel } from '../models/receiving-close-update-request.model';
import { IWNConfigurationModel } from '../models/wn-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class WeightService {
  socket: any;
  public searchTerm$ = new BehaviorSubject<string>('');
  private searchTerm: string;
  readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;

  constructor(private _http: HttpClient) { }

  /**
   * get weight notes
   */
  public getWeightNotes(url?: string, params = {}): Observable<{ data: IReceivingNoteListModel[], paginator: IPaginator }> {
    let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WEIGHT_NOTE}?`;
    return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
      .pipe(map((response: any) => {
        let result: { data: IReceivingNoteListModel[], paginator: IPaginator } = {
          data: [],
          paginator: new Paginator()
        };
        result.data = response.data.map((d: any) => new ReceivingNoteListModel(d))
        result.paginator = new Paginator(response, true)
        return result
      }));
  }

  /**
  * get reciving weight notes
  */
  public getRecivingWeightNotes(url?: string, params = {}): Observable<{ data: IReceivingNoteListModel[], paginator: IPaginator }> {
    let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WEIGHT_NOTE_LIST}?`;
    return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
      .pipe(map((response: any) => {
        let result: { data: IReceivingNoteListModel[], paginator: IPaginator } = {
          data: [],
          paginator: new Paginator()
        };
        result.data = response.data.map((d: any) => new ReceivingNoteListModel(d))
        result.paginator = new Paginator(response, true)
        return result
      }));
  }

  /**
   * get weight notes
   */
  public getWeightNotesProduction(url?: string, params = null): Observable<{ data: IWNProductionModel[], paginator: IPaginator }> {
    let uri: string = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WEIGHT_PRODUCTION}?`;
    if (!uri.includes('?')) { uri = `${uri}?` }
    return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
      .pipe(map((response: any) => {
        let result: { data: IWNProductionModel[], paginator: IPaginator } = {
          data: [],
          paginator: new Paginator()
        }
        result.data = response.data.map((d: any) => new WNProductionModel(d, true));
        result.paginator = new Paginator(response, true);
        return result;
      }));
  }

  public getWeightNotesProductionFiltered(params: any) {
    this.searchTerm = params.search;
    this.searchTerm$.next(this.searchTerm);
    return this.getWeightNotesProduction(null, params);
  }

  public getWeightNotesFiltered(params: any) {
    this.searchTerm = params.search;
    this.searchTerm$.next(this.searchTerm);
    return this.getWeightNotes(null, params);
  }

  public getRecivingWeightNotesFiltered(params: any) {
    this.searchTerm = params.search;
    this.searchTerm$.next(this.searchTerm);
    return this.getRecivingWeightNotes(null, params);
  }

  /**
   * Get certification
   * @param id id weight note
   */
  public getWeightNoteById(id: string) {
    let uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RECEPTION_NOTE}/${id}`;
    return this._http.get(uri)
  }

  /**
   * Get certification
   * @param sellerId id seller
   * @param farmId id farm
   * @param blockId id block
   */
  public getRelatedCertifications(sellerId: number, farmId: number, blockId: string): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CERTIFICATIONS}/${sellerId}`;
    let params: any = {};
    if (null != farmId) {
      params.farm_id = farmId;
    }
    if (null != blockId) {
      params.block_id = blockId;
    }
    return this._http.get(uri, { params: new HttpParams({ fromObject: params }) });
  }

  /**
   * Obtener unidad de medida para el factor
   * @param transformation_type_id TRANSFORMATION TYPE
   * @param measurementId UNIDAD DE MEDIDA
   */
  public getConfigTare(transformation_type_id: string, measurementId: string) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION_TARE}?measurement_unit=${measurementId}&transformation_type=${transformation_type_id}`;
    return this._http.post(uri, { measurement_unit: measurementId, transformation_type: transformation_type_id });
  }

  /**
   * get configuration
   */
  public getConfiguration(): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION}`;
    return this._http.get(uri);
  }

  public saveNote(receivingNote: IWNRequestActionReceivingNoteModel) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WEIGHT_NOTE}`;
    return this._http.post(uri, receivingNote);
  }

  public editNote(receivingNote: IWNRequestActionReceivingNoteModel) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WEIGHT_NOTE}/${receivingNote.id}`;
    return this._http.put(uri, receivingNote);
  }

  public deleteNote(id: string, reason?: string) {
    const options = {};
    if (reason) {
      options['body'] = {
        deletion_reason: reason
      }
    }
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WEIGHT_NOTE}/${id}`;
    return this._http.delete(uri, options);
  }

  public getCertificationById(id: string): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CERTIFICATION}/${id}`;
    return this._http.get(uri);
  }

  public getCertifications() {
    let uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SEALS_SELLERS}`;
    return this._http.get(uri);
  }

  public getReceptionNoteById(id: string, config: IWNConfigurationModel): Observable<IReceivingNoteModel> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RECEPTION_NOTE}/${id}`;
    return this._http.get(uri)
      .pipe(map((result: any) => {
        return new ReceivingNoteModel(result.data, true, config);
      }));
  }

  public changeStatusNote(data: IWNRequestChangeStatusModel): Observable<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CHANGE_STATUS_WEIGHT_NOTE}`;
    return this._http.post(uri, data);
  }

  public reportReceptionNote(id: string, format: string, lang: string = "es"): Promise<any> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_REPORTS_NOTE_RECEPTION}/${id}`;
    return this._http.post(uri, { format: format, lang: lang }).toPromise();
  }

  public getBlocksBySeller(id: number) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_BLOCKS_BY_SELLER}/${id}`
    return this._http.get(uri).toPromise();
  }

  public getBlocks(farmId: number, sellerId: number): Observable<Array<IWNBlockModel>> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_BLOCSK}/${farmId}?seller_id=${sellerId}`;
    return this._http.get(uri)
      .pipe(map((result: any) => {
        let data: Array<any> = result.data;
        let blocks: Array<IWNBlockModel> = [];
        data.forEach((f: any) => blocks.push(new WNBlockModel(f)));
        return sortByStringValue(blocks, 'name');
      }));
  }

  public getFarmsByProducer(producerId: number): Observable<Array<IWNFarmModel>> {
    let uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_FARMS_BY_PRODUCER}/${producerId}`
    return this._http.get(uri)
      .pipe(map((result: any) => {
        let data: Array<any> = result[0].farms;
        let farms: Array<IWNFarmModel> = [];
        data.forEach((f: any) => farms.push(new WNFarmModel(f)));
        return sortByStringValue(farms, 'name');
      }));
  }

  /**
   * get commodities
   */
  public getCommodities(uri: string, isSearch: boolean): Observable<Array<IWNCommodityModel>> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}`;
    if (null == uri) {
      uri = path;
    }
    else if (isSearch) {
      const parameters: string = uri;
      uri = path + parameters;
    }
    return this._http.get(uri)
      .pipe(map((result: any) => {
        let response: Array<IWNCommodityModel> = null;
        if (result.status) {
          response = [];
          result.data.forEach((item: any) => { response.push(new WNCommodityModel(item)); });
          response = sortByStringValue(response, 'name');
        }
        return response;
      }));
  }

  public getCommodityTypes(commodityId: number, uri: string, isSearch: boolean): Observable<Array<IWNCommodityTypeModel>> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS}?commodity_id=${commodityId}`;
    if (null == uri) {
      uri = path;
    }
    else if (isSearch) {
      const parameters: string = uri;
      uri = path + parameters;
    }
    return this._http.get(uri).pipe(map(
      (result: any) => {
        let response: Array<IWNCommodityTypeModel> = null;
        if (result.status) {
          response = [];
          result.data.forEach((item: any) => {
            response.push(new WNCommodityTypeModel(item));
          });
        }
        return sortByStringValue(response, 'name');
      }
    ));
  }

  public getCommodityTransformation(commodityId: number, uri: string, isSearch: boolean): Observable<Array<IWNCommodityTransformationModel>> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFORMATIONS_TYPES_BY_COMMODITY}/${commodityId}`;
    if (null == uri) {
      uri = path;
    }
    else if (isSearch) {
      const parameters: string = uri;
      uri = path + parameters;
    }
    return this._http.get(uri)
      .pipe(map((result: any) => {
        let response: Array<IWNCommodityTransformationModel> = null;
        if (result.status) {
          response = [];
          result.data.forEach((item: any) => {
            response.push(new WNCommodityTransformationModel(item));
          });
        }
        return sortByStringValue(response, 'name');
      }));
  }

  public getWarehouse(transformationTypeId: string, uri: string, isSearch: boolean , type_id : number = CONSTANTS.TYPE_OF_TANKS.PHYSICAL): Observable<Array<IWNContainerModel>> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TANK_COMMODITY}/${transformationTypeId}`;
    if (null == uri) {
      uri = path;
    }
    else if (isSearch) {
      const parameters: string = uri;
      uri = path + parameters;
    }

    return this._http.get(uri, { params: new HttpParams({ fromObject: {type_id} }) })
      .pipe(map((result: Array<any>) => {
        let response: Array<IWNContainerModel> = [];
        result.forEach((item: any) => {
          response.push(new WNContainerModel(item));
        });
        return sortByStringValue(response, 'name');
      }));
  }

  public getSeasons(): Observable<Array<IWNSeasonModel>> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SEASONS}`;
    return this._http.get(path)
      .pipe(map((result: Array<any>) => {
        let response: Array<IWNSeasonModel> = [];
        result.forEach((item: any) => {
          response.push(new WNSeasonModel(item, true));
        });
        return sortByStringValue(response, 'name');
      }));
  }

  public getCharacteristics(params?: string): Observable<Array<IWNCharacteristicModel>> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CHARACTERISTICS}`;
    if (params) {
      path = `${path}?${params}`
    }
    return this._http.get(path)
      .pipe(map((result: any) => {
        let response: Array<IWNCharacteristicModel> = [];
        result.data.forEach((item: any) => {
          response.push(new WNCharacteristicModel(item, true));
        });
        return sortByStringValue(response, 'name');
      }));
  }

  public getDrivers(uri: string, params: any): Observable<IWNDriverListPaginatorModel> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DRIVERS}`;
    if (null == uri) {
      uri = path;
    }
    return this._http.get(uri, { params: new HttpParams({ fromObject: params }) }).pipe(map(
      (result: any) => {
        let response: IWNDriverListPaginatorModel = null;
        if (result.status) {
          response = new WNDriverListPaginatorModel(result.data);
        }
        return response;
      }));
  }

  public getSellers(uri: string, isSearch: boolean): Observable<IWNSellerListPaginatorModel> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCERS_WITH_FARMS}`;
    if (null == uri) {
      uri = path;
    }
    else if (isSearch) {
      const parameters: string = uri;
      uri = path + parameters;
    }
    return this._http.get(uri)
      .pipe(map((result: any) => {
        let response: IWNSellerListPaginatorModel = null;
        if (result.status) {
          response = new WNSellerListPaginatorModel(result.data);
        }
        return response;
      }));
  }

  public getTrucks(uri: string, params: any): Observable<IWNTruckListPaginatorModel> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRUCKS}`;
    if (null == uri) {
      uri = path;
    }
    return this._http.get(uri, { params: new HttpParams({ fromObject: params }) }).pipe(map(
      (result: any) => {
        let response: IWNTruckListPaginatorModel = null;
        if (result.status) {
          response = new WNTruckListPaginatorModel(result.data);
        }
        return response;
      }));
  }


  public applyDeductions(data: IWNDeductionsTradingModel) {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DEDUCTIONS_TRADING}`;
    return this._http.post(path, data);
  }

  public getCompanyInfo(): Observable<IWCompanyInfoModel> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_GET_CONFIG_COMPANY_INFO}`;
    return this._http.get(path).pipe(map((result: any) => new WCompanyInfoModel(result.data)));
  }

  public relatedBlocksWithFarms(farm: any): Promise<any> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_UPDATE_BLOCK_WEIGHT_NOTE}`;
    return this._http.post(path, farm).toPromise()
  }

  public getContractsByProducer(producerId: number): Observable<IContractTrumodityModel[]> {
    let path: string =
      `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PURCHASE_ORDERS_CONTRACTS}?producer_id=${producerId}`;
    return this._http
      .get(path)
      .pipe(map((response: any) => response.data.contracts.map((d: any) => new ContractTrumodityModel(d))));
  }

  public updateCloseReceptionNote(reception: IReceivingCloseUpdateRequestModel, id: string): Observable<any> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_UPDATES_RECEPTION_NOTES}/${id}`;
    return this._http.put(path, reception)
  }
}
