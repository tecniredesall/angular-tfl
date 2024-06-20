import { RetentionOrderModel } from './../../models/retention-orders-model';
import { PurchaseOrdersService } from './../../../purchase-orders/services/purchase-orders.service';
import { RetentionOrderWeightNotesModel } from './../../models/retention-orders-weight-notes';
import { RetentionOrdersService } from './../../services/retention-orders.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ILotCommodityTypeModel } from 'src/app/routes/lots/models/lot-commodity-type.model';
import { ILotCommodityModel } from 'src/app/routes/lots/models/lot-commodity.model';
import { ILotWarehouseModel } from 'src/app/routes/lots/models/lot-warehouse.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { SubscriptionManagerDirective } from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { PageEvent } from '@angular/material/paginator';
import { PaginationModel } from 'src/app/shared/utils/models/paginator.model';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { CompanyInfoService } from 'src/app/shared/services/company-info/company-info.service';
import { IWCompanyInfoModel, WCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { IPaginator } from 'src/app/shared/models/paginator.model';

@Component({
    selector: 'sst-retention-order-filter',
    templateUrl: './retention-order-filter.component.html',
    styleUrls: ['./retention-order-filter.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: CONSTANTS.DATE_FORMATS.PURCHASE_ORDERS.ADAPTER,
        },
    ],
})
export class RetentionOrderFilterComponent extends SubscriptionManagerDirective implements OnInit {
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals'))?.general;
    @Input() urlBackToList: string = null;
    @Input() idRetentionOrder: string;
    @Output() urlBackToListChange: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() eventFormStatusChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

    @BlockUI('results-filter-layout') blockUI: NgBlockUI;
    @BlockUI('spinner-process') blockUIProcess: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public formControls: FormGroup
    public commodities: Array<ILotCommodityModel> = [];
    public isLoadingCommodities: boolean = true;
    public commodityTypes: Array<ILotCommodityTypeModel> = [];
    public isLoadingCommodityTypes: boolean = false;
    public warehouses: Array<ILotWarehouseModel> = [];
    public isLoadingWarehouses: boolean = false;
    public producers: TProducerModel[] = [];
    public loadingProducers: boolean = false;
    public currentProducer: TProducerModel;
    public isEdit: boolean = false;
    private urlBackToListSaved: string = null;
    private _subscription: Subscription = new Subscription();
    private _timeout: any;
    private _retentionOrderId: string
    private _initialDataOrder: any
    private dataWasModified: boolean = false
    public filters: any = {};
    public isCompleteFilters: boolean = false;
    public selectedNotes: RetentionOrderWeightNotesModel[] = [];
    public CONSTANTS = CONSTANTS;
    public producersPagination: PaginationModel;
    public configuration: ITRConfiguration = new TRConfiguration();
    public companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    public currentRetentionOrder: RetentionOrderModel = new RetentionOrderModel({})
    public maxDate: moment.Moment = moment();

    readonly KEY_FILTER: string = `${CONSTANTS.PERMISSIONS.RETENTION_ORDERS}-${CONSTANTS.CRUD_ACTION.CREATE}-Filter`
    readonly KEY_TAGS: string = `${CONSTANTS.PERMISSIONS.RETENTION_ORDERS}-${CONSTANTS.CRUD_ACTION.CREATE}-Tags`

    constructor(
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _dateAdapter: DateAdapter<any>,
        private _i18nService: I18nService,
        private _retentionOrdersService: RetentionOrdersService,
        private _paginationService: PaginationService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _companyInfoService: CompanyInfoService
    ) {
        super()
        this._retentionOrderId = this._activatedRoute.snapshot.params?.id;
        this.isEdit = !!this._retentionOrderId;
        this._i18nService.lang.pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
            this._dateAdapter.setLocale(result ? result : 'es');
        });
    }

    /**
     * Component initialization
     */
    ngOnInit() {
        this._paginationService.pagination$
            .pipe(takeUntil(this.destroy$))
            .subscribe((p) => (this.producersPagination = p));
        this.createFormGroupControls();
        this.loadProducers();
        this._getConfiguration();
        this._getCompanyInfoValues();
        if (this.isEdit) {
            this._getRetentionOrderDetail();
            this.formControls.get('producerDataCompleted').disable();
        }
    }

    /**
     * After component view initialization
     */
    ngAfterViewInit() {
        this.formControls.patchValue({
            retentionDate: [{ value: moment(new Date(), 'YYYY-MM-DD HH:mm:ss'), disabled: true }],
        })
        if (null != this.urlBackToListSaved) {
            this.urlBackToList = this.urlBackToListSaved;
            this.urlBackToListChange.emit(this.urlBackToListSaved)
        }
        this._initListnerChangesForm()
    }

    private _getRetentionOrderDetail() {
        this._retentionOrdersService.getDetailRetentionOrders(this._retentionOrderId).pipe(take(1)).subscribe((order: RetentionOrderModel) => {
            this.formControls.patchValue({
                textNote: order.note,
                sellerId: order.sellerId,
                producerDataCompleted: order.sellerId,
                retention_date: order.retentionDate,
                ihcafe: order.cvIhcafe,
                selectedNotesIds: order.notes.map((n) => n.id),
                selectedNotes: order.notes
            })
            this.formControls.updateValueAndValidity()
            this.setSeller(new TProducerModel({ id: order.sellerId }))
            this.selectedNotes = order.notes
            this._initialDataOrder = this.formControls.getRawValue()
            this.formControls.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
                this.detectChangesOnEditRetentionOrder(data);
            })
        }, (error: HttpErrorResponse) => {
            let message = this._errorHandlerService.handleError(
                error,
                'retention-order-details'
            );
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
            this.blockUI.stop();
        })
    }

    private detectChangesOnEditRetentionOrder(data): void {
        this.dataWasModified =
            JSON.stringify(this._initialDataOrder) !=
            JSON.stringify(data);
    }

    private _initListnerChangesForm() {
        this.formControls.statusChanges.subscribe((status: any) => {
            this.eventFormStatusChange.emit(this.formControls);
        })

    }

    private _getConfiguration(): void {
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._purchaseOrderService.getConfiguration()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (configuration) => {
                    this.configuration = configuration;
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(
                        error,
                        'weight-note'
                    );
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
    }

    private _getCompanyInfoValues() {
        this._companyInfoService.getCompanyInfo().pipe(take(1)).subscribe((response) => {
            this.companyInfo = new WCompanyInfoModel(response);
        })
    }

    /**
     * On component destroy
     */
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    /**
     * Update list of weight notes
     * @param updateList
     */
    private updateWeightNotes(isFromWorkflow: boolean = false): void {
        this.isCompleteFilters = false;
        this.selectedNotes = isFromWorkflow ? this.selectedNotes : [];
        setTimeout(() => {
            this.isCompleteFilters = true;
        }, 50);
    }
    /**
     * Create reactive controls to form
     */
    private createFormGroupControls(): void {
        this.formControls = this._formBuilder.group({
            textNote: new FormControl(''),
            sellerId: new FormControl('', [Validators.required]),
            producerDataCompleted: new FormControl('', [Validators.required]),
            retention_date: new FormControl(moment(new Date(), 'YYYY-MM-DD HH:mm:ss'), [Validators.required]),
            ihcafe: new FormControl('', [Validators.pattern(CONSTANTS.IHCAFE_PATTERN), Validators.maxLength(CONSTANTS.MAX_LENGTH_PRODUCER_CARNET_IHCAFE)]),
            selectedNotesIds: new FormControl(new Array(), [Validators.required]),
            selectedNotes: new FormControl(new Array<RetentionOrderWeightNotesModel>(), [Validators.required])
        });
        this.formControls.updateValueAndValidity()
    }


    /**
     * set weight notes
     * @param weightNotes weight notes selected
     */
    public onEventSetSelectedNotes(weightNotes: RetentionOrderWeightNotesModel[]): void {
        this.selectedNotes = weightNotes;
        this.currentRetentionOrder._notes = this.selectedNotes
        if (this.selectedNotes.length > 0) {
            const ids = this.selectedNotes.map(x => x.id)
            this.formControls.patchValue({ selectedNotesIds: ids, selectedNotes: this.selectedNotes })
        } else {
            this.formControls.patchValue({
                selectedNotesIds: new Array(),
                selectedNotes: new Array<RetentionOrderWeightNotesModel>()
            })
        }
    }

    public onBlurIhcafe(event) {
        if (this.formControls.controls.ihcafe.value !== '') {
            let params: any = {}
            params.ihcafe = this.formControls.controls.ihcafe.value
            this._retentionOrdersService.getRetentionOrders(null, params).subscribe(
                (response: { data: RetentionOrderModel[], paginator: IPaginator }) => {
                    if (response.data.length > 0) {
                        this.formControls.controls.ihcafe.setErrors({ not_valid: true })
                        this.formControls.updateValueAndValidity()
                    }
                })
        }
    }

    //#region  FUNCTION FOR PRODUCER SELECT

    private loadProducersFiltered(query: string) {
        this.loadingProducers = true;
        this._retentionOrdersService
            .getProducersFiltered({ q: query })
            .pipe(take(1))
            .subscribe(
                (p) => {
                    this.producers = [...p.data];
                    this.loadingProducers = false;
                },
                () => {
                    this.loadingProducers = false;
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
            );
    }

    private loadProducers(uri?: string, append = false) {
        this.loadingProducers = true;
        this._retentionOrdersService
            .getProducers(uri ?? null)
            .pipe(take(1))
            .subscribe(
                (p) => {
                    if (append) {
                        this.producers = [...this.producers, ...p.data];
                    } else {
                        this.producers = p.data;
                    }
                    if (this.currentProducer) {
                        const isInDropdown = this.producers.find(
                            (p) => p.id === this.currentProducer.id
                        );
                        if (!isInDropdown) {
                            this.producers = [
                                this.currentProducer,
                                ...this.producers,
                            ];
                        }
                    }
                    this.loadingProducers = false;
                },
                () => {
                    this.loadingProducers = false;
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
            );
    }

    public onDropdownReachedEnd() {
        const pageEvent = new PageEvent();
        let uri: string;

        pageEvent.previousPageIndex = this.producersPagination.current_page;
        pageEvent.pageIndex = this.producersPagination.current_page + 1;
        if (pageEvent.pageIndex <= this.producersPagination.last_page) {
            uri = this._paginationService.getPageUri(pageEvent);
            this.loadProducers(uri, true);
        }
    }

    public onDropdownSearch(searchValue: any) {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.loadProducersFiltered(searchValue ? searchValue : '');
        }, 400);
    }

    public onDropdownClear() {
        this.producers = [];
        this.loadProducersFiltered('');
    }

    public setSeller(producerSelected: TProducerModel): void {
        this.isCompleteFilters = false
        this.currentProducer = producerSelected;
        this.formControls
            .get('sellerId')
            .setValue(producerSelected ? producerSelected.id : null);
        this.formControls
            .get('producerDataCompleted')
            .setValue(producerSelected)
        this.filters.sellerId = this.currentProducer?.id ?? null
        setTimeout(() => {
            this.isCompleteFilters = true
        }, 50);
    }
    //#endregion

}
