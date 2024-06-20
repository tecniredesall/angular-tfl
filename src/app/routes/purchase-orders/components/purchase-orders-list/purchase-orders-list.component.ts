import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ITRFilter, TRFilter } from 'src/app/shared/models/filter-data.model';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';

import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { IPurchaseOrderModel, PurchaseOrderModel } from '../../models/purchase-order.model';
import { PurchaseOrderSettleComponent } from '../purchase-order-settle/purchase-order-settle.component';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { eventPaginatorFunction } from 'src/app/shared/utils/functions/event-paginator';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { IWCompanyInfoModel, WCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { NetworkStatusService } from 'src/app/shared/services/network-status/network-status.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';

@Component({
    selector: 'app-purchase-orders-list',
    templateUrl: './purchase-orders-list.component.html',
    styleUrls: ['./purchase-orders-list.component.scss'],
})
export class PurchaseOrdersListComponent
    implements OnInit, OnChanges, OnDestroy {
    @ViewChild('matPaginator') matPaginator: MatPaginator;
    @BlockUI('purchase-list') blockUI: NgBlockUI;
    @Output() actionClicked = new EventEmitter();
    @Output() newRequest = new EventEmitter();
    @Input() orders: Array<IPurchaseOrderModel> = [];
    @Input() paginator: IPaginator = new Paginator();
    @Input() ordersStatus: number = 0;
    @Input() queryText: string;
    @Input() filterData: ITRFilter = new TRFilter();
    @Input() companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public hasFilter = false;
    public countFilter: number = 0;
    public searchText: string = '';
    public isFocusOnInputSearch: boolean = false;
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public columnOrder: string = 'creation_date';
    public columnAscState: any = {};
    public purchaseOrders: Array<IPurchaseOrderModel> = [];
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public isOnline: boolean
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals')
        ? JSON.parse(localStorage.getItem('decimals')).general
        : 2;
    readonly PURCHASE_STATUS: any = CONSTANTS.PURCHASE_ORDER_STATUS;
    readonly PURCHASER_SETLED: any = CONSTANTS.PURCHASE_ORDER_SETTLED_STATUS;
    public PERMISSION_TAG = CONSTANTS.PERMISSIONS.PURCHASE_ORDER;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public userHasEmptyPermissions = false;
    public userCanOnlyRead = false;
    public currentStatus: number;
    public configuration: ITRConfiguration = new TRConfiguration();
    constructor(
        private _router: Router,
        private _dialog: MatDialog,
        private _permissionService: PermissionsService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _alertService: AlertService,
        private _networkStatusService: NetworkStatusService,
        private _i18nPipe: I18nPipe,
    ) { }
    ngOnInit() {
        this._networkStatusService.checkStatus$().pipe(takeUntil(this.destroy$)).subscribe(isOnline => this.isOnline = isOnline)
        this.purchaseOrders = this.orders;
        this.currentStatus = this.ordersStatus;
        this.userHasEmptyPermissions = this._permissionService.checkForEmptyPermissions(this.PERMISSION_TAG);
        this.userCanOnlyRead = this._permissionService.checkForOnlyRead(this.PERMISSION_TAG);
        this.setPaginatorIndexOnResponse();
        this.initializeColumnState();
        this.newRequest.emit({
            uri: null,
            params: this.getParamsRequestLots(),
        });
        this.getConfig();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.orders && !changes.orders.isFirstChange()) {
            this.purchaseOrders = changes.orders.currentValue;
        }

        if (changes?.queryText && !changes.queryText.isFirstChange()) {
            this.searchText = changes.queryText.currentValue;
        }
        if (changes.filterData && !changes.filterData.isFirstChange()) {
            this.filterData = changes.filterData.currentValue;
            this.newRequest.emit({
                uri: null,
                params: this.getParamsRequestLots(),
            });
        }
        if (changes.ordersStatus && !changes.ordersStatus.isFirstChange()) {
            this.currentStatus = changes.ordersStatus.currentValue;
            this.newRequest.emit({
                uri: null,
                params: this.getParamsRequestLots(),
            });
        }
    }

    /**
     * init column, is posible call in liquitate list
     */
    private initializeColumnState(): void {
        this.columnOrder = 'creation_date';
        this.columnAscState = {
            creation_date: true,
            producer: false,
            total_notes: false,
            total_qq: false,
            total_payment: false,
            folio: false,
            contract_id: false,
        };
    }

    /**
     * set index paginator config
     */
    private setPaginatorIndexOnResponse(): void {
        if (this.matPaginator) {
            this.matPaginator.pageIndex = this.paginator.currentPage
                ? this.paginator.currentPage - 1
                : 0;
        }
    }

    /**
     * event paginator component
     * @param event paginator params
     */
    public eventPaginator(event: PageEvent): void {
        let uri = eventPaginatorFunction(event, this.paginator);
        this.newRequest.emit({
            uri: uri,
            params: this.getParamsRequestLots(),
        })
    }

    public onActionClicked(action: number, order?: IPurchaseOrderModel) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this.actionClicked.emit({
                    action: CONSTANTS.CRUD_ACTION.UPDATE,
                    order,
                });
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.actionClicked.emit({
                    action: CONSTANTS.CRUD_ACTION.DELETE,
                    order,
                });
                break;
            case CONSTANTS.CRUD_ACTION.CREATE:
                this.actionClicked.emit({
                    action: CONSTANTS.CRUD_ACTION.CREATE,
                });
                break;
            case CONSTANTS.CRUD_ACTION.PRINT:
                this.actionClicked.emit({
                    action: CONSTANTS.CRUD_ACTION.PRINT,
                    order: order,
                });
                break;
            case CONSTANTS.CRUD_ACTION.DOWNLOAD:
                this.actionClicked.emit({
                    action: CONSTANTS.CRUD_ACTION.DOWNLOAD,
                    order: order,
                });
                break;
            case CONSTANTS.CRUD_ACTION.READ:
                this._router.navigate([
                    '/routes/purchase-orders/details',
                    order.id,
                ], {
                    queryParams: {
                        fromLiquidate: this.PURCHASE_STATUS.LIQUIDATE == this.currentStatus
                    }
                });
                break;
            case CONSTANTS.CRUD_ACTION.RESEND:
                this._resendPurchaseOrder(order)
            break;
            default:
                break;
        }
    }

    /**
     * sort data
     * @param column column for sort
     */
    public sortData(column: string): void {
        for (const key in this.columnAscState) {
            if (
                Object.prototype.hasOwnProperty.call(
                    this.columnAscState,
                    key
                ) &&
                column !== key
            ) {
                this.columnAscState[key] = true;
            }
        }
        this.columnOrder = column;
        this.columnAscState[column] = !this.columnAscState[column];
        this.newRequest.emit({
            uri: null,
            params: this.getParamsRequestLots(true),
        });
    }
    /**
     * build params for request
     * @returns params for request
     */
    private getParamsRequestLots(fromSort: boolean = false): any {
        let params: any = {};
        if (this.searchText?.length > 0) {
            params.search = trimSpaces(this.searchText);
        }
        if (this.columnOrder) {
            params.order = this.columnOrder;
            params.sort = this.columnAscState[this.columnOrder]
                ? 'desc'
                : 'asc';
        }
        if (this.filterData.date?.start) {
            params.date_init = this.filterData.date.start;
        }
        if (this.filterData.date?.end) {
            params.date_end = this.filterData.date.end;
        }
        params.status =
            this.ordersStatus === this.PURCHASE_STATUS.LIQUIDATE
                ? this.PURCHASE_STATUS.LIQUIDATE
                : this.PURCHASE_STATUS.CREATED;
        return params;
    }

    private _resendPurchaseOrder(order: IPurchaseOrderModel){
        if(this.isOnline){
            this.actionClicked.emit({
                action: CONSTANTS.CRUD_ACTION.RESEND,
                order: order,
            });
        }
        else {
            this._alertService.error(this._i18nPipe.transform('network-offline-status'))
        }
    }

    public onShowLiquidatePurchseOrder(order: IPurchaseOrderModel) {
        this._dialog
            .open(PurchaseOrderSettleComponent, {
                autoFocus: false,
                disableClose: true,
                width: '590px',
                data: {
                    fromList: true,
                    order,
                    currency: this.companyInfo.currency
                },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((result) => {
                if (result) {
                    this.newRequest.emit({
                        uri: null,
                        params: this.getParamsRequestLots(),
                    });
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public getConfig() {
        this._purchaseOrderService
            .getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.configuration = response;
                },
                (error) => {
                    let message = this._errorHandlerService.handleError(
                        error,
                        'weight-note'
                    );
                    this._alertService.errorTitle(error, message);
                    this.blockUI.stop();
                }
            );
    }
}
