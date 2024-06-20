import { ITag } from 'src/app/shared/models/tags.model';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ILotCommodityTypeModel, LotCommodityTypeModel } from '../models/lot-commodity-type.model';
import { ILotCommodityModel, LotCommodityModel } from '../models/lot-commodity.model';
import { ILotListWeightNoteGrouper, LotListWeightNoteGrouper } from '../models/lot-list-weight-note-grouper.model';
import {
    ILotProductionFlowModel, LotProductionFlowModel
} from '../models/lot-production-flow.model';
import { LotRequestAtionCreateModel } from '../models/lot-request-ation-create.model';
import { ILotWarehouseModel, LotWarehouseModel } from '../models/lot-warehouse.model';
import { ILotHistoryModel, LotHistoryModel } from '../models/lot-history.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { IWorkflowModel, WorkflowModel } from 'src/app/shared/models/workflow.models';
import { SplitLotRequestCreate } from '../models/lot-split.model';
import { ITransitionViewRequestModel } from '../../kanban/models/transition.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ITRFilter, TRFilter } from 'src/app/shared/models/filter-data.model';
@Injectable({
    providedIn: 'root',
})
export class LotsService {
    public CONSTANTS = CONSTANTS;
    readonly KEY_FILTER: string = `${CONSTANTS.PERMISSIONS.LOTS}-${CONSTANTS.CRUD_ACTION.CREATE}-Filter`
    readonly KEY_TAGS: string = `${CONSTANTS.PERMISSIONS.LOTS}-${CONSTANTS.CRUD_ACTION.CREATE}-Tags`
    private searchTerm: string;
    public searchTerm$ = new BehaviorSubject<string>('');
    public currentFilterCreate : ITRFilter | undefined;
    public currentTagsCreate : ITag [] | undefined;
    constructor(private _http: HttpClient) { }

    public actionCreateLot = new BehaviorSubject<boolean>(false);
    action$ = this.actionCreateLot.asObservable();

    public callFunctionCreateLot(create: boolean): void {
        this.actionCreateLot.next(create);
    }

    public getProducersFiltered(params: any, config: any) {
        this.searchTerm = params.search;
        return this.getLots(null, config, params);
    }

    public getFilterStorage(){
        const filter = this.currentFilterCreate ??
            localStorage.getItem(this.KEY_FILTER) ? JSON.parse(localStorage.getItem(this.KEY_FILTER)) as ITRFilter : undefined;
        this.currentFilterCreate = filter
        return this.currentFilterCreate
    }

    public getTagsStorage(){
        const filter = this.currentTagsCreate ??
            localStorage.getItem(this.KEY_TAGS) ? JSON.parse(localStorage.getItem(this.KEY_TAGS)) as  Array<ITag> : undefined;
        this.currentTagsCreate = filter
        return this.currentTagsCreate
    }

    public getCommodities(): Observable<Array<ILotCommodityModel>> {
        let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY
            }`;
        return this._http.get(path).pipe(
            map((result: any) => {
                let response: Array<ILotCommodityModel> = null;
                if (result.status) {
                    response = [];
                    result.data.forEach((item: any) => {
                        response.push(new LotCommodityModel(item));
                    });
                    response = sortByStringValue(response, 'name');
                }
                return response;
            })
        );
    }

    public getCommodityTypes(
        commodityId: number
    ): Observable<Array<ILotCommodityTypeModel>> {
        let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS
            }?commodity_id=${commodityId}`;
        return this._http.get(path).pipe(
            map((result: any) => {
                let response: Array<ILotCommodityTypeModel> = null;
                if (result.status) {
                    response = [];
                    result.data.forEach((item: any) => {
                        response.push(new LotCommodityTypeModel(item, true));
                    });
                }
                return sortByStringValue(response, 'name');
            })
        );
    }

    public getWarehouses(
        transformationTypeId: string,
        params: any
    ): Observable<Array<ILotWarehouseModel>> {
        let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TANK_COMMODITY
            }/${transformationTypeId}`;
        return this._http.get(path, {params: new HttpParams({fromObject:params})}).pipe(
            map((result: Array<any>) => {
                let response: Array<ILotWarehouseModel> = [];
                result.forEach((item: any) => {
                    response.push(new LotWarehouseModel(item, true));
                });
                return sortByStringValue(response, 'name');
            })
        );
    }

    public getProductionFlows(
        commodityId: number,
        commodityTypeId: string
    ): Observable<Array<ILotProductionFlowModel>> {
        let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOW
            }/${commodityId}?commodity_transformation_id=${commodityTypeId}`;
        return this._http.get(path).pipe(
            map((result: any) => {
                let response: Array<ILotProductionFlowModel> = [];
                result.data.data.forEach((item: any) => {
                    response.push(new LotProductionFlowModel(item, true));
                });
                return sortByStringValue(response, 'name');
            })
        );
    }

    public getConfiguration(): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION
            }`;
        return this._http.get(uri);
    }

    public getWeightNotes(url, params = {}): Observable<any> {
        let path = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WEIGHT_NOTES}?`;
        if( params['tanks'] && params['tanks'].length > 0 ) {
            params['tanks[]'] = params['tanks'];
        }
        params['status[]'] = CONSTANTS.RECEIVING_NOTE_STATUS.CLOSED;
        params['batched'] = CONSTANTS.LOT_STATUS.IN_PROGRESS;
        params['wn_status[]'] = CONSTANTS.WEIGHT_NOTE_STATUS.CLOSED;
        return this._http.get(path, { params: new HttpParams({ fromObject: params }) });
    }

    public getReceptionNotes(url, params = {}): Observable<any> {
        let path = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RECEPTION_NOTES}?`;
        if( params['tanks'] && params['tanks'].length > 0 ) {
            params['tanks[]'] = params['tanks'];
        }
        params['status[]'] = CONSTANTS.RECEIVING_NOTE_STATUS.CLOSED;
        params['batched'] = CONSTANTS.LOT_STATUS.IN_PROGRESS;
        params['wn_status[]'] = CONSTANTS.WEIGHT_NOTE_STATUS.CLOSED;
        return this._http.get(path, { params: new HttpParams({ fromObject: params }) });
    }

    /**
     * Get configuration data
     */
    public getConfigurationData(): Observable<ITRConfiguration> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION
            }`;
        return this._http.get(uri).pipe(
            map((result: any) => {
                return new TRConfiguration(result);
            })
        );
    }

    /**
     * Get lot list data
     * @param uri for request
     * @param config data object to conversions
     * @param params for request
     */
    public getLots(
        uri: string,
        config: { baseMeasurementUnitFactor: number; decimalPlaces: number },
        params: any
    ): Observable<{ data: ILotListWeightNoteGrouper[]; pagination: IPaginator }> {
        const path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOTS
            }`;
        uri = uri ?? path;
        if (params?.date_init) {
            params.date_init = moment(params.date_init)
                .startOf('day')
                .utc()
                .format('YYYY-MM-DD HH:mm:ss');
        }
        if (params?.date_end) {
            params.date_end = moment(params.date_end)
                .endOf('day')
                .utc()
                .format('YYYY-MM-DD HH:mm:ss');
        }
        return this._http
            .get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(
                map(
                    (result: any) => {
                        let response: {
                            data: ILotListWeightNoteGrouper[];
                            pagination: IPaginator;
                        } = { data: [], pagination: null };
                        response['data'] = result.data.map(
                            (d: any) => new LotListWeightNoteGrouper({ item: d, config }, true)
                        );
                        response['pagination'] = new Paginator(result, true);
                        // new LotListPaginator(
                        //     { item: result, config: config },
                        //     true
                        // )

                        return response;
                    }
                )
            );
    }
    public getLot(
        id: string,
        config: { baseMeasurementUnitFactor: number; decimalPlaces: number }
    ) {
        const url = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOTS
            }/${id}`;
        return this._http.get(url).pipe(
            map(
                (r: any) => {
                    return new LotListWeightNoteGrouper(
                        {
                            item: r.data,
                            config: config,
                        },
                        true
                    )
                }
            )
        );
    }

    /**
     * Lot delete
     * @param id lot id to delete
     */
    public lotDelete(id: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOTS
            }/${id}`;
        return this._http.delete(uri);
    }

    /**
     * Get production workflows for reprocess lot
     * @param id of lot
     * @returns workflows array
     */
    public getWorkflowsToReprocessLot(id: string): Observable<IWorkflowModel[]> {
        const url = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_WORKFLOWS_LOT}/${id}`;
        return this._http.get(url).pipe(map((response: any) => {
            return response.data.map((w: any) => new WorkflowModel(w, true));
        }));
    }

    /**
     * Reprocess a lot
     * @param lotId to reprocess
     * @param workflowId selected to reprocess lot
     * @returns data from operation reprocess
     */
    public lotReprocess(lotId: string, workflowId: string): Observable<any> {
        const url = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_REPROCESS_LOT}/${lotId}`;
        const data: any = {
            lot_id: lotId,
            workflow_id: workflowId
        };
        return this._http.put(url, data);
    }

    public createLot(data: any): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOTS
            }`;
        return this._http.post(uri, data);
    }
    public postTransferLot(modelData: { transition: ITransitionViewRequestModel, lots: Array<LotRequestAtionCreateModel> }): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOT_TRANSITION_DECREASE}`;
        return this._http.post(uri, modelData);
    }
    public getReportProcessingOrder(format: string, transitionId: string, isGeneral = false): Promise<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_REPORTS_LOT_TRAMSITION}/${isGeneral ? 'null' : transitionId}?format=${format}`;
        return this._http.post(uri, {
            format,
            lot_id: isGeneral ? transitionId : null,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'es'
        }).toPromise();
    }

    public getReportProcessingOrderCsv(format: string, transitionId: string, isGeneral = false): Promise<any> {
        const uri = `${localStorage.getItem('uri-owner')}/web/lots-transitions/${isGeneral ? transitionId : null}/export`;
        let params: any = {}
        params.lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'es';
        return this._http
            .get(uri, {
                params: new HttpParams({ fromObject: params }),
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(map((r) => r.body)).toPromise()
    }

    public getLotsHistory(url: string, params: any): Observable<{ items: ILotHistoryModel[], paginator: IPaginator }> {
        const path = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOT_HISTORY}`;
        return this._http.get(path, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => {
                let response = { items: [], paginator: new Paginator() }
                response.paginator = new Paginator(result, true)
                response.items = result.data.map((d: any) => new LotHistoryModel(d));
                return response;
            }));
    }
    public SplitLot(data: SplitLotRequestCreate): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOTS}`;
        return this._http.post(uri, data);
    }
    public getReportLot(lotId: string, lang: string, reportType: number): Promise<any> {
        const uri = `${localStorage.getItem('uri-owner')}${reportType === CONSTANTS.FILE_REPORT_ACTIONS.TYPE.DETAILED ? URIS_CONFIG.API_REPORT_LOT_DETAIL : URIS_CONFIG.API_REPORT_LOT_GENERAL}/${lotId}?lang=${lang}`;
        return this._http
            .get(uri)
            .pipe(map((r: any) => r.data)).toPromise()
    }
    public getLotsAvailableForMerge(lotId: string, config: ITRConfiguration, decimalPlace: number): Observable<Array<ILotListWeightNoteGrouper>> {
        const path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_MERGE_LOT}?id=${lotId}`;
        return this._http.get(path)
            .pipe(
                map(
                    (result: any) => {
                        let data = result.data.map((l: any) =>
                            new LotListWeightNoteGrouper(
                                {
                                    item: l,
                                    config: {
                                        baseMeasurementUnitFactor: config.baseMeasurementUnitFactor,
                                        decimalPlaces: decimalPlace
                                    }
                                }, true));
                        return data;
                    }

                )
            );
    }
    public mergeLots(data: { lots: Array<string> }): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_MERGE_LOT}`;
        return this._http.post(uri, data)

    }
    public getCatacionDetail(transitionId: string): Promise<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOT_CATACION_DETALLE}/${transitionId}/tastings`;
        return this._http.get(uri).toPromise();
    }
    public getReportCatation(format: string, transitionId: string, isGeneral = false, lang: string = CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG): Promise<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_REPORTS_CATATION}/${isGeneral ? 'null' : transitionId}?format=${format}&lang=${lang}`;
        return this._http.get(uri).toPromise();
    }
}
