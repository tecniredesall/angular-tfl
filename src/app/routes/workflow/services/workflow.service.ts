import { Injectable } from '@angular/core';
import { URIS_CONFIG } from '../../../shared/config/uris-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IWorkflowModel, IWorkflowRequestModel, WorkflowModel } from '../../../shared/models/workflow.models';
import { IWorkflowProcessRequestModel, WorkflowProcessModel } from '../models/workflow-process.model';
import { ITransformationTypeModel, TransformationTypeModel } from '../models/transformation_types.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { IProcessModel, ProcessModel } from '../models/process.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProductionTypeModel, ProductionTypeModel } from 'src/app/shared/models/production-type.model';
import { ICommodityTypeModel, CommodityTypeModel } from '../models/commodity-type.model';
import { sortBykey } from 'src/app/shared/utils/functions/sortFunction';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(
    private http: HttpClient
  ) { }

  getCommodities() {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}`;
    return this.http.get(uri);
  }

  getWorkflowProcesses(workflowId: string): Observable<WorkflowProcessModel[]> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES_LIST}/${workflowId}`;
    return this.http.get(uri)
      .pipe(map((response: any) => sortBykey(response.data.map((data: any) => new WorkflowProcessModel(data, true)), 'level')));
  }

  postWorkflowProcesses(data: IWorkflowProcessRequestModel[]) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES_LIST}`;
    return this.http.post(uri, data);
  }

  putWorkflowProcesses(id: string, data: IWorkflowProcessRequestModel[]) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES_LIST}/${id}`;
    return this.http.put(uri, data);
  }

  getProductionTypes(): Observable<IProductionTypeModel[]> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PRODUCTION_TYPES}`;
    return this.http.get(uri).pipe(map((response: any) => response.map((d: any) => new ProductionTypeModel(d))));
  }

  postWorkflow(workflow: IWorkflowRequestModel) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW}`;
    return this.http.post(uri, workflow);
  }

  putWorkflow(workflow: IWorkflowRequestModel) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW}/${workflow.workflow_id}`;
    return this.http.put(uri, workflow);
  }

  deleteWorkflow(workflowId: string) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW}/${workflowId}`;
    return this.http.delete(uri);
  }

  getWorkflows(commodityId: number): Observable<IWorkflowModel[]> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW}/${commodityId}?top=50`;
    return this.http.get(uri).pipe(map((response: any) => response.data.data.map((d: any) => new WorkflowModel(d))));
  }

  getProcesses(url: string, params: any): Observable<{data: IProcessModel[], pagination: IPaginator}> {
    const path = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES}`;
    return this.http.get(path, { params: new HttpParams({ fromObject: params }) }).pipe(map(
      (result: any) => {
        let response: {data: IProcessModel[], pagination: IPaginator} = {
          data: [],
          pagination: new Paginator(result, true)
        };
        result.data.forEach((item: any) => {
          response.data.push(new ProcessModel(item, true));
        });
        return response;
      }
    ));
  }

  public getProcess(id: string): Observable<IProcessModel> {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES}/${id}`;
    return this.http.get(uri).pipe(map((response: any) => new ProcessModel(response.data[0])));
  }

  postProcess(process) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES}`;
    return this.http.post(uri, process);
  }

  putProcess(process) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES}/${process.process_id}`;
    return this.http.put(uri, process);
  }

  deleteProcess(process_id: any) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESSES}/${process_id}`;
    return this.http.delete(uri);
  }

  public getProcessByCommodity(commodityId: number) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW_PROCESS_BY_COMMODITY}/${commodityId}`;
    return this.http.get(uri).toPromise();
  }

  public getCommodityTypes(commodityId: number): Observable<ICommodityTypeModel[]> {
    let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS}?commodity_id=${commodityId}`;
    return this.http.get(path).pipe(map((response: any) => response.data.map((d: any) => new CommodityTypeModel(d))));
  }

  public getProductionTanks(transformationTypeId: string, commodityId: number) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TANK_COMMODITY}/${transformationTypeId}?commodity_id=${commodityId}`;
    return this.http.get(uri);
  }

  public getTransformationTypes(uri: string, params: any): 
    Observable<{data: ITransformationTypeModel[], pagination: IPaginator}> {
    const path = uri ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFORMATIONS}`;
    return this.http.get(path, { params: new HttpParams({ fromObject: params }) }).pipe(map(
      (result: any) => {
        let response: {data: ITransformationTypeModel[], pagination: IPaginator} = {
          data: [],
          pagination: new Paginator(result)
        };
        result.data.data.forEach((item: any) => {
          response.data.push(new TransformationTypeModel(item, true));
        });
        return response;
      }
    ));
  }
}
