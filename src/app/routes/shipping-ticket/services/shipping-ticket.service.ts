import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { ISTReasonTransferModel, STReasonTransferModel } from '../models/st-reason-transfer.model';
import { ISTBuyerPaginatorModel, STBuyerPaginatorModel } from '../models/st-buyer-paginator.model';
import { ISTBuyerLocationPaginatorModel, STBuyerLocationPaginatorModel } from '../models/st-buyer-location-paginator.model';
import { ISTCompanyBranchPaginatorModel, STCompanyBranchPaginatorModel } from '../models/st-company-branch-paginator.model';
import { ISTCompanyBranchPointPaginatorModel, STCompanyBranchPointPaginatorModel } from '../models/st-company-branch-point-paginator.model';
import { ISTDriverPaginatorModel, STDriverPaginatorModel } from '../models/st-driver-paginator.model';
import { ISTVehiclePaginatorModel, STVehiclePaginatorModel } from '../models/st-vehicle-paginator.model';
import { IWNCommodityModel, WNCommodityModel } from '../../weight-note/models/wn-commodity.model';
import { IWNContainerModel, WNContainerModel } from '../../weight-note/models/wn-container.model';
import { IWNCommodityTypeModel, WNCommodityTypeModel } from '../../weight-note/models/wn-commodity-type.model';
import { IWNConfigurationModel, WNConfigurationModel } from '../../weight-note/models/wn-configuration.model';
import { ISubtankModel, SubtankModel } from '../../warehouse/models/subtank.model';
import { IWNDeductionsTradingModel } from '../../weight-note/models/wn-request-deductions-trading.model';
import { IWNCharacteristicModel, WNCharacteristicModel } from '../../weight-note/models/wn-characteristic.model';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import * as moment from 'moment';
import { ISTGeneralInformationModel, STGeneralInformationModel } from '../models/st-general-information.model';
import { IShippingTicketModel, ShippingTicketModel } from '../models/shipping-ticket.model';
import { IShippingTicketRequestModel } from '../models/shipping-ticket-request.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { ITag } from 'src/app/shared/models/tags.model';
import { ITRFilter } from 'src/app/shared/models/filter-data.model';

@Injectable({
    providedIn: 'root'
})
export class ShippingTicketService {
    private searchTerm: string;
    public searchTerm$ = new BehaviorSubject<string>('');
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).general : 0;
    public currentFilterCreate: ITRFilter | undefined;
    public currentTagsCreate: ITag[] | undefined;
    readonly KEY_FILTER: string = `${CONSTANTS.PERMISSIONS.SHIPPING_TICKET}-${CONSTANTS.CRUD_ACTION.READ}-Filter`
    readonly KEY_TAGS: string = `${CONSTANTS.PERMISSIONS.SHIPPING_TICKET}-${CONSTANTS.CRUD_ACTION.READ}-Tags`
    constructor(
        private _http: HttpClient
    ) { }

    public getConfiguration(): Observable<IWNConfigurationModel> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CONFIGURATION}`;
        return this._http.get(uri)
            .pipe(map((result: any) => new WNConfigurationModel(result)));
    }

    public getReasonTransfer(): Observable<ISTReasonTransferModel[]> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_REASON_TRANSFER}`;
        return this._http.get(uri)
            .pipe(map((result: any) => result.data.map((d: any) => new STReasonTransferModel(d))));
    }

    public getCompanyBranches(url?: string, params = {}): Observable<ISTCompanyBranchPaginatorModel> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMPANY_BRANCHES}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => new STCompanyBranchPaginatorModel(result)));
    }

    public getCompanyBranchesPoints(companyBranchId: number, url?: string, params = {}): Observable<ISTCompanyBranchPointPaginatorModel> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMPANY_BRANCHES}/${companyBranchId}/points`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => new STCompanyBranchPointPaginatorModel(result)));
    }

    public getBuyers(url?: string, params = {}): Observable<ISTBuyerPaginatorModel> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_BUYERS}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => new STBuyerPaginatorModel(result)));
    }

    public getBuyerLocation(buyerId: number, url?: string, params = {}): Observable<ISTBuyerLocationPaginatorModel> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_BUYERS}/${buyerId}/locations`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => new STBuyerLocationPaginatorModel(result)));
    }

    public getCommodities(): Observable<IWNCommodityModel[]> {
        let uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_PROD_COMMODITY}`;
        return this._http.get(uri).pipe(map((result: any) => result.data.map((d: any) => new WNCommodityModel(d))));
    }

    public getCommodityTypes(commodityId: number): Observable<IWNCommodityTypeModel[]> {
        let uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_COMMODITY_TRANSFORMATIONS}?commodity_id=${commodityId}`;
        return this._http.get(uri).pipe(map((result: any) => result.data.map((d: any) => new WNCommodityTypeModel(d))));
    }

    public getWarehouses(commodityTransformationId: number , params : any = {type_id: CONSTANTS.TYPE_OF_TANKS.PHYSICAL}): Observable<IWNContainerModel[]> {
        let uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TANK_COMMODITY}/${commodityTransformationId}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) }).pipe(map((result: any) => result.map((d: any) => new WNContainerModel(d))));
    }

    public getWarehouseById(warehouseId: string): Observable<ISubtankModel> {
        let uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SUBTANK}/${warehouseId}`;
        return this._http.get(uri).pipe(map((result: any) => new SubtankModel(result.data)));
    }

    public applyDeductions(data: IWNDeductionsTradingModel) {
        let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DEDUCTIONS_TRADING}`;
        return this._http.post(path, data);
    }

    public getCharacteristics(params: any = {}): Observable<Array<IWNCharacteristicModel>> {
        let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CHARACTERISTICS}`;
        return this._http.get(path, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => {
                let response: Array<IWNCharacteristicModel> = result.data.map((d: any) => new WNCharacteristicModel(d, true))
                return sortByStringValue(response, 'name');
            }));
    }
    public getDrivers(url?: string, params = {}): Observable<ISTDriverPaginatorModel> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DRIVERS}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => new STDriverPaginatorModel(result)));
    }

    public getFilterDrivers(url?: string, params = {}): Observable<ISTDriverPaginatorModel> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_DRIVERS_FILTERS}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) =>
                    new STDriverPaginatorModel(result)
            ));
    }

    public getTrucks(url?: string, params = {}): Observable<ISTVehiclePaginatorModel> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRUCKS}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => new STVehiclePaginatorModel(result)));
    }

    public getFilterTrucks(url?: string, params = {}): Observable<ISTVehiclePaginatorModel> {
        const uri = url ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRUCKS_FILTERS}`;
        return this._http.get(uri, { params: new HttpParams({ fromObject: params }) })
            .pipe(map((result: any) => new STVehiclePaginatorModel(result)));
    }

    public createShippingTicket(shippingTicket: IShippingTicketRequestModel) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SHIPPING_TICKET}`;
        return this._http.post(uri, shippingTicket)
    }

    public deleteShippingNote(shippingNote: string) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SHIPPING_NOTES}/${shippingNote}`;
        return this._http.delete(uri);
    }


    public updateShippingTicket(shippingTicket: IShippingTicketRequestModel, shippingTicketId: string) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SHIPPING_TICKET}/${shippingTicketId}`;
        return this._http.put(uri, shippingTicket)
    }

    public getCompanyInfo(): Observable<any> {
        const path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_GET_CONFIG_COMPANY_INFO
            }`;
        return this._http.get(path);
    }

    public getShippingTicketsFilter(params: any) {
        this.searchTerm = params.q;
        this.searchTerm$.next(this.searchTerm);
        return this.getShippingTickets(null, params);
    }

    public getShippingTickets(uri, params: any): Observable<{ data: ISTGeneralInformationModel[]; pagination: IPaginator }> {
        let path: string = uri ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SHIPPING_TICKET}`;
        if (params?.date_init) {
            params.date_init = moment(params.date_init)
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
        }
        if (params?.date_end) {
            params.date_end = moment(params.date_end)
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
        }
        return this._http
            .get(path, { params: new HttpParams({ fromObject: params }) })
            .pipe(
                map((result: any) => {
                    let response: {
                        data: ISTGeneralInformationModel[];
                        pagination: IPaginator;
                    } = { data: [], pagination: null };
                    response['data'] = result.data.map(
                        (d: any) => new STGeneralInformationModel(d, true)
                    );
                    response['pagination'] = new Paginator(result, true);
                    return response;
                })
            );
    }

    public getShippingTicketDetail(shippingId: string): Observable<IShippingTicketModel> {
        let uri: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SHIPPING_TICKET}/${shippingId}`;
        return this._http.get(uri)
            .pipe(
                map(
                    (result: any) => {
                        return new ShippingTicketModel(result.data, true, true, this.DECIMAL_DIGITS);
                    }
                )
            );
    };

    public getShippingReportPDF(id: string, language: string): Observable<any> {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SHIPPING_NOTE
            }/${id}`;
        return this._http.get(uri, {
            params: new HttpParams({
                fromObject: {
                    format: 'pdf',
                    lang: language
                }
            })
        });
    }
    public closeShippingTicket(shippingTicketId: string) {
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SHIPPING_TICKET}/close/${shippingTicketId}`;
        return this._http.put(uri, null)
    }

    public voidShippingTicket(shippingTicketId: string ,reason:string): Observable<IShippingTicketModel> {
        const methodName = 'void'
        const postData = {void_reason: reason}
        const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_SHIPPING_TICKET}/${shippingTicketId}/${methodName}`;
        return this._http.patch(uri, postData)
        .pipe(
            map(
                (result: any) => {
                    return new ShippingTicketModel(result.data, true, true, this.DECIMAL_DIGITS);
                }
            )
        );
    }

    public getFilterStorage() {
        const filter = this.currentFilterCreate ??
            localStorage.getItem(this.KEY_FILTER) ? JSON.parse(localStorage.getItem(this.KEY_FILTER)) as ITRFilter : undefined;
        this.currentFilterCreate = filter
        return this.currentFilterCreate
    }

    public getTagsStorage() {
        const filter = this.currentTagsCreate ??
            localStorage.getItem(this.KEY_TAGS) ? JSON.parse(localStorage.getItem(this.KEY_TAGS)) as Array<ITag> : undefined;
        this.currentTagsCreate = filter
        return this.currentTagsCreate
    }

}
