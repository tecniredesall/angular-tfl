import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { HttpErrorResponse } from '@angular/common/http';
import {
    AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ILotCommodityTypeModel } from '../../models/lot-commodity-type.model';
import { ILotCommodityModel } from '../../models/lot-commodity.model';
import { ILotFilterStatusModel } from '../../models/lot-filter-status.model';
import { ILotWarehouseModel } from '../../models/lot-warehouse.model';
import { ILotWeignotesModel } from '../../models/lot-weignotes.model';
import { IWeightModel } from '../../models/weigth-note.model.ts';
import { LotsService } from '../../services/lots.service';

@Component({
    selector: 'app-lot-create-results-filter',
    templateUrl: './lot-create-results-filter.component.html',
    styleUrls: ['./lot-create-results-filter.component.scss'],
})
export class LotCreateResultsFilterComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @Input() urlBackToList: string = null;
    @Output()
    urlBackToListChange: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() eventFormStatusChange: EventEmitter<{
        isValid: boolean;
        data: ILotWeignotesModel;
    }> = new EventEmitter<{ isValid: boolean; data: ILotWeignotesModel }>();

    @BlockUI('results-filter-layout') blockUI: NgBlockUI;
    @BlockUI('spinner-process') blockUIProcess: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public formControls: UntypedFormGroup = this.createFormGroupControls();
    public commodities: Array<ILotCommodityModel> = [];
    public isLoadingCommodities: boolean = true;
    public commodityTypes: Array<ILotCommodityTypeModel> = [];
    public isLoadingCommodityTypes: boolean = false;
    public warehouses: Array<ILotWarehouseModel> = [];
    public isLoadingWarehouses: boolean = false;
    private localStorageKey: string = 'new-lot-filter-status';
    private localStorageWNKey: string = 'weight-notes-selected';
    private urlBackToListSaved: string = null;
    private _productionFlowsSubject = new Subject<{
        commodityId: number;
        commodityTypeId: string;
    }>();
    private _subscription: Subscription = new Subscription();
    public filters: ILotFilterStatusModel = {};
    public isCompleteFilters: boolean = false;
    public selectedNotes: IWeightModel[] = [];
    constructor(
        private _lotsService: LotsService,
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        let params: any = this._activatedRoute.snapshot.queryParams;
        if ('true' == params?.isFromWorkflow) {
            this.setStoredValuesToFilter();
        }
        this._subscription.add(
            this.formControls.statusChanges.subscribe((status: any) => {
                const isComplete =
                    'VALID' == status && this.selectedNotes.length > 0;
                let data: ILotWeignotesModel = {
                    notes: this.selectedNotes,
                    params: this.filters,
                };
                this.eventFormStatusChange.emit({ data, isValid: isComplete });
            })
        );
    }

    /**
     * Component initialization
     */
    ngOnInit() {
        this.getCommodities();
    }

    /**
     * After component view initialization
     */
    ngAfterViewInit() {
        if (null != this.urlBackToListSaved) {
            this.urlBackToList = this.urlBackToListSaved;
            this.urlBackToListChange.emit(this.urlBackToListSaved);
        }
    }

    /**
     * On component destroy
     */
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    /**
     * On select commodity item
     * @param commodity selected
     */
    public setCommodity(commodity: ILotCommodityModel): void {
        this.cleanCommodityTypeValues();
        this.cleanWarehouseValues();
        if (commodity) {
            this.isCompleteFilters = false;
            this.filters.commodity = commodity;
            this.getCommodityTypes(commodity.id);
        } else {
            this.isCompleteFilters = false;
        }
    }

    /**
     * On select commodity type item
     * @param commodityType selected
     */
    public setCommodityType(commodityType: ILotCommodityTypeModel): void {
        this.cleanWarehouseValues();
        if (commodityType) {
            let commodity: ILotCommodityModel = this.formControls.get(
                'commodity'
            ).value;
            this.filters.commodityType = commodityType;
            if (commodity) {
                this.getWarehouses(
                    commodityType.transformationTypeId,
                    this._builtParamsWarehouses(commodity.id)
                );
                this._productionFlowsSubject.next({
                    commodityId: commodity.id,
                    commodityTypeId: commodityType.id,
                });
                this.updateWeightNotes();
            }
        } else {
            this.isCompleteFilters = false;
        }
    }
    public setWarehouse(warehouses: Array<ILotWarehouseModel>) {
        this.filters.warehouses = warehouses;
        this.updateWeightNotes();
    }

    private _builtParamsWarehouses(commodityId: number , type_id = CONSTANTS.TYPE_OF_TANKS.PHYSICAL){
        return {
            commodity_id: commodityId,
            type_id
        }
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
    private createFormGroupControls(): UntypedFormGroup {
        let formGroup: UntypedFormGroup = new UntypedFormGroup({
            commodity: new UntypedFormControl(null, [Validators.required]),
            commodityType: new UntypedFormControl({ value: null, disabled: true }, [
                Validators.required,
            ]),
            warehouse: new UntypedFormControl({ value: [], disabled: true }),
        });
        return formGroup;
    }
    /**
     * Get stored values and set to form
     */
    private setStoredValuesToFilter(): void {
        let storedData: any = localStorage.getItem(this.localStorageKey);
        if (storedData) {
            this.filters = JSON.parse(storedData);
            this.urlBackToListSaved = this.filters.urlBackToList;
            this.formControls.patchValue({
                commodity: this.filters.commodity,
                commodityType: this.filters.commodityType,
                warehouse: this.filters.warehouses,
            });
            if (this.filters.commodity) {
                this.getCommodityTypes(this.filters.commodity.id);
                if (this.filters.commodityType) {
                    this.getWarehouses(
                        this.filters.commodityType.transformationTypeId,
                        this._builtParamsWarehouses(this.filters.commodity.id)
                    );
                }
            }
            let storedWeightData: any = localStorage.getItem(
                this.localStorageWNKey
            );
            if (storedWeightData) {
                this.selectedNotes = JSON.parse(storedWeightData);
                this.updateWeightNotes(true);
            }
        }
    }
    /**
     * Commodities request
     */
    private getCommodities(): void {
        this.blockUI.start();
        this._subscription.add(
            this._lotsService.getCommodities().subscribe(
                (response: Array<ILotCommodityModel>) => {
                    if (response) {
                        this.commodities = response;
                    } else {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                    }
                    this.isLoadingCommodities = false;
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    this.showErrorMessage(error);
                    this.isLoadingCommodities = false;
                    this.blockUI.stop();
                }
            )
        );
    }
    /**
     * Commodity types request by commodity
     * @param commodityId selected
     */
    private getCommodityTypes(commodityId: number): void {
        this.isLoadingCommodityTypes = true;
        this._subscription.add(
            this._lotsService.getCommodityTypes(commodityId).subscribe(
                (response: Array<ILotCommodityTypeModel>) => {
                    if (response) {
                        this.commodityTypes = response;
                    } else {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                    }
                    this.formControls.get('commodityType').enable();
                    this.isLoadingCommodityTypes = false;
                },
                (error: HttpErrorResponse) => {
                    this.showErrorMessage(error);
                    this.isLoadingCommodityTypes = false;
                }
            )
        );
    }
    /**
     * Warehouses request
     * @param transformationTypeId selected
     * @param commodityId selected
     */
    private getWarehouses(
        transformationTypeId: string,
        params: any
    ): void {
        this.isLoadingWarehouses = true;
        this._subscription.add(
            this._lotsService
                .getWarehouses(transformationTypeId, params)
                .subscribe(
                    (response: Array<ILotWarehouseModel>) => {
                        if (response) {
                            this.warehouses = response;
                        } else {
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('unidentified-problem')
                            );
                        }
                        this.formControls.get('warehouse').enable();
                        this.isLoadingWarehouses = false;
                    },
                    (error: HttpErrorResponse) => {
                        this.showErrorMessage(error);
                        this.isLoadingWarehouses = false;
                    }
                )
        );
    }
    /**
     * Show error message notification
     * @param error object data
     */
    private showErrorMessage(error: HttpErrorResponse): void {
        let message = this._errorHandlerService.handleError(error, 'lots');
        this._alertService.errorTitle(
            this._i18nPipe.transform('error-msg'),
            message
        );
    }

    /**
     * Clean commodity type value and reset state control
     */
    private cleanCommodityTypeValues(): void {
        this.formControls.patchValue({ commodityType: null });
        this.formControls.get('commodityType').disable();
        this.commodityTypes = [];
        this.isLoadingCommodityTypes = false;
        this.filters.commodityType = null;
    }

    /**
     * Clean warehouse value and reset state control
     */
    private cleanWarehouseValues(): void {
        this.formControls.patchValue({ warehouse: [] });
        this.formControls.get('warehouse').disable();
        this.warehouses = [];
        this.isLoadingWarehouses = false;
        this.filters.warehouses = [];
    }
    /**
     * set weight notes
     * @param weightNotes weight notes selected
     */
    public onEventSetSelectedNotes(weightNotes: IWeightModel[]): void {
        let data: ILotWeignotesModel = {
            notes: this.selectedNotes,
            params: this.filters,
        };
        this.eventFormStatusChange.emit({
            data,
            isValid: weightNotes.length > 0,
        });
        this.selectedNotes = weightNotes;
    }
}
