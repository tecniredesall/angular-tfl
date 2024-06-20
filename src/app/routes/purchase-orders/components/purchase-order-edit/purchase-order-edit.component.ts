import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { ProducersService } from 'src/app/routes/producers/services/producer/producers.service';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { ContractFeaturesModel } from '../../models/contract-features.model';
import {
    ContractTrumodityModel, IContractTrumodityModel
} from '../../models/contract-trumodity.model';
import { IPurchaseOrderModel, PurchaseOrderModel } from '../../models/purchase-order.model';
import { IWeightNoteModel } from '../../models/reception-note-purchase-order.model';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import {
    PurchaseOrderDeleteComponent
} from '../purchase-order-delete/purchase-order-delete.component';
import {
    ContractChangedModalComponent
} from './components/contract-changed-modal/contract-changed-modal.component';
import { IWCompanyInfoModel, WCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { FederatedService } from '../../../../shared/services/federated-sync/federated.service';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Component({
    selector: 'app-purchase-order-edit',
    templateUrl: './purchase-order-edit.component.html',
    styleUrls: ['./purchase-order-edit.component.scss'],
})
export class PurchaseOrderEditComponent
    extends SubscriptionManagerDirective
    implements OnInit, OnDestroy {
    @BlockUI('hello') blockUI: NgBlockUI;
    @HostBinding('class') hostClasses = 'sil-overflow-container';
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public action: number;
    public formIsValid = false;
    public notesAreValid = true;
    public amountIsValid = true;
    public notesReachedZero = false;
    public companyInfo: IWCompanyInfoModel;
    public purchaseOrder: PurchaseOrderModel;
    public orderToSave: {
        creation_date?: string;
        producer_id?: string;
        note?: string;
        contract_id: string;
        weight_notes?: any[];
        id?: string;
    };
    public currentProducer: TProducerModel;
    public currentContract: ContractTrumodityModel;
    public contractNeedsMatching: boolean = false;
    public contracts: ContractTrumodityModel[] = [];
    public selectedTabIndex: 0 | 1 = 0;
    private _producerId: number = 0;
    public hasPlacePriceFeature: boolean = false;
    public isSyncContractsStarted: boolean = false;
    public hasPriceNote: boolean = false;
    public config: ITRConfiguration = new TRConfiguration();
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _responseErrorHandlerService: ResponseErrorHandlerService,
        private _notifier: NotifierService,
        private _i18n: I18nPipe,
        private _alert: AlertService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _dialog: MatDialog,
        private _producerService: ProducersService,
        private _federatedService: FederatedService
    ) {
        super();
        this.orderToSave = {
            creation_date: null,
            producer_id: null,
            note: null,
            weight_notes: [],
            contract_id: null,
        };
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngOnInit() {
        this.getCompanyInfo();
        this.loadOrderDetails();
        this.getConfig();
    }

    private getCompanyInfo() {
        this.blockUI.start();
        this._purchaseOrderService.getCompanyInfo()
            .pipe(take(1))
            .subscribe(
                (response) =>
                    (this.companyInfo = new WCompanyInfoModel(response.data)),
                (error: HttpErrorResponse) => {
                    const message: string = this._responseErrorHandlerService.handleError(
                        error,
                        'note'
                    );
                    this._alert.errorTitle(this._i18n.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            );

    }

    public getConfig() {
        this.blockUI.start();
        this._purchaseOrderService.getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.config = response;
                },
                (error) => {
                    this.blockUI.stop();
                    const message: string = this._responseErrorHandlerService.handleError(
                        error,
                        'note'
                    );
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }

    public onProducerChanged(producer: TProducerModel) {
        if (producer) {
            this.currentProducer = producer;
            this.loadContracts(producer.id.toString());
        } else {
            this.contracts = [];
            this.currentProducer = null;
        }
    }

    public onFormChanged(value: any) {
        this.orderToSave.creation_date = value.date;
        this.orderToSave.producer_id = value.producer;
        this.purchaseOrder.creationDate = value.date;
    }

    public onFormIsValid(value: boolean) {
        this.formIsValid = value;
    }

    public onSelectedNotesChanged(notes: IWeightNoteModel[]) {
        const notesToSave = notes.map((n) => ({
            weight_note_id: n.id,
            weight: n.netDryWeight,
            weightOut: n.netDryWeightOut,
            price: n.price,
        }));
        this.orderToSave.weight_notes = notesToSave;
        if (notesToSave.length === 0) {
            this.notesReachedZero = true;
        }
        this.hasPriceNote = notesToSave.filter(n => n.price == 0).length === 0;
    }

    public onNoteChanged(note: string) {
        this.orderToSave.note = note;
    }

    public onCancelClicked() {
        this._router.navigate(['routes/purchase-orders']);
    }

    public openDeleteDialog(purchaseOrder: IPurchaseOrderModel): void {
        this._dialog
            .open(PurchaseOrderDeleteComponent, {
                autoFocus: false,
                disableClose: true,
                data: purchaseOrder,
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((response: { refresh: boolean }) => {
                if (response.refresh) {
                    this._router.navigate(['/routes/purchase-orders']);
                }
            });
    }

    private loadContracts(producerId: string) {
        this.blockUI.start();
        this._purchaseOrderService
            .getContractsByProducer(producerId)
            .pipe(take(1))
            .subscribe(
                (c) => {
                    this.currentProducer = new TProducerModel(c);
                    this.contracts = this.currentProducer.contracts;
                    if (this.action === this.ACTIONS.UPDATE) {
                        this.currentContract = this.contracts.find(
                            (c) => c.id === this.purchaseOrder.contract
                        );
                    }
                    if (this.currentContract) {
                        this.orderToSave.contract_id = this.currentContract.id;
                    }
                    this.blockUI.stop();
                },
                (e) => {
                    if (!this.currentProducer) {
                        this.loadNonFederatedProducerdetail(producerId);
                    }
                    const message = e.error.message.data.producer_id
                        ? 'federated-id-empty'
                        : 'unidentified-problem';
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform(message)
                    );

                }
            );
    }

    private loadNonFederatedProducerdetail(id: string) {
        this._producerService
            .getProducer(Number(id))
            .pipe(take(1))
            .subscribe((p) => {
                this.currentProducer = new TProducerModel(p[0]);
            });

    }

    private loadOrderDetails() {
        this.blockUI.start();
        this._route.url
            .pipe(
                take(1),
                tap((r) => {
                    this.action = this.getFormAction(r);
                }),
                switchMap(() => this._route.paramMap),
                switchMap((p) =>
                    this.action === this.ACTIONS.UPDATE
                        ? this._purchaseOrderService.getPurchaseOrder(
                            String(p.get('id'))
                        )
                        : of(new PurchaseOrderModel())
                )
            )
            .subscribe(
                (order) => {
                    if (order) {
                        this.purchaseOrder = order;
                        if (this.action === this.ACTIONS.UPDATE) {
                            this.orderToSave.id = order.id;
                            this.orderToSave.producer_id = order.producerId;
                            this.orderToSave.creation_date =
                                order.creationDate.format(
                                    'YYYY-MM-DD HH:mm:ss'
                                );
                            this._producerId = Number(this.purchaseOrder.producerId);
                            this.loadContracts(this.purchaseOrder.producerId);
                        }
                    } else {
                        this._router.navigate(['routes', 'purchase-orders']);
                    }
                    this.blockUI.stop();
                },
                (e) => {
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }

    private getFormAction(url: UrlSegment[]): number {
        const uri = url.toString();

        return uri.includes('edit') ? this.ACTIONS.UPDATE : this.ACTIONS.CREATE;
    }

    public onContractChanged(contract: ContractTrumodityModel) {
        if (this.currentContract && contract) {
            if (this.orderToSave.weight_notes.length > 0) {
                this.showContractChangeModal(this.currentContract, contract);
            } else {
                this.currentContract = contract;
                this.orderToSave.contract_id = contract.id;
            }
        }

        if (!this.currentContract && contract) {
            this.currentContract = contract;
            this.orderToSave.contract_id = contract.id;
        }
    }

    public showContractChangeModal(
        currentContract: ContractTrumodityModel,
        contract: ContractTrumodityModel
    ) {
        this._dialog
            .open(ContractChangedModalComponent, {
                autoFocus: false,
                disableClose: true,
                data: currentContract,
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((r) => {
                if (r.contract) {
                    this.currentContract = contract;
                    this.orderToSave.contract_id = contract.id;
                }
            });
    }

    public onNextClick() {
        if (this.selectedTabIndex === 0) {
            this.currentProducer.id = this.currentProducer.id ?? this._producerId;
            this.checkFeatureMatch();
        } else {
            if (this.action === this.ACTIONS.CREATE) {
                this.savePurchaseOrder(this.orderToSave);
            }
            if (this.action === this.ACTIONS.UPDATE) {
                this.updatePurchaseOrder(this.orderToSave);
            }
        }
    }

    public checkFeatureMatch() {
        if (this.currentContract) {
            this.blockUI.start();
            this._purchaseOrderService
                .getContractsCharacteristics(this.currentContract.id)
                .pipe(take(1))
                .subscribe(
                    (result) => {
                        const features = new ContractFeaturesModel(result.data);
                        const hasUnmapedFeatures =
                            features.features.filter(
                                (f) => !f.idTransformationFeature
                            ).length > 0;
                        this.hasPlacePriceFeature = features.features.find( f => (f.idTrumodityFeature === CONSTANTS.PRICE_PLACE_FEATURE_ID)) ? true : false;
                        if (!hasUnmapedFeatures) {
                            this.selectedTabIndex = 1;
                        } else {
                            this.contractNeedsMatching = true;
                        }
                        this.blockUI.stop();
                    },
                    (error: HttpErrorResponse) => {
                        this.blockUI.stop();
                        this._alert.errorTitle(
                            this._i18n.transform('error-msg'),
                            this._responseErrorHandlerService.handleError(
                                error,
                                'match-features'
                            )
                        );
                    }
                );
        } else {
            this.selectedTabIndex = 1;
        }
    }

    public onEditContractCharacteristics(contract: IContractTrumodityModel) {
        this.currentContract = contract;
        this.contractNeedsMatching = true;
    }

    public onCancelFeaturesMatch() {
        this.contractNeedsMatching = false;
    }

    public onFeaturesMatched() {
        this.loadContracts(this.currentProducer.id.toString());
        this.contractNeedsMatching = false;
    }

    private savePurchaseOrder(order: any) {
        this.blockUI.start();
        this._purchaseOrderService
            .postPurchaseOrder(order)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('purchase-order-save-success')
                    );
                    this._router.navigate(['routes', 'purchase-orders']);
                },
                (err) => {
                    this.blockUI.stop();
                    const message: string =
                        this._responseErrorHandlerService.handleError(
                            err,
                            'purchase-order'
                        );
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }

    private updatePurchaseOrder(order: any) {
        this.blockUI.start();
        this._purchaseOrderService
            .putPurchaseOrder(order)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('purchase-order-update-success')
                    );
                    this._router.navigate(['routes', 'purchase-orders']);
                },
                (err) => {
                    this.blockUI.stop();
                    const message: string =
                        this._responseErrorHandlerService.handleError(
                            err,
                            'purchase-order'
                        );
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }
    public onSyncContractsEvent() {
        this.isSyncContractsStarted = true;
        this._federatedService.syncTrummodityContracts()
            .pipe(take(1)).subscribe(
                () => {
                    this._notifier.notify('success',
                        this._i18n.transform('updated-data-sent-success'))
                },
                error => {
                    this.isSyncContractsStarted = false;
                    const message: string = this._responseErrorHandlerService.handleError(
                        error,
                        'worker-sync'
                    );
                    this._alert.error(message);
                }
            );
    }
}
