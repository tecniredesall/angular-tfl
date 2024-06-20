import { RetentionOrdersService } from './../../services/retention-orders.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil, distinctUntilChanged, tap, debounceTime } from 'rxjs/operators';
import { ILotWeignotesModel } from 'src/app/routes/lots/models/lot-weignotes.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { ITRFilter, TRFilter, TRFilterProductionStatus, TRFilterUserModel } from 'src/app/shared/models/filter-data.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { IUserModel, UserModel } from 'src/app/shared/models/user.model';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { collapse, sonCollapse } from 'src/app/shared/utils/animations/collapse.animation';
import { rotate } from 'src/app/shared/utils/animations/rotate.animation';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { eventPaginatorFunction } from 'src/app/shared/utils/functions/event-paginator';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { RetentionOrderWeightNotesModel } from '../../models/retention-orders-weight-notes';
import { IWCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { ITag } from 'src/app/shared/models/tags.model';
import { onDeleteTag } from 'src/app/shared/utils/functions/delete-item-from-filter';

@Component({
    selector: 'sst-retention-order-weight-notes',
    templateUrl: './retention-order-weight-notes.component.html',
    styleUrls: ['./retention-order-weight-notes.component.scss'],
    animations: [collapse, sonCollapse, rotate]
})
export class RetentionOrderWeightNotesComponent implements OnInit {
    @Output() eventBackTab: EventEmitter<void> = new EventEmitter<void>();
    @Output() eventCreateNewLot: EventEmitter<ILotWeignotesModel> = new EventEmitter<ILotWeignotesModel>();
    @Output() eventSetSelectedNotes: EventEmitter<Array<RetentionOrderWeightNotesModel>> = new EventEmitter<Array<RetentionOrderWeightNotesModel>>();
    @Input() filters: any;
    @Input() selectedNotes: RetentionOrderWeightNotesModel[] = [];
    @Input() companyInfo: IWCompanyInfoModel;
    @Input() idRetentionOrder: string;
    @ViewChild('matPaginator', { static: false }) matPaginator: MatPaginator;
    @BlockUI('weight-note') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public searchText: string;
    public allSelected: Array<{ page: number, selected?: boolean, indeterminated?: boolean }> = [];
    public currenPage: { page: number, selected?: boolean, indeterminated?: boolean };
    public weightNotes: RetentionOrderWeightNotesModel[] = [];
    public paginator: Paginator;
    public DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).general : 0;
    public isOrderAsc: boolean;
    private _factorConvertion: number;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public existOneSelected = false;
    private filterData: ITRFilter = new TRFilter();
    public columnOrder: string = 'created_at'
    public columnAscState = {
        created_at: false,
        folio: true,
        transformation_type: true,
        sacks: true,
        purchase_order_folio: true,
        net_weight_out: true,
        gold_weight_out: true,
        price: true,
    };
    private params: any;
    public unitAbbreviation: string;
    private _storageKeyBaseUnit: string = 'base-unit-abbrviation';
    private cancelNotesRequest$: Subject<boolean> = new Subject<boolean>();
    private searchTerm$: Subject<string> = new Subject<string>();
    public hasFilter: boolean = false;
    public countFilter: number = 0;
    public paramTags: any[] = [];
    private limitRowsPerPage: number = 10
    readonly DEDUCTION_TYPE = CONSTANTS.DEDUCTION_TYPE;
    readonly CHARACTERISTICS_FILTER_OPERATION_TYPE = CONSTANTS.CHARACTERISTICS_FILTER_OPERATION_TYPE;
    readonly CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION = CONSTANTS.CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION;
    readonly PAGINATOR = CONSTANTS.PAGINATOR;
    readonly PAYMENT_STATUS: any = CONSTANTS.PURCHASE_ORDER_STATUS;

    constructor(
        private _errorHandlerService: ResponseErrorHandlerService,
        private _alert: AlertService,
        private _i18nPipe: I18nPipe,
        private _dialog: MatDialog,
        private _retentionOrdersService: RetentionOrdersService,

    ) { }

    ngOnInit() {
        this.params = this.filters;
        this.getConfig();
        this._initSearch();
        this.sendWeightNotes();
    }

    public getConfig() {
        this._retentionOrdersService.getConfiguration().pipe(take(1)).subscribe(
            response => {
                this._factorConvertion = response ? (response.baseMeasurementUnitFactor) : 1;
                this.unitAbbreviation = response ? response.conversionMeasurementUnitAbbreviation : '';
                localStorage.setItem(this._storageKeyBaseUnit, this.unitAbbreviation);
                this.getRetentionOrderNotes(null, this._getParamsRequestNotes());
            },
            error => {
                let message: string = this._errorHandlerService.handleError(error, 'note')
                this._alert.errorTitle(this._i18nPipe.transform('error-msg'), message);
                this.blockUI.stop();
            }
        )
    }

    private getRetentionOrderNotes(url: string, params: any = {}): void {

        if (!this.filters.sellerId) {
            this._clearListWN()
            return
        }
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }

        this._retentionOrdersService.getWeighNotes(url, params).pipe(takeUntil(this.destroy$)).subscribe(
            (result: { data: RetentionOrderWeightNotesModel[], paginator: IPaginator }) => {

                this.paginator = result.paginator;
                this.weightNotes = result.data;

                this.setNotesSelection();
                this.blockUI.stop();
                this.setPageIndexAfterRequest();
            },
            error => {
                this.blockUI.stop();
                this.setPageIndexAfterRequest();
                const message: string = this._errorHandlerService.handleError(error, 'weight-note');
                this._alert.error(message)
            }
        )
    }

    public openFilter(event: any): void {
        if (this.filterData.isFirstTime) {
            const titleUser = 'user-wn-author'
            this.filterData.sealsRequired = false
            this.filterData.isFirstTime = false
            this.filterData.users = new TRFilterUserModel({ label: titleUser, required: true })
            this.filterData.purchaseOrderStatusWN = new TRFilterProductionStatus({ selected: [], lookups: this.PAYMENT_STATUS })
        }
        if (event.detail === 1) {
            this._dialog.open(FiltersComponent, {
                autoFocus: false,
                disableClose: true,
                data: this.filterData,

            }).afterClosed().pipe(
                takeUntil(this.destroy$),
                take(1)
            ).subscribe((result: any) => {
                if (result) {
                    this.filterData = result.data;
                    this.hasFilter = result.hasSelectedFilters;
                    if (result.refresh) {
                        this.paramTags = result.tags;
                        this.setFilteredLots(result.data);
                        this.countFilter = result.countSelectedFilters
                    }
                }
            });
        }
    }

    private _getParamsRequestNotes() {
        let queryParams: any = {}

        if (this.idRetentionOrder) {
            queryParams['retention_order'] = this.idRetentionOrder
        }

        if (this.limitRowsPerPage > 0) {
            queryParams['limit'] = this.limitRowsPerPage
        }

        if (this.searchText?.length > 0) {
            queryParams.search = trimSpaces(this.searchText);
            return queryParams;
        }

        if (this.params?.paymentStatus) {
            queryParams['payment_status[]'] = this.params.paymentStatus
        }

        if (this.params?.sellerId) {
            queryParams['seller'] = this.params.sellerId
        }

        if (this.columnOrder) {
            queryParams.order = this.columnOrder;
            queryParams.sort = this.columnAscState[this.columnOrder]
                ? 'asc'
                : 'desc';
        }

        if (this.params?.users?.length > 0) {
            const users: UserModel[] = this.params.users.map((user: IUserModel) => user.id);
            queryParams['created_by[]'] = users;
        } else {
            delete this.params?.users
        }

        if (this.params?.start_date) {
            queryParams.start_date = this.filterData.date.start;
            queryParams.start_date = moment(queryParams.start_date)
                .startOf('day')
                .utc()
                .format('YYYY-MM-DD HH:mm:ss');

        }
        if (this.params?.end_date) {
            queryParams.end_date = this.filterData.date.end;
            queryParams.end_date = moment(queryParams.end_date)
                .endOf('day')
                .utc()
                .format('YYYY-MM-DD HH:mm:ss');
        }

        return queryParams;
    }

    private _clearListWN() {
        delete this.params.sellerId
        this.selectedNotes = []
        this.weightNotes = []
        this.eventSetSelectedNotes.emit(this.selectedNotes)
    }

    /**
     * set filter data
     */
    private setFilteredLots(data: ITRFilter) {

        if (data.date.start) {
            this.params['start_date'] = moment(data.date.start);
        } else {
            delete this.params['start_date'];
        }
        if (data.date.end) {
            this.params['end_date'] = moment(data.date.end);
        } else {
            delete this.params['end_date'];
        }
        if (data.users.users?.length > 0) {
            this.params.users = Array.from(data.users.users);
        } else {
            delete this.params?.users
        }

        if (data.purchaseOrderStatusWN?.selected.length > 0) {
            this.params.paymentStatus = data.purchaseOrderStatusWN.selected
        } else {
            delete this.params.paymentStatus
        }

        const obj = new TRFilter({ ...data })
        this.countFilter = obj.countSelectedFilters()
        this.hasFilter = this.countFilter > 0
        this.getRetentionOrderNotes(null, this._getParamsRequestNotes())
    }
    /**
     * set weight notes selection in back action
     */
    private setNotesSelection(): void {
        if (this.selectedNotes.length > 0) {
            this.selectedNotes.forEach(note => {
                const selectedNote = this.weightNotes.find(x => x.id === note.id);
                if (selectedNote) {
                    selectedNote.selected = true
                }
            });
        }
    }
    /**
     * set page and selection per page
     */
    private setPageIndexAfterRequest(): void {
        if (this.matPaginator) {
            this.matPaginator.pageIndex = this.paginator.currentPage ? this.paginator.currentPage - 1 : 0;
            const indexPageSelected = this.allSelected.findIndex(pg => pg.page === this.paginator.currentPage);
            // get diferents receptions form selected notes
            const receptionSelected = this.selectedNotes.filter((note, i, arr) => arr.findIndex(w => w.id === note.id) === i);
            const duplicate = [];
            receptionSelected.forEach(item => {
                const existWeihtNote = this.weightNotes.find(x => x.id === item.id);
                if (existWeihtNote) {
                    duplicate.push(item);
                }
            });
            if (indexPageSelected >= 0) {
                this.currenPage = {
                    page: this.paginator.currentPage
                };
                this.currenPage.selected = duplicate.length === this.weightNotes.length;
                this.currenPage.indeterminated = duplicate.length > 0 && duplicate.length < this.weightNotes.length;
                this.allSelected[indexPageSelected] = this.currenPage;
            } else {
                this.currenPage = {
                    page: this.paginator.currentPage,
                    selected: false,
                };
                this.currenPage.indeterminated = duplicate.length > 0;
                this.allSelected.push(this.currenPage);
            }
        }
    }

    private _initSearch(): void {
        this.searchTerm$.pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged(),
            tap((e) => {
                this.cancelNotesRequest$.next(true);
                if (!this.blockUI.isActive) {
                    this.blockUI.start();
                }
            }),
            debounceTime(500)
        ).subscribe(
            (term: string) => {
                this.getRetentionOrderNotes(null, this._getParamsRequestNotes());
            },
            (error: HttpErrorResponse) => {
                this._alert.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'lots')
                );
                this.blockUI.stop();
            }
        );
    }

    public sortData(column: string) {
        for (const key in this.columnAscState) {
            if (Object.prototype.hasOwnProperty.call(this.columnAscState, key) && column !== key) {
                this.columnAscState[key] = true;
            }
        }
        this.columnOrder = column;
        this.columnAscState[column] = !this.columnAscState[column];
        this.getRetentionOrderNotes(null, this._getParamsRequestNotes());
    }

    public searchNotes(event) {
        this.searchTerm$.next(this.searchText)
    }

    public selectAll() {
        this.currenPage.selected = !this.currenPage.selected
        if (this.currenPage.selected) {
            this.weightNotes.forEach(wn => {
                if (wn.status != CONSTANTS.PURCHASE_ORDER_STATUS.CREATED) {
                    wn.selected = true;
                }
                const isNoteSelected = !this.selectedNotes.some(note => note.id === wn.id);
                if (isNoteSelected && wn.status != CONSTANTS.PURCHASE_ORDER_STATUS.CREATED) {
                    wn.selected = true;
                    this.selectedNotes.push(wn);
                }
            })
        } else {
            this.weightNotes.forEach(wn => {
                const isNoteSelected = this.selectedNotes.findIndex(note => note.id === wn.id);
                if (isNoteSelected !== -1) {
                    wn.selected = false;
                    this.selectedNotes[isNoteSelected].selected = false;
                }
            })
        }
        this.currenPage.indeterminated = false;
        this.allSelected[this.allSelected.findIndex(x => x.page === this.currenPage.page)] = this.currenPage;
        this.sendWeightNotes();
    }

    public selectWeightGroup(weight: RetentionOrderWeightNotesModel): void {
        const current = this.weightNotes.find(x => x.id === weight.id);
        current.selected = !current.selected;
        if (current.selected) {
            this.selectedNotes.push(current);
        } else {
            const index = this.selectedNotes.findIndex(x => x.id === weight.id);
            if (index !== -1) {

                this.selectedNotes[index].selected = false
            }

        }

        this.sendWeightNotes();
    }

    public onDeleteTag(tag: ITag): void {
        this.filterData = onDeleteTag(tag, this.filterData)
        this.setFilteredLots(this.filterData);
    }


    public eventPaginator(event: PageEvent): void {
        let uri = eventPaginatorFunction(event, this.paginator);
        if (event.pageSize) {
            this.limitRowsPerPage = event.pageSize
        }
        this.getRetentionOrderNotes(uri, this._getParamsRequestNotes());
    }

    private sendWeightNotes() {
        this.eventSetSelectedNotes.emit(this.selectedNotes.filter(x => x.selected));
    }

    private _countFilters(startDate: moment.Moment, endDate: moment.Moment, filterData: ITRFilter) {
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
        if (filterData.users?.users?.length > 0) {
            this.countFilter = this.countFilter + 1;
        }
        if (filterData.characteristics?.length > 0) {
            this.countFilter = this.countFilter + 1;
        }

    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.cancelNotesRequest$.next(true)
        this.cancelNotesRequest$.complete()
        this.searchTerm$.next();
        this.searchTerm$.complete();
    }
}
