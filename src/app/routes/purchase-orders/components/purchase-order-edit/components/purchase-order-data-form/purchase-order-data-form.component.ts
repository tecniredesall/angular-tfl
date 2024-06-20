import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import * as moment from 'moment';
import { map, take, takeUntil, tap } from 'rxjs/operators';
import { PurchaseOrderModel } from 'src/app/routes/purchase-orders/models/purchase-order.model';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { Paginator } from 'src/app/shared/models/paginator.model';
import { arrayUnique } from 'src/app/shared/utils/functions/array-unique';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-purchase-order-data-form',
    templateUrl: './purchase-order-data-form.component.html',
    styleUrls: ['./purchase-order-data-form.component.scss'],
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
export class PurchaseOrderDataFormComponent
    extends SubscriptionManagerDirective
    implements OnInit, OnDestroy, OnChanges {
    public producersPagination: Paginator;
    public form: UntypedFormGroup;
    public producers: TProducerModel[] = [];
    public loadingProducers: boolean = false;
    @Input() order: PurchaseOrderModel;
    @Input() currentProducer: TProducerModel;
    @Input() action: number;
    @Output() producerChanged = new EventEmitter<TProducerModel>();
    @Output() formChanged = new EventEmitter<TProducerModel>();
    @Output() formIsValid = new EventEmitter<boolean>();
    private _timeout: any;
    private destroyRequestProduces$ : Subject<boolean> = new Subject<boolean>()
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _purchaseOrdersService : PurchaseOrdersService,
        private _paginationService: PaginationService,
        private _i18n: I18nPipe,
        private _i18nService: I18nService,
        private _alert: AlertService,
        private _dateAdapter: DateAdapter<any>
    ) {
        super();
        this._i18nService.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this._dateAdapter.setLocale(result ? result : 'es');
            });
    }

    ngOnInit() {
        this.loadProducers();
        if (!this.form) {
            this.setForm(this.order);
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.currentProducer) {
            if (changes.currentProducer.currentValue) {
                this.currentProducer = changes.currentProducer.currentValue;
                if (this.form) {
                    this.patchProducerFormData();
                    if (this.action === CONSTANTS.CRUD_ACTION.UPDATE) {
                        this.form
                            .get('producerDataCompleted')
                            .setValue(this.currentProducer)
                    }
                    this.formIsValid.emit(!this.form.invalid);
                }
                const isInDropdown = this.producers.find(
                    (p) => p.id === changes.currentProducer.currentValue.id
                );
                if (!isInDropdown) {
                    this.producers = [
                        changes.currentProducer.currentValue,
                        ...this.producers,
                    ];
                }
            } else {
                if (this.form) {
                    this.form
                        .get('address')
                        .setValue(null, { emitEvent: false });
                    this.form.get('type').setValue(null, { emitEvent: false });
                }
            }
        }
    }

    private setChangesHandler() {
        this.form
            .get('producer')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                const producer = this.producers.find((p) => p.id === id);
                this.producerChanged.emit(producer);
            });

        this.form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.formChanged.emit(value);
                this.formIsValid.emit(this.form.valid);
            });
    }

    private mapProducerType(type: number) {
        switch (type) {
            case CONSTANTS.PRODUCER_TYPE.ASSOCIATE:
                return this._i18n.transform('associate');
            case CONSTANTS.PRODUCER_TYPE.PROVIDER:
                return this._i18n.transform('provider');
            case CONSTANTS.PRODUCER_TYPE.CLIENT:
                return this._i18n.transform('client');
            default:
                return null;
        }
    }

    private setForm(order?: PurchaseOrderModel) {
        this.form = this._formBuilder.group({
            date: [
                {
                    value:
                        order.creationDate ??
                        moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    disabled: this.action === CONSTANTS.CRUD_ACTION.UPDATE,
                },
            ],
            producer: [
                {
                    value:
                        this.action === CONSTANTS.CRUD_ACTION.UPDATE
                            ? order.producerId
                            : this.currentProducer
                                ? this.currentProducer.id
                                : null,
                    disabled: this.action === CONSTANTS.CRUD_ACTION.UPDATE,
                },
                Validators.required,
            ],
            producerDataCompleted: [
                {
                    value:
                        this.action === CONSTANTS.CRUD_ACTION.UPDATE
                            ? order.producerId
                            : this.currentProducer
                                ? this.currentProducer
                                : null,
                    disabled: this.action === CONSTANTS.CRUD_ACTION.UPDATE,
                },
                Validators.required,
            ],
            type: [
                {
                    value: this.currentProducer
                        ? this.mapProducerType(this.currentProducer.type)
                        : null,
                    disabled: true,
                },
            ],
            address: [
                {
                    value: this.currentProducer
                        ? this.currentProducer.address
                        : null,
                    disabled: true,
                },
            ],
        });
        this.formIsValid.emit(!this.form.invalid);
        this.setChangesHandler();
    }

    private patchProducerFormData() {
        this.form.patchValue(
            {
                type: this.currentProducer
                        ? this.mapProducerType(this.currentProducer.type)
                        : null,
                address: this.currentProducer?.address,
                producer: this.currentProducer?.id,
            },
            {
                emitEvent: false,
            }
        );
        this.formIsValid.emit(!this.form.invalid);
    }

    public onDropdownReachedEnd() {
        this.destroyRequestProduces$.next(true)
        if (this.producersPagination.currentPage <= this.producersPagination.totalPages) {
            this.loadProducers(this.producersPagination.nextPageUrl, true);
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

    private loadProducers(uri?: string, append = false) {
        this.loadingProducers = true;
        this._purchaseOrdersService
            .getProducers(uri ?? null)
            .pipe(
                take(1),
                takeUntil(this.destroyRequestProduces$)
            )
            .subscribe(
                (p) => {
                    if (append) {
                        this.producers = arrayUnique([...this.producers,...p.data],'id') ;
                    } else {
                        this.producers = arrayUnique([...this.producers,...p.data],'id') ;
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
                    this.producersPagination = p.paginator
                },
                () => {
                    this.loadingProducers = false;
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }
    public setSeller(producerSelected: TProducerModel): void {
        this.currentProducer = producerSelected;
        this.form
            .get('producer')
            .setValue(producerSelected ? producerSelected.id : null);
        this.form
            .get('producerDataCompleted')
            .setValue(producerSelected)
    }

    private loadProducersFiltered(query: string) {
        this.loadingProducers = true;
        this._purchaseOrdersService
            .getProducersFiltered({ q: query })
            .pipe(take(1))
            .subscribe(
                (p) => {
                    this.producers = [...p.data];
                    this.loadingProducers = false;
                },
                () => {
                    this.loadingProducers = false;
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }
}
