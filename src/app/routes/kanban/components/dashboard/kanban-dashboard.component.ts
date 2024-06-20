import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { of, Subject } from 'rxjs';
import {
    debounceTime, delay, distinctUntilChanged, filter, map, take, takeUntil, tap
} from 'rxjs/operators';
import {
    LotDeleteDialogComponent
} from 'src/app/routes/lots/components/lot-delete-dialog/lot-delete-dialog.component';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { ITRFilter, TRFilter, TRFilterDate } from 'src/app/shared/models/filter-data.model';
import { LotDelete } from 'src/app/shared/models/lot-delete.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import {
    SearchByPropertyPipe
} from 'src/app/shared/pipes/search-by-property/search-by-property.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { accurateDecimalSum } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { reverseSortByKey, sortBykey } from 'src/app/shared/utils/functions/sortFunction';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ITRSealImage } from 'src/app/shared/utils/models/seal-image.model';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import {
    CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragRelease, CdkDragStart, CdkDropList,
    moveItemInArray, transferArrayItem
} from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { IKanbanDashboardLot, KanbanDashboardLot } from '../../models/kanban-dashboard-lot.model';
import {
    IKanbanDashboardWorkflow, KanbanDashboardWorkflow
} from '../../models/kanban-dashboard-workflow.model';
import { KanbanService } from '../../services/kanban.service';
import { IKanbanDashboardProcess } from '../../models/kanban-dashboard-process.model';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';

@Component({
    selector: 'app-kanban-dashboard',
    templateUrl: './kanban-dashboard.component.html',
    styleUrls: ['./kanban-dashboard.component.scss'],
    host: {
        '(window:resize)': 'checkDocumentWidth()'
    }
})
export class KanbanDashboardComponent implements OnInit, OnDestroy {

    @HostBinding('class.kanban-dashboard__pointer--outer-list') pointerIsOuterLists: boolean = true;
    @BlockUI('kanban-dashboard-layout') blockUILayout: NgBlockUI;
    @BlockUI('kanban-dashboard-processes') blockUIProcesses: NgBlockUI;

    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;

    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public dragStartDelay: { touch: number, mouse: number } = { touch: 300, mouse: 0 };
    public pressedLotId: string = null;
    public isMobileResolution: boolean = true;
    public searchWorkflowsTerm$: Subject<string> = new Subject<string>();
    public isLoadingWorkflows: boolean = true;
    public isLoadingProcesses: boolean = true;
    public configuration: ITRConfiguration = new TRConfiguration();
    public workflowId: string = null;
    public searchTextProcess: string = '';
    public isFocusOnInputSearch: boolean = false;
    public workflowsPaginator: IPaginator = new Paginator();
    public workflows: IKanbanDashboardWorkflow[] = [];
    public selectedWorkflow: IKanbanDashboardWorkflow = new KanbanDashboardWorkflow();
    public lastLevel: number = -1;
    public hasFilter: boolean = false;
    public countFilter: number = 0;

    private isDragging: boolean = false;
    private dragStartedRect: DOMRect;
    private workflowSearchTerm: string = '';
    private filterData: ITRFilter = new TRFilter(null, true);
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cancelTouchEvent$: Subject<boolean> = new Subject<boolean>();
    private cancelWorkflowsRequest$: Subject<boolean> = new Subject<boolean>();
    private cancelProcessesRequest$: Subject<boolean> = new Subject<boolean>();
    private workflowsListEndReached$: Subject<{ q: string, nextPage: string }> = new Subject<{ q: string, nextPage: string }>();
    private _commodityId: number;

    constructor(
        private _kanbanService: KanbanService,
        private _i18nPipe: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _alertService: AlertService,
        private _activatedRoute: ActivatedRoute,
        private _dialog: MatDialog,
        private _searchByPropertyPipe: SearchByPropertyPipe,
        private _router: Router,
        private _notifierService: NotifierService,
        private _purchaseOrderService: PurchaseOrdersService,
    ) {
        let params: Params = this._activatedRoute.snapshot.params;
        let queryParams: Params = this._activatedRoute.snapshot.queryParams;
        if (params?.workflowId) {
            this.workflowId = params.workflowId;
        }
        if (queryParams?.commodity) {
            this._commodityId = parseInt(queryParams.commodity);
        }

        this.checkDocumentWidth();

        // On event workflows list scroll end reached
        this.workflowsListEndReached$
            .pipe(
                takeUntil(this.destroy$),
                filter((e: any) => this.workflowsPaginator.currentPage < this.workflowsPaginator.totalPages),
                tap((e: { q: string, nextPage: string }) => {
                    this.isLoadingWorkflows = true;
                    this.cancelWorkflowsRequest$.next(true);
                })
            )
            .subscribe((event: { q: string, nextPage: string }) => {
                let params: any = {};
                if (event.q?.length > 0) {
                    params.q = trimSpaces(event.q);
                }
                // Get workflows list
                this.getWorkflows(false, event.nextPage, params);
            });

        // On search workflows tearm event
        this.searchWorkflowsTerm$
            .pipe(
                takeUntil(this.destroy$),
                map((term: string) => trimSpaces(term)),
                distinctUntilChanged(),
                tap((term: string) => {
                    this.isLoadingWorkflows = true;
                    this.cancelWorkflowsRequest$.next(true);
                    this.workflowsPaginator = new Paginator();
                    this.workflowSearchTerm = term;
                    this.workflows = [];
                }),
                debounceTime(500)
            )
            .subscribe((term: string) => {
                let params: any = term ? { q: term } : {};
                // Get workflows list
                this.getWorkflows(false, null, params);
            });

    }

    /**
     * Callback method that is invoked immediately after the default change detector has checked the component's data-bound properties for the first time
     */
    ngOnInit() {
        this.blockUILayout.start();
        // Get configuration data on init
        this.getConfiguration();
    }

    /**
     * Method called on destroy component
     */
    ngOnDestroy() {
        this.cancelWorkflowsRequest$.next(true);
        this.cancelWorkflowsRequest$.complete();
        this.cancelProcessesRequest$.next(true);
        this.cancelProcessesRequest$.complete();
        this.cancelTouchEvent$.next(true);
        this.cancelTouchEvent$.complete();
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Method called on select option from workflow list
     * @param event emmited on action select
     */
    public onWorkflowSelect(event: IKanbanDashboardWorkflow): void {
        this.searchTextProcess = '';
        this.filterData.date = new TRFilterDate();
        this.filterData.seals.selected = [];
        this.filterData.status = null;
        this.filterData.producers.selected = null;
        this.hasFilter = false;

        this.selectedWorkflow = new KanbanDashboardWorkflow(event);
        this.getProcesses(false);
    }

    /**
     * Method called on workflow list scroll reached end
     */
    public onWorkflowScrollReachedEnd(): void {
        this.workflowsListEndReached$.next({
            q: this.workflowSearchTerm,
            nextPage: this.workflowsPaginator.nextPageUrl
        });
    }

    /**
     * Method called on event apply filters
     */
    public openFilter(): void {
        this._dialog.open(FiltersComponent, {
            autoFocus: false,
            disableClose: true,
            data: this.filterData,
        }).afterClosed().pipe(
            takeUntil(this.destroy$),
            take(1)
        ).subscribe((result: any) => {
            if (result) {
                this.hasFilter = result.hasSelectedFilters;
                this.filterData = result.data;
                if (result.refresh) {
                    this.setFilteredLots();
                }
            }
        });
    }

    /**
     * Clear search input value
     */
    public clearSearchInput(): void {
        this.searchTextProcess = '';
        this.setFilteredLots();
    }

    /**
     * Method called on type search input
     * @param event data object emitted from event
     */
    public onTypeSearchInput(event: any): void {
        this.setFilteredLots();
    }

    /**
     * Method invoked on touch start event on lot card
     * @param lotId pressed
     */
    public onTouchStartLotEvent(lotId: string): void {
        this.pressedLotId = null;
        this.cancelTouchEvent$.next(true);
        of(lotId).pipe(
            delay(this.dragStartDelay.touch),
            takeUntil(this.cancelTouchEvent$),
            filter((lotId: string) => !this.isDragging)
        ).subscribe((lotId: string) => this.pressedLotId = lotId);
    }

    /**
     * Method invoked on touch end event on lot card
     */
    public onTouchEndLotEvent(): void {
        this.pressedLotId = null;
        this.cancelTouchEvent$.next(true);
    }

    /**
     * Method invoked on touch move event on lot card
     */
    public onTouchMoveLotEvent(): void {
        this.pressedLotId = null;
        this.cancelTouchEvent$.next(true);
    }

    /**
     * Method invoked on item drag start event
     * @param event emmited
     */
    public onDragStarted(event: CdkDragStart) {
        this.isDragging = true;
        this.dragStartedRect = event.source.element.nativeElement.getBoundingClientRect();
    }

    /**
     * Method invoked on item drag end event
     * @param event emmited
     */
    public onDragEnded(event: CdkDragEnd) {
        this.isDragging = false;
    }

    /**
     * Method invoked on item released event
     * @param event emmited
     */
    public onReleased(event: CdkDragRelease) {
        if (this.pointerIsOuterLists) {
            const placeholder = event.source.getPlaceholderElement();
            placeholder.style.transform = "";
            const rect = placeholder.getBoundingClientRect();
            const x = this.dragStartedRect.left - rect.left;
            const y = this.dragStartedRect.top - rect.top;
            placeholder.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
        }
    }

    /**
     * Method invoked on item drop event
     * @param event emmited
     */
    public onDrop(event: CdkDragDrop<any[]>) {
        if (event.isPointerOverContainer) {
            if (event.previousContainer === event.container) {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            }
            else {
                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
                let previousIndexLot: number = this.selectedWorkflow.processes[event.previousContainer.id].lots.findIndex((l: IKanbanDashboardLot) => event.item.data.lot.id == l.id);
                if (previousIndexLot > -1) {
                    let lotTransfer: IKanbanDashboardLot = new KanbanDashboardLot(this.selectedWorkflow.processes[event.previousContainer.id].lots[previousIndexLot]);
                    this.selectedWorkflow.processes[event.previousContainer.id].lots.splice(previousIndexLot, 1);
                    this.selectedWorkflow.processes[event.container.id].lots.push(lotTransfer);
                }
                this.calculateDynamicAmounts();
                this._router.navigateByUrl(`/routes/kanban/transition/${event.item.data.lot.id}?isFromDetail=false&isFromKanban=true&processId=${this.selectedWorkflow.processes[event.container.id].id}&isEdit=false&commodity=${this._commodityId}`);
            }
        }
    }

    /**
     * Method invoked on cancel move event
     * @param event emmited
     */
    public returnToPreviousArray(event: CdkDragDrop<any[]>) {
        transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex,
        );
        let currentIndexLot: number = this.selectedWorkflow.processes[event.container.id].lots.findIndex((l: IKanbanDashboardLot) => event.item.data.lot.id == l.id);
        let lotTransfer: IKanbanDashboardLot = new KanbanDashboardLot(this.selectedWorkflow.processes[event.container.id].lots[currentIndexLot]);
        this.selectedWorkflow.processes[event.container.id].lots.splice(currentIndexLot, 1);
        this.selectedWorkflow.processes[event.previousContainer.id].lots.push(lotTransfer);
        this.calculateDynamicAmounts();
    }

    /**
     * Method invoked on item move event
     * @param event emmited
     */
    public onMoved(event: CdkDragMove<any>) {
        let listDragRect: DOMRect = event.source.getPlaceholderElement().parentElement.getBoundingClientRect();
        if (
            event.pointerPosition.x < listDragRect.left || event.pointerPosition.x > listDragRect.right ||
            event.pointerPosition.y < listDragRect.top || event.pointerPosition.y > listDragRect.bottom
        ) {
            this.pointerIsOuterLists = true;
        }
        else {
            this.pointerIsOuterLists = false;
        }
    }

    /**
     * method that validates if it is allowed to move the lot to the selected process
     * @param drag object emmited
     * @param drop object emmited
     * @returns boolean value
     */
    public processPredicate(drag: CdkDrag<any>, drop: CdkDropList<any>) {
        return drag.data.previousStep + 1 == drag.data.processes[drop.id].step;
    }

    /**
     * Method invoked for check client width resolution
     */
    public checkDocumentWidth() {
        this.isMobileResolution = (document.documentElement.clientWidth < 768);
    }

    /**
     * Method called for open delete lot confirmation dialog
     * @param lot to delete
     * @param idxProcess process index to which the lot to delete belongs
     */
    public openDeleteLotDialog(lot: IKanbanDashboardLot, idxProcess: number): void {
        this._dialog
            .open(LotDeleteDialogComponent, {
                autoFocus: false,
                disableClose: true,
                data: new LotDelete({
                    id: lot.id,
                    name: lot.name
                })
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe((response: any) => {
                if (response.refresh) {
                    this.blockUILayout.start();
                    this.getProcesses(true);
                }
            });
    }

    /**
     * Method invoked on view option click
     * @param lot data object
     */
    public openLotDetail(lot: IKanbanDashboardLot): void {
        this._router.navigateByUrl(`/routes/weight-note/lots/lot/${lot.id}?isFromKanban=true&commodity=${this._commodityId}`);
    }

    /**
     * Method invoked on edit option click
     * @param lot data object
     */
    public openLotEdit(lot: IKanbanDashboardLot): void {
        this._router.navigateByUrl(`/routes/kanban/transition/${lot.id}?isFromDetail=false&isFromKanban=true&isEdit=true&commodity=${this._commodityId}`);
    }


    /**
     * Triggered request for configuration data
     */
    private getConfiguration(): void {
        this._purchaseOrderService.getConfiguration().pipe(
            takeUntil(this.destroy$),
            take(1)
        ).subscribe(
            (response: ITRConfiguration) => {
                this.configuration = response;
                // Get processes for selected workflow
                this.getProcesses(true);
            },
            (error: HttpErrorResponse) => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'kanban')
                );
                this.blockUILayout.stop();
                this.isLoadingProcesses = false;
                this.isLoadingWorkflows = false;
            }
        );
    }

    /**
     * Get processes for selected workflow
     * @param isOnInit indicate if request is executed on init
     */
    private getProcesses(isOnInit: boolean): void {
        this.isLoadingProcesses = true;
        if (!isOnInit && !this.blockUIProcesses.isActive) {
            this.blockUIProcesses.start();
        }
        if (this.workflowId) {
            this._kanbanService.getProcessesByWorkflow(this.workflowId)
                .pipe(
                    takeUntil(this.cancelProcessesRequest$),
                    take(1)
                )
                .subscribe(
                    (response: IKanbanDashboardWorkflow) => {
                        this.blockUIProcesses.stop();
                        this.selectedWorkflow = response;
                        this.setFilteredLots();
                        this.isLoadingProcesses = false;
                        this.selectedWorkflow.processes
                            .forEach(process => this.lastLevel = this.lastLevel < process.step ? process.step : this.lastLevel);
                        if (isOnInit) {
                            let cpSelectedWorkflow: IKanbanDashboardWorkflow = new KanbanDashboardWorkflow(this.selectedWorkflow);
                            cpSelectedWorkflow.processes = [];
                            this.workflows.push(cpSelectedWorkflow);
                            this.getWorkflows(true);
                        }
                    },
                    (error: HttpErrorResponse) => {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._errorHandlerService.handleError(error, 'kanban')
                        );
                        this.blockUIProcesses.stop();
                        this.isLoadingProcesses = false;
                        if (isOnInit) {
                            this.blockUILayout.stop();
                            this.isLoadingWorkflows = false;
                        }
                    }
                );
        }
        else {
            this.blockUIProcesses.stop();
            this.isLoadingProcesses = false;
            if (isOnInit) {
                this.getWorkflows(true);
            }
        }
    }

    /**
     * Get workflows by default receiving commodity id
     * @param isOnInit indicate if request is executed on init
     * @param uri for request
     * @param params for request
     */
    private getWorkflows(isOnInit: boolean, uri: string = null, params: any = {}): void {
        this._kanbanService.getWorkflowsByCommodity(
            uri,
            this._commodityId,
            params
        ).pipe(
            takeUntil(this.cancelWorkflowsRequest$),
            take(1)
        ).subscribe(
            (response: { paginator: IPaginator, data: IKanbanDashboardWorkflow[] }) => {
                let isNewRegister: boolean = false;
                response.data.forEach((w: IKanbanDashboardWorkflow) => {
                    isNewRegister = (-1 == this.workflows.findIndex((r: IKanbanDashboardWorkflow) => r.id == w.id));
                    if (isNewRegister) {
                        this.workflows.push(w);
                    }
                });
                this.workflows = [...sortBykey(this.workflows, 'name')];
                this.workflowsPaginator = response.paginator;
                this.isLoadingWorkflows = false;
                if (isOnInit) {
                    this.blockUILayout.stop();
                }
            },
            (error: HttpErrorResponse) => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'kanban')
                );
                this.isLoadingWorkflows = false;
                if (isOnInit) {
                    this.blockUILayout.stop();
                }
            }
        )
    }

    /**
     * Set items to filtered lots property, after apply filters
     */
    private setFilteredLots(): void {
        let startDate: moment.Moment = this.filterData.date.start ? moment(this.filterData.date.start).startOf('day') : null;
        let endDate: moment.Moment = this.filterData.date.end ? moment(this.filterData.date.end).endOf('day') : null;
        this.countFilters(startDate, endDate, this.filterData);
        for (let p = 0; p < this.selectedWorkflow.processes.length; p++) {
            // Copy all lots of process
            let filteredLots: IKanbanDashboardLot[] = [...this.selectedWorkflow.processes[p].lots];
            // Filter by search text
            if (this.searchTextProcess?.length > 0) {
                filteredLots = this._searchByPropertyPipe.transform(filteredLots, this.searchTextProcess, ['name', 'warehouse']);
            }
            // Filter by date
            if (startDate && endDate) {
                filteredLots = filteredLots.filter((l: IKanbanDashboardLot) => l.date && moment(l.date).isBetween(startDate, endDate, 'second'));
            }
            else if (startDate) {
                filteredLots = filteredLots.filter((l: IKanbanDashboardLot) => l.date && moment(l.date).isSameOrAfter(startDate, 'second'));
            }
            else if (endDate) {
                filteredLots = filteredLots.filter((l: IKanbanDashboardLot) => l.date && moment(l.date).isSameOrBefore(endDate, 'second'));
            }
            // Filter by seals
            if (this.filterData.seals.selected.length > 0) {
                filteredLots = filteredLots.filter((l: IKanbanDashboardLot) => {
                    let matchFound: boolean = false;
                    for (let s = 0; s < this.filterData.seals.selected.length; s++) {
                        matchFound = !!l.seals.find((c: ITRSealImage) => this.filterData.seals.selected[s] == c.id);
                        if (matchFound) {
                            break;
                        }
                    }
                    return matchFound;
                });
            }
            // Filter by producer
            if (this.filterData.producers.selected) {
                filteredLots = filteredLots.filter((lot: IKanbanDashboardLot) => {
                    let matchFound = lot.producers.filter(p => p == this.filterData.producers.selected.id.toString()).length > 0
                    return matchFound;
                });
            }
            this.selectedWorkflow.processes[p].filteredLots = [...filteredLots];
        }
        this.calculateDynamicAmounts();
    }


    /**
     * Method for count filters: one for section.
     */
    private countFilters(startDate: moment.Moment, endDate: moment.Moment, filterData: ITRFilter) {
        this.countFilter = 0;
        if (startDate || endDate) {
            this.countFilter = this.countFilter + 1;
        }
        if (filterData.seals.selected.length > 0) {
            this.countFilter = this.countFilter + 1;
        }
        if (filterData.producers.selected) {
            this.countFilter = this.countFilter + 1;
        }
    }

    /**
     * Method invoked for calculate dynamic amounts of processes lots
     */
    private calculateDynamicAmounts(): void {
        for (let p = 0; p < this.selectedWorkflow.processes.length; p++) {
            this.selectedWorkflow.processes[p].numberLots = this.selectedWorkflow.processes[p].filteredLots.length;
            this.selectedWorkflow.processes[p].weightQQ = accurateDecimalSum(
                this.selectedWorkflow.processes[p].filteredLots.map((f: IKanbanDashboardLot) => f.currentWeightQQ),
                this.DECIMAL_DIGITS
            );
        }
    }

    /**
     * Method invoked for finalize lot by id.
     */
    public finalizeLot(lot: IKanbanDashboardLot): void {
        this._router.navigateByUrl(`/routes/kanban/transition/${lot.id}?isFromDetail=false&isFromKanban=true&isEdit=false&commodity=${this._commodityId}`);
    }

}
