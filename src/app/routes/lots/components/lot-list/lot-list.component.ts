import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil, tap, switchMap } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ITRFilter, TRFilter } from 'src/app/shared/models/filter-data.model';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
    ITRConfiguration, TRConfiguration
} from '../../../../shared/utils/models/configuration.model';
import { ILotListWeightNoteGrouper } from '../../models/lot-list-weight-note-grouper.model';
import { LotsService } from '../../services/lots.service';
import { LotDeleteDialogComponent } from '../lot-delete-dialog/lot-delete-dialog.component';
import { LotDelete } from 'src/app/shared/models/lot-delete.model';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { LotReprocessDialogComponent } from '../lot-reprocess-dialog/lot-reprocess-dialog.component';
import { IPaginator, Paginator } from '../../../../shared/models/paginator.model';
import { eventPaginatorFunction } from '../../../../shared/utils/functions/event-paginator';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';

@Component({
    selector: 'tr-lot-list',
    templateUrl: './lot-list.component.html',
    styleUrls: ['./lot-list.component.scss'],
})
export class LotListComponent implements OnInit, OnDestroy, AfterViewInit {
    @BlockUI('weight-note-lots-layout') blockUIWNLots: NgBlockUI;
    @BlockUI('lot-list-layout') blockUI: NgBlockUI;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('matPaginator') matPaginator: MatPaginator;

    readonly DECIMAL_DIGITS: number = JSON.parse(
        localStorage.getItem('decimals')
    ).general;
    readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;
    readonly RECEIVING_NOTE_STATUS: any = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly LOT_STATUS: any = CONSTANTS.LOT_STATUS;
    readonly PERMISSIONS = CONSTANTS.PERMISSIONS;
    readonly PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    readonly PENDING_LOT_STATUS = CONSTANTS.LOT_PENDING_PROCESS;

    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public isProcessedMode: boolean = false;
    public lots: Array<ILotListWeightNoteGrouper> = [];
    public paginator: IPaginator = new Paginator();
    public searchText: string = '';
    public isFocusOnInputSearch: boolean = false;
    public isInputSearchDisabled: boolean = false;
    public columnOrder: string = 'created';
    public columnAscState: any = {}
    public isLoadingLots: boolean = true;
    public configuration: ITRConfiguration = new TRConfiguration();
    public hasPermissionReprocess: boolean = false;
    public countFilter: number = 0;
    public tanks: string[] = [];
    private filterData: ITRFilter = new TRFilter();
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cancelLotsRequest$: Subject<boolean> = new Subject<boolean>();
    private searchTerm$: Subject<string> = new Subject<string>();

    constructor(
        private _errorHandlerService: ResponseErrorHandlerService,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _lotsService: LotsService,
        private _dialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _permissionsService: PermissionsService,
        private _purchaseService: PurchaseOrdersService,
    ) {
        let params: Params = this._activatedRoute.snapshot.queryParams;
        this.isProcessedMode = !!('processed' == params?.subtab);
        this.hasPermissionReprocess = this._permissionsService.checkValidity(this.PERMISSIONS.LOT_REPROCESS, this.PERMISSION_TYPES.UPDATE);
        this.initializeColumnState();
    }


    /**
     * Callback method that is invoked immediately after the default change detector has checked the component's data-bound properties for the first time
     */
    ngOnInit() {

        this._lotsService.searchTerm$.pipe(takeUntil(this.destroy$))
            .subscribe((filter) => {
                this.searchText = filter ?? ''
                this.searchTerm$.next(this.searchText)
            })

        this.blockUI.start();
        this._purchaseService
            .getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response: ITRConfiguration) => {
                    this.configuration = response;
                    this.getLots(null, this.getParamsRequestLots());
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'lots')
                    );
                    this.blockUI.stop();
                    this.isLoadingLots = false;
                }
            );
    }

    ngAfterViewInit(): void {
        let config: any = {
            baseMeasurementUnitFactor: this.configuration
                .baseMeasurementUnitFactor,
            decimalPlaces: this.DECIMAL_DIGITS,
        };

        this.searchTerm$
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                tap((e) => {
                    this.isLoadingLots = true;
                    this.cancelLotsRequest$.next(true);
                    if (!this.blockUI.isActive) {
                        this.blockUI.start();
                    }
                    this.lots = [];
                }),
                debounceTime(500),
                switchMap(() =>
                    this._lotsService.getProducersFiltered(this.getParamsRequestLots(), config)
                )
            )
            .subscribe(
                ( response : { data: ILotListWeightNoteGrouper[], pagination: IPaginator }) => {
                    this._setLots(response);
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'lots')
                    );
                    this.blockUI.stop();
                    this.isLoadingLots = false;
                }
            );
    }

    /**
     * Method called on destroy component
     */
    ngOnDestroy() {
        this.cancelLotsRequest$.next(true);
        this.cancelLotsRequest$.complete();
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Select lot list to display and reset state of some variables
     * @param isProcessedList  true if lot list processed is selected to display
     */
    public selectLotList(isProcessedList: boolean): void {
        this.cancelLotsRequest$.next(true);
        this.isProcessedMode = isProcessedList;
        this.countFilter = 0;
        this.lots = [];
        this.initializeColumnState();
        this.searchText = '';
        this.filterData = new TRFilter();
        this.getLots(null, this.getParamsRequestLots());
    }

    /**
     * Sort data grid ascend or descend depending on the current sort state
     * @param column for sorting
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
        this.getLots(null, this.getParamsRequestLots());
    }

    /**
     * Method called on toggle expand/colapse all panels icon
     */
    public onToggle(): void {
        let isClosedAllPanels: boolean =
            -1 ==
            this.lots.findIndex(
                (l: ILotListWeightNoteGrouper) => l.opened
            );
        if (isClosedAllPanels) {
            this.accordion.openAll();
        } else {
            this.accordion.closeAll();
        }
    }

    /**
     * Method called on opened panel event
     * @param index of panel touched
     */
    public onOpenedPanelEvent(index: number): void {
        this.lots[index].opened = true;
    }

    /**
     * Method called on closed panel event
     * @param index of panel touched
     */
    public onClosedPanelEvent(index: number): void {
        this.lots[index].opened = false;
    }

    /**
     * Method called on event apply filters
     */
    public openFilter() {
        this._dialog
            .open(FiltersComponent, {
                autoFocus: false,
                disableClose: true,
                data: this.filterData,
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe((result: any) => {
                if (result) {
                    this.filterData = result.data;
                    if (result.refresh) {
                        this.countFilter = result.countSelectedFilters
                        this.getLots(null, this.getParamsRequestLots());
                    }
                }
            });
    }

    /**
     * Method called for open delete lot confirmation dialog
     * @param lot to delete
     */
    public openDeleteLotDialog(lot: ILotListWeightNoteGrouper): void {
        this._dialog
            .open(LotDeleteDialogComponent, {
                autoFocus: false,
                disableClose: true,
                data: new LotDelete({
                    id: lot.id,
                    name: lot.folio
                })
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe((response: any) => {
                if (response.refresh) {
                    this.getLots(null, this.getParamsRequestLots());
                }
            });
    }

    /**
     * Method called for open reprocess lot dialog
     * @param lot to reprocess
     */
    public openReprocessLotDialog(lot: ILotListWeightNoteGrouper): void {
        this._dialog
            .open(LotReprocessDialogComponent, {
                autoFocus: false,
                disableClose: true,
                data: {
                    id: lot.id,
                    folio: lot.folio
                }
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe((response: any) => {
                if (response?.refresh) {
                    this.blockUIWNLots.start();
                    let hasKanbanPermission = this._permissionsService.checkValidity(this.PERMISSIONS.KANBAN, this.PERMISSION_TYPES.READ);
                    if (hasKanbanPermission) {
                        const path = `/routes/kanban/dashboard/${response.workflowId}`;
                        this._router.navigateByUrl(path);
                    }
                    else {
                        this.blockUIWNLots.stop();
                        this.getLots(null, this.getParamsRequestLots());
                    }
                }
            });
    }

    /**
     * Clear search input value
     */
    public clearSearchInput(): void {
        this.searchText = '';
        this._lotsService.searchTerm$.next(this.searchText);
    }

    /**
     * Method called on type search input
     * @param event data object emitted from event
     */
    public onTypeSearchInput(event: any): void {
        this._lotsService.searchTerm$.next(trimSpaces(this.searchText));
        //this.searchTerm$.next(this.searchText);
    }
    public eventPaginator(event: PageEvent): void {
        let uri = eventPaginatorFunction(event, this.paginator);
        this.getLots(uri, this.getParamsRequestLots());

    }

    /**
     * Get lots data
     * @param uri to request
     * @param params to request
     */
    private getLots(uri: string = null, params: any = {}): void {
        this.isLoadingLots = true;
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }

        let config: any = {
            baseMeasurementUnitFactor: this.configuration
                .baseMeasurementUnitFactor,
            decimalPlaces: this.DECIMAL_DIGITS,
        };

        this._lotsService
            .getLots(uri, config, params)
            .pipe(takeUntil(this.cancelLotsRequest$), take(1))
            .subscribe(
                (response: { data: ILotListWeightNoteGrouper[], pagination: IPaginator }) => {
                        this._setLots(response);

                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'lots')
                    );
                    this.setPaginatorIndexOnResponse();
                    this.blockUI.stop();
                    this.isLoadingLots = false;
                }
            );
    }

    private _setLots(response: any): void {
        this.lots = response.data;
        this.paginator = response.pagination;
        this.setPaginatorIndexOnResponse();
        this.blockUI.stop();
        this.isLoadingLots = false;
        this.getTanks();
    }

    /**
     * Method invoked for initialize column order and state
     */
    private initializeColumnState(): void {
        this.columnOrder = 'created';
        this.columnAscState = {
            created: false,
            id: true,
            transformation: true,
            tank: true,
            weight: true,
        };
    }

    /**
     * Method called after set response lots data for set valid page index
     */
    private setPaginatorIndexOnResponse(): void {
        if (this.matPaginator) {
            this.matPaginator.pageIndex = this.paginator.currentPage
                ? this.paginator.currentPage - 1
                : 0;
        }
    }

    /**
     * Get object with params to request lots
     * @param searchValue text to search
     */
    private getParamsRequestLots(): any {
        let params: any = {};
        if (this.searchText?.length > 0) {
            params.search = trimSpaces(this.searchText);
        }
        if (this.columnOrder) {
            params.order = this.columnOrder;
            params.sort = this.columnAscState[this.columnOrder]
                ? 'asc'
                : 'desc';
        }
        if (this.filterData.date?.start) {
            params.date_init = this.filterData.date.start;
        }
        if (this.filterData.date?.end) {
            params.date_end = this.filterData.date.end;
        }
        if (this.filterData.seals?.selected.length > 0) {
            params['certificates[]'] = [...this.filterData.seals.selected];
        }
        params.status = this.isProcessedMode ? this.LOT_STATUS.PROCESSED : this.LOT_STATUS.IN_PROGRESS;
        return params;
    }

    public onViewLotDetail(id: string) {
        this._router.navigateByUrl('/routes/weight-note/lots/lot/' + id);
    }

    public getTanks() {
        this.lots.forEach(lot => lot.weightNotes.forEach(weightNote => {
            if(!lot.weightNotesWarehouses.includes(weightNote.productionTankName)){
                lot.weightNotesWarehouses.push(weightNote.productionTankName)
            }
        }));
    }

    public getTanksMessage(lot: ILotListWeightNoteGrouper) {
        return lot.weightNotesWarehouses.map(warehouse => warehouse).join();
    }
}
