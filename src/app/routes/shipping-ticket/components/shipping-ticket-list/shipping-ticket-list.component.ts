import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
//import { FilterSectionModel, ITRFilter, ITRFilterStatusModel, TRFilter, TRFilterUserModel } from 'src/app/shared/models/filter-data.model';
import { FilterSectionModel, ITRFilter, ITRFilterStatusModel, TRFilter, TRFilterRetentionOrderStatus, TRFilterUser, TRFilterUserModel } from 'src/app/shared/models/filter-data.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ShippingTicketService } from '../../services/shipping-ticket.service';
import { distinctUntilChanged, take, takeUntil, tap, switchMap, debounceTime, filter } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ISTGeneralInformationModel, STGeneralInformationModel } from '../../models/st-general-information.model';
import { ShippingTicketGenerateReports } from '../shared/shipping-ticket-generate-reports';
import { NotifyService } from '../../../../shared/notifier/notify.service';
import { NotifierService } from 'angular-notifier';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ITRDialogSettings } from '../../../../shared/models/tr-dialog-settings';
import { eventPaginatorFunction } from 'src/app/shared/utils/functions/event-paginator';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { ITag } from 'src/app/shared/models/tags.model';
import { onDeleteTag } from 'src/app/shared/utils/functions/delete-item-from-filter';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { IUserModel } from 'src/app/shared/models/user.model';
import { RetentionOrdersService } from 'src/app/routes/retention-orders/services/retention-orders.service';

@Component({
    selector: 'app-shipping-ticket-list',
    templateUrl: './shipping-ticket-list.component.html',
    styleUrls: ['./shipping-ticket-list.component.scss']
})
export class ShippingTicketListComponent implements OnInit, OnDestroy {
    @BlockUI('shipping-tickets-list') blockUI: NgBlockUI;
    @ViewChild('matPaginator', { static: false }) matPaginator: MatPaginator;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public searchText: string = '';
    public PERMISSION_TAG = CONSTANTS.PERMISSIONS.SHIPPING_TICKET;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public readonly SHIPPING_TICKET_STATUS: any = CONSTANTS.SHIPPING_TICKET_STATUS;
    readonly ACTIONS = CONSTANTS.CRUD_ACTION;
    public columnOrder: string = 'created_at';
    public columnAscState: any = {};
    public destroy$ = new Subject();
    public shippingTickets: ISTGeneralInformationModel[] = [];
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals')
        ? JSON.parse(localStorage.getItem('decimals')).general
        : CONSTANTS.DEFAULT_SYSTEM_SETTINGS.GENERAL_DECIMALS;
    readonly SHIPPING_STATUS: any = CONSTANTS.SHIPPING_TICKET_STATUS;
    private searchTerm$: Subject<string> = new Subject<string>();
    private _timeout: any;
    private generateReportsHelpClass: any;
    public paginator: Paginator;
    public imgNoData: string = 'shipping-ticket-empty';
    public config: ITRConfiguration = new TRConfiguration();

    /*********PROPIERTIES FOR FILTER ********** */
    readonly KEY_FILTER: string = `${CONSTANTS.PERMISSIONS.SHIPPING_TICKET}-${CONSTANTS.CRUD_ACTION.READ}-Filter`
    readonly KEY_TAGS: string = `${CONSTANTS.PERMISSIONS.SHIPPING_TICKET}-${CONSTANTS.CRUD_ACTION.READ}-Tags`
    public paramTags: any[] = [];
    private _filterData: ITRFilter = new TRFilter();
    constructor(private _shippingService: ShippingTicketService,
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _router: Router,
        private _notifyService: NotifierService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _dialog: MatDialog) {
        this.initializeColumnState();
    }

    ngOnInit() {
        this._filterData = this._shippingService.getFilterStorage() ?? new TRFilter();
        this.paramTags = this._shippingService.getTagsStorage() ?? [] as ITag[]
        this.generateReportsHelpClass = new ShippingTicketGenerateReports(this._shippingService, this._alertService, this._i18nPipe, this._errorHandlerService, this._router);
        this.searchTerm$
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                filter(() => !this.blockUI.isActive),
                tap((e) => {
                    this.shippingTickets = [];
                    this.blockUI.start();
                }),
                switchMap(() => this._shippingService.getShippingTicketsFilter(this.getParamsRequest()))
            )
            .subscribe(
                (response: { data: ISTGeneralInformationModel[]; pagination: Paginator }) => {
                    this._setShippingTickets(response);
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'lots')
                    );
                    this.blockUI.stop();
                }
            );

        this._shippingService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe((filter: string) => {
            this.searchText = filter ?? ''
            this.searchTerm$.next(this.searchText)
        })
        this.getConfig();
    }

    public getConfig() {
        this.blockUI.start();
        this._purchaseOrderService.getConfiguration()
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

    private _getShippingTickets(uri: string = null, params: any = {}) {
        this.blockUI.start();
        this._shippingService.getShippingTickets(uri, params)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: { data: ISTGeneralInformationModel[]; pagination: Paginator }) => {
                this._setShippingTickets(response)
            },
                error => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(
                            error,
                            'shipping-tickets'
                        )
                    );
                    this.blockUI.stop();
                });
    }

    private _setShippingTickets(response: { data: ISTGeneralInformationModel[]; pagination: Paginator }) {
        this.blockUI.stop();
        this.shippingTickets = response.data;
        this.paginator = response.pagination;
        this.setPaginatorIndexOnResponse();
    }
    /**
    * init column, is posible call in liquitate list
    */
    private initializeColumnState(): void {
        this.columnOrder = 'created_at';
        this.columnAscState = {
            created_at: true,
            ticket_number: false,
            company_name_origin: false,
            company_name_destination: false,
            total_payment: false,
            net_weight: false,
        };
    }
    private setPaginatorIndexOnResponse(): void {
        if (this.matPaginator) {
            this.matPaginator.pageIndex = this.paginator.currentPage
                ? this.paginator.currentPage - 1
                : 0;
        }
    }
    /**
    * build params for request
    * @returns params for request
    */
    private getParamsRequest(fromSort: boolean = false): any {
        let params: any = {};
        if (this.searchText?.length > 0) {
            params.q = trimSpaces(this.searchText);
        }
        if (this.columnOrder) {
            params.order = this.columnOrder;
            params.sort = this.columnAscState[this.columnOrder]
                ? 'desc'
                : 'asc';
        }
        if (this._filterData.date?.start) {
            params.date_init = this._filterData.date.start;

        }
        if (this._filterData.date?.end) {
            params.date_end = this._filterData.date.end;

        }
        if (fromSort) {
            params.page = this.paginator.currentPage;
        }

        if (this._filterData?.users?.users?.length > 0) {
            const users: number[] = this._filterData?.users.users.map((user: IUserModel) => user.id);
            params['created_by[]'] = users;
        }

        if (this._filterData?.shippingTicketStatus?.filters?.length > 0) {
            params['status[]'] = Array.from(this._filterData.shippingTicketStatus.filters.filter(x => x.selected).map(x => x.status));
        }


        return params;
    }

    public onTypeSearchInput(event: any): void {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.searchTerm$.next(trimSpaces(this.searchText));
        }, 600);

    }
    public eventPaginator(event: PageEvent): void {
        let uri = eventPaginatorFunction(event, this.paginator);
        this._getShippingTickets(uri, this.getParamsRequest());
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
        this._getShippingTickets(null, this.getParamsRequest())
    }

    public onClearSearching() {
        this.searchText = '';
        this._shippingService.searchTerm$.next(this.searchText);
    }
    public openFilter(): void {
        if (this._filterData.isFirstTime) {
            const titleUser = 'filter-shipping-ticket-label-user'
            this._filterData.shippingTicketStatus = this._createFilterShippingTicketStatus()
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
                if (result) {
                    this._filterData = result.data;
                    this.paramTags = result.tags
                    if (result.refresh) {
                        localStorage.setItem(this.KEY_FILTER, JSON.stringify(this._filterData))
                        localStorage.setItem(this.KEY_TAGS, JSON.stringify(this.paramTags))
                        this._getShippingTickets(null, this.getParamsRequest())
                    }
                }
            });
    }

    public onDeleteTag(tag: ITag): void {
        this._filterData = onDeleteTag(tag, this._filterData)
        localStorage.setItem(this.KEY_FILTER, JSON.stringify(this._filterData))
        this._getShippingTickets(null, this.getParamsRequest())
    }

    private _createFilterShippingTicketStatus() : FilterSectionModel{
        const labelsEstatus = { open:'open' , closed:'closed' , voided : 'retention-order-status-voided'}
        let lookups: Array<ITRFilterStatusModel> = []
        const props = Object.keys(this.SHIPPING_TICKET_STATUS)
        let status = { cssButton: { label: labelsEstatus.open, icon:'icon-note-open', cssButton:'filter-form__status-button--open'}, name: props[0], status: this.SHIPPING_TICKET_STATUS.OPEN, order: 1, selected: false }
        lookups.push(status)
        status ={cssButton: { label: labelsEstatus.closed, icon:'icon-note-close', cssButton:'filter-form__status-button--closed'}, name: props[1], status: this.SHIPPING_TICKET_STATUS.CLOSED, order: 2, selected: false }
        lookups.push(status)
        status ={cssButton: { label: labelsEstatus.voided, icon:'icon-note-canceled', cssButton:'filter-form__status-button--canceled'}, name: props[3], status: this.SHIPPING_TICKET_STATUS.VOIDED, order: 3, selected: false }
        lookups.push(status)
        return new FilterSectionModel({sectionName:'filter-shipping-ticket-label-status', filters:lookups})
    }


    public onActionClicked(action: number, shippingTicket: ISTGeneralInformationModel) {
        //TODO: implements actions from list
        switch (action) {
            case this.ACTIONS.UPDATE: {
                this._router.navigate([
                    '/routes/shipping-ticket/edit',
                    shippingTicket.id,
                ]);
                break;
            }
            case this.ACTIONS.DELETE: {
                break;
            }
            case this.ACTIONS.READ: {
                this._router.navigate([
                    '/routes/shipping-ticket/details',
                    shippingTicket.id,
                ]);
                break;
            }
            case this.ACTIONS.PRINT:
            case this.ACTIONS.DOWNLOAD: {
                const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG;
                this.generateReportsHelpClass.onGenerateReportPdf(this.blockUI, lang, shippingTicket, action);
                break;
            }
        }
    }

    public onCloseShippingEvent(shippingTicket: ISTGeneralInformationModel) {
        const settingsDialogComponent: ITRDialogSettings = {
            title: this._i18nPipe.transform('shipping-note-close-dialog-confirmation').replace('value', shippingTicket.folio),
        }
        this._dialog.open(ConfirmationDialogComponent, {
            autoFocus: false,
            disableClose: true,
            data: settingsDialogComponent,
        }).afterClosed().pipe(takeUntil(this.destroy$)).subscribe(
            (action: number) => {
                if (action === CONSTANTS.CRUD_ACTION.ACCEPT) {
                    this.closeShippingTicket(shippingTicket);
                }
            });
    }

    private closeShippingTicket(shippingTicket: ISTGeneralInformationModel) {
        this.blockUI.start();
        this._shippingService.closeShippingTicket(shippingTicket.id)
            .pipe(take(1))
            .subscribe(
                () => {
                    this._notifyService.notify(
                        'success',
                        this._i18nPipe.transform('shipping-ticket-closed')
                    );
                    const lang = localStorage.getItem('lang') ?? CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG;
                    this.generateReportsHelpClass
                        .onGenerateReportPdf(this.blockUI, lang, shippingTicket, CONSTANTS.CRUD_ACTION.PRINT);
                    shippingTicket.ticketStatus = CONSTANTS.SHIPPING_TICKET_STATUS.CLOSED;
                    this.blockUI.stop;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
