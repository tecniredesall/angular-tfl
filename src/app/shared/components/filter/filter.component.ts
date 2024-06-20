import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil, filter } from 'rxjs/operators';
import { IProducerModel } from 'src/app/shared/models/producer.model';
import { ProducerService } from 'src/app/shared/services/producer/producer.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BlockModalUiComponent } from '../../block/block-modal.component';
import { I18nPipe } from '../../i18n/i18n.pipe';
import { I18nService } from '../../i18n/i18n.service';
import { ITRFilter, ITRFilterStatusModel, TRFilterProductionStatus } from '../../models/filter-data.model';
import { IPaginator } from '../../models/paginator.model';
import { SealsService } from '../../services/seals/seals.service';
import { AlertService } from '../../utils/alerts/alert.service';
import { CONSTANTS } from '../../utils/constants/constants';
import { ITRSealImage } from '../../utils/models/seal-image.model';
import {
    ResponseErrorHandlerService
} from '../../utils/response-error-handler/response-error-handler.service';
import * as moment from 'moment';
import { IUserModel, UserModel } from 'src/app/shared/models/user.model';
import { IWNPenaltyModel, WNPenaltyModel } from 'src/app/routes/weight-note/models/wn-penalty.model';
import { IWNDescriptionModel } from 'src/app/routes/weight-note/models/wn-description.model';
import { IWNCharacteristicModel, WNCharacteristicModel } from 'src/app/routes/weight-note/models/wn-characteristic.model';
import { WeightService } from 'src/app/routes/weight-note/services/weight.service';
import { validatorDuplicateDataFormArray } from '../../validators/validator-duplicate-data-form-array';
import { FormCharacteristicModel, IFormCharacteristicModel } from 'src/app/routes/weight-note/models/form-characteristic.model';
import { ITag, TagType } from '../../models/tags.model';

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
    public _paginationUser: IPaginator;
    public isLoadingProducers: boolean = false;
    public hasSelectedFilters: boolean = false;
    public dateFormatInput: string = CONSTANTS.DATE_FORMATS.PRODUCER.LOCALE.es;
    public dateFormatLabel: string = CONSTANTS.DATE_FORMATS.PRODUCER.LOCALE.es;
    private _timeout: any;
    private cancelProducerRequest$: Subject<boolean> = new Subject<boolean>()
    private cancelUsersRequest$: Subject<boolean> = new Subject<boolean>()
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public paramTags: ITag[] = [];
    readonly RECEIVING_NOTE_STATUS = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly WEIGHT_NOTE_STATUS = CONSTANTS.WEIGHT_NOTE_STATUS;
    readonly RECEIVING_NOTE_PRODUCTION_STATUS = CONSTANTS.RECEIVING_NOTE_PRODUCTION_STATUS
    readonly CHARACTERISTICS_FILTER_OPERATION_TYPE = CONSTANTS.CHARACTERISTICS_FILTER_OPERATION_TYPE
    readonly CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION = CONSTANTS.CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION
    readonly RETENTION_ORDER_STATUS = CONSTANTS.RETENTION_ORDER_STATUS
    readonly PURCHASE_ORDER_STATUS = CONSTANTS.PURCHASE_ORDER_STATUS
    public _users: UserModel[];
    readonly DEDUCTION_TYPE = CONSTANTS.DEDUCTION_TYPE
    public isLoadingUsers: boolean = true;
    public descIndex: number = 0;
    public _characteristics: IWNCharacteristicModel[];
    public availableCharacteristics: IWNCharacteristicModel[];
    public isLoadingCharacteristics = true;
    readonly PAYMENT_STATUS: any = CONSTANTS.PAYMENT_STATUS;

    constructor(
        private formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<FiltersComponent>,
        @Inject(MAT_DIALOG_DATA) public filter: ITRFilter,
        private _i18nPipe: I18nPipe,
        private _i18nService: I18nService,
        private _dateAdapter: DateAdapter<any>,
        private _alertService: AlertService,
        private _sealsService: SealsService,
        private _producersService: ProducerService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _weightService: WeightService,
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
        this.setForm(this.filter);
        if (this.filter.seals.lookups.length > 0) {
            this.seals = [...this.filter.seals.lookups];
        }
        else if (this.filter.sealsRequired) {
            this.getSeals();
        }
        if (this.filter.producersRequired && this.filter.producers.lookups.length > 0) {
            this.producers = [...this.filter.producers.lookups];
        }
        else if (this.filter.producersRequired) {
            this.getProducers(null, {});
        }
        if(this.filter.users?.required){
            this._getUsers();
        }
        if(this.filter.characteristics){
            this._getCharacteristics();
        }
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.cancelProducerRequest$.next(true);
        this.cancelProducerRequest$.complete();
    }

    public setForm(filter: ITRFilter) {
        console.log(filter.shippingTicketStatus)
        this.form = this.formBuilder.group({
            date: this.formBuilder.group({
                start: [filter.date.start],
                end: [filter.date.end],
            }),
            start : [filter.date.start],
            seals: [filter.seals?.selected ?? new Array()],
            status: [filter.status?.selected ?? new Array()],
            paymentStatus: [filter.paymentStatus?.selected ?? new Array()],
            productionStatus: [filter.productionStatus?.selected ?? new Array()],
            producer: [filter.producersRequired ? filter.producers.selected : null],
            users: [filter.users?.users ?? new Array()],
            characteristics: filter.characteristics ? this.createCharacteristicsFormArray(filter) : null,
            retentionOrderStatus: [filter?.retentionOrderStatus ?? new Array()],
            receivingNoteStatus: [filter.receivingNoteStatus?.selected ?? new Array()],
            weightNoteStatus: [filter.weightNoteStatus?.selected ?? new Array()],
            purchaseOrderStatusWN: [filter.purchaseOrderStatusWN?.selected ?? new Array()],
            shippingTicketStatus: [filter.shippingTicketStatus?.filters ?? new Array()],
            isFirstTime: filter.isFirstTime ?? true
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
            seals: {
                selected: this.form.get('seals').value,
                lookups: [...this.seals]
            },
            status: this.filter.status ? {
                selected: this.form.get('status').value,
                lookups: this.filter.status?.lookups
            } : this.filter.status,

            productionStatus: this.filter.productionStatus ? {
                selected: this.form.get('productionStatus').value,
                lookups: this.filter.productionStatus?.lookups
            } : this.filter.productionStatus,

            paymentStatus: this.filter.paymentStatus ? {
                selected: this.form.get('paymentStatus').value,
                lookups: this.filter.paymentStatus?.lookups
            } : this.filter.paymentStatus,
            receivingNoteStatus: this.filter.receivingNoteStatus ? {
                selected: this.form.get('receivingNoteStatus').value,
                lookups: this.filter.receivingNoteStatus?.lookups
            } : this.filter.receivingNoteStatus,
            weightNoteStatus: this.filter.weightNoteStatus ? {
                selected: this.form.get('weightNoteStatus').value,
                lookups: this.filter.weightNoteStatus?.lookups
            } : this.filter.weightNoteStatus,

            producers: {
                selected: this.form.get('producer').value as IProducerModel,
                lookups: [...this.producers]
            },

            purchaseOrderStatusWN: this.filter.purchaseOrderStatusWN ? {
                selected: this.form.get('purchaseOrderStatusWN').value,
                lookups: this.filter.purchaseOrderStatusWN?.lookups
            } : this.filter.purchaseOrderStatusWN,

            retentionOrderStatus: this.filter.retentionOrderStatus,
            sealsRequired: this.filter.sealsRequired,
            producersRequired: this.filter.producersRequired,
            //users: this.form.get("users").value,
            users: this.filter.users ? { users: this.form.get("users").value , label: this.filter.users.label , required : this.filter.users.required} : undefined,
            characteristics: this.form.get("characteristics").value,
            isFirstTime: this.form.get("isFirstTime").value,
            shippingTicketStatus:this.filter.shippingTicketStatus
        };
        this.dialogRef.close({tags: this._getParamsTags(filter), data: filter, refresh: true, hasSelectedFilters: this.hasSelectedFilters ,countSelectedFilters: this.checkCountSelectedFilters()});
    }

    public onCancelClick() {
        this.filter.seals.lookups = [...this.seals];
        this.dialogRef.close({ tags: this._getParamsTags(this.filter) ,data: this.filter, refresh: false, hasSelectedFilters: this.hasSelectedFilters, countSelectedFilters: this.checkCountSelectedFilters() });
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

    public onRetentionOrderSelected(status: number) {
        const statusControl = this.form.get('retentionOrderStatus');
        this.filter.retentionOrderStatus.status.find(s=> s.status == status).selected=!this.filter.retentionOrderStatus.status.find(s=> s.status == status).selected
        const newValue = this.filter.retentionOrderStatus.status?.filter(x=> x.selected)?.map(x=> x.status) ?? []
        statusControl.setValue(newValue);
        statusControl.markAsDirty();
    }

    public onFilterStatusSelected(item:any) {

        const statusControl = this.form.get('shippingTicketStatus');
        this.filter.shippingTicketStatus.filters.find(s=> s.name == item.name).selected = !this.filter.shippingTicketStatus.filters.find(s=> s.name == item.name).selected
        const newValue = this.filter.shippingTicketStatus.filters?.filter(x=> x.selected)?.map(x=> x.status) ?? []
        statusControl.setValue(newValue);
        statusControl.markAsDirty();

    }

    public onProductionStatus(status: number) {
        const statusControl = this.form.get('productionStatus');
        const newValue =
            statusControl.value.indexOf(status) !== -1
                ? statusControl.value.filter((i: number) => i !== status)
                : [...statusControl.value, status];

        statusControl.setValue(newValue);
        statusControl.markAsDirty();
    }

    public onPaymentStatus(status: number) {
        const statusControl = this.form.get('paymentStatus');
        const newValue =
            statusControl.value.indexOf(status) !== -1
                ? statusControl.value.filter((i: number) => i !== status)
                : [...statusControl.value, status];

        statusControl.setValue(newValue);
        statusControl.markAsDirty();
    }

    public onPurchaseOrderStatusWN(status: number) {
        const statusControl = this.form.get('purchaseOrderStatusWN');
        const newValue =
        statusControl.value.indexOf(status) !== -1
            ? statusControl.value.filter((i: number) => i !== status)
            : [...statusControl.value, status];
        statusControl.setValue(newValue);
        statusControl.markAsDirty();
    }

    public onReceivingNoteStatus(status: number) {
        const statusControl = this.form.get('receivingNoteStatus');
        const newValue =
            statusControl.value.indexOf(status) !== -1
                ? statusControl.value.filter((i: number) => i !== status)
                : [...statusControl.value, status];
        statusControl.setValue(newValue);
        statusControl.markAsDirty();
    }

    public onWeightNoteStatus(status: number) {
        const statusControl = this.form.get('weightNoteStatus');
        const newValue =
            statusControl.value.indexOf(status) !== -1
                ? statusControl.value.filter((i: number) => i !== status)
                : [...statusControl.value, status];

        statusControl.setValue(newValue);
        statusControl.markAsDirty();
    }

    public onClearFilters() {
        this.clearAllCharacteristics();
        this.form.reset({
            date: this.formBuilder.group({
                start: [null],
                end: [null],
            }),
            seals: new Array(),
            status: new Array(),
            productionStatus: new Array(),
            paymentStatus: new Array(),
            users:  new Array(),
            characteristics:  null,
            retentionOrderStatus: new Array(),
            weightNoteStatus: new Array(),
            purchaseOrderStatusWN :new Array()
        });
        if(this.filter.retentionOrderStatus){
            this.filter.retentionOrderStatus.status.forEach(item => {
                item.selected = false
            });
        }
        if(this.filter.shippingTicketStatus){
            this.filter.shippingTicketStatus.filters.forEach(item => {
                item.selected = false
            });
        }
        this.form.markAsDirty();
    }

    private checkIfSelectedFilters(data: any): void {
        this.hasSelectedFilters = (
            data.date?.start ||
            data.date?.end ||
            data.seals?.length > 0 || data.status?.length > 0||
            data.productionStatus?.length > 0 ||
            data.paymentStatus?.length > 0 ||
            data.producer ||
            data.users?.length > 0 ||
            data.retentionOrderStatus?.status?.some(x=> x.selected) ||
            data.retentionOrderStatus?.length > 0 ||
            data.characteristics?.length ||
            data.purchaseOrderStatusWN?.length > 0 ||
            data.shippingTicketStatus?.some(x=> x.selected)
            ) ? true : false;
    }




    public addCharacteristic(): void {
        const newCharacteristic  = new FormCharacteristicModel();
        (this.form.get('characteristics') as UntypedFormArray).push(
            this.getConversionsFormGroup(newCharacteristic)
        );
    }

    public getConversionsFormGroup(
        characteristic: IFormCharacteristicModel
    ): UntypedFormGroup {        
        return new UntypedFormGroup({
            characteristic: new UntypedFormControl(characteristic.characteristic),
            id: new UntypedFormControl(characteristic.id),
            name: new UntypedFormControl(characteristic.name, [
                Validators.required
            ]),
            slug: new UntypedFormControl(characteristic.slug),
            type: new UntypedFormControl(characteristic.type),
            choices: new UntypedFormControl(characteristic.choices),
            selectedChoice: new UntypedFormControl(characteristic.selectedChoice),
            isLoadingCharacteristicChoices: new UntypedFormControl(characteristic.isLoadingCharacteristicChoices),
            operationType: new UntypedFormControl(characteristic.operationType),
            value: new UntypedFormControl(characteristic.value),
            maxValue: new UntypedFormControl(characteristic.maxValue),
        });
    }

    public removeCharacteristic(index: number): void {
        (this.form.get('characteristics')as UntypedFormArray).removeAt(index);
        this.updateAvailableCharacteristicsList();
        this.form.markAsDirty();
    }

    public setCharacteristic(index: number): void{
        let selectedForm = (this.form.get('characteristics')as UntypedFormArray).at(index);
        
        selectedForm.patchValue({
            characteristic: selectedForm.value.characteristic,
            id: selectedForm.value.characteristic.id,
            name: selectedForm.value.characteristic.name,
            slug: selectedForm.value.characteristic.slug,
            type: selectedForm.value.characteristic.deduction.type,
            choices: selectedForm.value.characteristic.deduction.type == this.DEDUCTION_TYPE.CHOICE ?
                 selectedForm.value.characteristic.deduction.options.map(option =>
                    option.name ) : [],
            isLoadingCharacteristicChoices: false,
        });
        this.setCharacteristicsValidators(index);
        this.updateAvailableCharacteristicsList();
    }

    private updateAvailableCharacteristicsList(){
        const selectedCharacteristics =  this.form.get("characteristics").value
            .map(characteristic => characteristic.id);
        this.availableCharacteristics = this._characteristics
            .filter(obj => !selectedCharacteristics.includes(obj.id));
    }

    private setCharacteristicsValidators(index: number): void{
        let selectedForm = (this.form.get('characteristics')as UntypedFormArray).at(index);
        if(selectedForm.value.type == this.DEDUCTION_TYPE.CHOICE ){
            selectedForm.get('selectedChoice').setValidators([Validators.required]);
            selectedForm.get('selectedChoice').updateValueAndValidity();
        }
        if(selectedForm.value.type  == this.DEDUCTION_TYPE.INPUT ){
            selectedForm.get('value').setValidators([Validators.required,
                Validators.min(selectedForm.value.characteristic.deduction.min),
                Validators.max(selectedForm.value.characteristic.deduction.max)]);
            selectedForm.get('value').updateValueAndValidity();
        }
         if(selectedForm.value.operationType == this.CHARACTERISTICS_FILTER_OPERATION_TYPE.RANGE){
                selectedForm.get('maxValue').setValidators([Validators.required,
                    Validators.min(selectedForm.value.characteristic.deduction.min),
                    Validators.max(selectedForm.value.characteristic.deduction.max)]);
                selectedForm.get('maxValue').updateValueAndValidity();
            }
    }

    private checkCountSelectedFilters(): number {
        return Object.values(this.form.getRawValue())
            .filter((value: any) => value != null && ((Array.isArray(value) && value.length > 0) ||
                (value.hasOwnProperty('start') && value['start'] != null) ||
                (value.hasOwnProperty('end') && value['end'] != null)
            )).length
    }

    private createCharacteristicsFormArray(filter): UntypedFormArray{
        return this.formBuilder.array(
            filter.characteristics.map((characteristic: FormCharacteristicModel) =>
                this.getConversionsFormGroup(characteristic)),
                validatorDuplicateDataFormArray('name'));
    }

    private clearAllCharacteristics(): void{
        const characteristicsForm =  (this.form.get('characteristics') as UntypedFormArray);
        characteristicsForm.controls = [];
        characteristicsForm.updateValueAndValidity();
    }

    private getSeals(uri: string = null) {
        this.blockUI.start();
        this._sealsService.getSeals(uri).pipe(
            takeUntil(this.destroy$),
            take(1)
        ).subscribe(
            (response: ITRSealImage[]) => {
                if (response) {
                    this.seals = response;
                } else {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
                this.blockUI.stop();
            },
            (error: HttpErrorResponse) => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'seals')
                );
                this.blockUI.stop();
            }
        );
    }

    private getProducers(uri: string, params: any): void {
        this.isLoadingProducers = true;
        this._producersService.getProducers(uri, params)
            .pipe(
                takeUntil(this.cancelProducerRequest$),
                take(1)
            ).subscribe(
                (response: { data: IProducerModel[], paginator: IPaginator }) => {
                    this.producers = this.producers.concat(response.data);
                    this.pagination = response.paginator;
                    this.isLoadingProducers = false;
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(error, 'seller');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isLoadingProducers = false;
                }
            )
    }

    public paginatorProducer(): void {
        if (this.pagination && this.pagination.nextPageUrl) {
            this.cancelProducerRequest$.next(true)
            this.getProducers(this.pagination.nextPageUrl, this.getParamsRequest());
        }
    }

    public onSearchProducer(searchText: any) {
        this.isLoadingProducers = true;
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.cancelProducerRequest$.next(true)
            this.searchText = searchText;
            this.producers = [];
            this.getProducers(null, this.getParamsRequest());
        }, 600);
    }

    private getParamsRequest(): any {
        let params: any = {};
        if (this.searchText?.length > 0) {
            params.q = this.searchText;
        }
        return params;
    }

    keepOrder = (a, b) => {
        return a;
    }

    private _getUsers(url?: string): void {
        this.isLoadingUsers = true;
        this._producersService.getUsers(url)
            .pipe(take(1), takeUntil(this.cancelUsersRequest$))
            .subscribe(
                (response:  { data: UserModel[], paginator: IPaginator }) => {
                    this._users = response.data;
                    this._paginationUser = response.paginator
                    this.isLoadingUsers = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'filter');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isLoadingUsers = false;
                }
            )
    }

    public paginatorUser(): void {
        if (this._paginationUser && this._paginationUser.nextPageUrl) {
            this.cancelUsersRequest$.next(true)
            this._getUsers(this.pagination.nextPageUrl);
        }
    }

    private _getCharacteristics(url?: string): void {
        this._weightService.getCharacteristics(url)
            .pipe(take(1))
            .subscribe(
                (characteristics: IWNCharacteristicModel[]) => {
                    this._characteristics = characteristics.map(data => new WNCharacteristicModel(data, true))
                    .filter(characteristic => characteristic.isFilterable );

                    this.updateAvailableCharacteristicsList();
                    this.isLoadingCharacteristics = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'filter');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isLoadingUsers = false;
                }
            )
    }

    public _getParamsTags(params: ITRFilter | any):  Array<ITag>{
        let paramTags:   Array<ITag> = [];
        if(params?.characteristics?.length > 0) {
            params?.characteristics.forEach((c, index) => {
                const name = c.type == this.DEDUCTION_TYPE.CHOICE ?
                             `${c.name} / ${this._i18nPipe.transform(this.CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION[0].label)}` :
                            `${c.name} / ${this._i18nPipe.transform(this.CHARACTERISTICS_FILTER_OPERATION_TYPE_DESCRIPTION[c.operationType].label)}`;

                const value = c.type == this.DEDUCTION_TYPE.CHOICE ? c.selectedChoice :
                                c.operationType == this.CHARACTERISTICS_FILTER_OPERATION_TYPE.RANGE ?
                                `${c.value} - ${c.maxValue}` : `${c.value}`;
                paramTags.push({
                        title: `${name} : ${value}`,
                        type: TagType.Array,
                        property: "characteristics",
                        reference: index
                    }
                )
            })
        }

        if(params?.users?.users?.length > 0){
            params.users.users.forEach((u: IUserModel, index) => {
                paramTags.push({
                    title: u.fullName,
                    type: TagType.Users,
                    property: "users",
                    reference: index
                });
            });
        }

        if(params?.retentionOrderStatus  && params?.retentionOrderStatus.status){
            const tags = params.retentionOrderStatus.status.filter(x=> x.selected).map((x,index) => {
                return {
                    title : x.label,
                    type: TagType.CustomSelected,
                    property: "retentionOrderStatus",
                    reference: x.order
                }
            });
            paramTags = [...paramTags , ...tags]
        }

        if(params?.date){
            if(params.date.start || params.date.end){
                let title =  params.date.start ? moment(params.date.start).format('DD/MM/YYYY').toString() : "";
                title += params.date.end  ? ` - ${moment(params.date.end).format('DD/MM/YYYY').toString()}` : "";
                paramTags.push({
                    title: title,
                    type: TagType.Object,
                    property: "date",
                });
            }
        }

        if(params?.purchaseOrderStatusWN) {
           const orderSttatus = (params?.purchaseOrderStatusWN  as TRFilterProductionStatus)
           const tags = orderSttatus.selected.map((status,index)=> {
            return {
                title : status == this.PURCHASE_ORDER_STATUS.LIQUIDATE ? "purchase-order-liquidated" :  "unsettled" ,
                type: TagType.Selected,
                property: "purchaseOrderStatusWN",
                reference: index
            }
           })
           paramTags = [...paramTags , ...tags]
        }

        if(params?.shippingTicketStatus  && params?.shippingTicketStatus.filters){
            const tags = params.shippingTicketStatus.filters.filter((x:ITRFilterStatusModel)=> x.selected).map((x:ITRFilterStatusModel,index) => {
                return {
                    title : x.cssButton.label,
                    type: TagType.DeleteItemFilterStatus,
                    property: "shippingTicketStatus",
                    reference: x.order
                }
            });
            paramTags = [...paramTags , ...tags]
        }
        return paramTags
    }
}
