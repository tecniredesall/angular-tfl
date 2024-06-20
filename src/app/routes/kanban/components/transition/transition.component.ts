import { IWNWeightModel, WNWeightModel } from './../../../weight-note/models/wn-weight.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { KanbanService } from '../../services/kanban.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ITransitionModel, TransitionViewModel, TransitionViewRequestModel } from '../../models/transition.model';
import { NotifierService } from 'angular-notifier';
import { IWarehouseModel } from '../../models/warehouse.model';
import * as moment from 'moment';
import { ILotListWeightNoteGrouper, LotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { IProcessListModel } from '../../models/process-list.model';
import { NgxMatDateAdapter, NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { IWNSeasonModel } from 'src/app/routes/weight-note/models/wn-season.model';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { checkUserHasScalesLinked } from "src/app/shared/utils/functions/user-scales-data";
import { ITransformationTypeModel } from 'src/app/shared/models/transformation-type.model';
import { WNPenaltyModel } from 'src/app/routes/weight-note/models/wn-penalty.model';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { accurateDecimalSum } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { ICommodityTypeModel } from '../../models/commodity-type.model';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
    parse: {
        dateInput: 'l, LTS'
    },
    display: {
        dateInput: 'dddd, LL HH:mm:ss',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    }
};

@Component({
    selector: 'app-transition',
    templateUrl: './transition.component.html',
    styleUrls: ['./transition.component.scss'],
    providers: [
        {
            provide: NGX_MAT_DATE_FORMATS,
            useValue: CUSTOM_DATE_FORMATS
        },
    ]
})
export class TransitionComponent implements OnInit, OnDestroy {

    @BlockUI('kanban-transition-layout') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public transitionForm = new UntypedFormGroup({
        current: new UntypedFormGroup({
            transitionAt: new UntypedFormControl({ value: null, disabled: true }),
            closedAt: new UntypedFormControl('', [Validators.required]),
            hours: new UntypedFormControl({ value: 0, disabled: true }),
            note: new UntypedFormControl('', Validators.maxLength(CONSTANTS.MAX_LENGTH_TEXT_NOTE)),
            commodityTransformationId: new UntypedFormControl({ value: null, disabled: true } , [Validators.required]),
            warehouseId: new UntypedFormControl({ value: null, disabled: true }),
        }),
        target: new UntypedFormGroup({
            processId: new UntypedFormControl(''),
            transitionAt: new UntypedFormControl('', [Validators.required]),
            commodityTransformationId: new UntypedFormControl(null, Validators.required),
            warehouseId: new UntypedFormControl({ value: null, disabled: true }, Validators.required),
        })
    });
    private _lotId: string;
    public maxDate: moment.Moment;
    public warehouses: IWarehouseModel[] = [];
    public isLoadingWarehouses = false;
    public configuration = new TRConfiguration();
    public commodityTransformations: ICommodityTypeModel[] = [];
    public isLoadingCommodityTransformations = false;
    public lot: ILotListWeightNoteGrouper = new LotListWeightNoteGrouper();
    public backToURL: string;
    public processList: IProcessListModel[] = [];
    public nextProcess: IProcessListModel;
    public isEdit: boolean = false;
    public isFromKanban: boolean = false;
    public isFromDetail: boolean = false;
    public nextProcessId: string;
    public dataWasEdited: boolean = false;
    public userHasScalesLinked: boolean = checkUserHasScalesLinked();
    public weights: Array<IWNWeightModel> = [];
    public penalties: Array<WNPenaltyModel> = [];
    readonly CONSTANTS = CONSTANTS;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly PARAM_WEIGHING_TABLE = CONSTANTS.PARAM_WEIGHING_TABLE;
    public positiveDecimalNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: this.DECIMAL_DIGITS,
        integerLimit: 12,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false,
    });
    public finalWeight: number = 0;
    public totalTare: number = 0;
    public totalNet: number = 0;
    public totalNetQQ: number = 0;
    public totalGross: number = 0;
    public totalSacks: number = 0;
    public totalDiscount: number = 0;
    public totalTareAditional: number = 0;
    public totalCharacteristics: number = 0;
    public totalCharacteristicsQQ: number = 0;
    public totalPercentCharacteristics: number = 0;
    public totalFinalWeightQQ: number = 0;
    public isPendingProcess: boolean = false;
    public formWeighinTable: UntypedFormGroup;
    public formPenaltiesTable: UntypedFormGroup;
    public isLoadConfiguration = true;

    public weigthsArray: Array<IWNWeightModel> = []
    private _commodity: number;
    private _closedDate: moment.Moment;
    private _transition: ITransitionModel;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _router: Router,
        private _i18nPipe: I18nPipe,
        private _dateAdapter: NgxMatDateAdapter<any>,
        private _i18nService: I18nService,
        private _alertService: AlertService,
        private _kanbanService: KanbanService,
        private _activatedRoute: ActivatedRoute,
        private _notifierService: NotifierService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _purchaseService: PurchaseOrdersService,
    ) {
        this._lotId = this._activatedRoute.snapshot.params.id;
        const queryParams = this._activatedRoute.snapshot.queryParams;
        this.isFromKanban = queryParams.isFromKanban === 'true';
        this.isFromDetail = queryParams.nisFromDetail === 'true';
        this.nextProcessId = queryParams.processId;
        this.isEdit = queryParams.isEdit === 'true';
        this._commodity = queryParams.commodity;
        this._i18nService.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this._dateAdapter.setLocale(result ?? 'es');
            })
    }

    ngOnInit() {
        this._getSeason();
        this._getConfiguration();
    }

    private _listenChangesTransitionForm() {
        this.transitionForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (form) => {
                    if (!this.isEdit && form.current.closedAt && form.current.closedAt != '' && form.current.closedAt != this._closedDate) {
                        this._calculateHours()
                    }
                    if (this.isEdit && this._transition) {
                        this.dataWasEdited = form.current?.note != this._transition.note ||
                            form.current?.transitionAt?.toISOString() != this._transition.transitionAt?.toISOString();
                    }
                }
            )
    }

    private _getSeason() {
        this._kanbanService.getSeason()
            .pipe(take(1))
            .subscribe((season: IWNSeasonModel) => this.maxDate = season.endDate)
    }

    private _getConfiguration() {
        this.blockUI.start();
        this._purchaseService.getConfiguration().pipe(
            takeUntil(this.destroy$),
            take(1)
        ).subscribe(
            (response: ITRConfiguration) => {
                this.configuration = response;
                this._getLotDetail();
                this.isLoadConfiguration = false;
            },
            error => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'kanban')
                );
                this.isLoadConfiguration = false;
                this.blockUI.stop();
            }
        );
    }

    private _getLotDetail() {
        this._kanbanService.getLotDetail(this._lotId, {
            baseMeasurementUnitFactor: this.configuration.baseMeasurementUnitFactor,
            decimalPlaces: this.DECIMAL_DIGITS,
        }).pipe(
            takeUntil(this.destroy$),
            take(1)
        )
            .subscribe(
                (response: ILotListWeightNoteGrouper) => {
                    this.lot = response;
                    this.lot.processId = response.processId ?? CONSTANTS.LOT_PENDING_PROCESS;
                    this.lot.processColor = response.processColor ?? '#70889E';
                    this.lot.process = this.lot.processId == CONSTANTS.LOT_PENDING_PROCESS ? 'kanban-dashboard-process-pending' : this.lot.process;
                    this.isPendingProcess = this.lot.processId == CONSTANTS.LOT_PENDING_PROCESS;
                    this.loadProcessList(this.lot.workflowId);
                    if (this.isEdit) {
                        this._getTransition(this.lot.currentTransition.id)
                    } else {
                        this.transitionForm.get('current').patchValue({ transitionAt: this.lot.currentTransition.transitionAt ?? this.lot.createdDate });
                        this._listenChangesTransitionForm();

                    }
                    this.backToURL = this.isFromDetail ?
                        `/routes/weight-note/lots/lot/${this.lot.id}?isFromKanban=${this.isFromKanban}&commodity=${this._commodity}` :
                        `/routes/kanban/dashboard/${this.lot.workflowId}?commodity=${this._commodity}`;
                },
                (error: HttpErrorResponse) => {
                    const message = this._errorHandlerService.handleError(error, 'kanban');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
    }


    private _getTransition(transitionId: string) {
        if (!this.blockUI.isActive) { this.blockUI.start() }
        this._kanbanService.getTransition(transitionId, {
            baseMeasurementUnitFactor: this.configuration.baseMeasurementUnitFactor,
            decimalPlaces: this.DECIMAL_DIGITS,
        })
            .pipe(take(1))
            .subscribe(
                (response: ITransitionModel) => {
                    this._transition = response;
                    this.transitionForm.get('current').patchValue({
                        transitionAt: this._transition.transitionAt,
                        commodityTransformationId: this._transition.commodityTransformationId,
                        warehouseId: this._transition.warehouseId,
                        note: this._transition.note
                    });
                    this.transitionForm.get('current').get('transitionAt').enable();
                    this.totalNet = this._transition.weight;
                    this.weights = this._transition.weights;
                    this.penalties = this._transition.penalties;
                    this._listenChangesTransitionForm();
                    this._getWarehouses(this._transition.transformationTypeId);
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    const message = this._errorHandlerService.handleError(error, 'kanban');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
    }

    public loadProcessList(workflowId: string) {
        this._kanbanService
            .getWorkflowProcesses(workflowId)
            .pipe(take(1))
            .subscribe(
                (processes: IProcessListModel[]) => {
                    const currentProcess: IProcessListModel = processes.find(process => process.id === this.lot.processId)
                    if (!this.isEdit) {
                        this.nextProcess = processes.find(process => process.id === this.nextProcessId);
                        if (this.nextProcess) {
                            this.processList = processes.filter(p => p.level === this.nextProcess.level);
                            this.transitionForm.get('target').patchValue({ processId: this.nextProcessId })
                            this._setTransformationsTypes(this.nextProcess);
                        } else {
                            this.transitionForm.get('target').disable();
                            this.transitionForm.get('current').get('commodityTransformationId').enable();
                            this._setTransformationsTypes(currentProcess);
                        }
                    } else {
                        this._setTransformationsTypes(currentProcess);
                    }
                    if (currentProcess.id == CONSTANTS.LOT_PENDING_PROCESS) {
                        this._loadPendingProcessData(currentProcess);
                    }
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    const message = this._errorHandlerService.handleError(error, 'kanban');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            );
    }

    public setTransformationType(commodityTransformationId: string) {
        this.transitionForm.get('target').get('warehouseId').reset();
        this.isLoadingWarehouses = true;
        const commodityTransformation = this.commodityTransformations.find( c => c.id == commodityTransformationId);
        this._getWarehouses(commodityTransformation.transformationTypeId);
    }

    public setProcess(nextProcess: IProcessListModel) {
        this.transitionForm.get('target').reset();
        this.transitionForm.get('target').patchValue({ processId: nextProcess.id })
        this.nextProcess = this.processList.find(p => p.id == nextProcess.id);
        this._setTransformationsTypes(nextProcess);
    }

    private _getWarehouses(transformationType: string) {
        this._kanbanService.getWarehouses(transformationType , this._builtParamsWarehouses())
            .pipe(take(1))
            .subscribe(
                (response: IWarehouseModel[]) => {
                    this.warehouses = response;
                    if(this.nextProcess) {
                       this.transitionForm.get('target').get('warehouseId').enable();
                    }
                    this.isLoadingWarehouses = false;
                },
                (error: HttpErrorResponse) => {
                    const message = this._errorHandlerService.handleError(error, 'kanban');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isLoadingWarehouses = false;
                }
            );
    }

    private _builtParamsWarehouses(type_id : number = CONSTANTS.TYPE_OF_TANKS.PHYSICAL){
        return {
            type_id
        }
    }

    public submit() {
        const config = {
            baseMeasurementUnitFactor: this.configuration.baseMeasurementUnitFactor,
            decimalPlaces: this.DECIMAL_DIGITS
        }

        if (!this.isEdit) {
            let transition = new TransitionViewModel(
                {
                    lotId: this._lotId ?? this.lot.id,
                    current: {
                        transitionAt: this.lot.currentTransition.transitionAt ?? this.lot.createdDate,
                        weight: this.totalNet,
                        processId: this.lot.processId,
                        warehouseId: this.lot.currentTransition.productionTankId,
                        commodityTransformationId: this.lot.currentTransition.commodityTransformationId,
                        finalFeaturedWeight: this.totalNet,
                        finalNetWeight: accurateDecimalSum([this.totalNet, this.totalCharacteristics], this.DECIMAL_DIGITS),
                        ...this.transitionForm.get('current').value,
                        ...this.formWeighinTable.getRawValue(),
                        ...this.formPenaltiesTable.getRawValue()
                    },
                    target: this.nextProcess ? {
                        processId: this.nextProcess?.id,
                        ...this.transitionForm.get('target').value
                    } : {
                        transitionAt: null,
                        weight: this.totalNetQQ,
                        processId: this.lot.processId,
                        warehouseId: this.lot.currentTransition.productionTankId,
                        commodityTransformationId: this.lot.currentTransition.commodityTransformationId
                    }
                },
                config
            );
            let request = new TransitionViewRequestModel(transition, config)
            this.blockUI.start();
            this._kanbanService.postTransition(request)
                .pipe(take(1))
                .subscribe(
                    _ => {
                        this._notifierService.notify('success', this._i18nPipe.transform('success-transition-lot'));
                        const path = this.isFromKanban ?
                            `/routes/kanban/dashboard/${this.lot.workflowId}` :
                            `/routes/weight-note?tab=lots`;
                        this._router.navigateByUrl(path);
                        this.blockUI.stop();
                    },
                    (error: HttpErrorResponse) => {
                        const message = this._errorHandlerService.handleError(error, 'kanban');
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                        this.blockUI.stop();
                    }
                )
        } else {
            let transition = new TransitionViewModel(
                {
                    current: {
                        id: this._transition.id,
                        lotId: this._lotId,
                        ...this.transitionForm.getRawValue().current
                    }
                },
                config
            );
            let request = new TransitionViewRequestModel(transition, config)
            this.blockUI.start();
            this._kanbanService.putTransition(this.lot.currentTransition.id, request)
                .pipe(take(1))
                .subscribe(
                    _ => {
                        this._notifierService.notify('success', this._i18nPipe.transform('success-transition-lot'));
                        this._router.navigateByUrl(this.backToURL);
                        this.blockUI.stop();
                    },
                    (error: HttpErrorResponse) => {
                        this.blockUI.stop();
                        const message = this._errorHandlerService.handleError(error, 'kanban');
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    }
                )
        }
    }

    public cancel() {
        this._router.navigateByUrl(this.backToURL);
    }

    public formWeightCaptureReady(formWeighinTable: UntypedFormGroup): void {
        this.formWeighinTable = formWeighinTable;
        formWeighinTable.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes: any) => {
            this.finalWeight = formWeighinTable.controls.totalNetQQ.value;
            this.totalGross = changes.totalGross;
            this.totalNet = changes.totalNet;
            this.totalSacks = changes.totalSacks;
            this.totalTare = changes.totalTare;
            this.totalTareAditional = changes.totalTareAditional;
            this.totalGross = changes.totalGross;
            this.totalNetQQ = convertLbtoQQ(changes.totalNet, this.configuration.conversionMeasurementUnitFactor);
            this.totalTare = changes.totalTare;
            this.totalTareAditional = changes.totalTareAditional;
            this.totalTare += this.totalTareAditional;
            this.totalFinalWeightQQ = (this.totalNetQQ - this.totalCharacteristics)
        })
    }

    public onSetPenaltiesFormArray(formPenaltiesTable: UntypedFormGroup) {
        this.formPenaltiesTable = formPenaltiesTable;
        formPenaltiesTable.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes: any) => {
            this.totalCharacteristics = Math.abs(changes.totalCharacteristics);
            this.totalCharacteristicsQQ = Math.abs(convertLbtoQQ(changes.totalCharacteristics, this.configuration.conversionMeasurementUnitFactor))
            this.totalPercentCharacteristics = changes.totalPercentCharacteristics
            this.totalFinalWeightQQ = (this.totalNetQQ - this.totalCharacteristicsQQ)
        })

    }

    private _setTransformationsTypes(process: IProcessListModel) {
        this.isLoadingCommodityTransformations = true;
        const transformationTypes = process.transformationTypes.filter(
            t => t.flow === (this.nextProcess ? CONSTANTS.PROCESS_FLOW.IN : CONSTANTS.PROCESS_FLOW.OUT)
        );
        this._getCommodityTypes(transformationTypes);
    }

    public setTargetTransitionAt() {
        this.transitionForm.get('target').get('transitionAt').markAsDirty();
        if (!this.transitionForm.get('target').get('transitionAt').value) {
            this.transitionForm.get('target').patchValue({
                transitionAt: this.transitionForm.get('current').get('closedAt').value
            })
        }
    }

    private _getCommodityTypes(transformationTypes: ITransformationTypeModel[]) {
        this._kanbanService.getCommodityTypes()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result: ICommodityTypeModel[]) => {
                    const transformationTypeIds = transformationTypes.map(t => t.id);
                    const commodityTransformations = result.filter(r => transformationTypeIds.includes(r.transformationTypeId));
                    this.commodityTransformations = transformationTypes.length > 0 ? commodityTransformations : result;
                    if (commodityTransformations.length === 1 && !this.isEdit) {
                        const commodityTransformation = commodityTransformations[0];
                        this.transitionForm.get('target').patchValue({ commodityTransformationId: commodityTransformation.id });
                        this.setTransformationType(commodityTransformation.id);
                    }
                    this.isLoadingCommodityTransformations = false;
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'kanban')
                    );
                    this.blockUI.stop();
                    this.isLoadingCommodityTransformations = false;
                }
            )
    }

    private _calculateHours() {
        this._closedDate = this.transitionForm.get('current').get('closedAt').value;
        const startDate = this.lot.currentTransition.transitionAt ?? this.lot.createdDate;
        let difference = startDate.diff(this._closedDate, 'hours') * -1;
        if (difference >= 0) {
            this.transitionForm.get("current").patchValue({ hours: difference })
        }
    }

    private _loadPendingProcessData(pendingProcess: IProcessListModel): void {
        let weight = new WNWeightModel({
            sacksNumber: 0,
            grossWeight: this.lot.grossWeightLB,
            tare: 0,
            tareAditional: 0
        });
        this.weights = [weight];
        const currentDate = moment();
        this.transitionForm.get('current').patchValue({ closedAt: currentDate });
        this.transitionForm.get('target').patchValue({ transitionAt: currentDate });
    }

    get isFirstTransitionOfSplitLot() {
        return this.lot.lotParentId && this.lot.lotParentId.length > 0 && this.lot.transitions.length == 1
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete()
    }

}

