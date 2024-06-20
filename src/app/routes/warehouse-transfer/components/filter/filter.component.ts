import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { IProducerModel } from 'src/app/shared/models/producer.model';
import { ProducerService } from 'src/app/shared/services/producer/producer.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ITRSealImage } from 'src/app/shared/utils/models/seal-image.model';
import { IPaginator } from 'src/app/shared/models/paginator.model';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { SealsService } from 'src/app/routes/seals/seals.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ISTCompanyBranchPaginatorModel } from 'src/app/routes/shipping-ticket/models/st-company-branch-paginator.model';
import { ShippingTicketService } from 'src/app/routes/shipping-ticket/services/shipping-ticket.service';
import { STCompanyBranchModel } from 'src/app/routes/shipping-ticket/models/st-company-branch.model';
import { STBuyerModel } from 'src/app/routes/shipping-ticket/models/st-buyer.model';
import { warehouseTransferService } from '../../services/warehouse-transfer.service';
import { IUserModel, UserModel } from 'src/app/shared/models/user.model';
import { WNContainerModel } from 'src/app/routes/weight-note/models/wn-container.model';
import { ITRFilter } from '../../models/filter-data.model';

@Component({
    selector: 'tr-filters',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: CONSTANTS.DATE_FORMATS.FILTER.ADAPTER },
        { provide: MAT_DATE_LOCALE, useValue: localStorage.getItem('lang') }
    ]
})
export class FiltersComponent implements OnInit, OnDestroy {
    @HostBinding('class') hostClasses =
        'sil-overflow-container sil-overflow-container--padded';
    @HostBinding('class.sil-overflow-container--in-modal') inModal = true;
    @BlockUI('seals-section') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public form: UntypedFormGroup;
    public seals: ITRSealImage[] = [];
    public producers: IProducerModel[] = [];
    public searchText: string;
    public pagination: IPaginator;
    public isLoadingProducers: boolean = false;
    public hasSelectedFilters: boolean = false;
    public dateFormatInput: string = CONSTANTS.DATE_FORMATS.PRODUCER.LOCALE.es;
    public dateFormatLabel: string = CONSTANTS.DATE_FORMATS.PRODUCER.LOCALE.es;
    private _timeout: any;
    private cancelProducerRequest$: Subject<boolean> = new Subject<boolean>()
    private destroy$: Subject<boolean> = new Subject<boolean>();
    readonly RECEIVING_NOTE_STATUS = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly WAREHOUSE_TRANSFER_STATUS = CONSTANTS.WAREHOUSE_TRANSFER_STATUS
    readonly WAREHOUSE_TYPE = CONSTANTS.WAREHOUSE_TYPE
    public _companies: STCompanyBranchModel[];
    public isLoadingCompanies: boolean = true;
    public _buyers: STBuyerModel[];
    public isLoadingBuyers: boolean = true;
    public _users: UserModel[];
    public isLoadingUsers: boolean = true;
    public _warehouses: WNContainerModel[];
    public isLoadingWarehouses: boolean = true;

    constructor(
        private formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<FiltersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            isListIn: boolean,
            filter: ITRFilter,
        },

        private _i18nPipe: I18nPipe,
        private _i18nService: I18nService,
        private _dateAdapter: DateAdapter<any>,
        private _alertService: AlertService,
        private _sealsService: SealsService,
        private _producersService: ProducerService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _shippingTicketService: ShippingTicketService,
        private _warehouseTransferService: warehouseTransferService,
    ) {
        this._i18nService.lang.pipe(
            takeUntil(this.destroy$)
        ).subscribe((result: any) => {
            this._dateAdapter.setLocale(result ?? 'es');
            this.dateFormatInput = CONSTANTS.DATE_FORMATS.PRODUCER.LOCALE[result];
            this.dateFormatLabel = CONSTANTS.DATE_FORMATS.PRODUCER.LABEL[result];
        });
    }

    public ngOnInit() {
        this._getCompanyBranches();
        this._getUsers();
        this._getWarehouses();
        this.setForm(this.data.filter);
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.cancelProducerRequest$.next(true);
        this.cancelProducerRequest$.complete();
    }

    public setForm(filter: ITRFilter) {
        this.form = this.formBuilder.group({
            date: this.formBuilder.group({
                start: [filter.date.start],
                end: [filter.date.end],
            }),
            start: [filter.date.start],
            users: [filter.users ?? new Array()],
            origin: [filter.origin ?? new Array()],
            destination: [filter.destination ?? new Array()],
            warehouse: [filter.warehouses ?? new Array()],
            status: [filter.status?.selected ?? new Array()],
        });
        this.checkIfSelectedFilters(this.form.getRawValue());
        this.form.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: any) => {
            this.checkIfSelectedFilters(data);
        });
    }

    public onApplyClick() {
        const filter: ITRFilter = {
            date: {
                start: this.form.get('date').get('start').value,
                end: this.form.get('date').get('end').value,
            },

            status: this.data.filter.status ? {
                selected: this.form.get('status').value,
                lookups: this.data.filter.status?.lookups
            } : this.data.filter.status,
            origin: this.form.get("origin").value,
            destination: this.form.get("destination").value,
            users: this.form.get("users").value,
            warehouses: this.form.get("warehouse").value
        };

        if (this.data.isListIn)
            localStorage.setItem('warehouseTransferListInFilters', JSON.stringify({ data: filter, numFilters: this.checkCountSelectedFilters() }));
        else
            localStorage.setItem('warehouseTransferListOutFilters', JSON.stringify({ data: filter, numFilters: this.checkCountSelectedFilters() }));

        this.dialogRef.close({ data: filter, refresh: true, hasSelectedFilters: this.hasSelectedFilters, countSelectedFilters: this.checkCountSelectedFilters() });
    }

    public onCancelClick() {
        this.dialogRef.close({ data: this.data.filter, refresh: false, hasSelectedFilters: this.hasSelectedFilters, countSelectedFilters: this.checkCountSelectedFilters() });
    }

    public onSealSelected(id: string) {
        const sealsControl = this.form.get('seals');
        const newValue = sealsControl.value.find((v: string) => v === id)
            ? sealsControl.value.filter((i: string) => i !== id)
            : [...sealsControl.value, id];

        sealsControl.setValue(newValue);
        sealsControl.markAsDirty();
    }
    public onStatusSelected(status: number) {
        const statusControl = this.form.get('status');
        const newValue =
            statusControl.value.indexOf(status) !== -1
                ? statusControl.value.filter((i: number) => i !== status)
                : [...statusControl.value, status];

        statusControl.setValue(newValue);
        statusControl.markAsDirty();
    }


    public onClearFilters() {
        this.form.reset({
            date: this.formBuilder.group({
                start: [null],
                end: [null],
            }),
            status: new Array(),
            origin: new Array(),
            destination: new Array(),
            users: new Array(),
            warehouses: new Array()
        });
        this.form.markAsDirty();

        if (this.data.isListIn)
            localStorage.removeItem('warehouseTransferListInFilters');
        else
            localStorage.removeItem('warehouseTransferListOutFilters');
    }

    private checkIfSelectedFilters(data: any): void {
        this.hasSelectedFilters = (data.date?.start ||
            data.date?.end || data.origin?.length > 0 || data.destination?.length > 0 || data.status?.length > 0 || data.warehouses?.length > 0) || data.users ? true : false;
    }

    public checkCountSelectedFilters(): number {
        return Object.values(this.form.getRawValue())
            .filter((value: any) => value != null && ((Array.isArray(value) && value.length > 0) ||
                (value.hasOwnProperty('start') && value['start'] != null) ||
                (value.hasOwnProperty('end') && value['end'] != null)
            )).length

    }

    private _getCompanyBranches(url?: string): void {
        this._shippingTicketService.getCompanyBranches(url)
            .pipe(take(1))
            .subscribe(
                (response: ISTCompanyBranchPaginatorModel) => {
                    this._companies = response.items;
                    this.isLoadingCompanies = false;
                },
                (error: HttpErrorResponse) => {
                    this.isLoadingCompanies = false;
                    let message = this._errorHandlerService.handleError(error, 'warehouse-transfer');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
    }

    private _getUsers(url?: string): void {
        this._warehouseTransferService.getUsers(url)
            .pipe(take(1))
            .subscribe(
                (response: IUserModel[]) => {
                    this._users = response;
                    this.isLoadingUsers = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'warehouse-transfer');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isLoadingUsers = false;
                }
            )
    }

    private _getWarehouses(url?: number): void {
        const physicalTankParam = {
            type_id: this.WAREHOUSE_TYPE.PHYSICAL
        };

        this._warehouseTransferService.getTanks(null, null, physicalTankParam)
            .pipe(take(1))
            .subscribe(
                (response: any[]) => {
                    this._warehouses = response;
                    this.isLoadingWarehouses = false;
                },
                (error: HttpErrorResponse) => {
                    this.isLoadingWarehouses = false;
                    let message = this._errorHandlerService.handleError(error, 'warehouse-transfer');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
    }
}
