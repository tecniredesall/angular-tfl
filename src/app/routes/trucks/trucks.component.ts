import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrucksService } from './services/trucks.service';
import { ITrucksModel, TrucksModel } from './models/trucks.model';
import { AlertService } from '../../shared/utils/alerts/alert.service';
import { I18nPipe } from '../../shared/i18n/i18n.pipe';
import { PageEvent } from '@angular/material/paginator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { Subject } from 'rxjs';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { debounceTime, distinctUntilChanged, take, takeUntil, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { IPaginator } from 'src/app/shared/models/paginator.model';
import { ResizedEvent } from 'angular-resize-event';
import { ModalDeleteTruckComponent } from './modal-delete-truck/modal-delete-truck.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-trucks',
    templateUrl: './trucks.component.html',
    styleUrls: ['./trucks.component.scss']
})
export class TrucksComponent implements OnInit, OnDestroy {

    @BlockUI('data-grid-container') blockUIDataGrid: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public templateBlockModalUiDataGrid: BlockModalUiComponent = BlockModalUiComponent;
    public trucks: Array<ITrucksModel> = [];
    public trucksData: ITrucksModel;
    public trucksOriginal: Array<ITrucksModel> = [];
    public selectedView = CONSTANTS.VIEW_MODE.LIST;
    public isEdit = false;
    public isSearching = false;
    public paginator: IPaginator;
    public columnOrder: string = 'name';
    public columnAscState: any = {
        name: true,
        license_plate: true,
        vehicle_type: true
    }
    public searchText: string = '';
    public CONSTANTS = CONSTANTS;
    public PERMISSIONS = CONSTANTS.PERMISSIONS
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES
    public responsiveClass: string = 't-trucks-view-lg';
    private destroy$ = new Subject()
    private searchTerm$ = new Subject()
    private cancelRequest$ = new Subject();
    readonly TRANSPORT_SERVICE_TYPE = CONSTANTS.TRANSPORT_SERVICE_TYPE;

    constructor(
        private _dialog: MatDialog,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _trucksService: TrucksService,
        private _handlerError: ResponseErrorHandlerService,
    ) { }

    ngOnInit() {
        this.searchTerm$
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                tap((e) => {
                    this.isSearching = true;
                    this.cancelRequest$.next(true);
                }),
                debounceTime(500)
            )
            .subscribe(
                (term: string) => {
                    this.getTrucks(null, this._getParamsRequest());
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._handlerError.handleError(error, 'trucks')
                    );
                    this.blockUIDataGrid.stop();
                    this.isSearching = false;
                }
            );
        this.getTrucks(null, this._getParamsRequest());
    }

    private getTrucks(url?: string, params?: any): void {
        this.trucks = [];
        this.trucksOriginal = [];
        this.blockUIDataGrid.start();
        this._trucksService.getTrucks(url, params)
            .pipe(
                take(1),
                takeUntil(this.cancelRequest$)
            )
            .subscribe(
                (result: { paginator: IPaginator, data: ITrucksModel[] }) => {
                    if (result) {
                        this.paginator = result.paginator;
                        this.trucksOriginal = result.data;
                        this.trucks = Array.from(this.trucksOriginal);
                    }
                    this.isSearching = false;
                    this.blockUIDataGrid.stop();
                },
                error => {
                    this.blockUIDataGrid.stop();
                    const message: string = this._handlerError.handleError(error, 'trucks');
                    this._alertService.error(message)
                }
            );
    }

    public onTypeSearchInput(text: string): void {
        this.searchText = text;
        this.searchTerm$.next(trimSpaces(this.searchText));
    }

    public editTrucks(truck): void {
        this.isEdit = true;
        this.trucksData = truck;
        this.selectedView = CONSTANTS.VIEW_MODE.ACTION
    }

    public newTruck(): void {
        this.isEdit = false;
        this.trucksData = new TrucksModel(null);
        this.selectedView = CONSTANTS.VIEW_MODE.ACTION
    }

    public closeModal(): void {
        this.selectedView = CONSTANTS.VIEW_MODE.LIST
        this.trucksData = new TrucksModel(null);
    }

    /**
     * refresh data when an item is added or edited
     */
    public refreshData(): void {
        this.closeModal();
        this.getTrucks(null, this._getParamsRequest());
    }

    public deleteTruck(truck: ITrucksModel): void {
        let dialogRef = this._dialog.open(ModalDeleteTruckComponent, {
          autoFocus: false,
          disableClose: true,
          data: truck
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(
            (response) => {
              if (response.refresh) {
                this.getTrucks(null, this._getParamsRequest());
              }
            }
        )
    }

    public sortData(column: string): void {
        for (const key in this.columnAscState) {
            if (
                Object.prototype.hasOwnProperty.call(this.columnAscState, key) &&
                column !== key
            ) {
                this.columnAscState[key] = true;
            }
        }
        this.columnOrder = column;
        this.columnAscState[column] = !this.columnAscState[column];
        this.getTrucks(null, this._getParamsRequest());
    }

    public eventPaginator(event: PageEvent): void {
        let selectedPage: number = event.pageIndex + 1;
        if (this.paginator.currentPage != selectedPage) {
            let uri: string = null;
            if (this.paginator.currentPage + 1 == selectedPage) {
                uri = this.paginator.nextPageUrl;
            } else if (this.paginator.currentPage - 1 == selectedPage) {
                uri = this.paginator.previousPageUrl;
            } else if (1 == selectedPage) {
                uri = this.paginator.firstPageUrl;
            } else if (this.paginator.totalPages == selectedPage) {
                uri = this.paginator.lastPageUrl;
            }
            this.getTrucks(uri, this._getParamsRequest());
        }
    }

    private _getParamsRequest(): any {
        let params: any = {};
        if (this.searchText?.length > 0) {
            params.q = trimSpaces(this.searchText);
        }
        if (this.columnOrder) {
            params.order = this.columnOrder;
            params.sort = this.columnAscState[this.columnOrder] ? 'asc' : 'desc';
        }
        return params;
    }

    public onEventViewResized(event: ResizedEvent): void {
        if (event.newWidth < 576) {
            this.responsiveClass = 't-trucks-view-xs';
        }
        else if (event.newWidth < 768) {
            this.responsiveClass = 't-trucks-view-sm';
        }
        else if (event.newWidth < 992) {
            this.responsiveClass = 't-trucks-view-md';
        }
        else if (event.newWidth < 1200) {
            this.responsiveClass = 't-trucks-view-lg';
        }
        else {
            this.responsiveClass = 't-trucks-view-xl';
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.searchTerm$.complete();
        this.cancelRequest$.next(true);
        this.cancelRequest$.complete();
    }
}
