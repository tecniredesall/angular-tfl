import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { forkJoin, Subject } from 'rxjs';
import { take, distinctUntilChanged, tap, debounceTime, takeUntil, switchMap } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { ITRFilter, TRFilter } from 'src/app/shared/models/filter-data.model';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ITRSealImage } from 'src/app/shared/utils/models/seal-image.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { WeightService } from '../../services/weight.service';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import * as printJS from 'print-js';
import { Router } from '@angular/router';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { IReceivingNoteListModel } from '../../models/receiving-note-list.model';
import { ModalNotesAssociatedComponent } from '../modal-notes-associated/modal-notes-associated.component';
import { IWNProductionModel } from '../../models/wn-production.model';
import { eventPaginatorFunction } from 'src/app/shared/utils/functions/event-paginator';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Component({
    selector: 'app-receiving-note-list',
    templateUrl: './receiving-note-list.component.html',
    styleUrls: ['./receiving-note-list.component.scss']
})
export class ReceivingNoteListComponent implements OnInit, OnDestroy {

    @BlockUI('notes-reception') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    @ViewChild('matPaginator', { static: false }) matPaginator: MatPaginator;

    @Input() set searchText(value: string) {
        this._searchText = value ?? ''
        this.searchTerm$.next(this._searchText);
    }
    @Input() set isOpenFilter(open: boolean) {
        if (open)
            this.openFilter();
    }
    @Output() closeFilter = new EventEmitter<boolean>();
    @Output() countSelectedFilters = new EventEmitter<number>();

    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals'))?.general;
    readonly RECEIVING_NOTE_STATUS: any = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly WEIGHT_NOTE_STATUS: any = CONSTANTS.WEIGHT_NOTE_STATUS;
    readonly PERMISSIONS = CONSTANTS.PERMISSIONS;
    readonly PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;

    public certifications = {};
    public isOpen: boolean = false;
    public openItem: string;
    public paginator: IPaginator = new Paginator();
    public receptionNotes: IReceivingNoteListModel[] = [];
    public params = {};
    public configuration: ITRConfiguration = new TRConfiguration();
    public isLoadData: boolean = true;
    public isOrderAsc: boolean = false;
    public columnOrder: string = null;
    public columnAscState: any = {}
    public isAllOpen = false;
    private _lookupsSeals: Array<ITRSealImage> = [];
    private _receptionNoteFilePDF: any;
    private _filterData: ITRFilter = new TRFilter();
    private _searchText: string
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cancelNotesRequest$: Subject<boolean> = new Subject<boolean>();
    private searchTerm$: Subject<string> = new Subject<string>();

    constructor(
        private _matdialog: MatDialog,
        private _alert: AlertService,
        private _sanitization: DomSanitizer,
        private _weightService: WeightService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _notifierService: NotifierService,
        private _alertService: AlertService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _i18nPipe: I18nPipe,
        private _router: Router
    ) { }

    ngOnInit() {

        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }

        forkJoin([
            this._purchaseOrderService.getConfiguration(),
            this._weightService.getRecivingWeightNotes(null, this._getParamsRequestNotes()),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                ([configuration, result]) => {
                    this.configuration = configuration;
                    this._setWeightNotes(result);
                    this.blockUI.stop();
                    this.isLoadData = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(
                        error,
                        'weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUI.stop();
                }
            );
        this._initializeColumnState();
        this._initSearch();
        this._initFilter();
    }

    private _initializeColumnState(): void {
        this.columnOrder = 'start_date';
        this.columnAscState = {
            start_date: false,
            reception_code: true,
            seller: true,
            transformations: true,
            tanks: true,
            net_weight: true
        };
    }

    private _initSearch(): void {
        this.searchTerm$.pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged(),
            tap((e) => {
                this.isLoadData = true
                this.cancelNotesRequest$.next(true);
                if (!this.blockUI.isActive) {
                    this.blockUI.start();
                }
            }),
            debounceTime(500),
            switchMap(() => this._weightService.getRecivingWeightNotesFiltered(this._getParamsRequestNotes()))
        ).subscribe(
            (result: { data: IReceivingNoteListModel[], paginator: IPaginator }) => {
                this._setWeightNotes(result)
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

    private _initFilter(): void {
        if (this._filterData.status == null) {
            this._filterData.status = {
                selected: this.params['status'] ?? [],
                lookups: this.RECEIVING_NOTE_STATUS
            }
        }

        if (this._filterData.receivingNoteStatus == null) {
            this._filterData.receivingNoteStatus = {
                selected: this.params['receivingNoteStatus'] ?? [],
                lookups: this.RECEIVING_NOTE_STATUS
            }
        }

        if (this._filterData.weightNoteStatus == null) {
            this._filterData.weightNoteStatus = {
                selected: this.params['weightNoteStatus'] ?? [],
                lookups: this.WEIGHT_NOTE_STATUS
            }
        }


        if (this._filterData.seals == null) {
            this._filterData.seals = {
                selected: this.params['certifications'] ?? [],
                lookups: this._lookupsSeals
            }
        }
    }

    public openNote(id: string, index: number) {
        this.isOpen = !this.isOpen;
        this.openItem = id;
        this.receptionNotes[index].isColapse = !this.receptionNotes[index].isColapse;
    }

    private _getReceptionNotes(uri = null, params: any = {}): void {
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this.isLoadData = true;
        this._weightService.getRecivingWeightNotes(uri, params)
            .pipe(takeUntil(this.cancelNotesRequest$), take(1))
            .subscribe(
                (result: { data: IReceivingNoteListModel[], paginator: IPaginator }) => {
                    this._setWeightNotes(result)
                    this.blockUI.stop();
                },
                (error) => {
                    this.blockUI.stop();
                    this.isLoadData = false;
                    const message: string = this._errorHandlerService.handleError(
                        error,
                        'weight-note'
                    );
                    this._alert.error(message);
                }, () => {
                    if (this._filterData.weightNoteStatus?.selected?.length > 0) {
                        this.expandAllElements();
                    }
                }
            )

    }

    private _getParamsRequestNotes(): any {
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
        if (this._filterData.status?.selected?.length > 0) {
            params['status[]'] = Array.from(this._filterData.status.selected);
        } else {
            delete this.params['in_process'];
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
        if (this._filterData.receivingNoteStatus?.selected?.length > 0) {
            params['receivingNoteStatus[]'] = Array.from(this._filterData.receivingNoteStatus.selected);
        }
        if (this._filterData.weightNoteStatus?.selected?.length > 0) {
            params['wn_status[]'] = Array.from(this._filterData.weightNoteStatus.selected);
        }
        return params;
    }

    private _setWeightNotes(result) {
        this.paginator = result.paginator;
        this.receptionNotes = result.data;
        this.getMessages();
        this.createObjectCertifications();
        this.receptionNotes.forEach((r: any) => {
            r.isAllowedCloseNote =
                this.RECEIVING_NOTE_STATUS.OPEN == r.isClose &&
                r.weightNotes.length > 0 &&
                -1 ==
                r.weightNotes.findIndex(
                    (w: any) =>
                        this.WEIGHT_NOTE_STATUS.OPEN ==
                        w.status
                );

            r.isColapse = this.isAllOpen;
        });
        this.blockUI.stop();

    }
    public colapseExpandAllElements() {
        this.receptionNotes.forEach((r: any) => {
            r.isColapse = !this.isAllOpen;
        });
        this.isAllOpen = !this.isAllOpen;
    }

    public expandAllElements() {
        this.receptionNotes.forEach((r: any) => {
            r.isColapse = true;
        });
        this.isAllOpen = true;
    }

    public getMessages() {
        this.receptionNotes.map((note: IReceivingNoteListModel) => {
            let tanks = note.weightNotes.map(
                (weightNote: any) => weightNote.vtankName
            );
            note.tanksMessage = tanks.join(', ');
            let transformations = note.weightNotes.map(
                (weightNote: any) => weightNote.ctName
            );
            note.transformationsMessage = transformations.join(', ');
        });
    }

    public createObjectCertifications() {
        this.receptionNotes.forEach((note) => {
            note.weightNotes.forEach((weightNote) => {
                weightNote.certifications.forEach((certification) => {
                    if (!this.certifications[certification.name]) {
                        this.certifications[certification.name] = {
                            certification_id: certification.id,
                            image: this._sanitization.bypassSecurityTrustUrl(
                                certification.image
                            ),
                        };
                    }
                });
            });
        });
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
        this._getReceptionNotes(null, this._getParamsRequestNotes());
    }

    public eventPaginator(event: PageEvent): void {
        let uri = eventPaginatorFunction(event, this.paginator);
        this._getReceptionNotes(uri, this._getParamsRequestNotes());
    }

    public openFilter() {

        this._matdialog
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
                        this._getReceptionNotes(null, this._getParamsRequestNotes());
                    }
                }
            });
    }

    public closeReceivingNote(note: IReceivingNoteListModel): void {
        this.blockUI.start();
        let requestData: any = {
            reception_id: note.id,
            status: CONSTANTS.RECEIVING_NOTE_STATUS.CLOSED,
            weight_notes: [],
        };
        this._weightService.changeStatusNote(requestData)
            .pipe(take(1))
            .subscribe(
                (response: any) => {
                    if (response.status) {
                        if (
                            this.RECEIVING_NOTE_STATUS.CLOSED ==
                            response.data.is_close
                        ) {
                            this._notifierService.notify(
                                'success',
                                this._i18nPipe.transform(
                                    't-receiving-note-closed'
                                )
                            );
                            note.isClose = true;
                            note.isAllowedCloseNote = false;
                            this._printReceptionNote(note.id);
                            this._getReceptionNotes(null, this._getParamsRequestNotes());

                        } else {
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('unidentified-problem')
                            );
                        }
                    }
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUI.stop();
                }
            )
    }

    private async _printReceptionNote(receptionId: any) {
        await this._getReportReceptionNote(receptionId);
        printJS({
            printable: this._receptionNoteFilePDF,
            type: 'pdf',
            base64: true,
            onPrintDialogClose: () => {
                this.blockUI.stop();
            },
            onPdfOpen: () => {
                this.blockUI.stop();
            }
        });
    }

    private async _getReportReceptionNote(receptionId: string) {
        try {
            let result = await this._weightService.reportReceptionNote(
                receptionId,
                CONSTANTS.FILE_REPORT_ACTIONS.FORMAT.PDF
            );
            this._receptionNoteFilePDF = result.data;
        } catch (e) {
            this.blockUI.stop();
            let message: string = this._errorHandlerService.handleError(e, 'note');
            this._alertService.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
            throw e;
        }
    }

    public onEditNote(note: IReceivingNoteListModel, weightNote: IWNProductionModel) {
        if (note.associated.length > 0) {
            if (weightNote) {
                let associatedWeightNote = !!note.associated.find(a => a.weightNotes.some(w => w.folio == weightNote.transactionInId));
                if (associatedWeightNote) {
                    this._matdialog.open(ModalNotesAssociatedComponent, {
                        data: {
                            note,
                            weightNote,
                            modalAssociatedNoteType: CONSTANTS.MODAL_ASSOCIATED_NOTE_TYPE.WEIGHT_NOTE
                        }
                    })
                } else {
                    let route = ['routes', 'weight-note', 'receiving-ticket', note.id, weightNote.transactionInId];
                    this._router.navigate(route);
                }
            } else {
                this._matdialog.open(ModalNotesAssociatedComponent, {
                    data: {
                        note,
                        weightNote,
                        modalAssociatedNoteType: CONSTANTS.MODAL_ASSOCIATED_NOTE_TYPE.RECEPTION_NOTE
                    }
                })
            }
        } else {
            let route = ['routes', 'weight-note', 'receiving-ticket', note.id];
            this._router.navigate(route);
        }
    }

    ngOnDestroy() {
        this.cancelNotesRequest$.next(true);
        this.cancelNotesRequest$.complete();
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
