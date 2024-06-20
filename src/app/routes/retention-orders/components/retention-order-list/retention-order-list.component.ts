import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { RetentionOrder, RetentionOrderModel } from './../../models/retention-orders-model';
import { RetentionOrdersService } from './../../services/retention-orders.service';
import { ITRFilter, TRFilter, TRFilterRetentionOrderStatus, TRFilterUser, TRFilterUserModel } from 'src/app/shared/models/filter-data.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as printJS from 'print-js';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, tap, debounceTime, switchMap, take, filter } from 'rxjs/operators';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { ModalNotesAssociatedComponent } from 'src/app/routes/weight-note/components/modal-notes-associated/modal-notes-associated.component';
import { WNProductionModel, IWNProductionModel } from 'src/app/routes/weight-note/models/wn-production.model';
import { WeightService } from 'src/app/routes/weight-note/services/weight.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { eventPaginatorFunction } from 'src/app/shared/utils/functions/event-paginator';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { IUserModel, UserModel } from 'src/app/shared/models/user.model';
import { ITag } from 'src/app/shared/models/tags.model';
import { onDeleteTag } from 'src/app/shared/utils/functions/delete-item-from-filter';
import { proccessReportPdf } from 'src/app/shared/utils/files/process-pdf-report';
import { ITRDialogSettings } from 'src/app/shared/models/tr-dialog-settings';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'sst-retention-order-list',
    templateUrl: './retention-order-list.component.html',
    styleUrls: ['./retention-order-list.component.scss']
})
export class RetentionOrderListComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @BlockUI('notes-reception-production') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    @ViewChild('matPaginator', { static: false }) matPaginator: MatPaginator;

    /************INPUTS AND OUTPUTS EVENTS ***************** */
    @Input() searchProductionNoteText: string
    @Input() isOpenFilter: boolean
    @Output() closeFilter = new EventEmitter<boolean>();
    @Output() countSelectedFilters = new EventEmitter<number>();
    @Output() componentReady = new EventEmitter<boolean>();

    readonly RECEIVING_NOTE_STATUS: any = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly WEIGHT_NOTE_STATUS: any = CONSTANTS.WEIGHT_NOTE_STATUS;
    public readonly RETENTION_ORDER_STATUS: any = CONSTANTS.RETENTION_ORDER_STATUS;
    readonly RECEIVING_NOTE_PRODUCTION_STATUS: any = CONSTANTS.RECEIVING_NOTE_PRODUCTION_STATUS;
    readonly ACTIONS = CONSTANTS.CRUD_ACTION;
    public certifications = {};
    public isOpen: boolean = false;
    public isOrderAsc: boolean = false;
    public columnOrder: string = null;
    public columnAscState: any = {}
    public openItem: string;
    public params = {};
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals'))?.general ?? CONSTANTS.DEFAULT_SYSTEM_SETTINGS.GENERAL_DECIMALS;;
    public configuration: ITRConfiguration = new TRConfiguration();
    public retentionOders: Array<RetentionOrderModel> = [];
    public isLoadData = true;
    public isTyping = false;
    public currentLanguage: string = localStorage.getItem('lang');
    /*******PROPIERTIES FOR PRINT NOTE***** */
    public isDisabledPrint = false;
    public file: any;
    public hasPermissionReprint = false;
    public paginator: IPaginator = new Paginator();

    /*********PROPIERTIES FOR SEARCH INPUT********** */
    private _searchText: string
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cancelProductionNotesRequest$: Subject<boolean> = new Subject<boolean>();
    private searchProductionNoteTerm$: Subject<string> = new Subject<string>();
    /*********PROPIERTIES FOR FILTER ********** */
    readonly KEY_FILTER: string = `${CONSTANTS.PERMISSIONS.RETENTION_ORDERS}-${CONSTANTS.CRUD_ACTION.READ}-Filter`
    readonly KEY_TAGS: string = `${CONSTANTS.PERMISSIONS.RETENTION_ORDERS}-${CONSTANTS.CRUD_ACTION.READ}-Tags`
    public paramTags: any[] = [];
    private _filterData: ITRFilter = new TRFilter();

    constructor(
        private _dialog: MatDialog,
        private _alert: AlertService,
        private _alertService: AlertService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _permissionsService: PermissionsService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _i18nPipe: I18nPipe,
        private _i18nService: I18nService,
        private _router: Router,
        private _matdialog: MatDialog,
        private _retentionOrdersService: RetentionOrdersService,
        private _notifier: NotifierService,
    ) {
        this.hasPermissionReprint = this._permissionsService.checkValidity(
            this.PERMISSIONS.RETENTION_ORDERS,
            this.PERMISSION_TYPES.PRINT
        );
        this._listenerChangesLanguaes()

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isOpenFilter && changes.isOpenFilter.currentValue) {
            this.openFilter();
        }
        if (changes.searchProductionNoteText && changes.searchProductionNoteText.currentValue != (changes.searchProductionNoteText.previousValue ?? '')) {
            this._retentionOrdersService.searchTerm$.next(changes.searchProductionNoteText.currentValue);
            //this.searchProductionNoteTerm$.next(changes.searchProductionNoteText.currentValue);
            this._searchText = changes.searchProductionNoteText.currentValue
        }
    }

    ngAfterViewInit(): void {

        this.searchProductionNoteTerm$.pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged(),
            tap((e) => {
                this.isLoadData = true
                this.cancelProductionNotesRequest$.next(true);
                if (!this.blockUI.isActive) {
                    this.blockUI.start();
                }
            }),
            debounceTime(500),
            switchMap(() =>
                this._retentionOrdersService.getRetentionOrders(null, this._getParamsRequestRetentionOrders())
            )
        ).subscribe(
            (response: { data: RetentionOrderModel[], paginator: IPaginator }) => {
                this._setRetentionOrders(response)
            },
            (error: HttpErrorResponse) => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'lots')
                );
                this.blockUI.stop();
                this.isLoadData = false;
            }
        );
        //avoid angulars NG1000 error
        setTimeout(() => {
            if (this._filterData) {
                this.countSelectedFilters.emit(new TRFilter(this._filterData).countSelectedFilters())
            }
        }, 0);
    }

    ngOnInit() {
        this.componentReady.emit(true)
        this._getConfiguration();
        this.initializeColumnState();
        this._initSearch();
        this._filterData = this._retentionOrdersService.getFilterStorage() ?? new TRFilter();
        this.paramTags = this._retentionOrdersService.getTagsStorage() ?? [] as ITag[]
        this._getRetentionOrders(null, this._getParamsRequestRetentionOrders())
    }

    ngOnDestroy() {
        this.cancelProductionNotesRequest$.next(true);
        this.cancelProductionNotesRequest$.complete();
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private _listenerChangesLanguaes() {
        this._i18nService.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((l) => (this.currentLanguage = l));
    }

    /*****************EVENTS****************** */
    private _initSearch(): void {
        this._searchText = ''
        this._retentionOrdersService.searchTerm$.pipe(takeUntil(this.destroy$))
            .subscribe((filter) => {
                this._searchText = filter ?? '';
                this.isTyping = this._searchText !== ''
                this.searchProductionNoteTerm$.next(this._searchText);
            })
    }

    get DataEmptyComponent() {
        return {
            customMessage: this.isTyping ? false : "retention-orders-list-empty",
            imgName: this.isTyping && this.retentionOders.length == 0 ? 'search-empty' : "retention-empty",
            buttonLink: this.isTyping && this.retentionOders.length == 0 ? undefined : { symbol: '+', link: 'create', label: 'retention-orders-new-retention' }
        }
    }

    public onDeleteTag(tag: ITag): void {

        this._filterData = onDeleteTag(tag, this._filterData)
        this.countSelectedFilters.emit(new TRFilter(this._filterData).countSelectedFilters())
        localStorage.setItem(this.KEY_FILTER, JSON.stringify(this._filterData))
        this._getRetentionOrders(null, this._getParamsRequestRetentionOrders())
    }

    private initializeColumnState(): void {
        this.columnOrder = 'retention_date';
        this.columnAscState = {
            retention_date: false,
            id: true,
            seller: true,
            ihcafe: true,
            weight: true
        };
    }

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
        this._getRetentionOrders(null, this._getParamsRequestRetentionOrders());
    }

    private _getParamsRequestRetentionOrders(): any {
        let params: any = {};
        if (this._searchText?.length > 0) {
            params.search = trimSpaces(this._searchText);
        }
        if (this.columnOrder) {
            params.order = this.columnOrder;
            params.sort = this.columnAscState[this.columnOrder]
                ? 'asc'
                : 'desc';
        }
        if (this._filterData.retentionOrderStatus?.status?.some(x => x.selected == true)) {
            params['status[]'] = Array.from(this._filterData.retentionOrderStatus.status.filter(x => x.selected).map(x => x.status));
        } else {
            delete this.params['status[]'];
        }

        if (this._filterData?.users?.users?.length > 0) {
            const users: number[] = this._filterData?.users.users.map((user: IUserModel) => user.id);
            params['created_by[]'] = users;
        } else {
            delete this.params['created_by[]'];
        }

        if (this._filterData.date?.start) {
            params.start_date = this._filterData.date.start;
            params.start_date = moment(params.start_date)
                .startOf('day')
                .utc()
                .format('YYYY-MM-DD HH:mm:ss');
        }
        if (this._filterData.date?.end) {
            params.end_date = this._filterData.date.end;
            params.end_date = moment(params.end_date)
                .endOf('day')
                .utc()
                .format('YYYY-MM-DD HH:mm:ss');
        }
        return params;
    }

    private _getRetentionOrders(uri: string = null, params: any = {}): void {
        this.isLoadData = true;
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._retentionOrdersService.getRetentionOrders(uri, params).
            pipe(takeUntil(this.cancelProductionNotesRequest$), take(1)).subscribe(
                (response: { data: RetentionOrderModel[], paginator: IPaginator }) => {
                    this._setRetentionOrders(response)
                },
                (error) => {
                    this.blockUI.stop();
                    this.isLoadData = false;
                    const message: string = this._errorHandlerService.handleError(error, 'weight-note');
                    this._alert.error(message);
                })
    }

    private _setRetentionOrders(response: { data: RetentionOrderModel[], paginator: IPaginator }) {
        this.paginator = response.paginator;
        this.retentionOders = response.data;
        this.blockUI.stop();
        this.isLoadData = false;
    }

    private _getConfiguration(): void {
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._purchaseOrderService.getConfiguration()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (configuration) => {
                    this.configuration = configuration;
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(
                        error,
                        'weight-note'
                    );
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
    }

    public eventPaginator(event: PageEvent): void {
        let uri = eventPaginatorFunction(event, this.paginator);
        this._getRetentionOrders(uri, this._getParamsRequestRetentionOrders());
    }

    private createFilterRetentionOrderStatus() {
        const labelsEstatus = { open:'open' , closed:'closed' , voided : 'retention-order-status-voided'}
        let lookups: Array<{ label: string, name?: string, status?: number, order?: number, selected?: boolean }> = []
        const props = Object.keys(this.RETENTION_ORDER_STATUS)
        lookups.push({ label: labelsEstatus.open, name: props[0], status: this.RETENTION_ORDER_STATUS.OPEN, order: 1, selected: false })
        lookups.push({ label: labelsEstatus.closed, name: props[1], status: this.RETENTION_ORDER_STATUS.CLOSED, order: 2, selected: false })
        lookups.push({ label: labelsEstatus.voided, name: props[2], status: this.RETENTION_ORDER_STATUS.DISABLED, order: 3, selected: false })
        return lookups
    }

    public openFilter() {
        if (this._filterData.isFirstTime) {
            this.createFilterRetentionOrderStatus()
            const titleUser = 'filter-retention-orders-label-user'
            this._filterData.retentionOrderStatus = new TRFilterRetentionOrderStatus({ lookups: this.RETENTION_ORDER_STATUS, status: this.createFilterRetentionOrderStatus() })
            this._filterData.sealsRequired = false
            this._filterData.isFirstTime = false
            this._filterData.users = new TRFilterUserModel({ label: titleUser, required: true })
        }
        this._dialog
            .open(FiltersComponent, {
                autoFocus: false,
                disableClose: true,
                data: this._filterData,
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe((result: any) => {

                this.closeFilter.emit(false)
                if (result) {
                    this._filterData = result.data;
                    this.paramTags = result.tags
                    if (result.refresh) {
                        localStorage.setItem(this.KEY_FILTER, JSON.stringify(this._filterData))
                        localStorage.setItem(this.KEY_TAGS, JSON.stringify(this.paramTags))
                        this.countSelectedFilters.emit(new TRFilter(this._filterData).countSelectedFilters())
                        this._getRetentionOrders(null, this._getParamsRequestRetentionOrders());
                    }
                }
            });
    }

    //#region FUNCTIONS TO PRINT
    public async onActionClicked(action: number, order: RetentionOrderModel) {
        //TODO: implements actions from list
        this.blockUI.start()
        switch (action) {
            case this.ACTIONS.UPDATE: {
                this._router.navigate(['routes/retention-orders/edit', order.id], {
                    queryParams: {
                        isEdit: true
                    }
                });
                break;
            }
            case this.ACTIONS.CLOSE: {
                this.blockUI.start()
                this._retentionOrdersService.updateStatusRetentionOrder(order.id).subscribe((data: any) => {
                    this.actionPDF(order, this.ACTIONS.PRINT)
                    this._getRetentionOrders(null, this._getParamsRequestRetentionOrders());
                }, err => {
                    this.blockUI.stop()
                    let message: string = this._errorHandlerService.handleError(err, 'rentention-orders');
                    this._alert.errorTitle(this._i18nPipe.transform('error-msg'), message);
                })
                break;
            }
            case this.ACTIONS.READ: {
                this._router.navigate([
                    '/routes/shipping-ticket/details',
                    order.id,
                ]);
                break;
            }
            case this.ACTIONS.PRINT:
            case this.ACTIONS.DOWNLOAD: {
                try {
                    this.actionPDF(order, action)
                    break;
                } catch (error) {
                    this.blockUI.stop()
                }
            }
                break
            case this.ACTIONS.VIEW:
                break
            case this.ACTIONS.VOID:
                break
            case this.ACTIONS.DELETE:
                this._execDeletedDialog(order)
                break

        }
    }

    public async actionPDF(order: RetentionOrderModel, action: number = this.ACTIONS.DOWNLOAD) {
        await this.reportRetentionOrder(order.id);
        const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG;
        proccessReportPdf(this._alert, this._errorHandlerService, this._i18nPipe, this._router, this.blockUI, this.file, order.folio, action)
    }

    public async reportRetentionOrder(id: string, format: string = 'pdf',) {
        try {
            let result = await this._retentionOrdersService.reportRetentionOrder(id, format, this.currentLanguage);
            this.file = format == 'pdf' ? result.data : null;
        } catch (e) {
            this.blockUI.stop()
            let message: string = this._errorHandlerService.handleError(e, 'note');
            this._alert.errorTitle(this._i18nPipe.transform('error-msg'), message);
            throw e;
        }
    }

    public checkAvailabilityPrint(order: RetentionOrderModel) {
        this.isDisabledPrint = !this.hasPermissionReprint
    }
    //#endregion

    public onEdit(weightNote: IWNProductionModel) {
        if (weightNote.associated == null) {
            this._router.navigate(
                ['routes', 'weight-note', 'receiving-ticket', weightNote.receptionId, weightNote.transactionInId],
                { queryParams: { allowEditProducer: weightNote.associated == null, fromProduction: true, isFromNoteList: true } }
            )
        } else {
            this._matdialog.open(
                ModalNotesAssociatedComponent,
                {
                    data: {
                        note: null,
                        weightNote,
                        modalAssociatedNoteType: CONSTANTS.MODAL_ASSOCIATED_NOTE_TYPE.PRODUCTION_WEIGHT_NOTE
                    }
                }
            )
        }
    }

    private _execVoidDialog(order: RetentionOrderModel) {
        try {
            const settingsDialogComponent: ITRDialogSettings = {
                title: this._i18nPipe.transform('retention-void-question').replace('[value]', order.folio),
                onlyMessage: this._i18nPipe.transform('retention-void-question-message'),
                okButton: { label: 'void', class: 'tr__button__delete' },
                withReason: true
            }
            this.blockUI.start();
            this._dialog.open(ConfirmationDialogComponent, {
                autoFocus: false,
                disableClose: true,
                data: settingsDialogComponent,
            }).afterClosed().pipe(takeUntil(this.destroy$))
                .subscribe(
                    (result) => {
                        result.action == CONSTANTS.CRUD_ACTION.ACCEPT ? this._sendOrderToVoid(order , result.reason) :  this.blockUI.stop();
                    }, null, () => {
                        this.blockUI.stop();
                    });
        } catch (error) {
            this.blockUI.stop();
        }
    }

    private _execDeletedDialog(order: RetentionOrderModel) {
        try {
            const settingsDialogComponent: ITRDialogSettings = {
                title: this._i18nPipe.transform('retention-delete-question').replace('[value]', order.folio),
                okButton: { label: 'delete', class: 'tr__button__delete' },
                withReason: false
            }
            this.blockUI.start();
            this._dialog.open(ConfirmationDialogComponent, {
                autoFocus: false,
                disableClose: true,
                data: settingsDialogComponent,
            }).afterClosed().pipe(takeUntil(this.destroy$))
                .subscribe(

                    (result) => {
                       const action = result.hasOwnProperty('action') ?  result.action  : result
                       action == CONSTANTS.CRUD_ACTION.ACCEPT ? this._sendOrderToDeleted(order) :  this.blockUI.stop();
                    }, null, () => {
                        this.blockUI.stop();
                    });
        } catch (error) {
            this.blockUI.stop();
        }
    }

    private _sendOrderToVoid(order: RetentionOrderModel , reason: string): void {
        this._retentionOrdersService.voidRetentionOrder(order.id, reason).subscribe((data: any) => {
            this._notifier.notify('success', this._i18nPipe.transform('retention-order-void-success').replace('[value]', order.folio));
            this.blockUI.stop()
            this.ngOnInit();
        }, err => {
            this.blockUI.stop()
            let message: string = this._errorHandlerService.handleError(err, 'rentention-orders');
            this._alertService.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
        })
    }
    private _sendOrderToDeleted(order: RetentionOrderModel): void {
        this._retentionOrdersService.deleteRetentionOrder(order.id).subscribe((data: any) => {
            this._notifier.notify('success', this._i18nPipe.transform('retention-order-deleted-success').replace('[value]', order.folio));
            this.blockUI.stop()
            this.ngOnInit();
        }, err => {
            this.blockUI.stop()
            let message: string = this._errorHandlerService.handleError(err, 'rentention-orders');
            this._alertService.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
        })
    }


}
