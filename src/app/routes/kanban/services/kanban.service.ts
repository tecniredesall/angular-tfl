import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { IWorkflowModel, WorkflowModel } from 'src/app/shared/models/workflow.models';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { IProductionTypeModel, ProductionTypeModel } from 'src/app/shared/models/production-type.model';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { ICommodityTypeModel, CommodityTypeModel } from 'src/app/routes/kanban/models/commodity-type.model';
import { IWarehouseModel, WarehouseModel } from 'src/app/routes/kanban/models/warehouse.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { IKanbanDashboardWorkflow, KanbanDashboardWorkflow } from '../models/kanban-dashboard-workflow.model';
import { IProcessListModel, ProcessListModel } from '../models/process-list.model';
import { ITransitionModel, ITransitionViewRequestModel, TransitionModel } from '../models/transition.model';
import { ILotListWeightNoteGrouper, LotListWeightNoteGrouper } from '../../lots/models/lot-list-weight-note-grouper.model';
import { IWNSeasonModel, WNSeasonModel } from '../../weight-note/models/wn-season.model';
import { TransformationTypeModel, ITransformationTypeModel } from 'src/app/shared/models/transformation-type.model';
import { CommodityModel, ICommodityModel } from '../../workflow/models/commodity.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  constructor(private _http: HttpClient) { }

  /**
   * Get configuration data
   * @returns observable object with configuration data
   */
  public getConfiguration(): Observable<ITRConfiguration> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION}`;
    return this._http.get(uri).pipe(map((result: any) => {
      return new TRConfiguration(result);
    }));
  }

  /**
   * Get workflows by commodity id
   * @param path for request
   * @param commodityId for request
   * @param params for request
   * @returns observable object with paginator status and data workflows
   */
  public getWorkflowsByCommodity(path: string, commodityId: number, params: any): Observable<{ paginator: IPaginator, data: IKanbanDashboardWorkflow[] }> {
    let uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW}/${commodityId}`;
    uri = path ?? uri;
    const httpParams: HttpParams = new HttpParams({ fromObject: params });
    return this._http.get(uri, { params: httpParams }).pipe(map((response: any) => {
      let paginator: IPaginator = new Paginator(response, true);
      let workflows: IKanbanDashboardWorkflow[] = response.data.data.map((w: any) => new KanbanDashboardWorkflow(w, true));
      return { paginator: paginator, data: workflows };
    }));
  }

  /**
   * Get processes by workflow id
   * @param workflowId for request
   * @returns observable object with workflow processes data
   */
  public getProcessesByWorkflow(workflowId: string): Observable<IKanbanDashboardWorkflow> {
    const uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_KANBAN_DASHBOARD}/${workflowId}`;
    return this._http.get(uri).pipe(map((response: any) => {
      return new KanbanDashboardWorkflow(response.data, true);
    }));
  }

  public getProductionTypes(): Observable<IProductionTypeModel[]> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCTION_TYPES}`;
    return this._http.get(uri).pipe(map((r: any) => {
      return r.map((d: any) => new ProductionTypeModel(d))
    }));
  }

  public getWorkflows(uri: string, params = null, commodityId: number): Observable<{ data: IWorkflowModel[], paginator: IPaginator }> {
    const path = uri ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW}/${commodityId}`;
    return this._http.get(path, { params: new HttpParams({ fromObject: params }) })
      .pipe(map((r: any) => {
        let response: { data: IWorkflowModel[], paginator: IPaginator } = { data: [], paginator: new Paginator() };
        response['data'] = r.data.data.map((d: any) => new WorkflowModel(d));
        response['paginator'] = new Paginator(r, true);
        return response
      }));
  }

  public getCommodityTypes(): Observable<ICommodityTypeModel[]> {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS}/1`;
    return this._http.get(path)
      .pipe(map((r: any) => {
        let response: ICommodityTypeModel[] = [];
        response = r.data.map((d: any) => new CommodityTypeModel(d));
        return sortByStringValue(response, 'name');;
      }));
  }

  public getWarehouses(transformationTypeId: string , params:any): Observable<IWarehouseModel[]> {
    let path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TANK_COMMODITY}/${transformationTypeId}`;
    return this._http.get(path, { params : new HttpParams({fromObject:params})})
      .pipe(map((result: Array<any>) => {
        let response: IWarehouseModel[] = [];
        response = result.map((r: any) => new WarehouseModel(r));
        return sortByStringValue(response, 'name');
      }));
  }

  public getLotDetail( id: string, config: { baseMeasurementUnitFactor: number; decimalPlaces: number }): Observable<ILotListWeightNoteGrouper> {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOTS}/${id}`;
    return this._http.get(path)
      .pipe(map((r: any) => new LotListWeightNoteGrouper({item: r.data, config: config,}, true )));
  }

  public getWorkflowProcesses(workflowId: string): Observable<IProcessListModel[]> {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES_LIST}/${workflowId}`;
    return this._http.get(path)
      .pipe(map((result: any) => result.data.map((r: any) => new ProcessListModel(r) )));
  }

  public postTransition(request: ITransitionViewRequestModel) {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOT_TRANSITION}`;
    return this._http.post(path, request);
  }

  public getTransition(id: string, config: { baseMeasurementUnitFactor: number; decimalPlaces: number }): Observable<ITransitionModel> {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOT_TRANSITION}/${id}`;
    return this._http.get(path)
      .pipe(map((result: any) => new TransitionModel(result.data, config, true)));
  }

  public putTransition(transitionId: string, request: ITransitionViewRequestModel) {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOT_TRANSITION}/${transitionId}`;
    return this._http.put(path, request);
  }

  public getSeason(): Observable<IWNSeasonModel> {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SEASONS}`;
    return this._http.get(path).pipe(map((result: any) => new WNSeasonModel(result[0], true)));
  }

  public finalizeLot(lotId: string): Observable<any> {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOTS}/${lotId}/finalize`;
    return this._http.put(path, {})
  }

  public getTransformationTypes(): Observable<ITransformationTypeModel[]> {
    const path = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFORMATION_TYPES}`;
    return this._http.get(path).pipe(map((result: any) => result.map(d => new TransformationTypeModel(d))))
  }

  public getCommodities(): Observable<ICommodityModel[]> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}`;
    return this._http.get(uri).pipe(map((result: any) => result.data.map((d: any) => new CommodityModel(d))));
  }

}
