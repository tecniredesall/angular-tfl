import { ITRFilter, TRFilter, TRFilterUserModel } from 'src/app/shared/models/filter-data.model';
import { ILotWeignotesModel } from './../../models/lot-weignotes.model';
import { debounceTime, distinctUntilChanged, take, takeUntil, tap } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { Router, Params } from '@angular/router';
import { BlockModalUiComponent } from './../../../../shared/block/block-modal.component';
import { LotsService } from './../../services/lots.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy, Input } from '@angular/core';
import { collapse, sonCollapse } from 'src/app/shared/utils/animations/collapse.animation';
import { rotate } from 'src/app/shared/utils/animations/rotate.animation';
import { Paginator } from 'src/app/shared/models/paginator.model';
import { ILotFilterStatusModel } from '../../models/lot-filter-status.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IWeightModel, IWeigthNoteModel, WeigthNoteModel } from './../../models/weigth-note.model.ts'
import { Subject } from 'rxjs';
import { DomSanitizer, EventManager } from '@angular/platform-browser';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { eventPaginatorFunction } from 'src/app/shared/utils/functions/event-paginator';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { ILotWarehouseModel } from '../../models/lot-warehouse.model';
import { IUserModel, UserModel } from 'src/app/shared/models/user.model';
import { WNPenaltyModel } from 'src/app/routes/weight-note/models/wn-penalty.model';
import { FormCharacteristicModel, IFormCharacteristicModel } from 'src/app/routes/weight-note/models/form-characteristic.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ITag, TagType } from 'src/app/shared/models/tags.model';
import { deleteArrayItemFilter, deleteObjectItemFilter, onDeleteTag } from 'src/app/shared/utils/functions/delete-item-from-filter';
@Component({
    selector: 'app-lot-list-receiving-note',
    templateUrl: './lot-list-receiving-note.component.html',
    styleUrls: ['./lot-list-receiving-note.component.scss'],
    animations: [collapse, sonCollapse, rotate]

})
export class LotListReceivingNoteComponent implements OnInit, OnDestroy {

    @Output() eventBackTab: EventEmitter<void> = new EventEmitter<void>();
    @Output() eventCreateNewLot: EventEmitter<ILotWeignotesModel> = new EventEmitter<ILotWeignotesModel>();
    @Output() eventSetSelectedNotes: EventEmitter<Array<IWeightModel>> = new EventEmitter<Array<IWeightModel>>();
    @Input() filters: ILotFilterStatusModel;
    @Input() selectedNotes: IWeightModel[] = [];

    @ViewChild('matPaginator', { static: false }) matPaginator: MatPaginator;
    @BlockUI('weight-note') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public searchText: string;
    public allSelected: Array<{ page: number, selected?: boolean, indeterminated?: boolean }> = [];
    public currenPage: { page: number, selected?: boolean, indeterminated?: boolean };
    public weightNotes: IWeigthNoteModel[] = [];
    public paginator: Paginator;
    public DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).general : 0;
    public isOrderAsc: boolean;
    private _factorConvertion: number;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public existOneSelected = false;
    private filterData: ITRFilter = new TRFilter();
    public columnOrder: string = 'start_date'
    public columnAscState = {
        start_date: false,
        reception_code: true,
        seller: true,
        transformations: true,
        tanks: true,
        net_weight: true,
        seals: true,
    };
    private params: any;
    private _timeout: any;
    public unitAbbreviation: string;
    private _storageKeyBaseUnit: string = 'base-unit-abbrviation';
    private cancelNotesRequest$: Subject<boolean> = new Subject<boolean>();
    private searchTerm$: Subject<string> = new Subject<string>();
    public hasFilter: boolean = false;
    public countFilter: number = 0;
    public paramTags: ITag[] = [];
    readonly CONSTANTS = CONSTANTS;
    readonly DEDUCTION_TYPE = CONSTANTS.DEDUCTION_TYPE;
    readonly CHARACTERISTICS_FILTER_OPERATION_TYPE = CONSTANTS.CHARACTERISTICS_FILTER_OPERATION_TYPE;
    readonly CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION = CONSTANTS.CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION;
    readonly KEY_FILTER: string = `${CONSTANTS.PERMISSIONS.LOTS}-${CONSTANTS.CRUD_ACTION.CREATE}-Filter`
    readonly KEY_TAGS: string = `${CONSTANTS.PERMISSIONS.LOTS}-${CONSTANTS.CRUD_ACTION.CREATE}-Tags`
    constructor(private _lotsService: LotsService,
        private _sanitization: DomSanitizer,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _alert: AlertService,
        private _i18nPipe: I18nPipe,
        private _dialog: MatDialog) { }


    ngOnInit() {
        this.params = this.filters;
        this.filterData = this._lotsService.getFilterStorage() ?? new TRFilter();
        this.paramTags = this._lotsService.getTagsStorage() ?? [] as ITag[]
        this.updateParams()
        this.getConfig();
        this._initSearch();
    }
    public getConfig() {
        this._purchaseOrderService.getConfiguration().pipe(take(1)).subscribe(
            response => {
                this._factorConvertion = response ? (response.baseMeasurementUnitFactor) : 1;
                this.unitAbbreviation = response ? response.conversionMeasurementUnitAbbreviation : '';
                localStorage.setItem(this._storageKeyBaseUnit, this.unitAbbreviation);
            },
            error => {
                let message: string = this._errorHandlerService.handleError(error, 'note')
                this._alert.errorTitle(this._i18nPipe.transform('error-msg'), message);
                this.blockUI.stop();
            }
        )

    }
    private getReceptionNotes(url: string, params: any = {}): void {

        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }

        this._lotsService.getReceptionNotes(url, params).pipe(takeUntil(this.destroy$)).subscribe(
            (result: any) => {
                this.paginator = new Paginator(result, true);
                this.weightNotes = result.data.map((data: any) => new WeigthNoteModel(data, this._factorConvertion));
                if (this.weightNotes.length > 0) {
                    this.weightNotes.forEach(item => {
                        item.collapsed = true;
                        if (item.weightNotes.length > 0) {
                            item.weightNotes.forEach(wn => {
                                if (wn.certifications.length > 0) {
                                    wn.certifications.forEach(cr => {
                                        cr.image = this._sanitization.bypassSecurityTrustUrl(cr.image);
                                    })
                                }
                            });
                        }
                    });
                }
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
            this.filterData.sealsRequired = false;
            this.filterData.users = new TRFilterUserModel({ label: 'user-wn-author', required: true })
            if (this.filterData.characteristics == null) {
                this.filterData.characteristics = new Array()
            }
            this.filterData.isFirstTime = false
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
                    this.paramTags = result.tags
                    this.hasFilter = result.hasSelectedFilters;
                    this.updateParams();
                }
            });
        }
    }

    private _getParamsRequestNotes() {
        let queryParams: any = {}
        if (this.params.warehouses.length > 0) {
            const tanks: number[] = this.params.warehouses.map((w: ILotWarehouseModel) => w.id);
            queryParams['tanks[]'] = tanks;
        }
        if (this.params?.commodityType) {
            queryParams['transformations[]'] = this.params?.commodityType.id
        }
        if (this.searchText?.length > 0) {
            queryParams.search = trimSpaces(this.searchText);
            return queryParams;
        }

        if (this.columnOrder) {
            queryParams.order = this.columnOrder;
            queryParams.sort = this.columnAscState[this.columnOrder]
                ? 'asc'
                : 'desc';
        }

        if (this.params?.start_date) {
            queryParams.start_date = moment(this.params['start_date']).startOf('day').utc().format("YYYY-MM-DD HH:mm:ss");

        }
        if (this.params?.end_date) {
            queryParams.end_date = moment(this.params['end_date']).endOf('day').utc().format("YYYY-MM-DD HH:mm:ss");

        }
        if (this.params?.users?.length > 0) {
            const users: number[] = this.params?.users.map((user: IUserModel) => user.id);           
            queryParams['users[]'] = users;
        }
        if (this.params?.characteristics?.length > 0) {
            let params = [];
            const operationTypes = Object.entries(this.CHARACTERISTICS_FILTER_OPERATION_TYPE);
            for (const c of this.params.characteristics) {
                let value: string;
                let operation: string;
                if (c.type === this.DEDUCTION_TYPE.CHOICE) {
                    value = c.selectedChoice;
                    operation = operationTypes[0][0].toLowerCase();
                } else {
                    value = `${c.value}`;
                    operation = operationTypes[c.operationType][0].toLowerCase();
                }
                if (c.type === this.DEDUCTION_TYPE.INPUT && c.operationType === this.CHARACTERISTICS_FILTER_OPERATION_TYPE.RANGE) {
                    params.push(`${c.slug},${operationTypes[1][0].toLowerCase()},${c.maxValue}`);
                    params.push(`${c.slug},${operationTypes[2][0].toLowerCase()},${c.value}`);
                } else {
                    params.push(`${c.slug},${operation},${value}`);
                }
            }

            queryParams['filters[]'] = params;
        }
        return queryParams;
    }

    public _getParamsTags(params): void {
        this.paramTags = [];
        if (params?.characteristics?.length > 0) {
            params.characteristics.forEach((c, index) => {
                const name = c.type == this.DEDUCTION_TYPE.CHOICE ?
                    `${c.name} / ${this._i18nPipe.transform(this.CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION[0].label)}` :
                    `${c.name} / ${this._i18nPipe.transform(this.CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION[c.operationType].label)}`;

                const value = c.type == this.DEDUCTION_TYPE.CHOICE ? c.selectedChoice :
                    c.operationType == this.CHARACTERISTICS_FILTER_OPERATION_TYPE.RANGE ?
                        `${c.value} - ${c.maxValue}` : `${c.value}`;
                this.paramTags.push({
                    title: `${name} : ${value}`,
                    type: TagType.Array,
                    property: "characteristics",
                    reference: index
                }
                )
            })
        }
        if (params?.users?.users?.length > 0) {
            params.users.users.forEach((u: IUserModel, index) => {
                this.paramTags.push({
                    title: u.fullName,
                    type: TagType.Users,
                    property: "users",
                    reference: index
                });
            });
        }

        if (params?.date) {
            if (params.date.start || params.date.end) {
                let title = params.date.start ? moment(params.date.start).format('DD/MM/YYYY').toString() : "";
                title += params.date.end ? ` - ${moment(params.date.end).format('DD/MM/YYYY').toString()}` : "";
                this.paramTags.push({
                    title: title,
                    type: TagType.Object,
                    property: "date",
                });
            }
        }
    }

    public onDeleteTag(tag: ITag): void {
        this.filterData = onDeleteTag(tag, this.filterData);
        this.updateParams();
    }

    public updateParams(): void {
        this.setFilteredLots(this.filterData);
        this._getParamsTags(this.filterData);
        localStorage.setItem(this.KEY_FILTER, JSON.stringify(this.filterData));
    }
    /**
     * set filter data
     */
    private setFilteredLots(data: any) {
        if (data.date.start != null) {
            this.params['start_date'] = moment(data.date.start);
        } else {
            delete this.params['start_date'];
        }
        if (data.date.end != null) {
            this.params['end_date'] = moment(data.date.end);
        } else {
            delete this.params['end_date'];
        }
        if (data?.users?.users?.length > 0) {
            this.params.users =Array.from(data.users.users);
        }
        else {
            delete this.params['users'];
        }
        if (data.characteristics?.length > 0) {
            this.params.characteristics = data.characteristics;
        } else {
            delete this.params['characteristics'];
        }

        this._countFilters(data.date.start, data.date.end, this.filterData);
        this.getReceptionNotes(null, this._getParamsRequestNotes())
    }
    /**
     * set weigth notes selection in back action
     */
    private setNotesSelection(): void {
        if (this.selectedNotes.length > 0) {
            this.selectedNotes.forEach(note => {
                const isNoteSelected = this.weightNotes.find(x => x.receptionId === note.receptionId);
                if (isNoteSelected) {
                    const noteSelected = isNoteSelected.weightNotes.find(nt => nt.transactionInId === note.transactionInId);
                    if (noteSelected) {
                        noteSelected.selected = true;
                    }
                    const totalNotes = this.selectedNotes.filter(x => x.receptionId === isNoteSelected.receptionId);
                    isNoteSelected.selected = totalNotes.length === isNoteSelected.weightNotes.length;
                    isNoteSelected.indeterminated = (totalNotes.length > 0) && totalNotes.length < isNoteSelected.weightNotes.length;
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
            const receptionSelected = this.selectedNotes.filter(
                (note, i, arr) => arr.findIndex(w => w.receptionId === note.receptionId) === i);
            const duplicate = [];
            receptionSelected.forEach(item => {
                const existWeihtNote = this.weightNotes.find(x => x.receptionId === item.receptionId);
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
                this.getReceptionNotes(null, this._getParamsRequestNotes());
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
        this.getReceptionNotes(null, this._getParamsRequestNotes());
    }

    public searchNotes(event) {
        this.searchTerm$.next(this.searchText)
    }

    public selectAll() {
        this.currenPage.selected = !this.currenPage.selected
        if (this.currenPage.selected) {
            this.weightNotes.forEach(wn => {
                wn.selected = true;
                wn.indeterminated = false;
                wn.weightNotes.forEach(note => {
                    const isNoteSelected = this.selectedNotes.findIndex(x => x.transactionInId === note.transactionInId);
                    if (isNoteSelected === -1) {
                        note.selected = true;
                        this.selectedNotes.push(note);
                    }
                });
            })
        } else {
            this.weightNotes.forEach(wn => {
                wn.selected = false;
                wn.weightNotes.forEach(note => {
                    const isNoteSelected = this.selectedNotes.findIndex(x => x.transactionInId === note.transactionInId);
                    if (isNoteSelected !== -1) {
                        note.selected = false;
                        this.selectedNotes.splice(isNoteSelected, 1);
                    }
                });
            })
        }
        this.currenPage.indeterminated = false;
        this.allSelected[this.allSelected.findIndex(x => x.page === this.currenPage.page)] = this.currenPage;
        this.sendWeightNotes();
    }
    public selectWeightGroup(weight: WeigthNoteModel): void {
        const current = this.weightNotes.find(x => x.receptionId === weight.receptionId);
        current.selected = !current.selected;
        if (current.selected) {
            current.weightNotes.forEach(wn => {
                const isNoteSelected = this.selectedNotes.findIndex(x => x.transactionInId === wn.transactionInId);
                if (isNoteSelected === -1) {
                    wn.selected = true;
                    this.selectedNotes.push(wn);
                }
            });

        } else {
            this.currenPage.selected = false;
            current.weightNotes.forEach(wn => {
                const isNoteSelected = this.selectedNotes.findIndex(x => x.transactionInId === wn.transactionInId);
                if (isNoteSelected !== -1) {
                    wn.selected = false;
                    this.selectedNotes.splice(isNoteSelected, 1);
                }
            });
        }
        weight.indeterminated = false;
        this.setIndeterminated();
        this.sendWeightNotes();
    }

    public selectOneNote(note: IWeightModel) {
        note.selected = !note.selected;
        if (note.selected) {
            this.selectedNotes.push(note);
        } else {
            const index = this.selectedNotes.findIndex(x => x.transactionInId === note.transactionInId);
            this.selectedNotes.splice(index, 1)
        }
        const isNoteReceptionSelected = this.weightNotes.find(x => x.receptionId === note.receptionId);
        const totalNotes = this.selectedNotes.filter(x => x.receptionId === note.receptionId);
        isNoteReceptionSelected.selected = totalNotes.length === isNoteReceptionSelected.weightNotes.length;
        isNoteReceptionSelected.indeterminated = (totalNotes.length > 0) && totalNotes.length < isNoteReceptionSelected.weightNotes.length;
        this.setIndeterminated();
        this.sendWeightNotes();
    }

    private setIndeterminated(): void {
        const notSelected = this.weightNotes.filter(x => x.selected === false).length;
        const indeterminatesNote = this.weightNotes.filter(x => x.indeterminated === true).length;
        this.currenPage.selected = notSelected === 0;
        this.currenPage.indeterminated = indeterminatesNote > 0 || (notSelected > 0 && notSelected < this.weightNotes.length) ? true : false;
        this.allSelected[this.allSelected.findIndex(x => x.page === this.currenPage.page)] = this.currenPage;
    }
    /**
     * Open panel
     * @param note note to will be open
     */
    public openCollapse(note) {
        note.collapsed = !note.collapsed;
    }

    public eventPaginator(event: PageEvent): void {
        let uri = eventPaginatorFunction(event, this.paginator);
        this.getReceptionNotes(uri, this._getParamsRequestNotes());
    }

    private sendWeightNotes() {
        this.eventSetSelectedNotes.emit(this.selectedNotes);
    }

    private _countFilters(startDate: moment.Moment, endDate: moment.Moment, filterData: ITRFilter) {
        this.countFilter = 0;
        if (startDate || endDate) {
            this.countFilter = this.countFilter + 1;
        }
        if (filterData?.seals?.selected?.length > 0) {
            this.countFilter = this.countFilter + 1;
        }
        if (filterData?.producers?.selected) {
            this.countFilter = this.countFilter + 1;
        }
        if (filterData?.users?.users?.length > 0) {
            this.countFilter = this.countFilter + 1;
        }
        if (filterData?.characteristics?.length > 0) {
            this.countFilter = this.countFilter + 1;
        }
        this.hasFilter = this.countFilter ? true : false;
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
