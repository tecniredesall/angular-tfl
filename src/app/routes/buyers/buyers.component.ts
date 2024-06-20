import { BuyersService } from './services/buyers.service';
import { AfterViewInit, Component, HostBinding, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MainHeaderComponent } from 'src/app/shared/main-header/main-header.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { TIBuyerModel } from './models/buyer.model';
import { Subject } from 'rxjs';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, filter, take, takeUntil, tap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { FileDownloadService } from 'src/app/shared/services/file-download/file-download.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
@Component({
    selector: 'app-buyers',
    templateUrl: './buyers.component.html',
    styleUrls: ['./buyers.component.scss']
})
export class BuyersComponent implements OnInit  , OnDestroy{

    @ViewChild(MainHeaderComponent) private _header: MainHeaderComponent;
    @HostBinding('class') hostClasses = 'sil-overflow-container';
    @BlockUI('data-grid-container') blockUI: NgBlockUI;

    public templateBlockModalUiDataGrid: BlockModalUiComponent = BlockModalUiComponent;
    public buyers: TIBuyerModel[] = [];
    public listBuyers: TIBuyerModel[] = [];
    public producerToDelete: TIBuyerModel;
    public buyerToSearch = '';
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public columnOrder = 'company_name';
    public pagination: Paginator;
    public isLoadData = false
    public columnAscState = {
        company_name: true,
        company_rtn: false,
        legal_fullname: false,

    };

    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cancelBuyersRequest$: Subject<boolean> = new Subject<boolean>();
    private currentLanguage = '';
    private searchTerm$: Subject<string> = new Subject<string>();

    constructor(
        private _buyersService: BuyersService,
        private _alert: AlertService,
        private _i18n: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _i18nService: I18nService,
        private _fileDownloader: FileDownloadService,
    ) {
        this._i18nService.lang.subscribe((l) => (this.currentLanguage = l));
    }


    ngOnInit() : void {
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._getBuyers(null, this._getParamsRequestBuyers());
        this.__initSearch();
    }

    ngOnDestroy(): void {
      this.destroy$.next(true)
      this.destroy$.complete()
      this.cancelBuyersRequest$.next(true)
      this.cancelBuyersRequest$.complete()
    }

    public sortData(column: string) {
        for (const key in this.columnAscState) {
            if (
                Object.prototype.hasOwnProperty.call(
                    this.columnAscState,
                    key
                ) &&
                column !== key
            ) {
                this.columnAscState[key] = false;
            }
        }
        this.columnOrder = column;
        this.columnAscState[column] = !this.columnAscState[column];
        this._getBuyers(null, this._getParamsRequestBuyers())
    }

    public eventPaginator(event: PageEvent): void {
        let selectedPage: number = event.pageIndex + 1;
        if (this.pagination.currentPage != selectedPage) {
            let uri: string = null;
            if (this.pagination.currentPage + 1 == selectedPage) {
                uri = this.pagination.nextPageUrl;
            } else if (this.pagination.currentPage - 1 == selectedPage) {
                uri = this.pagination.previousPageUrl;
            } else if (1 == selectedPage) {
                uri = this.pagination.firstPageUrl;
            } else if (this.pagination.totalPages == selectedPage) {
                uri = this.pagination.lastPageUrl;
            }
            this._getBuyers(uri, this._getParamsRequestBuyers());
        }
    }

    /**
     * Handles all component action emition
     * @param action constant value for action clicked
     * @param index optional row index to get data from array
     */
    public onActionClicked(action: number, id?: number) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                //TODO
                break;
            case CONSTANTS.CRUD_ACTION.CREATE:
                 //TODO
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                 //TODO
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL:
                // This closes warning
                //TODO
                break;
            default:
                break;
        }
    }

    public onDownloadCsv():void {
        this.blockUI.start();
        this._buyersService
            .exportCsv(null, { lang: this.currentLanguage })
            .pipe(take(1))
            .subscribe(
                (url) => {
                    this._fileDownloader.downloadFromURL(
                        url,
                        `${this._i18n.transform('t-buyers-list-file')}.csv`
                    );
                    this.blockUI.stop();
                },
                (e) => {
                    const message: string = this._errorHandlerService.handleError(e, 'buyers');
                    this.blockUI.stop();
                    this._alert.error(message);
                }
            );
    }

    public searchBuyer($event):void{
        this.searchTerm$.next($event)
    }

    private __initSearch(): void {
        this.searchTerm$.pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged(),
            tap((e) => {
                this.isLoadData = true
                this.cancelBuyersRequest$.next(true);
                if (!this.blockUI.isActive) {
                    this.blockUI.start();
                }
            }),
            debounceTime(500)
        ).subscribe(
            (term: string) => {
                this.buyerToSearch= term;
                this._getBuyers(null, this._getParamsRequestBuyers())
            },
            (error: HttpErrorResponse) => {
                this._alert.errorTitle(
                    this._i18n.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'buyers')
                );
                this.blockUI.stop();
                this.isLoadData = false;
            }
        );

    }

    private _getBuyers(uri, params) {
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this.isLoadData = true;

        this._buyersService.getBuyers(uri, params).pipe(take(1)).subscribe(
            (response: any) => {
                this._setListBuyer(response)
                this.blockUI.stop();
                this.isLoadData= false;
            }, (error: HttpErrorResponse) => {
                let message = this._errorHandlerService.handleError(
                    error,
                    'buyers'
                );
                this._alert.errorTitle(
                    this._i18n.transform('error-msg'),
                    message
                );
                this.blockUI.stop();
                this.isLoadData= false;
            });

    }

    private _setListBuyer(response : { paginator : IPaginator , data: TIBuyerModel[] }) {
        this.listBuyers = response.data;
        this.pagination = response.paginator;
    }

    private _getParamsRequestBuyers(): any {
        let searchValue: string =
            this.buyerToSearch?.length > 0 ? this.buyerToSearch : null;
        let sortColumn: string = this.columnAscState[this.columnOrder]
            ? 'asc'
            : 'desc';
        let params: any = {
            order: this.columnOrder,
            sort: sortColumn,
        };
        if (null != searchValue) {
            params['q'] = searchValue;
        }
        return params;
    }


}
