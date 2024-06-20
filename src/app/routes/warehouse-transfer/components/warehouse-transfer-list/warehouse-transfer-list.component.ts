import { TRFilterProductionStatus } from '../../../../shared/models/filter-data.model';
import { take, distinctUntilChanged, tap, debounceTime, takeUntil, switchMap } from 'rxjs/operators';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { MatDialog } from '@angular/material/dialog';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { eventPaginatorFunction } from 'src/app/shared/utils/functions/event-paginator';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { FiltersComponent } from '../filter/filter.component';
import { IWarehouseTransferModel, WarehouseTransferModel } from '../../models/warehouse-transfer-list.model';
import { warehouseTransferService } from '../../services/warehouse-transfer.service';
import { ITRFilter, TRFilter } from '../../models/filter-data.model';
import { getKeyByValue } from 'src/app/shared/utils/functions/key-by-value';
import * as FileSaver from 'file-saver';
import * as printJS from 'print-js';


@Component({
    selector: 'app-warehouse-transfer-list',
    templateUrl: './warehouse-transfer-list.component.html',
    styleUrls: ['./warehouse-transfer-list.component.scss']
})
export class WarehouseTransferListComponent implements OnInit, OnDestroy, AfterViewInit {

    @BlockUI('notes-reception-production') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    @ViewChild('matPaginator', { static: false }) matPaginator: MatPaginator;

    /************INPUTS AND OUTPUTS EVENTS ***************** */
    @Input() set searchProductionNoteText(value: string) {
        this._warehouseTransferService.searchTerm$.next(value);
    }
    @Input() set isOpenFilter(open: boolean) {
        if (open)
            this.openFilter();
    }
    @Output() closeFilter = new EventEmitter<boolean>();
    @Output() countSelectedFilters = new EventEmitter<number>();
    @Input() isListIn: boolean;

    readonly WAREHOUSE_TRANSFER_STATUS: any = CONSTANTS.WAREHOUSE_TRANSFER_STATUS;
    readonly WAREHOUSE_TRANSFER_STATUS_DESCRIPTION: any = CONSTANTS.WAREHOUSE_TRANSFER_STATUS_DESCRIPTION;
    readonly PROCESS_FLOW: any = CONSTANTS.PROCESS_FLOW;
    readonly FILE_REPORT_ACTIONS: any = CONSTANTS.FILE_REPORT_ACTIONS;

    public isOpen: boolean = false;
    public isOrderAsc: boolean = false;
    public columnOrder: string = null;
    public columnAscState: any = {}
    public openItem: string;
    public params = {};
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public DECIMAL_DIGITS: number = 2;
    public configuration: ITRConfiguration = new TRConfiguration();
    public warehouseTransferenceList: Array<IWarehouseTransferModel> = [];
    public isLoadData = true;
    /*******PROPIERTIES FOR PRINT NOTE***** */
    public isDisabledPrint = false;
    public file: any;
    public hasPermissionReprint = false;
    public paginator: IPaginator = new Paginator();
    public openedItems: Array<string> = [];
    private currentLanguage: string = localStorage.getItem('lang');

    /*********PROPIERTIES FOR SEARCH INPUT********** */
    private _filterData: ITRFilter = new TRFilter();
    private _searchText: string
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cancelProductionNotesRequest$: Subject<boolean> = new Subject<boolean>();
    private searchProductionNoteTerm$: Subject<string> = new Subject<string>();
    public urlEdition: string = "";
    public urlDelete: string = "";
    public buttonLink = {
        symbol: '+',
        label: 'new',
        link: 'create-output-transfer/out'
    }

    constructor(
        private _dialog: MatDialog,
        private _alert: AlertService,
        private _warehouseTransferService: warehouseTransferService,
        private _alertService: AlertService,
        private _permissionsService: PermissionsService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _purchaseService: PurchaseOrdersService,
        private _i18nPipe: I18nPipe,
        private _router: Router,
        private _matdialog: MatDialog
    ) {
        this.hasPermissionReprint = this._permissionsService.checkValidity(
            this.PERMISSIONS.WEIGHT_NOTE,
            this.PERMISSION_TYPES.REPRINT
        );
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
                this._warehouseTransferService.getWarehouseTransferenceFiltered(this._getParamsRequestNotesProduction())
            )
        ).subscribe(
            (response: { data: IWarehouseTransferModel[], paginator: IPaginator }) => {
                this._setWeightNotesProduction(response)
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
    }

    ngOnInit() {
        this._getConfiguration();
        this.initializeColumnState();
        this._initSearch();

        let filters: ITRFilter;

        if (this.isListIn)
            filters = localStorage.getItem('warehouseTransferListInFilters')
                ? JSON.parse(localStorage.getItem('warehouseTransferListInFilters')).data
                : false;
        else
            filters = localStorage.getItem('warehouseTransferListOutFilters')
                ? JSON.parse(localStorage.getItem('warehouseTransferListOutFilters')).data
                : false;



        if (filters) {
            this._filterData = filters;
        }

        const isOut: string = this.isListIn ? this.PROCESS_FLOW.IN : this.PROCESS_FLOW.OUT;
        this.urlEdition = `create-output-transfer/${isOut}-edit/`;
        this.urlDelete = `create-output-transfer/new-override/override-${isOut}/`;
        this._getWeightNotesProduction(null, this._getParamsRequestNotesProduction())
    }

    ngOnDestroy() {
        this.cancelProductionNotesRequest$.next(true);
        this.cancelProductionNotesRequest$.complete();
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /*****************EVENTS****************** */
    private _initSearch(): void {

        this._warehouseTransferService.searchTerm$.pipe(takeUntil(this.destroy$))
            .subscribe((filter) => {
                this._searchText = filter ?? '';
                this.searchProductionNoteTerm$.next(this._searchText);
            })

    }

    public onToggle(): void {
        if (this.isOpen) {
            this.isOpen = false;
            this.openedItems = [];
        } else {
            this.isOpen = true;
            this.openedItems = this.warehouseTransferenceList.map(a => a.id);
        }
    }

    private initializeColumnState(): void {
        this.columnOrder = 'id';
        this.columnAscState = {
            dateAt: true,
            id: false,
            origin: true,
            destination: true,
            net: true
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
        this._getWeightNotesProduction(null, this._getParamsRequestNotesProduction());
    }

    private _getParamsRequestNotesProduction(): any {
        let params: any = {};

        params.operation_type = this.isListIn ? this.PROCESS_FLOW.IN : this.PROCESS_FLOW.OUT;
        if (this._searchText?.length > 0) {
            params.search = trimSpaces(this._searchText);
        }
        if (this.columnOrder) {
            params.order = this.columnOrder;
            params.sort = this.columnAscState[this.columnOrder]
                ? 'asc'
                : 'desc';
        }
        if (this._filterData.status?.selected?.length > 0) {
            params.status = this._filterData.status.selected.map((value) =>
                getKeyByValue(this.WAREHOUSE_TRANSFER_STATUS, value).toLocaleLowerCase()).join();
        } else {
            delete this.params['open'];
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
        if (this._filterData.origin?.length > 0) {
            params.origin = this._filterData.origin.map((o) => o.id).join();
        }
        if (this._filterData.destination?.length > 0) {
            params.destiny = this._filterData.destination.map((o) => o.id).join();
        }
        if (this._filterData.users?.length > 0) {
            params.user = this._filterData.users.map((o) => o.id).join();
        }
        if (this._filterData.warehouses?.length > 0) {
            params.warehouse_origin = this._filterData.warehouses.map((o) => o.id).join();
        }

        return params;
    }

    private _getWeightNotesProduction(uri: string = null, params: any = {}): void {
        this.isLoadData = true;
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._warehouseTransferService.getWarehouseTransference(uri, params).
            pipe(takeUntil(this.cancelProductionNotesRequest$), take(1)).subscribe(
                (response: { data: IWarehouseTransferModel[], paginator: IPaginator }) => {
                    this._setWeightNotesProduction(response)
                },
                (error) => {
                    this.blockUI.stop();
                    this.isLoadData = false;
                    const message: string = this._errorHandlerService.handleError(error, 'weight-note');
                    this._alert.error(message);
                })
    }

    private _setWeightNotesProduction(response: { data: IWarehouseTransferModel[], paginator: IPaginator }) {
        this.paginator = response.paginator;
        this.warehouseTransferenceList = response.data;
        this.blockUI.stop();
        this.isLoadData = false;
    }

    private _getConfiguration(): void {
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._purchaseService.getConfiguration()
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
        this._getWeightNotesProduction(uri, this._getParamsRequestNotesProduction());
    }

    public openMovement(id: string) {
        if (!this.isOpenedItem(id)) this.openedItems.push(id); else this.removeItemFromArray(id);

    }

    public isOpenedItem(id: string) {
        return this.openedItems.includes(id)
    }

    public removeItemFromArray(id: string) {
        const index = this.openedItems.indexOf(id);
        this.openedItems.splice(index, 1);
    }

    public isVoidable(transfer: IWarehouseTransferModel): boolean{
        return (transfer.operationType == this.PROCESS_FLOW.IN && transfer.status == this.WAREHOUSE_TRANSFER_STATUS_DESCRIPTION.CLOSE) || transfer.completed;
    }

    public openFilter() {
        if (this._filterData.status == null) {
            this._filterData.status = new TRFilterProductionStatus({ selected: [], lookups: this.WAREHOUSE_TRANSFER_STATUS })
        }
        this._dialog
            .open(FiltersComponent, {
                autoFocus: false,
                disableClose: true,
                data: {
                    isListIn: this.isListIn,
                    filter: this._filterData
                },
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe((result: any) => {
                this.closeFilter.emit(false)
                if (result) {
                    this._filterData = result.data;
                    if (result.refresh) {
                        this.countSelectedFilters.emit(result.countSelectedFilters)
                        this._getWeightNotesProduction(null, this._getParamsRequestNotesProduction());
                    }
                }
            });
    }

    public onPrint(movement: IWarehouseTransferModel, action?: string) {
        this.actionPDF('pdf', movement, action)
    }

    public async actionPDF(format: string, movement: IWarehouseTransferModel, action?: string) {
        if (this.checkAvailabilityPrint(movement)) {
            this.blockUI.start();
            try {
                if (format == 'pdf') {
                    await this.getReportReceptionNote(format, movement.id);
                    const byteArray = new Uint8Array(
                        atob(this.file)
                            .split('')
                            .map((char) => char.charCodeAt(0))
                    );
                    let blob = new Blob([byteArray], {
                        type: 'application/pdf',
                    });
                    const url = window.URL.createObjectURL(blob);
                    if (action == 'download') {
                        const fileName = `${this._i18nPipe.transform('warehouse-transfer')}-${movement.id}.pdf`;
                        FileSaver.saveAs(url, fileName);
                    } else {
                        printJS({
                            printable: this.file,
                            type: 'pdf',
                            base64: true
                        });
                    }
                } else {
                    await this.getReportReceptionNote(format, movement.id);
                }
                this.blockUI.stop();
            } catch (e) {
                this.blockUI.stop();
            }
        }
    }

    public async getReportReceptionNote(format: string, id: string) {
        try {
            let result = await this._warehouseTransferService.reportReceptionNote(
                id,
                format,
                this.currentLanguage
            );
            this.file = format == 'pdf' ? result.data : null;
        } catch (e) {
            let message: string = this._errorHandlerService.handleError(e, 'note');
            this._alert.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
            throw e;
        }
    }

    public checkAvailabilityPrint(movement: IWarehouseTransferModel): boolean{
        return movement.status === this.WAREHOUSE_TRANSFER_STATUS_DESCRIPTION.CLOSE || movement.status === this.WAREHOUSE_TRANSFER_STATUS_DESCRIPTION.CANCELED;
    }
}
