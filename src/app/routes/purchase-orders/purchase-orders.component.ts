import * as FileSaver from 'file-saver';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as printJS from 'print-js';
import { debounceTime, distinctUntilChanged, filter, take, takeUntil, switchMap, tap } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { MainHeaderComponent } from 'src/app/shared/main-header/main-header.component';
import { ITRFilter, TRFilter } from 'src/app/shared/models/filter-data.model';
import { FileDownloadService } from 'src/app/shared/services/file-download/file-download.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import {
    PurchaseOrderDeleteComponent
} from './components/purchase-order-delete/purchase-order-delete.component';
import { IPurchaseOrderModel, PurchaseOrderModel, RequestResentSettling, RequestResentSettlingModel } from './models/purchase-order.model';
import { PurchaseOrdersService } from './services/purchase-orders.service';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { Subject } from 'rxjs';
import { IWCompanyInfoModel, WCompanyInfoModel } from '../weight-note/models/company-info.model';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-purchase-orders',
    templateUrl: './purchase-orders.component.html',
    styleUrls: ['./purchase-orders.component.scss'],
})/*  */
export class PurchaseOrdersComponent
    extends SubscriptionManagerDirective
    implements OnInit, AfterViewInit {
    @ViewChild(MainHeaderComponent) private _header: MainHeaderComponent;
    @BlockUI('purchase-orders-layout') blockUI: NgBlockUI;
    public permissionTag = CONSTANTS.PERMISSIONS.PURCHASE_ORDER;
    public permissionType = CONSTANTS.PERMISSION_TYPES.CREATE;
    public PURCHASE_STATUS = CONSTANTS.PURCHASE_ORDER_STATUS;
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public currentStatus: number = this.PURCHASE_STATUS.CREATED;
    public createdFilterData: ITRFilter = new TRFilter();
    public liquidatedFilterData: ITRFilter = new TRFilter();
    public createdOrders: IPurchaseOrderModel[] = [];
    public liquidatedOrders: IPurchaseOrderModel[] = [];
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public selectedTabIndex: number = 1;
    public searchText: string = '';
    public orderSearch: string = '';
    public hasFilter = false;
    public countFilter = 0;
    private _safeParams: any = {};
    private _timeout: any;
    private destroySearch$: Subject<boolean> = new Subject<boolean>();
    private currentRequest: {
        uri: string;
        params: any;
    };
    public currentLang: string;
    public paginator: IPaginator = new Paginator();
    public companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    public config: ITRConfiguration = new TRConfiguration();
    constructor(
        private _dialog: MatDialog,
        private _purchaseService: PurchaseOrdersService,
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _router: Router,
        private _fileDownLoader: FileDownloadService,
        private _i18n: I18nService,
        private _activatedRoute: ActivatedRoute,
        private ref: ChangeDetectorRef,
        private _notifierService: NotifierService,
    ) {
        super();
        const queryParams = this._activatedRoute.snapshot.queryParams;
        this.currentStatus =
            queryParams.fromLiquidate === 'true'
                ? this.PURCHASE_STATUS.LIQUIDATE
                : this.PURCHASE_STATUS.CREATED;
        this.selectedTabIndex =
            this.currentStatus === this.PURCHASE_STATUS.CREATED ? 0 : 1;
        this._updateRoute();

    }

    ngOnInit() {
        this.createdFilterData.sealsRequired = false;
        this.liquidatedFilterData.sealsRequired = false;
        this._i18n.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((lang) => (this.currentLang = lang));

        this._purchaseService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe((filter: any) => {
            this.searchText = filter ?? ''
            this._safeParams.search = filter ?? '';
        })
        this.getCompanyInfo(this._purchaseService);
        this.getConfig();
    }

    public getConfig() {
        this.blockUI.start();
        this._purchaseService.getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.config = response;
                },
                (error) => {
                    this.blockUI.stop();
                    const message: string = this._errorHandlerService.handleError(
                        error,
                        'note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            );
    }


    public ngAfterViewInit() { }

    private _initSearch(): void {
        this._header?.eventSearchInput
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntil(this.destroySearch$),
                filter(() => !this.blockUI.isActive),
                tap((v) => {
                    this._safeParams.search = v
                    this.blockUI.start();
                }),
                switchMap(() => this._purchaseService.getPurchaseOrdersFiltered(null, this._safeParams))
            )
            .subscribe((result: { data: IPurchaseOrderModel[]; pagination: IPaginator }) => {
                this._setPurchaseOrders(result)
            });

    }

    public getCompanyInfo(_purchaseService: PurchaseOrdersService) {
        this.blockUI.start();
        _purchaseService.getCompanyInfo().pipe(take(1)).subscribe(
            (response) => {
                this.companyInfo = new WCompanyInfoModel(response.data);
            },
            (error) => {
                const message: string = this._errorHandlerService.handleError(
                    error,
                    'note'
                );
                this.blockUI.stop();
            }
        );

    }

    private _updateRoute(): void {
        this._router.navigate(['.'], {
            relativeTo: this._activatedRoute,
            queryParams: {
                fromLiquidate: this.selectedTabIndex === 0 ? 'false' : 'true',
            },
        });
    }


    /**
     * get purchase order list
     * @param uri uri
     * @param params params
     */
    private getPurchaseOrders(uri: string = null, params: any = {}) {
        this._safeParams = params;
        this.blockUI.start();
        this._purchaseService
            .getPurchaseOrders(uri, params)
            .pipe(take(1))
            .subscribe(
                (result: { data: IPurchaseOrderModel[]; pagination: IPaginator }) => {
                    this._setPurchaseOrders(result)
                },
                (error) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(
                            error,
                            'purchase_orders'
                        )
                    );
                    this.blockUI.stop();
                }
            );
    }

    private _setPurchaseOrders(result: { data: IPurchaseOrderModel[]; pagination: IPaginator }) {
        if (this.currentStatus === this.PURCHASE_STATUS.CREATED) {
            this.createdOrders = result.data;
        }
        if (this.currentStatus === this.PURCHASE_STATUS.LIQUIDATE) {
            this.liquidatedOrders = result.data;
        }
        this.paginator = result.pagination;
        this.blockUI.stop();
    }

    /**
     * Open modal delete purchase
     * @param purchaseOrder order for delete
     */
    public openDeleteDialog(purchaseOrder: IPurchaseOrderModel): void {
        this._dialog
            .open(PurchaseOrderDeleteComponent, {
                autoFocus: false,
                disableClose: true,
                data: purchaseOrder,
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: { refresh: boolean }) => {
                if (response.refresh) {
                    this.getPurchaseOrders(null, this._safeParams);
                }
            });
    }

    public onTabClick(tab: MatTabChangeEvent): void {
        this._clearFilters();
        this.currentStatus =
            this.currentStatus !== this.PURCHASE_STATUS.LIQUIDATE
                ? this.PURCHASE_STATUS.LIQUIDATE
                : this.PURCHASE_STATUS.CREATED;
        this._purchaseService.searchTerm$.next('');
        this.createdOrders = [];
        this.liquidatedOrders = [];
        this.selectedTabIndex = tab.index;
        this._updateRoute();
        this.destroySearch$.next(true)
        this.destroySearch$.complete()
    }

    private _clearFilters(): void {
        this.hasFilter = false;
        this.createdFilterData = new TRFilter();
        this.liquidatedFilterData = new TRFilter();
        this.createdFilterData.sealsRequired = false;
        this.liquidatedFilterData.sealsRequired = false;
    }

    public onActionClicked(event: {
        action: number;
        order?: PurchaseOrderModel;
    }) {
        switch (event.action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this._router.navigate([
                    '/routes/purchase-orders/edit',
                    event.order.id,
                ]);
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.openDeleteDialog(event.order);
                break;
            case CONSTANTS.CRUD_ACTION.CREATE:
                this._router.navigate(['/routes/purchase-orders/new']);
                break;
            case CONSTANTS.CRUD_ACTION.DOWNLOAD:
                this.onDownloadOrderPdf(event.order);
                break;
            case CONSTANTS.CRUD_ACTION.PRINT:
                this.onPrintdOrderPdf(event.order);
                break;
            case CONSTANTS.CRUD_ACTION.RESEND:
                this._resendPurchaseOrder(event.order);
                break;
            default:
                break;
        }
    }

    public onEventSearch(value): void { }

    public onNewRequestEvent(event: { uri: string; params: any }) {
        this.currentRequest = event;
        this._safeParams = { ...this._safeParams, ...event.params };
        this.blockUI.start();
        this._purchaseService.getPurchaseOrdersFiltered(this.currentRequest.uri, this._safeParams)
            .pipe(take(1))
            .subscribe((result: { data: IPurchaseOrderModel[]; pagination: IPaginator }) => {
                this._setPurchaseOrders(result)
            });
    }

    public onComponentComplete(value): void {
        this._initSearch();
    }

    public openFilter() {
        this._dialog
            .open(FiltersComponent, {
                autoFocus: false,
                disableClose: true,
                data:
                    this.currentStatus === this.PURCHASE_STATUS.CREATED
                        ? this.createdFilterData
                        : this.liquidatedFilterData,
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe(
                (result: {
                    data: ITRFilter;
                    refresh: boolean;
                    hasSelectedFilters: boolean;
                }) => {
                    if (result) {
                        if (
                            this.currentStatus === this.PURCHASE_STATUS.CREATED
                        ) {
                            this.createdFilterData = result.data;
                        }
                        if (
                            this.currentStatus ===
                            this.PURCHASE_STATUS.LIQUIDATE
                        ) {
                            this.liquidatedFilterData = result.data;
                        }
                        this.hasFilter = result.hasSelectedFilters;
                        this.countFilter = this.hasFilter ? 1 : 0;
                    }
                }
            );
    }

    /**
     * for download action
     */
    public onDownloadCsv() {
        this.blockUI.start();
        this._purchaseService
            .getPurchaseOrdersCSV(this.currentRequest.params, this.currentLang)
            .pipe(take(1))
            .subscribe(
                (file) => {
                    const fileName =
                        this.currentStatus === this.PURCHASE_STATUS.CREATED
                            ? `${this._i18nPipe.transform(
                                'purchase-orders-list-file'
                            )}.csv`
                            : `${this._i18nPipe.transform(
                                'purchase-orders-liquidated-list'
                            )}.csv`;
                    this._fileDownLoader.downloadFromURL(file, fileName);
                    this.blockUI.stop();
                },
                () => {
                    this.blockUI.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
            );
    }

    public onDownloadOrderPdf(order: IPurchaseOrderModel) {
        this.blockUI.start();
        this._purchaseService
            .getPurchaseOrderPDF(order.id, this.currentLang)
            .pipe(take(1))
            .subscribe(
                (file: any) => {
                    const byteArray = new Uint8Array(
                        atob(file.data)
                            .split('')
                            .map((char) => char.charCodeAt(0))
                    );
                    const blob = new Blob([byteArray], {
                        type: 'application/pdf',
                    });
                    const url = window.URL.createObjectURL(blob);
                    FileSaver.saveAs(url, `${order.folio}-report.pdf`);
                    this.blockUI.stop();
                },
                () => {
                    this.blockUI.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
            );
    }

    public onPrintdOrderPdf(order: IPurchaseOrderModel) {
        this.blockUI.start();
        this._purchaseService
            .getPurchaseOrderPDF(order.id, this.currentLang)
            .pipe(take(1))
            .subscribe(
                (file: any) => {
                    printJS({
                        printable: file.data,
                        type: 'pdf',
                        base64: true,
                        onError: (error) => {
                            const message: string =
                                this._errorHandlerService.handleError(
                                    error,
                                    'print'
                                );
                            this.blockUI.stop();
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                message
                            );
                        },
                    });
                    this.blockUI.stop();
                },
                () => {
                    this.blockUI.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
            );
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$.next(true);
        this.destroy$.complete();
        super.ngOnDestroy();

    }


    private _resendPurchaseOrder(order: IPurchaseOrderModel) {
        this.blockUI.start();
        this._purchaseService.resendSettlement(new RequestResentSettlingModel(order)).pipe(take(1)).subscribe((data: any) => {
            this._notifierService.notify(
                'success',
                this._i18nPipe.transform(data.data[`wks-resent`][0])
            );
            this.blockUI.stop();
            this.getPurchaseOrders(null, this._safeParams)
        }, error => {
            this._alertService.errorTitle(
                this._i18nPipe.transform('error-msg'),
                this._errorHandlerService.handleError(
                    error, 'purchase-orders'
                )
            );
            this.blockUI.stop();
            this.getPurchaseOrders(null, this._safeParams)
        })
    }
}
