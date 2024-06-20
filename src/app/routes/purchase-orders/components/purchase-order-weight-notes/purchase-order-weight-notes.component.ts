import { IPaginator , Paginator } from './../../../../shared/models/paginator.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import {
    collapse,
    sonCollapse,
} from 'src/app/shared/utils/animations/collapse.animation';
import { rotate } from 'src/app/shared/utils/animations/rotate.animation';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import {
    IReceptionNotePurchaseOrderModel,
    IWeightNoteModel,
} from '../../models/reception-note-purchase-order.model';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import { NotifierService } from 'angular-notifier';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import * as moment from 'moment';
import { ContractTrumodityDetailModel } from '../../models/contract-tummodity-detail.model';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Component({
    selector: 'app-purchase-order-weight-notes',
    templateUrl: './purchase-order-weight-notes.component.html',
    styleUrls: ['./purchase-order-weight-notes.component.scss'],
    animations: [collapse, sonCollapse, rotate],
})
export class PurchaseOrderWeightNotesComponent implements OnInit, OnDestroy {
    @BlockUI('purchase-order-weight-note') blockUI: NgBlockUI;
    @ViewChild('matPaginator', { static: false }) matPaginator: MatPaginator;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public searchText: string = '';
    public openPanel = true;
    public columnOrder = {
        start_date: true,
        folio: true,
        totalSacks: true,
        weight: true,
    };
    public paginator: Paginator;
    public isOrderAsc: boolean;
    public weightNotes: IReceptionNotePurchaseOrderModel[] = [];
    public receptionNotes: IReceptionNotePurchaseOrderModel[] = [];
    public selectedWeightNotes: IWeightNoteModel[] = [];
    public currentPage: {
        page: number;
        isSelected?: boolean;
        isIndeterminated?: boolean;
    };
    private allSelected: Array<{
        page: number;
        isSelected?: boolean;
        indeterminated?: boolean;
    }> = [];
    public contract: ContractTrumodityDetailModel;
    public producer: TProducerModel;
    public totalQQSelected: number = 0;
    public remainingContractQQ: number = 0;
    public isValidNotes: boolean = false;
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals')
        ? JSON.parse(localStorage.getItem('decimals')).general
        : 0;

    private _currentPageUrl: string;
    private _notesInPurchaseOrder: IWeightNoteModel[] = [];
    private _params: any = {};
    private _purchaseOrderDate: moment.Moment;
    private _timeout: any;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public configuration: ITRConfiguration = new TRConfiguration();
    weightBeforeSelecteNotes: number = 0;
    constructor(
        private _purchaseService: PurchaseOrdersService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _alert: AlertService,
        private _notifierService: NotifierService,
        private _i18nPipe: I18nPipe,
        public dialogRef: MatDialogRef<PurchaseOrderWeightNotesComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            contract: ContractTrumodityDetailModel;
            producer: TProducerModel;
            notes: IWeightNoteModel[];
            purchaseOrderDate: moment.Moment,
            configuration: ITRConfiguration,
            weightBeforeSelecteNotes:number
        }
    ) {
        this.contract = data.contract;
        this.producer = data.producer;
        this.configuration = data.configuration;
        this._purchaseOrderDate = data.purchaseOrderDate;
        this._notesInPurchaseOrder = data.notes;
        this.remainingContractQQ = this.contract.contractId ? (this.contract.weightQQ - this.getTotalFromPurchaseDetail) : 0;
        this.weightBeforeSelecteNotes = data.weightBeforeSelecteNotes;
    }

    get getTotalFromPurchaseDetail(): number {

        let totalSelectedQQ = 0;
        this._notesInPurchaseOrder.forEach(note => {
            totalSelectedQQ += note.netDryWeightOut
        });
        return totalSelectedQQ;
    }

    ngOnInit() {
        if(this._notesInPurchaseOrder.length > 0) {
            this.selectedWeightNotes = Array.from(this._notesInPurchaseOrder)
        }
        this.getWeightNotes();
    }

    private getWeightNotes(isSearch: boolean = false) {
        let url: string = isSearch ? null : this._currentPageUrl;
        this.blockUI.start();
        this._purchaseService
            .getWeightNotes(url, this._params, this.producer.id, this._purchaseOrderDate, this.contract.commodityId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.paginator = result.paginator
                    this.receptionNotes = result.data
                    this.receptionNotes.forEach((rn) => {
                        let weightNotesSelected = [];
                        rn.weightNotes.forEach((wn) => {
                            const isWeightNoteSelected = !!this._notesInPurchaseOrder.find(np => np.id === wn.id);
                            const isInSelectedWeightNotes = !!this.selectedWeightNotes.find(sw => sw.id === wn.id);
                            if(isWeightNoteSelected || isInSelectedWeightNotes) {
                                wn.selected = true;
                                weightNotesSelected.push(wn)
                            }
                        });
                        rn.selected = weightNotesSelected.length == rn.weightNotes.length;
                        rn.indeterminated = weightNotesSelected.length > 0 && !rn.selected;

                    });
                    this.setPageIndexAfterRequest();
                    this.calculateTotalNoteSelected();
                    this.blockUI.stop();
                },
                (error) => {
                    this.blockUI.stop();
                    const message: string = this._errorHandlerService.handleError(error, 'weight-note');
                    this._alert.error(message);
                    this.setPageIndexAfterRequest();
                }
            );
    }

    /**
     * set page and selection per page
     */
    private setPageIndexAfterRequest(): void {
        if (this.matPaginator) {
            const indexPageSelected = this.allSelected.findIndex(
                (pg) => pg.page === this.paginator.currentPage
            );
            // get diferents receptions form selected notes
            const receptionSelected = this.selectedWeightNotes.filter(
                (note, i, arr) =>
                    arr.findIndex((w) => w.receptionId === note.receptionId) ===
                    i
            );
            const duplicate = [];
            receptionSelected.forEach((item) => {
                const existWeihtNote = this.receptionNotes.find(
                    (x) => x.id === item.receptionId
                );
                if (existWeihtNote) {
                    duplicate.push(item);
                }
            });
            if (indexPageSelected >= 0) {
                this.currentPage = {
                    page: this.paginator.currentPage,
                };
                this.currentPage.isSelected = this.receptionNotes.length > 0 ?
                    duplicate.length === this.receptionNotes.length : false;
                this.currentPage.isIndeterminated =
                    duplicate.length > 0 &&
                    duplicate.length < this.receptionNotes.length;
                this.allSelected[indexPageSelected] = this.currentPage;
            } else {
                this.currentPage = {
                    page: this.paginator.currentPage,
                    isSelected: false,
                };
                this.currentPage.isIndeterminated = duplicate.length > 0;
                this.allSelected.push(this.currentPage);
            }
        }
    }
    public searchNotes(event) {
        clearTimeout(this._timeout);
        this._params = {};
        this._timeout = setTimeout(() => {
            const search: string = event.target.value ?? '';
            search.toLocaleLowerCase();
            this._params['search'] = search;
            this.getWeightNotes(true);
        }, 600);
    }
    /**
     * sort Data
     * @param column column for sorData
     */
    public sortData(column: string) {
        for (const key in this.columnOrder) {
            if (column !== key) {
                this.columnOrder[key] = true;
            }
        }
        this.columnOrder[column] = !this.columnOrder[column];
        this._params['sort'] = this.columnOrder[column] ? 'asc' : 'desc';
        this._params['order'] = column;
        this.getWeightNotes();
    }

    public openCollapse(note: IReceptionNotePurchaseOrderModel) {
        note.collapsed = !note.collapsed;
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
            this._params = {};
            this._currentPageUrl = uri;
            this.getWeightNotes();
        }
    }
    public toggleSelectAll() {
        this.currentPage.isSelected = !this.currentPage.isSelected;
        if (this.currentPage.isSelected) {
            this.receptionNotes.forEach((wn) => {
                wn.selected = true;
                wn.indeterminated = false;
                wn.weightNotes.forEach((note) => {
                    const isNoteSelected = this.selectedWeightNotes.findIndex(
                        (x) => x.transactionInId === note.transactionInId
                    );
                    if (isNoteSelected === -1) {
                        note.selected = true;
                        this.selectedWeightNotes.push(note);
                    }
                });
            });
        } else {
            this.receptionNotes.forEach((wn) => {
                wn.selected = false;
                wn.weightNotes.forEach((note) => {
                    const isNoteSelected = this.selectedWeightNotes.findIndex(
                        (x) => x.transactionInId === note.transactionInId
                    );
                    if (isNoteSelected !== -1) {
                        note.selected = false;
                        this.selectedWeightNotes.splice(isNoteSelected, 1);
                    }
                });
            });
        }
        this.currentPage.isIndeterminated = false;
        this.allSelected[
            this.allSelected.findIndex((x) => x.page === this.currentPage.page)
        ] = this.currentPage;
        this.calculateTotalNoteSelected();
    }
    public selectWeightGroup(receptionNote: IReceptionNotePurchaseOrderModel): void {
        const currentRecepionNote = this.receptionNotes.find(
            (x) => x.id === receptionNote.id
        );
        currentRecepionNote.selected = !currentRecepionNote.selected;
        if (currentRecepionNote.selected) {
            currentRecepionNote.weightNotes.forEach((wn) => {
                const isNoteSelected = this.selectedWeightNotes.findIndex(
                    (x) => x.transactionInId === wn.transactionInId
                );
                if (isNoteSelected === -1) {
                    wn.selected = true;
                    this.selectedWeightNotes.push(wn);
                }
            });
        } else {
            this.currentPage.isSelected = false;
            currentRecepionNote.weightNotes.forEach((wn) => {
                const isNoteSelected = this.selectedWeightNotes.findIndex(
                    (x) => x.transactionInId === wn.transactionInId
                );
                if (isNoteSelected !== -1) {
                    wn.selected = false;
                    this.selectedWeightNotes.splice(isNoteSelected, 1);
                }
            });
        }
        currentRecepionNote.indeterminated = false;
        this._setIndeterminated();
        this.calculateTotalNoteSelected();
    }

    public toggleSelectWeightNote(weightNote: IWeightNoteModel) {
        weightNote.selected = !weightNote.selected;
        if (weightNote.selected) {
            this.selectedWeightNotes.push(weightNote);
        } else {
            this._deleteWeightNoteSelected(weightNote);
        }
        const receptionNote = this.receptionNotes.find(
            (x) => x.id === weightNote.receptionId
        );
        const weightNotesSelectedByReceptionNote = this.selectedWeightNotes.filter(
            (x) => x.receptionId === weightNote.receptionId
        );
        receptionNote.selected = weightNotesSelectedByReceptionNote.length === receptionNote.weightNotes.length;
        receptionNote.indeterminated = weightNotesSelectedByReceptionNote.length > 0
            && weightNotesSelectedByReceptionNote.length < receptionNote.weightNotes.length;
        this._setIndeterminated();
        this.calculateTotalNoteSelected();
    }

    private _deleteWeightNoteSelected(weightNote: IWeightNoteModel) {
        const index = this.selectedWeightNotes.findIndex(
            (x) => x.transactionInId === weightNote.transactionInId
        );
        this.selectedWeightNotes.splice(index, 1);
    }

    private _setIndeterminated(): void {
        const notSelectedReceptionNotes = this.receptionNotes.filter(
            (x) => x.selected === false
        ).length;
        const indeterminatesReceptionNotes = this.receptionNotes.filter(
            (x) => x.indeterminated === true
        ).length;
        this.currentPage.isSelected = notSelectedReceptionNotes === 0;
        this.currentPage.isIndeterminated =
            indeterminatesReceptionNotes > 0 ||
            (notSelectedReceptionNotes > 0 && notSelectedReceptionNotes < this.receptionNotes.length)
        this.allSelected[
            this.allSelected.findIndex((x) => x.page === this.currentPage.page)
        ] = this.currentPage;
    }

    public onEventAddNote(action: number) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.CREATE: {
                this.selectedWeightNotes.forEach(note => {
                    note.netDryWeight = note.netDryWeight;
                })
                this.dialogRef.close(this.selectedWeightNotes);
                break;
            }
            case CONSTANTS.CRUD_ACTION.CANCEL: {
                this.dialogRef.close([]);
                break;
            }
        }
    }

    public calculateTotalNoteSelected() {
        this.totalQQSelected = 0;
        this.selectedWeightNotes.forEach((note) => {
            this.totalQQSelected += note.netDryWeightOut;
        });
        const isThresholdValid = this.contract.contractId && (this.totalQQSelected + this.weightBeforeSelecteNotes    <= this.contract.weightQQ);
        this.remainingContractQQ = (this.contract.contractId ? this.contract.weightQQ : 0) - this.totalQQSelected;
        this.isValidNotes = !this.contract.contractId && this.selectedWeightNotes.length > 0
        if (this.contract.contractId) {
            this.isValidNotes = this.selectedWeightNotes.length > 0 && isThresholdValid;
            if (this.contract.contractId && !isThresholdValid) {
                this._notifierService.notify('error', this._i18nPipe.transform('amount-exceeds-contract'))
            }
        } else {
            this.isValidNotes = this.selectedWeightNotes.length > 0;
        }

    }
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
