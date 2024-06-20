import { TRFilterProductionStatus } from './../../../../shared/models/filter-data.model';
import { take, distinctUntilChanged, tap, debounceTime, takeUntil, switchMap } from 'rxjs/operators';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ITRFilter, TRFilter } from 'src/app/shared/models/filter-data.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ProductionPaginatorModel } from '../../models/wn-production-paginator';
import { IWNProductionModel, WNProductionModel } from '../../models/wn-production.model';
import { MatDialog } from '@angular/material/dialog';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { WeightService } from '../../services/weight.service';
import * as printJS from 'print-js';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { ModalNotesAssociatedComponent } from '../modal-notes-associated/modal-notes-associated.component';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { eventPaginatorFunction } from 'src/app/shared/utils/functions/event-paginator';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';


@Component({
    selector: 'app-receiving-note-list-production',
    templateUrl: './receiving-note-list-production.component.html',
    styleUrls: ['./receiving-note-list-production.component.scss']
})
export class ReceivingNoteListProductionComponent implements OnInit, OnDestroy , AfterViewInit {

    @BlockUI('notes-reception-production') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    @ViewChild('matPaginator', { static: false }) matPaginator: MatPaginator;

    /************INPUTS AND OUTPUTS EVENTS ***************** */
    @Input() set searchProductionNoteText(value: string) {
        this._searchText = value ?? ''
        this._weightService.searchTerm$.next(this._searchText);
    }
    @Input() set isOpenFilter(open: boolean) {
        if (open)
            this.openFilter();
    }
    @Output() closeFilter = new EventEmitter<boolean>();
    @Output() countSelectedFilters = new EventEmitter<number>();

    readonly RECEIVING_NOTE_STATUS: any = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly WEIGHT_NOTE_STATUS: any = CONSTANTS.WEIGHT_NOTE_STATUS;
    readonly RECEIVING_NOTE_PRODUCTION_STATUS: any = CONSTANTS.RECEIVING_NOTE_PRODUCTION_STATUS;
    readonly PAYMENT_STATUS: any = CONSTANTS.PAYMENT_STATUS;
    readonly WEIGHT_NOTES_STATUS: any = CONSTANTS.WEIGHT_NOTES_STATUS;

    public certifications = {};
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
    public receptionNotesProduction: Array<WNProductionModel> = [];
    public isLoadData = true;
    /*******PROPIERTIES FOR PRINT NOTE***** */
    public isDisabledPrint = false;
    public file: any;
    public hasPermissionReprint = false;
    public paginator: IPaginator = new Paginator();

    /*********PROPIERTIES FOR SEARCH INPUT********** */
    private _filterData: ITRFilter = new TRFilter();
    private _searchText: string
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cancelProductionNotesRequest$: Subject<boolean> = new Subject<boolean>();
    private searchProductionNoteTerm$: Subject<string> = new Subject<string>();


    constructor(
        private _dialog: MatDialog,
        private _alert: AlertService,
        private _weightService: WeightService,
        private _alertService: AlertService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _permissionsService: PermissionsService,
        private _errorHandlerService: ResponseErrorHandlerService,
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
            switchMap(()=>
               this._weightService.getWeightNotesProductionFiltered(this._getParamsRequestNotesProduction())
            )
        ).subscribe(
            (response: { data: IWNProductionModel[], paginator: IPaginator }) => {
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

        let filters: ITRFilter = localStorage.getItem('weightNotesFilters') 
                ? JSON.parse(localStorage.getItem('weightNotesFilters')).data 
                : false;

        if(filters){
            this._filterData = filters;
        }

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

        this._weightService.searchTerm$.pipe(takeUntil(this.destroy$))
        .subscribe((filter) => {
            this._searchText = filter ?? '';
            this.searchProductionNoteTerm$.next(this._searchText);
        })

    }

    private initializeColumnState(): void {
        this.columnOrder = 'date_start';
        this.columnAscState = {
            pt_name: true,
            ct_name: true,
            date_start: false,
            net: true,
            producer_name: true,
            vtank_name: true,
            transaction_in_id: true
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
        if (this._searchText?.length > 0) {
            params.search = trimSpaces(this._searchText);
        }
        if (this.columnOrder) {
            params.order = this.columnOrder;
            params.sort = this.columnAscState[this.columnOrder]
                ? 'asc'
                : 'desc';
        }
        if (this._filterData.productionStatus?.selected?.length > 0) {
            params.production_status = this._filterData.productionStatus.selected.map((value) => 
            this.WEIGHT_NOTES_STATUS[value]).join();
        }
        if (this._filterData.paymentStatus?.selected?.length > 0) {
            params.payment_status = this._filterData.paymentStatus.selected.map((value)  => 
            this.WEIGHT_NOTES_STATUS[value]).join();
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
        if (this._filterData.seals?.selected.length > 0) {
            params['certificates[]'] = Array.from(this._filterData.seals.selected);
        }
        return params;
    }

    private _getWeightNotesProduction(uri: string = null, params: any = {}): void {
        this.isLoadData = true;
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._weightService.getWeightNotesProduction(uri, params).
            pipe(takeUntil(this.cancelProductionNotesRequest$), take(1)).subscribe(
                (response: { data: IWNProductionModel[], paginator: IPaginator }) => {
                        this._setWeightNotesProduction(response)
                },
                (error) => {
                    this.blockUI.stop();
                    this.isLoadData = false;
                    const message: string = this._errorHandlerService.handleError(error, 'weight-note');
                    this._alert.error(message);
                })
    }

    private _setWeightNotesProduction(response: { data: IWNProductionModel[], paginator: IPaginator })
    {
        this.paginator = response.paginator;
        this.receptionNotesProduction = response.data;
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
        this._getWeightNotesProduction(uri, this._getParamsRequestNotesProduction());
    }

    public onPrint(note: WNProductionModel) {
        this.checkAvailabilityPrint(note)
        this.actionPDF('pdf', note.receptionId, 'print')
        this.checkAvailabilityPrint(note)
    }

    public openFilter() {
        if (this._filterData.productionStatus == null) {
            this._filterData.productionStatus = new TRFilterProductionStatus({ selected: [], lookups: this.RECEIVING_NOTE_PRODUCTION_STATUS })
        }
        if (this._filterData.paymentStatus == null) {
            this._filterData.paymentStatus = new TRFilterProductionStatus({ selected: [], lookups: this.PAYMENT_STATUS })
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
                    if (result.refresh) {
                        this.countSelectedFilters.emit(result.countSelectedFilters)
                        this._getWeightNotesProduction(null, this._getParamsRequestNotesProduction());
                    }
                }
            });
    }

    //#region FUNCTIONS TO PRINT
    public async actionPDF(format: string, receptionId: string, action?: string) {
        if (!this.isDisabledPrint) {
            this.blockUI.start();
            try {
                await this.getReportReceptionNote(format, receptionId);
                printJS({
                    printable: this.file,
                    type: 'pdf',
                    base64: true
                });
                this.blockUI.stop();
            } catch (e) {
                this.blockUI.stop();
            }
        }
    }

    public async getReportReceptionNote(format: string, id: string) {
        try {
            let result = await this._weightService.reportReceptionNote(
                id,
                format
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

    public checkAvailabilityPrint(note: WNProductionModel) {
        this.isDisabledPrint =
            !this.hasPermissionReprint && note.print > 0;
    }
    //#endregion

    public onEdit(weightNote: IWNProductionModel) {
        if (weightNote.associated == null) {
            this._router.navigate(
                ['routes', 'weight-note', 'receiving-ticket', weightNote.receptionId, weightNote.transactionInId],
                { queryParams: { allowEditProducer: weightNote.associated == null , fromProduction : true ,isFromNoteList :true } }
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


}
