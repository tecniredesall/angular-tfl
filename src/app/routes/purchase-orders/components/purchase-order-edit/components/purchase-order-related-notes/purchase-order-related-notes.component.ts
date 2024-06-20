import { accurateDecimalMultiplication, accurateRoundDecimalMultiplication, roundDecimal } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { findIndex, retry, take, takeUntil } from 'rxjs/operators';
import {
    ContractTrumodityModel
} from 'src/app/routes/purchase-orders/models/contract-trumodity.model';
import {
    ContractTrumodityDetailModel
} from 'src/app/routes/purchase-orders/models/contract-tummodity-detail.model';
import { PurchaseOrderModel } from 'src/app/routes/purchase-orders/models/purchase-order.model';
import {
    IWeightNoteModel, WeightNoteModel
} from 'src/app/routes/purchase-orders/models/reception-note-purchase-order.model';
import {
    PurchaseOrdersService
} from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    reverseSortByKey, sortAlphanumerical, sortBykey
} from 'src/app/shared/utils/functions/sortFunction';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
    AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
    PurchaseOrderSettleComponent
} from '../../../purchase-order-settle/purchase-order-settle.component';
import {
    PurchaseOrderWeightNotesComponent
} from '../../../purchase-order-weight-notes/purchase-order-weight-notes.component';
import { IWCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { WeightService } from 'src/app/routes/weight-note/services/weight.service';

@Component({
    selector: 'app-purchase-order-related-notes',
    templateUrl: './purchase-order-related-notes.component.html',
    styleUrls: ['./purchase-order-related-notes.component.scss'],
})
export class PurchaseOrderRelatedNotesComponent
    extends SubscriptionManagerDirective
    implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals')
        ? JSON.parse(localStorage.getItem('decimals')).general
        : 2;
    public noteControl = new UntypedFormControl('');
    @Input() contract: ContractTrumodityModel;
    @Input() contractDetail: ContractTrumodityDetailModel =
        new ContractTrumodityDetailModel();
    @Input() producer: TProducerModel;
    @Input() order: PurchaseOrderModel;
    @Input() action: any = CONSTANTS.CRUD_ACTION.CREATE;
    @Input() orderToSave: any;
    @Input() companyInfo: IWCompanyInfoModel;
    @Input() hasPlacePriceFeature: boolean = false;
    @Output() selectedNotesChanged = new EventEmitter();
    @Output() noteChanged = new EventEmitter();
    @Output() notesTotalValidityChanged = new EventEmitter();
    @Output() amountValidityChanged = new EventEmitter();

    public currentWeight = 0;
    public currentContractWeight = 0;
    public currentTotalToPay = 0;
    public currentAveragePrice = 0;
    public currentProgress = 0;

    public currentCommodity: Number = null;

    public columnAscState = {
        creation: false,
        id: false,
        sacks: false,
        type: false,
        net_weight: false,
    };
    public selectedNotes: IWeightNoteModel[] = [];
    public scanInput: UntypedFormControl = new UntypedFormControl('');
    private cancelRequestWeighNote: Subject<boolean> = new Subject();
    private weightBeforeSelecteNotes = 0;
    @BlockUI('hello') blockUI: NgBlockUI;
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public positiveDecimalNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: false,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: this.DECIMAL_DIGITS,
        integerLimit: 12,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: true,
    });
    public hasValidAmount: boolean = false;
    public hasValidAmountPrice: boolean = true;
    public hasValidPricePerNote: boolean = true;
    public configuration: ITRConfiguration = new TRConfiguration();

    constructor(
        private _dialog: MatDialog,
        private purchaseOrderService: PurchaseOrdersService,
        private _i18n: I18nPipe,
        private _alert: AlertService,
        private _route: Router,
        private _numberPipe: DecimalPipe,
        private _weightService: WeightService
    ) {
        super();
    }

    ngOnInit() {
        this.getConfig(this.purchaseOrderService);
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.order && changes.order.currentValue) {
            this.selectedNotes = this.order.weightNotes;
            this.selectedNotesChanged.emit(this.selectedNotes);
            this.sortData('id');
            this.setTotals();
            this.setNoteValue(changes.order.isFirstChange());
            this._getContractWeigthBeforeSelectNoted()
        }

        if (changes.contract && changes.contract.currentValue) {
            this.hasValidAmount = this._hasValidAmountInContract();
            this.getContractDetail(
                this.contract.id,
                changes.contract.isFirstChange() ? false : true
            );
            this._getContractWeigthBeforeSelectNoted()
        }
    }
    ngAfterViewInit() {
        this.noteControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((n) => this.noteChanged.emit(n));
        setTimeout(() => {
            this.hasValidAmount = this._hasValidAmountInContract();
        }, 500);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
    private _hasValidAmountInContract(): boolean {
        if (this.action === this.ACTIONS.UPDATE) {
            const hasValidWeight = this.contract ? (this.currentWeight < this.contract.weightQQ) : true;
            if (hasValidWeight) {
                this.scanInput.enable();
            } else {
                this.scanInput.disable();

            }
            return hasValidWeight;
        } else {
            return true;
        }
    }

    private setNoteValue(emitEvent = false) {
        this.noteControl.setValue(this.order.note ?? '', {
            emitEvent,
        });
    }
    private setNotesDefaultPrices(isNewContract = false) {
        this.selectedNotes = this.selectedNotes.map((n) => {
            if (n.price === null || isNewContract) {
                n.price = this.hasPlacePriceFeature ? 0 : this.contractDetail.pricing.priceUnit;
            }
            n.total = accurateRoundDecimalMultiplication([n.price , n.netDryWeightOut],this.DECIMAL_DIGITS)
            return n;
        });
        this.selectedNotesChanged.emit(this.selectedNotes);
    }
    private getContractDetail(id: string, isNewContract = false) {
        this.purchaseOrderService
            .getContractDetail(id)
            .pipe(take(1))
            .subscribe(
                (c) => {
                    if (isNewContract) {
                        if (this.order.commodityId == c.commodityId) {
                            if (this.selectedNotes) {
                                this.contractDetail = c;
                                this.setNotesDefaultPrices(true);
                                this.setTotals();
                            }
                        } else {
                            this.contractDetail = c;
                            this.selectedNotes = [];
                            this.selectedNotesChanged.emit(this.selectedNotes);
                            this.setTotals();
                        }
                    } else {
                        if (this.selectedNotes) {
                            this.contractDetail = c;
                            this.setNotesDefaultPrices(false);
                            this.setTotals();
                        }
                    }
                },
                () => {
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }
    public onShowProducerNotes() {
        this._dialog
            .open(PurchaseOrderWeightNotesComponent, {
                autoFocus: false,
                disableClose: true,
                height: '95%',
                data: {
                    contract: this.contractDetail,
                    producer: this.producer,
                    notes: this.selectedNotes,
                    purchaseOrderDate: this.order.creationDate,
                    configuration: this.configuration,
                    weightBeforeSelecteNotes:this.weightBeforeSelecteNotes
                },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((notes: IWeightNoteModel[]) => {
                if (notes) {
                    const filteredNotes = notes.filter((note) => {
                        const isAlreadySelected = this.selectedNotes.find(
                            (n) => n.id === note.id
                        );
                        return isAlreadySelected ? false : true;
                    });
                    this.selectedNotes = [
                        ...this.selectedNotes,
                        ...filteredNotes,
                    ];
                    this.setNotesDefaultPrices();
                    this.setTotals();
                    this.selectedNotesChanged.emit(this.selectedNotes);
                }
            });
    }

    public onShowLiquidatePurchseOrder() {
        this._dialog
            .open(PurchaseOrderSettleComponent, {
                autoFocus: false,
                disableClose: true,
                width: '550px',
                data: {
                    contract: this.contractDetail,
                    fromList: false,
                    notes: this.selectedNotes,
                    order: this.order,
                    action: this.action,
                    orderToSave: this.orderToSave,
                    configuration: this.configuration,
                    currency: this.companyInfo.currency
                },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((response: boolean) => {
                if (response) {
                    this._route.navigateByUrl('/routes/purchase-orders');
                }
            });
    }

    public sortData(column: string) {
        switch (column) {
            case 'creation':
                this.columnAscState.creation = !this.columnAscState.creation;
                this.selectedNotes = this.columnAscState.creation
                    ? sortBykey(this.selectedNotes, 'startDate')
                    : reverseSortByKey(this.selectedNotes, 'startDate');
                break;
            case 'id':
                this.columnAscState.id = !this.columnAscState.id;
                this.selectedNotes = this.columnAscState.id
                    ? sortBykey(this.selectedNotes, 'transactionInId')
                    : reverseSortByKey(this.selectedNotes, 'transactionInId');
                break;
            case 'sacks':
                this.columnAscState.sacks = !this.columnAscState.sacks;
                this.selectedNotes = this.columnAscState.sacks
                    ? sortBykey(this.selectedNotes, 'totalSacks')
                    : reverseSortByKey(this.selectedNotes, 'totalSacks');
                break;
            case 'type':
                this.columnAscState.type = !this.columnAscState.type;
                this.selectedNotes = this.selectedNotes.sort((a, b) =>
                    sortAlphanumerical(
                        a.commodityTypename,
                        b.commodityTypename,
                        this.columnAscState.type
                    )
                );
                break;
            case 'net_weight':
                this.columnAscState.net_weight =
                    !this.columnAscState.net_weight;
                this.selectedNotes = this.columnAscState.net_weight
                    ? sortBykey(this.selectedNotes, 'netDryWeight')
                    : reverseSortByKey(this.selectedNotes, 'netDryWeight');
                break;
            default:
                break;
        }
    }
    public setTotals() {
        if (this.selectedNotes.length > 0) {
            this.currentWeight = this.selectedNotes
                .map((n) => n.netDryWeightOut)
                .reduce((a, b) => a + b);

            this.currentTotalToPay = this.selectedNotes
                .map((n) => n.total)
                .reduce((a, b) => a + b);
            this.currentAveragePrice =
                this.selectedNotes.map((n) => n.price).reduce((a, b) => a + b) /
                this.selectedNotes.length;
            this.currentContractWeight =
                this.currentWeight + this.weightBeforeSelecteNotes;
            this.hasValidAmountPrice = this.currentTotalToPay < this.companyInfo.purchaseOrderMaxAmount;
            this.amountValidityChanged.emit(this.hasValidAmountPrice);
            this.hasValidAmountPrice ? this.scanInput.enable() : this.scanInput.disable();
            this.hasValidPricePerNote = !this.selectedNotes.some((wn:IWeightNoteModel) => Number(wn.price) <= 0)
        } else {
            this.currentWeight = 0;
            this.currentTotalToPay = 0;
            this.currentAveragePrice = 0;
            this.currentContractWeight =
                this.currentWeight +
                (this.contract ? this.contract.deliveredWeight : 0);
            this.hasValidAmountPrice = true;
            this.scanInput.enable();
        }

        this.checkTotalValidity();
    }
    public checkTotalValidity() {
        this.notesTotalValidityChanged.emit(
            this.contract
                ? this.currentContractWeight <=
                this.contractDetail.weightThreshold
                : true
        );
    }
    public onPriceChanged(event: Event, note: WeightNoteModel) {
        const newValue = (event.target as HTMLInputElement).value;
        const noteIndex = this.selectedNotes.findIndex(
            (n) => n.transactionInId === note.transactionInId
        );
        let newNote = this.selectedNotes.find(
            (n) => n.transactionInId === note.transactionInId
        );
        let newArray = this.selectedNotes.filter(
            (n) => n.transactionInId !== note.transactionInId
        );

        newNote.price = Number(newValue);
        newNote.total = newNote.price * newNote.netDryWeightOut;
        newArray.splice(noteIndex, 0, newNote);
        this.selectedNotes = newArray;

        this.setTotals();
        this.selectedNotesChanged.emit(this.selectedNotes);
    }

    public onRemoveNote(note: WeightNoteModel) {
        if (this.action === this.ACTIONS.UPDATE) {
            this.blockUI.start();
            this.purchaseOrderService
                .deletePurchaseOrdersWeigthNote(note.id)
                .pipe(take(1))
                .subscribe(
                    () => {
                        const newArray = this.selectedNotes.filter(
                            (n) => n.transactionInId !== note.transactionInId
                        );
                        this.selectedNotes = newArray;
                        this.setTotals();
                        this.selectedNotesChanged.emit(this.selectedNotes);
                        this.blockUI.stop();
                        this.hasValidAmount = this._hasValidAmountInContract();
                    },
                    (error) => {
                        this._alert.errorTitle(
                            this._i18n.transform('error-msg'),
                            error
                        );
                    }
                );
        }

        if (this.action === this.ACTIONS.CREATE) {
            const newArray = this.selectedNotes.filter(
                (n) => n.transactionInId !== note.transactionInId
            );
            this.selectedNotes = newArray;
            this.setTotals();
            this.selectedNotesChanged.emit(this.selectedNotes);
        }
    }

    public scan() {
        this.cancelRequestWeighNote.next(true);
        this.purchaseOrderService
            .getWeightNoteByScan(this.producer.id, this.scanInput.value, {
                date: this.order.creationDate,
            })
            .pipe(takeUntil(this.cancelRequestWeighNote))
            .subscribe(
                (note: WeightNoteModel) => {
                    const isAlreadySelected = this.selectedNotes.find(
                        (n) => n.id === note.id
                    );
                    if (!isAlreadySelected) {
                        if (this.contract != null) {
                            let currentNotes = Array.from(this.selectedNotes);
                            currentNotes.push(note);
                            let currentWeight: number = currentNotes
                                .map((n) => n.netDryWeight)
                                .reduce((a, b) => a + b);
                            if (
                                currentWeight <=
                                this.contractDetail.weightThreshold
                            ) {
                                this.selectedNotes.push(note);
                                this.setNotesDefaultPrices();
                                this.setTotals();
                                this.selectedNotesChanged.emit(
                                    this.selectedNotes
                                );
                                this.scanInput.reset();
                            } else {
                                this.scanInput.setErrors({
                                    maxWeightExceded: true,
                                });
                            }
                        } else {
                            this.selectedNotes.push(note);
                            this.setNotesDefaultPrices();
                            this.setTotals();
                            this.selectedNotesChanged.emit(this.selectedNotes);
                            this.scanInput.reset();
                        }
                    } else {
                        this.scanInput.setErrors({ alreadyExists: true });
                    }
                },
                (error: HttpErrorResponse) => {
                    for (const key in error.error.data) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                error.error.data,
                                key
                            )
                        ) {
                            let propertyName: string = key;
                            let errorData: string = error.error.data[
                                key
                            ][0].replace('.', '-');
                            let msg: string =
                                'purchase-order' +
                                '-' +
                                propertyName +
                                '-' +
                                errorData;
                            this.scanInput.setErrors({ errorMessage: msg });
                            break;
                        }
                    }
                }
            );
    }

    public clearScan(event: any) {
        if (event.key === 'Backspace') {
            this.scanInput.reset();
        }
    }

    public formatPrice(price: number, event: any) {
        const element = event.target as HTMLInputElement;
        element.value = this._numberPipe.transform(
            price,
            '1.' + this.DECIMAL_DIGITS + '-' + this.DECIMAL_DIGITS,
            'en'
        );
    }
    public getConfig(_purchaseOrderService: PurchaseOrdersService) {
        _purchaseOrderService
            .getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.configuration = response;
                },
                (error) => {
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        error
                    );
                }
            );
    }

    private _getContractWeigthBeforeSelectNoted(){
        if (this.action === this.ACTIONS.CREATE)
            this.weightBeforeSelecteNotes = (this.contract ? this.contract.deliveredWeight : 0)

        if(this.selectedNotes.length > 0){
            const currentWeight = this.selectedNotes
            .map((n) => n.netDryWeightOut)
            .reduce((a, b) => a + b);
            this.weightBeforeSelecteNotes = (this.contract ? this.contract.deliveredWeight : 0) - this.currentWeight;
        }

    }
}
