import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import {
    debounceTime, distinctUntilChanged, filter, map, switchMap, take, takeUntil, tap
} from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { MainHeaderComponent } from 'src/app/shared/main-header/main-header.component';
import { TIProducerModel, TProducerModel } from 'src/app/shared/models/sil-producer';
import { FileDownloadService } from 'src/app/shared/services/file-download/file-download.service';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { PaginationModel } from 'src/app/shared/utils/models/paginator.model';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { AfterViewInit, Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ProducersService } from './services/producer/producers.service';
import { FederatedService } from '../../shared/services/federated-sync/federated.service';

@Component({
    selector: 'app-producers',
    templateUrl: './producers.component.html',
    styleUrls: ['./producers.component.scss'],
})
export class ProducersComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MainHeaderComponent) private _header: MainHeaderComponent;
    @HostBinding('class') hostClasses = 'sil-overflow-container';
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public producers: TIProducerModel[] = [];
    public listProducers: TIProducerModel[] = [];
    public producerToDelete: TIProducerModel;
    public producerToSearch = '';
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public columnOrder = 'producer';
    public columnAscState = {
        producer: true,
        farms: true,
        blocks: true,
        associates: true,
    };
    public pagination: PaginationModel;
    @BlockUI('hello') blockUI: NgBlockUI;
    private orderValue: any = {
        producer: 'sellers.name',
        farms: 'totalFarmsByProducer',
        blocks: 'totalBlocksByProducer',
        associates: 'totalPartnersByProducer',
    };
    public isSyncStarted: boolean = false;
    public workerSyncAction: string = CONSTANTS.WORKER_SYNC_ACTIONS.FEDERATION_DATA;
    constructor(
        private _producerService: ProducersService,
        private _paginationService: PaginationService,
        private _router: Router,
        private _notifier: NotifierService,
        private _alert: AlertService,
        private _i18n: I18nPipe,
        private _fileDownloader: FileDownloadService,
        private _i18nPipe: I18nPipe,
        private _responseErrorHandlerService: ResponseErrorHandlerService,
        private _federatedService: FederatedService
    ) { }

    public ngOnInit() {
        // Pagination observable to keep list state on navigation
        this._paginationService.pagination$
            .pipe(
                takeUntil(this.destroy$),
                filter((p) => !!p)
            )
            .subscribe((p) => (this.pagination = p));
        // Search term observable to keep input state on navigation
        this._producerService.searchTerm$
            .pipe(takeUntil(this.destroy$))
            .subscribe((t) => (this.producerToSearch = t ? t : ''));
        this.setProducers();
    }
    public ngAfterViewInit() {
        // Search input event handler
        this._header.eventSearchInput
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntil(this.destroy$),
                filter(() => !this.blockUI.isActive),
                tap((v) => {
                    this.producerToSearch = v;
                    this.blockUI.start();
                }),
                switchMap(() =>
                    this._producerService.getProducersFiltered(
                        this.getParamsRequestProducers()
                    )
                )
            )
            .subscribe(
                (p: TIProducerModel[]) => {
                    this.initProducerData(p);
                    this.blockUI.stop();
                },
                () => this.blockUI.stop()
            );
    }
    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    private setProducers(page?: PageEvent) {
        this.blockUI.start();
        const params: any = this.getParamsRequestProducers();
        this._producerService
            .getProducers(page, params)
            .pipe(
                take(1),
                filter((t) => !!t)
            )
            .subscribe(
                (p: TIProducerModel[]) => {
                    this.initProducerData(p);
                },
                (e) => {
                    this.blockUI.stop();
                    this._alert.showAlert(e.status, e.message);
                },
                () => this.blockUI.stop()
            );
    }

    /**
     * Inits current producers as wel as list producer objects (these are ONLY used for list display)
     * @param p producer object to init with
     */
    private initProducerData(p: TIProducerModel[]) {
        this.producers = p;
        this.listProducers = this.producers;
    }

    /**
     * Navigate to a producer profile
     * @param producer producer row clicked
     */
    public onRowSelected(producer: TIProducerModel) {
        this._router.navigate(['routes', 'producers', 'profile', producer.id]);
    }

    /**
     * Sorts grid data ascend or descend depending on current sort state
     * @param colum column for sorting
     */
    public sortData(column: string) {
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
        this.setProducers();
    }
    /**
     * Handle page events
     * @param event the page event data to be requested
     */
    public onPaginatorEvent(event: PageEvent) {
        this.setProducers(event);
    }
    /**
     * Handles all component action emition
     * @param action constant value for action clicked
     * @param index optional row index to get data from array
     */
    public onActionClicked(action: number, id?: number) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this._router.navigate(['routes', 'producers', 'edit', id]);
                break;
            case CONSTANTS.CRUD_ACTION.CREATE:
                this._router.navigate(['routes', 'producers', 'new']);
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                // This opens warning
                this.producerToDelete = this.producers.find((p) => p.id === id);
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL:
                // This closes warning
                this.producerToDelete = null;
                break;
            default:
                break;
        }
    }

    public onDownloadCsv() {
        this.blockUI.start();
        let params: any = this.getParamsRequestProducers();
        this._producerService
            .getCSVProducers(params)
            .pipe(take(1))
            .subscribe(
                (url) => {
                    this._fileDownloader.downloadFromURL(
                        url,
                        `${this._i18nPipe.transform(
                            't-producers-list-file'
                        )}.csv`
                    );
                    this.blockUI.stop();
                },
                (e) => {
                    const message: string = this._responseErrorHandlerService.handleError(
                        e,
                        't-producer'
                    );
                    this.blockUI.stop();
                    this._alert.error(message);
                }
            );
    }
    /**
     * Calls API service to delete a producer or shows error
     * @param producer producer data to delete
     */
    public onDeleteProducer(producer: TIProducerModel) {
        this.producerToDelete = null;
        this.blockUI.start();
        this._producerService
            .deleteProducer(producer.id)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('t-producer-delete-success')
                    );
                    this.setProducers();
                },
                (error) => {
                    this.blockUI.stop();
                    const message: string = this._responseErrorHandlerService.handleError(
                        error,
                        't-producer'
                    );
                    this._alert.errorTitle(this._i18n.transform('error-msg'), message);
                }
            );
    }

    /**
     * Get object with params to request producers
     * @param searchValue text to search
     */
    private getParamsRequestProducers(): any {
        let searchValue: string =
            this.producerToSearch?.length > 0 ? this.producerToSearch : null;
        let sortColumn: string = this.columnAscState[this.columnOrder]
            ? 'asc'
            : 'desc';
        let params: any = {
            order: this.orderValue[this.columnOrder],
            sort: sortColumn,
        };
        if (null != searchValue) {
            params['q'] = searchValue;
        }
        return params;
    }
}
