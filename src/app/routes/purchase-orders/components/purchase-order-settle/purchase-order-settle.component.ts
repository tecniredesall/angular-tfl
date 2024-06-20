import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { take } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ContractTrumodityDetailModel } from '../../models/contract-tummodity-detail.model';
import { IWeightNoteModel } from '../../models/reception-note-purchase-order.model';
import { PurchaseOrderSettledRequestModel } from '../../models/purchase-order-settled-request.model';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import { IPurchaseOrderModel } from '../../models/purchase-order.model';
import { IPurchaseOrderDetailModel } from '../../models/purchase-order-detail.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { IWCompanyInfoCurrencyModel, WCompanyInfoCurrencyModel } from 'src/app/routes/weight-note/models/company-info-currency.model';

@Component({
    selector: 'app-purchase-order-settle',
    templateUrl: './purchase-order-settle.component.html',
    styleUrls: ['./purchase-order-settle.component.scss']
})
export class PurchaseOrderSettleComponent implements OnInit {
    @BlockUI('purchase-order-settled') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public notesPriceEdited: IWeightNoteModel[] = [];
    public notesPriceOfContract: IWeightNoteModel[] = [];
    public notes: IWeightNoteModel[] = [];
    private _orderId: string;
    private _orderFolio: string;
    public contract: ContractTrumodityDetailModel;
    public personalizedPrice: number = 0;
    public contractPrice: number = 0;
    private _orderToSave: IPurchaseOrderModel;
    private _action: number;
    public configuration:  ITRConfiguration = new TRConfiguration();
    public _currency: IWCompanyInfoCurrencyModel = new WCompanyInfoCurrencyModel();
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals')
        ? JSON.parse(localStorage.getItem('decimals')).general
        : 2;
    public notesByPrice: Array<{
        generalPrice: number,
        notes: Array<IWeightNoteModel>,
        totalPrice: number;
    }> = [];
    constructor(private _dialogRef: MatDialogRef<PurchaseOrderSettleComponent>,
        private _purchaseOrderService: PurchaseOrdersService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _alert: AlertService,
        private _notifierService: NotifierService,
        private _i18nPipe: I18nPipe,
        private _route: Router,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            order: IPurchaseOrderModel;
            notes: IWeightNoteModel[];
            contract: ContractTrumodityDetailModel,
            fromList: boolean,
            action: number,
            orderToSave: IPurchaseOrderModel,
            configuration: ITRConfiguration,
            currency: IWCompanyInfoCurrencyModel;
        }) {
        this._orderId = data.order.id;
        this._orderFolio = data.order.folio;
        this._action = data.action;
        this._orderToSave = data.orderToSave;
        this.configuration = data.configuration;
        this._currency = data.currency;
        if (data.fromList) {
            this.getWeightNotesByPurchaseOrder(data.order.contract);
        } else {
            this.contract = data.contract;
            this.notes = data.notes;
            this.setNotesFiltered();

        }
    }
    ngOnInit() {
    }
    private setNotesFiltered() {
        this.notesPriceEdited = this.notes.filter(note => note.price !== this.contract.pricing.priceUnit);
        this.notesPriceEdited.forEach(note => {
            const noteIndex = this.notesByPrice.findIndex(x => x.generalPrice === note.price);
            if (noteIndex != -1) {
                this.notesByPrice[noteIndex].notes.push(note);
                this.notesByPrice[noteIndex].totalPrice = this.setPriceTotal(this.notesByPrice[noteIndex].notes)
            } else {
                const current: {
                    generalPrice: number,
                    notes: Array<IWeightNoteModel>,
                    totalPrice: number;
                } = {
                    generalPrice: note.price,
                    notes: [note],
                    totalPrice: 0
                }
                current.totalPrice = this.setPriceTotal(current.notes);
                this.notesByPrice.push(current);
            }
        });
        this.notesPriceOfContract = this.notes.filter(note => note.price === this.contract.pricing.priceUnit);
        this.personalizedPrice = this.setPriceTotal(this.notesPriceEdited);
        this.contractPrice = this.setPriceTotal(this.notesPriceOfContract);

    }

    private setPriceTotal(notes: IWeightNoteModel[]): number {
        let priceTotal: number = 0;
        notes.forEach(
            note => {
                let total = note.price * note.netDryWeightOut
                priceTotal += total;
            }
        );
        return priceTotal;

    }
    private getWeightNotesByPurchaseOrder(contractId: string) {
        this.blockUI.start();
        this._purchaseOrderService.getPurchaseOrderDetail(this._orderId)
            .pipe(take(1))
            .subscribe(
                (result: IPurchaseOrderDetailModel) => {
                    result.weightNotes.forEach(
                        wn => {
                            let current: IWeightNoteModel = {
                                id: wn.id,
                                commodityTypename: wn.commodityName,
                                netDryWeight: wn.netDryWeight,
                                netDryWeightOut: wn.weightQQ,
                                creationEmail: '',
                                receptionId: wn.id,
                                selected: true,
                                sellerId: null,
                                startDate: null,
                                totalSacks: wn.sacks,
                                transactionInId: null,
                                price: wn.price,
                                total: wn.total
                            };
                            this.notes.push(current);
                        }
                    );
                    this.getContractDetail(contractId);
                },
                error => {
                    this.blockUI.stop();
                    const message: string = this._errorHandlerService.handleError(
                        error,
                        'purchase-order-settled'
                    );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            );
    }
    private getContractDetail(id: string) {
        this._purchaseOrderService
            .getContractDetail(id)
            .pipe(take(1))
            .subscribe(
                (c) => {
                    this.blockUI.stop();
                    this.contract = c;
                    this.setNotesFiltered();
                },
                error => {
                    this.blockUI.stop();
                    const message: string = this._errorHandlerService.handleError(
                        error,
                        'purchase-order-settled'
                    );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            );
    }
    public onEventSettlePurchseOrder(action: number) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.CREATE: {
                if (this._action === CONSTANTS.CRUD_ACTION.CREATE) {
                    this._createPurchaseOrder();
                } else if (this._action === CONSTANTS.CRUD_ACTION.UPDATE) {
                    this._updatePurchaseOrder();
                } else {
                    this._settledPurchaseOrder();
                }
                break;
            }
            case CONSTANTS.CRUD_ACTION.CANCEL: {
                this._dialogRef.close();
            }
        }

    }
    private _updatePurchaseOrder() {
        this.blockUI.start();
        this._purchaseOrderService
            .putPurchaseOrder(this._orderToSave)
            .pipe(take(1))
            .subscribe((result: any) => {
                this._orderId = result.data.id;
                this._orderFolio = result.data.folio;
                this._settledPurchaseOrder();
            },
                err => {
                    this.blockUI.stop();
                    const message: string =
                        this._errorHandlerService.handleError(
                            err,
                            'purchase-order'
                        );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                });
    }
    private _createPurchaseOrder() {
        this.blockUI.start();
        this._purchaseOrderService
            .postPurchaseOrder(this._orderToSave)
            .pipe(take(1))
            .subscribe(
                (result: any) => {
                    this._orderId = result.data.id;
                    this._orderFolio = result.data.folio;
                    this._settledPurchaseOrder();
                },
                (err) => {
                    this.blockUI.stop();
                    const message: string =
                        this._errorHandlerService.handleError(
                            err,
                            'purchase-order'
                        );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            );
    }
    private _settledPurchaseOrder() {
        if(!this.blockUI.isActive) {
            this.blockUI.start();
        }
        const data: PurchaseOrderSettledRequestModel = new PurchaseOrderSettledRequestModel(this.notes);
        this._purchaseOrderService.settlePurchaseOrder(data, this._orderId)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._dialogRef.close(true);
                    this._notifierService.notify('success',
                        this._i18nPipe.transform('purchase-order-success-settled').replace('value', this._orderFolio));
                },
                error => {
                    this.blockUI.stop();
                    if (error.error.errors?.weight_notes) {
                        this._alert.error('purchase-order-validation-weight-notes');
                    } else {
                        const message: string =
                            this._errorHandlerService.handleError(
                                error,
                                'purchase-order'
                            );
                        this._alert.error(message);
                    }
                }
            );
    }

}
