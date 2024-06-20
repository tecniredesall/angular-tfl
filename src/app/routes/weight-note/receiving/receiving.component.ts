import { NotifierService } from 'angular-notifier';
import { ResizedEvent } from 'angular-resize-event';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { accurateDecimalSubtraction, accurateDecimalSum, roundDecimal } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { removeAccents } from 'src/app/shared/utils/functions/remove-accents';
import { cleanWord } from 'src/app/shared/utils/functions/clean-word';
import { sortByStringValue, sortFormArrayBykey } from 'src/app/shared/utils/functions/sortFunction';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { validatorMaxDateFormControl } from 'src/app/shared/validators/validator-max-date-form-control';
import { validatorMinDateFormControl } from 'src/app/shared/validators/validator-min-date-form-control';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { validatorNonZeroFormControl } from '../../../shared/validators/validator-non-zero-form-control';
import { validatorNumericalRangeFormControl } from '../../../shared/validators/validator-numerical-range-form-control';
import { TBlockModel, TIBlockModel } from '../../t-blocks/models/block.model';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModalNewComponent } from '../modal-new/modal-new.component';
import { IReceivingNoteValidatorModel, ReceivingNoteValidatorModel } from '../models/receiving-note-validator.model';
import { IReceivingNoteModel, ReceivingNoteModel } from '../models/receiving-note.model';
import { IWNBlockModel, WNBlockModel } from '../models/wn-block.model';
import { IWNCertificationModel, WNCertificationModel } from '../models/wn-certification.model';
import { IWNCharacteristicModel, WNCharacteristicModel } from '../models/wn-characteristic.model';
import { IWNCommodityTransformationModel, WNCommodityTransformationModel } from '../models/wn-commodity-transformation.model';
import { IWNCommodityTypeModel } from '../models/wn-commodity-type.model';
import { IWNCommodityModel, WNCommodityModel } from '../models/wn-commodity.model';
import { IWNContainerModel } from '../models/wn-container.model';
import { IWNDeductionTradingStatusModel, WNDeductionTradingStatusModel } from '../models/wn-deduction-trading-status.model';
import { IWNDescriptionValidatorModel, WNDescriptionValidatorModel } from '../models/wn-description-validator.model';
import { IWNDescriptionModel, WNDescriptionModel } from '../models/wn-description.model';
import { IWNDriverListPaginatorModel, WNDriverListPaginatorModel } from '../models/wn-driver-list-paginator.model';
import { IWNDriverModel, WNDriverModel } from '../models/wn-driver.model';
import { IWNFarmModel, WNFarmModel } from '../models/wn-farm.model';
import { IWNGeneralInformationModel } from '../models/wn-general-information-model.model';
import { WNGeneralInformationValidatorModel } from '../models/wn-general-information-validator.model';
import { IWNOptionChoiceDeductionModel } from '../models/wn-option-choice-deduction.model';
import { IWNPenaltyModel, WNPenaltyModel } from '../models/wn-penalty.model';
import { IWNRequestActionReceivingNoteModel, WNRequestActionReceivingNoteModel } from '../models/wn-request-action-receiving-note.model';
import { IWNRequestChangeStatusModel, WNRequestChangeStatusModel } from '../models/wn-request-change-status.model';
import { IWNDeductionsTradingModel, WNDeductionsTradingModel } from '../models/wn-request-deductions-trading.model';
import { IWNSeasonModel } from '../models/wn-season.model';
import { IWNSellerListPaginatorModel, WNSellerListPaginatorModel } from '../models/wn-seller-list-paginator.model';
import { IWNSellerModel, WNSellerModel } from '../models/wn-seller.model';
import { IWNTruckListPaginatorModel, WNTruckListPaginatorModel } from '../models/wn-truck-list-paginator.model';
import { IWNTruckModel, WNTruckModel } from '../models/wn-truck.model';
import { IWNWeightModel, WNWeightModel } from '../models/wn-weight.model';
import { WeightService } from '../services/weight.service';
import { take, takeUntil } from 'rxjs/operators';
import { IContractTrumodityModel } from '../../purchase-orders/models/contract-trumodity.model';
import * as printJS from 'print-js';
import { ReceivingCloseUpdateRequestModel } from '../models/receiving-close-update-request.model';
import { DeleteWeightNoteComponent } from '../components/delete-weight-note/delete-weight-note.component';
import { EditWeightNoteComponent } from '../components/edit-weight-note/edit-weight-note.component';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrdersService } from '../../purchase-orders/services/purchase-orders.service';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';

@Component({
    selector: 'app-receiving',
    templateUrl: './receiving.component.html',
    styleUrls: ['./receiving.component.scss']
})
export class ReceivingComponent implements OnInit, OnDestroy {
    @BlockUI('receiving-layout') blockUILayout: NgBlockUI;
    @BlockUI('weights-section') blockWeightsSection: NgBlockUI;
    @ViewChild('certificationsContainer', { static: false })
    certificationsContainer: ElementRef;
    @ViewChild('hightLimitContainerNotification', { static: true })
    hightLimitContainerNotification;

    readonly DECIMAL_DIGITS: number = JSON.parse(
        localStorage.getItem('decimals')
    ).general;
    readonly CHARACTERISTICS_DECIMAL: number = JSON.parse(
        localStorage.getItem('decimals')
    ).characteristics;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public templateBlockUiModalWS: BlockModalUiComponent = BlockModalUiComponent;
    public configuration: ITRConfiguration = new TRConfiguration();
    public descIndex: number = 0;
    public receivingNote: { information: UntypedFormGroup; description: UntypedFormArray };
    public sellersPaginator: IWNSellerListPaginatorModel = new WNSellerListPaginatorModel();
    public driversPaginator: IWNDriverListPaginatorModel = new WNDriverListPaginatorModel();
    public trucksPaginator: IWNTruckListPaginatorModel = new WNTruckListPaginatorModel();
    public MAX_LENGTH_FIELD_TICKET: number = CONSTANTS.MAX_LENGTH_FIELD_TICKET;
    public MAX_LENGTH_CONTRACT_ID: number = CONSTANTS.MAX_LENGTH_CONTRACT_ID;
    public ALPHANUMERIC_REGEXP: RegExp = CONSTANTS.ALPHANUMERIC_REGEXP;
    public isLoadingCommodities: boolean = true;
    public commodities: Array<IWNCommodityModel> = [];
    public commodityTransformations: Array<IWNCommodityTransformationModel> = [];
    public openedPanelIndex: number = 0;
    public characteristicDecimalNumberMask: any = createNumberMask({
        prefix: '',
        suffix: ' %',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: this.CHARACTERISTICS_DECIMAL,
        integerLimit: 12,
        requireDecimal: false,
        allowNegative: true,
        allowLeadingZeroes: false,
    });
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
    public positiveNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: false,
        decimalSymbol: '.',
        decimalLimit: 0,
        integerLimit: 12,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false,
    });
    public isEditing: boolean = false;
    public isAllowedEditGeneralInformation: boolean = true;
    public dataWasModified: boolean = false;
    public isAllowedCloseReceivingNote: boolean = false;
    public OPTIONS_MODAL = CONSTANTS.OPTIONS_MODAL_WEIGHT_NOTE;
    public farmsByProducer: Array<IWNFarmModel> = [];
    public cacheFarmsByProducer: Array<IWNFarmModel> = [];
    public isEnabledChangeNote: boolean = true;
    public seasons: Array<IWNSeasonModel> = [];
    public isLoadingSeasons: boolean = false;
    public isLoadingBlocks: boolean = false;
    public isLoadingCertifications: boolean = false;
    public disableBtnCloseWeightNote: boolean = false;
    public isDisabledDeleteWeightNoteBtn: boolean = false;
    public isDisabledSaveAndExitBtn: boolean = false;
    public isDisabledCloseReceivingBtn: boolean = false;
    public producerContracts: string[] = []
    public isLoadingProducerContracts: boolean = false;
    public queryParams: any = {};
    public isSyncStarted: boolean = false;
    public workerSyncAction: string = CONSTANTS.WORKER_SYNC_ACTIONS.FEDERATION_DATA;
    public hasPermissionToEditClosedNote: boolean = true;
    public hasPermissionToDeleteClosedNote: boolean = true;
    public hasPermissionToDeleteOpenNote: boolean = true;
    public weights: IWNWeightModel[][] = [[]];
    public isLoadConfiguration: boolean = false;
    readonly PERMISSIONS = CONSTANTS.PERMISSIONS;
    readonly PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    readonly CONSTANTS = CONSTANTS;
    readonly RECEIVING_NOTE_STATUS: any = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly WEIGHT_NOTE_STATUS: any = CONSTANTS.WEIGHT_NOTE_STATUS;
    readonly TYPE_WEIGHT_NOTE: any = CONSTANTS.TYPE_WEIGHT_NOTE;
    readonly DEDUCTION_TYPE: any = CONSTANTS.DEDUCTION_TYPE;
    readonly LOT_STATUS: any = CONSTANTS.LOT_STATUS;
    readonly PARAM_WEIGHING_TABLE = CONSTANTS.PARAM_WEIGHING_TABLE;
    readonly DEDUCTIONS_ALLOW_ACTIONS = CONSTANTS.DEDUCTIONS_ALLOW_ACTIONS;

    private selectedWeightNote: number = null;
    private refTimeoutSellersRequest: any = null;
    private refTimeoutDriversRequest: any = null;
    private refTimeoutTrucksRequest: any = null;
    private isSelectedProducer: boolean = false;
    private emptyDescriptionReference: IWNDescriptionValidatorModel = new WNDescriptionValidatorModel();
    private receivingNoteReference: IReceivingNoteValidatorModel = null;
    private deductionsTradingStatus: IWNDeductionTradingStatusModel = new WNDeductionTradingStatusModel();
    private _sellerSubscription: Subscription = new Subscription();
    private _certificationSubscription: Subscription = new Subscription();
    private _commodityTypesSubscription: Subscription = new Subscription();
    private _transformationsSubscription: Subscription = new Subscription();
    private _containersSubscription: Subscription = new Subscription();
    private _driverSubscription: Subscription = new Subscription();
    private _truckSubscription: Subscription = new Subscription();
    private _weightSubscription: Subscription = new Subscription();
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private file: any;
    private _isAllowedEditProducer: boolean = false;

    constructor(
        private _router: Router,
        private _dialog: MatDialog,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _sanitization: DomSanitizer,
        private _weightService: WeightService,
        private _activatedRoute: ActivatedRoute,
        private _purchaseOrderService: PurchaseOrdersService,
        private _notifierService: NotifierService,
        private _permissionsService: PermissionsService,
        private _errorHandlerService: ResponseErrorHandlerService,
    ) {
        this._createReceivingNoteForm();
        let params = this._activatedRoute.snapshot.params;
        if (params.hasOwnProperty('receptionId')) {
            this.isEditing = true;
            this.receivingNote.information.patchValue({
                id: params.receptionId,
            });
            this.selectedWeightNote = params?.transactionInId ?? null;
        }
        let queryParams: any = this._activatedRoute.snapshot.queryParams;
        if (queryParams?.isFromNoteList === 'true') {
            this.queryParams = { production: (!!queryParams.fromProduction) }
        }

        this.hasPermissionToEditClosedNote = this._permissionsService.checkValidity(
            this.PERMISSIONS.UPDATE_CLOSE_NOTE, this.PERMISSION_TYPES.UPDATE)

        this.hasPermissionToDeleteClosedNote = this._permissionsService.checkValidity(
            this.PERMISSIONS.UPDATE_CLOSE_NOTE, this.PERMISSION_TYPES.DELETE)

        this.hasPermissionToDeleteOpenNote = this._permissionsService.checkValidity(
            this.PERMISSIONS.WEIGHT_NOTE, this.PERMISSION_TYPES.DELETE)
    }

    ngOnInit() {
        this.isLoadConfiguration = true;
        if (this.isEditing) {
            this.blockUILayout.start();
            forkJoin([
                this._purchaseOrderService.getConfiguration(),
                this._weightService.getReceptionNoteById(
                    this.receivingNote.information.get('id').value,
                    this.configuration
                ),
            ])
                .pipe(take(1))
                .subscribe(
                    ([configuration, receivingNoteData]) => {
                        this.configuration = configuration;
                        this.isLoadConfiguration = false;
                        this.setReceivingNoteExistentData(receivingNoteData);
                    },
                    (error: HttpErrorResponse) => {
                        let message = this._errorHandlerService.handleError(error, 't-weight-note');
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            message
                        );
                        this.blockUILayout.stop();
                    }
                );
        } else {
            this.getConfiguration();
            this.getSellers(null, false);
            this.getSeasons();
            this.getCommodities(null, false);
            this.getDrivers(null, false);
            this.getTrucks(null, false);
        }
    }

    /**
     * Callback method that performs custom clean-up, invoked immediately before the component instance is destroyed.
     */
    ngOnDestroy(): void {
        this._sellerSubscription.unsubscribe();
        this._certificationSubscription.unsubscribe();
        this._commodityTypesSubscription.unsubscribe();
        this._transformationsSubscription.unsubscribe();
        this._containersSubscription.unsubscribe();
        this._driverSubscription.unsubscribe();
        this._truckSubscription.unsubscribe();
        this._weightSubscription.unsubscribe();
        this.deductionsTradingStatus.refRequest.unsubscribe();
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private _createReceivingNoteForm(): void {

        let receiving: IReceivingNoteModel = new ReceivingNoteModel();
        let informationFormGroup: UntypedFormGroup = new UntypedFormGroup({
            id: new UntypedFormControl(receiving.information.id),
            folio: new UntypedFormControl({
                value: receiving.information.folio,
                disabled: true,
            }),
            producer: new UntypedFormControl(receiving.information.producer, [
                Validators.required,
            ]),
            season: new UntypedFormControl(receiving.information.season, [
                Validators.required,
            ]),
            fieldTicket: new UntypedFormControl(receiving.information.fieldTicket, [
                Validators.maxLength(CONSTANTS.MAX_LENGTH_FIELD_TICKET),
                Validators.pattern(CONSTANTS.ALPHANUMERIC_REGEXP),
            ]),
            contractId: new UntypedFormControl(
                {
                    value: receiving.information.contractId,
                    disabled: true,
                }
            ),
            totalNetWeightQQ: new UntypedFormControl(
                receiving.information.totalNetWeightQQ
            ),
            totalNetWeight: new UntypedFormControl(
                receiving.information.totalNetWeight
            ),
            totalDiscount: new UntypedFormControl(
                receiving.information.totalDiscount
            ),
            totalAddition: new UntypedFormControl(
                receiving.information.totalAddition
            ),
            totalNetDryWeightQQ: new UntypedFormControl(
                receiving.information.totalNetDryWeightQQ
            ),
            status: new UntypedFormControl(receiving.information.status),
        });
        let descriptionFormArray: UntypedFormArray = new UntypedFormArray(
            [],
            this.validatorDataModifiedFormArray(this.emptyDescriptionReference)
        );
        receiving.description.forEach((d: IWNDescriptionModel) => {
            descriptionFormArray.push(this.createDescriptionFormGroup(d));
        });
        informationFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
            this.detectChangesOnEditReceivingNote();
        })
        this.receivingNote = {
            information: informationFormGroup,
            description: descriptionFormArray,
        };
    }

    private createDescriptionFormGroup(description: IWNDescriptionModel): UntypedFormGroup {
        let selectedSeason: IWNSeasonModel = this.receivingNote?.information.get('season').value;
        let allowedMaxDate: moment.Moment =
            selectedSeason?.endDate &&
                moment(selectedSeason.endDate).isSameOrBefore(description.todayDate)
                ? moment(selectedSeason.endDate)
                : moment(description.todayDate);
        let weightsFormArray: UntypedFormArray = new UntypedFormArray([]);
        description.weights.forEach((w: IWNWeightModel) => {
            weightsFormArray.push(this.createWeightFormGroup(w));
        });
        let penaltiesFormArray: UntypedFormArray = new UntypedFormArray([]);
        description.penalties.forEach((p: IWNPenaltyModel) => {
            penaltiesFormArray.push(this.createPenaltyFormGroup(p));
        });
        penaltiesFormArray.disable();
        let descriptionFormGroup: UntypedFormGroup = new UntypedFormGroup({
            transactionInId: new UntypedFormControl(description.transactionInId),
            weightNoteId: new UntypedFormControl(description.weightNoteId),
            indexSort: new UntypedFormControl(description.indexSort),
            localDateCapture: new UntypedFormControl(description.localDateCapture),
            todayDate: new UntypedFormControl(description.todayDate),
            allowedMaxDate: new UntypedFormControl(allowedMaxDate),
            date: new UntypedFormControl(
                description.date,
                selectedSeason
                    ? [
                        Validators.required,
                        validatorMinDateFormControl(
                            selectedSeason?.startDate
                        ),
                        validatorMaxDateFormControl(allowedMaxDate),
                    ]
                    : [Validators.required]
            ),
            commodity: new UntypedFormControl(description.commodity, [
                Validators.required,
            ]),
            isLoadingCommodityTypes: new UntypedFormControl(
                description.isLoadingCommodityTypes
            ),
            commodityType: new UntypedFormControl(
                { value: description.commodityType, disabled: true },
                [Validators.required]
            ),
            commodityTypesByCommodity: new UntypedFormControl(
                description.commodityTypesByCommodity
            ),
            commodityTransformation: new UntypedFormControl(
                description.commodityTransformation,
                [Validators.required]
            ),
            isLoadingContainers: new UntypedFormControl(
                description.isLoadingContainers
            ),
            container: new UntypedFormControl(
                { value: description.container, disabled: true },
                [Validators.required]
            ),
            containersByCommodityTransformation: new UntypedFormControl(
                description.containersByCommodityTransformation
            ),
            driver: new UntypedFormControl(description.driver, [Validators.required]),
            truck: new UntypedFormControl(description.truck, [Validators.required]),
            deliveredByProducer: new UntypedFormControl(
                description.deliveredByProducer
            ),
            farm: new UntypedFormControl(
                {
                    value: description.farm,
                    disabled: this.isSelectedProducer ? false : true,
                },
                [Validators.required]
            ),
            block: new UntypedFormControl(
                {
                    value: description.block,
                    disabled: this.isSelectedProducer ? false : true,
                },
                [Validators.required]
            ),
            blocksByFarm: new UntypedFormControl(description.blocksByFarm),
            cacheBlocksByFarm: new UntypedFormControl(description.cacheBlocksByFarm),
            certifications: new UntypedFormControl(description.certifications),
            showCertificationControls: new UntypedFormControl(
                description.showCertificationControls
            ),
            isLoadingCertifications: new UntypedFormControl(
                description.isLoadingCertifications
            ),
            certificationsWasLoaded: new UntypedFormControl(
                description.certificationsWasLoaded
            ),
            totalCertifications: new UntypedFormControl(
                description.totalCertifications
            ),
            weights: weightsFormArray,
            penalties: penaltiesFormArray,
            textNote: new UntypedFormControl(description.textNote, [
                Validators.maxLength(CONSTANTS.MAX_LENGTH_TEXT_NOTE),
            ]),
            totalSacks: new UntypedFormControl(description.totalSacks),
            totalGross: new UntypedFormControl(description.totalGross),
            totalTare: new UntypedFormControl(description.totalTare),
            totalTareAditional: new UntypedFormControl(description.totalTareAditional),
            totalSumTares: new UntypedFormControl(description.totalSumTares),
            totalDiscount: new UntypedFormControl(description.totalDiscount),
            totalAddition: new UntypedFormControl(description.totalAddition),
            totalNet: new UntypedFormControl(description.totalNet),
            totalNetQQ: new UntypedFormControl(description.totalNetQQ),
            totalNetDryWt: new UntypedFormControl(description.totalNetDryWt),
            totalNetDryWtQQ: new UntypedFormControl(description.totalNetDryWtQQ),
            totalCharacteristics: new UntypedFormControl(
                description.totalCharacteristics
            ),
            totalPercentCharacteristics: new UntypedFormControl(
                description.totalPercentCharacteristics
            ),
            status: new UntypedFormControl(description.status),
            isDataLoadedOnEdit: new UntypedFormControl(description.isDataLoadedOnEdit),
            isLoadingCharacteristics: new UntypedFormControl(
                description.isLoadingCharacteristics
            ),
            characteristicsWasLoaded: new UntypedFormControl(
                description.characteristicsWasLoaded
            ),
            characteristics: new UntypedFormControl(description.characteristics),
            isWarningContainer: new UntypedFormControl(description.isWarningContainer),
            inProcess: new UntypedFormControl(description.inProcess),
            statusLot: new UntypedFormControl(description.statusLot),
            inPurchaseOrder: new UntypedFormControl(description.inPurchaseOrder),
            deletionReason: new UntypedFormControl(description.deletionReason),
            comment: new UntypedFormControl(''),
            comments: new UntypedFormControl(description.comments),
        });
        descriptionFormGroup.get('date').markAsDirty();
        descriptionFormGroup.setValidators([
            this.validatorNonNegativeTotalFormArray(),
            this.validatorNonEmptyTotalDeductionFormArray(),
        ]);
        descriptionFormGroup.updateValueAndValidity();
        descriptionFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
            this.detectChangesOnEditReceivingNote();
        })
        return descriptionFormGroup;
    }

    private createWeightFormGroup(weight: IWNWeightModel): UntypedFormGroup {

        let weightFormGroup: UntypedFormGroup = new UntypedFormGroup({
            sacksNumber: new UntypedFormControl(weight.sacksNumber, [
                Validators.required,
            ]),
            grossWeight: new UntypedFormControl(weight.grossWeight, [
                Validators.required,
                validatorNonZeroFormControl(),
            ]),
            tare: new UntypedFormControl(weight.tare, [
                Validators.required,
            ]),
            tareAditional: new UntypedFormControl(weight.tareAditional, [
                Validators.required,
            ]),
            featuredWeight: new UntypedFormControl(weight.featuredWeight),
            index: new UntypedFormControl(weight.index),
            isWarningSacks: new UntypedFormControl(weight.isWarningSacks),
            netWeightQQ: new UntypedFormControl(weight.netWeightQQ),
        });
        weightFormGroup.updateValueAndValidity();
        return weightFormGroup;
    }

    private createPenaltyFormGroup(penalty: IWNPenaltyModel): UntypedFormGroup {
        let penaltyFormGroup: UntypedFormGroup = new UntypedFormGroup({
            characteristic: new UntypedFormControl(penalty.characteristic),
            choiceDeduction: new UntypedFormControl(penalty.choiceDeduction),
            sign: new UntypedFormControl(penalty.sign),
            value: new UntypedFormControl({ value: penalty.value, disabled: true }),
            total: new UntypedFormControl(penalty.total),
            characteristicsEnabled: new UntypedFormControl(
                penalty.characteristicsEnabled
            ),
        });
        return penaltyFormGroup;
    }

    private getSeasons(): void {
        this.isLoadingSeasons = true;
        this._weightService.getSeasons().subscribe(
            (response: Array<IWNSeasonModel>) => {
                this.seasons = response;
                if (this.seasons.length > 0) {
                    this.receivingNote.information.patchValue({ season: this.seasons[0] });
                    this.setSeason(this.seasons[0])
                }
                this.isLoadingSeasons = false;
            },
            (error) => {
                let message: string = this._errorHandlerService.handleError(
                    error,
                    't-weight-note'
                );
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );
                this.isLoadingSeasons = false;
            }
        );
    }

    public setOpenedPanel(itemIndex: number): void {
        this.openedPanelIndex = itemIndex;
        if (1 == itemIndex) {
            this.checkStatusCertificationsControls();
        }
    }

    public setClosedPanel(itemIndex: number): void {
        if (this.openedPanelIndex === itemIndex) {
            this.openedPanelIndex = -1;
        }
    }

    public selectNoteWeight(index: number): void {
        if (this.isEnabledChangeNote && !this.isLoadingCertifications) {
            this.weights[this.descIndex] = [...this.receivingNote.description.at(this.descIndex).get('weights').value];
            this.descIndex = index;
            this.checkStatusCertificationsControls();
            if (
                this.isEditing &&
                null != this.receivingNote.description.at(this.descIndex).get('weightNoteId').value &&
                !this.receivingNote.description.at(this.descIndex).get('isDataLoadedOnEdit').value
            ) {
                this.loadDataForSelectedWeightNoteOnEdit();
            }
        }
    }

    public addNewWeighNote(): void {
        if (this.receivingNote.information.get('status').value == this.RECEIVING_NOTE_STATUS.CLOSED) {
            this.isDisabledSaveAndExitBtn = true;
        }
        let descriptionsLenght: number = this.receivingNote.description.length;
        let descriptionIndex: number =
            0 == descriptionsLenght
                ? 1
                : this.receivingNote.description
                    .at(descriptionsLenght - 1)
                    .get('indexSort').value + 1;
        let description: IWNDescriptionModel = new WNDescriptionModel({
            indexSort: descriptionIndex
        });
        this.weights[descriptionsLenght - 1] = [...this.receivingNote.description.at(descriptionsLenght - 1).get('weights').value];
        this.weights[descriptionsLenght] = [];
        this.receivingNote.description.push(
            this.createDescriptionFormGroup(description)
        );
        this.checkIfAllowedCloseReceivingNote();
        this.sortAndSelectWeightNotesFormArray('indexSort', descriptionIndex);
        if (this.farmsByProducer.length > 0) {
            let farm = this.farmsByProducer[0];
            this.receivingNote.description.at(this.descIndex).patchValue({
                farm: { ...farm }
            });
            this.setFarm(farm);
        } else {
            this.getCertifications(true);
            this.getBlocks(true);
        }
        if (this.commodities.length > 0) {
            const defaultIndex = this.findDefaultCommodity(this.commodities);
            this.receivingNote.description
                .at(this.descIndex)
                .patchValue({ commodity: this.commodities[defaultIndex] });
            this.setCommodity(this.commodities[defaultIndex])
        }
        this.getBlocks(false);
    }

    private checkStatusCertificationsControls(): void {
        setTimeout(() => {
            if (this.certificationsContainer) {
                let scrollLength: number =
                    this.certificationsContainer.nativeElement.scrollWidth -
                    this.certificationsContainer.nativeElement.offsetWidth;
                this.receivingNote.description.at(this.descIndex).patchValue({
                    showCertificationControls: scrollLength > 0,
                });
            }
        }, 0);
    }

    public onMoveCertificationsList(offset: number): void {
        this.certificationsContainer.nativeElement.scrollLeft += offset * 24;
    }

    public addPenalty(): void {
        let penalty: IWNPenaltyModel = new WNPenaltyModel({
            characteristicsEnabled: this.updateCharacteristicsList(),
        });
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray).push(
                this.createPenaltyFormGroup(penalty)
            );
    }

    public removePenalty(index: number): void {
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray).removeAt(index);
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray).controls.forEach((p) => {
                p.patchValue({
                    characteristicsEnabled: this.updateCharacteristicsList(
                        (p as UntypedFormGroup).getRawValue()
                    ),
                });
            });
        this.calculateWeightNoteTotals(this.descIndex);
        this.applyDeduction();
    }

    public captureWeight(): void {
        this.openedPanelIndex = 1;
    }

    public calculateWeightNoteTotals(descriptionIndex: number): void {
        let penalty: IWNPenaltyModel = null;
        let totalDiscount: number = 0;
        let totalAddition: number = 0;
        let totalSubtraction: number = 0;
        let totalNetDryWt: number = 0;
        let totalCharacteristics: number = 0;
        let totalNetDryWtQQ: number = 0;
        let totalTare = this.receivingNote.description.at(descriptionIndex).get('totalTare').value;
        const totalGross = this.receivingNote.description.at(descriptionIndex).get('totalGross').value;
        const totalTareAdditional = this.receivingNote.description.at(descriptionIndex).get('totalTareAditional').value;

        this.hideHightLimitNotification();
        // Penalties
        (this.receivingNote.description
            .at(descriptionIndex)
            .get('penalties') as UntypedFormArray).controls.forEach((p: UntypedFormGroup) => {
                penalty = p.getRawValue();
                penalty.total = convertStringToNumber(penalty.total?.toString());
                if ('-' == penalty.sign) {
                    totalDiscount = accurateDecimalSum(
                        [totalDiscount, penalty.total],
                        this.DECIMAL_DIGITS
                    );
                } else {
                    totalAddition = accurateDecimalSum(
                        [totalAddition, penalty.total],
                        this.DECIMAL_DIGITS
                    );
                }
            });

        totalSubtraction = accurateDecimalSubtraction(
            [totalGross, totalTare, totalTareAdditional, totalDiscount],
            this.DECIMAL_DIGITS
        );
        totalNetDryWt = accurateDecimalSum(
            [totalSubtraction, totalAddition],
            this.DECIMAL_DIGITS
        );
        totalCharacteristics = accurateDecimalSubtraction(
            [totalAddition, totalDiscount],
            this.DECIMAL_DIGITS
        );
        const totalSumTares = accurateDecimalSum([totalTare, totalTareAdditional], this.DECIMAL_DIGITS);

        totalNetDryWtQQ = convertLbtoQQ(totalNetDryWt, this.configuration.conversionMeasurementUnitFactor);
        this.receivingNote.description.at(descriptionIndex).patchValue({
            totalSumTares: totalSumTares,
            totalDiscount: totalDiscount,
            totalAddition: totalAddition,
            totalNetDryWt: totalNetDryWt,
            totalCharacteristics: totalCharacteristics,
            totalNetDryWtQQ: totalNetDryWtQQ,
        });

        this.calculateReceivingNoteTotals();
    }

    public calculateReceivingNoteTotals(): void {
        let weightNote: IWNDescriptionModel = null;
        let totalNetWeight: number = 0;
        let totalDiscount: number = 0;
        let totalAddition: number = 0;
        (this.receivingNote.description as UntypedFormArray).controls.forEach(
            (d: UntypedFormGroup) => {
                if (d.get('status').value != this.WEIGHT_NOTE_STATUS.DELETED) {
                    weightNote = d.getRawValue();
                    totalNetWeight = accurateDecimalSum(
                        [totalNetWeight, weightNote.totalNet],
                        this.DECIMAL_DIGITS
                    );
                    totalDiscount = accurateDecimalSum(
                        [totalDiscount, weightNote.totalDiscount],
                        this.DECIMAL_DIGITS
                    );
                    totalAddition = accurateDecimalSum(
                        [totalAddition, weightNote.totalAddition],
                        this.DECIMAL_DIGITS
                    );
                }
            }
        );
        const totalNetDryWeight = accurateDecimalSubtraction([totalNetWeight, totalDiscount], this.DECIMAL_DIGITS);
        const totalNetDryWeightQQ = convertLbtoQQ(totalNetDryWeight, this.configuration.conversionMeasurementUnitFactor);
        this.receivingNote.information.patchValue({
            totalNetWeight: totalNetWeight,
            totalDiscount: totalDiscount,
            totalNetDryWeightQQ: totalNetDryWeightQQ,
        });
    }

    private clearCharacteristics(): void {
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray).clear();
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray).disable();
        this.calculateWeightNoteTotals(this.descIndex);
        this.applyDeduction();
    }

    private updateCharacteristicsList(
        penalty: IWNPenaltyModel = null,
        description: IWNDescriptionModel = (this.receivingNote.description.at(
            this.descIndex
        ) as UntypedFormGroup).getRawValue()
    ): Array<IWNCharacteristicModel> {
        let characteristics: Array<IWNCharacteristicModel> = [];
        this.receivingNote.description
            .at(this.descIndex)
            .get('characteristics')
            .value.forEach((c: IWNCharacteristicModel) => {
                let item = new WNCharacteristicModel(c);
                if (penalty && item.id == penalty.characteristic?.id) {
                    item.disabled = false;
                } else {
                    item.disabled =
                        description.penalties.findIndex(
                            (p: IWNPenaltyModel) =>
                                p.characteristic?.id == item.id
                        ) > -1;
                }
                characteristics.push(item);
            });
        return characteristics;
    }

    public setCharacteristic(index: number): void {
        let validatorsValue: Array<ValidatorFn> = [Validators.required];
        let characteristic: IWNCharacteristicModel = (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('characteristic').value;
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray).controls.forEach((p) => {
                p.patchValue({
                    characteristicsEnabled: [
                        ...this.updateCharacteristicsList(
                            (p as UntypedFormGroup).getRawValue()
                        ),
                    ],
                });
            });
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('choiceDeduction')
            .clearValidators();
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('choiceDeduction')
            .updateValueAndValidity();
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('value')
            .clearValidators();
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('value')
            .updateValueAndValidity();
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .patchValue({
                choiceDeduction: null,
                value:
                    null == characteristic.defaultValue
                        ? null
                        : characteristic.defaultValue,
                sign: null,
                total: null,
            });
        if (CONSTANTS.DEDUCTION_TYPE.TABLE == characteristic.deduction.type || CONSTANTS.DEDUCTION_TYPE.INPUT == characteristic.deduction.type) {
            validatorsValue.push(
                validatorNumericalRangeFormControl(
                    characteristic.deduction.min,
                    characteristic.deduction.max
                )
            );
        } else {
            (this.receivingNote.description
                .at(this.descIndex)
                .get('penalties') as UntypedFormArray)
                .at(index)
                .get('choiceDeduction')
                .setValidators(Validators.required);
            (this.receivingNote.description
                .at(this.descIndex)
                .get('penalties') as UntypedFormArray)
                .at(index)
                .get('choiceDeduction')
                .updateValueAndValidity();
        }
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('value')
            .setValidators(validatorsValue);
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('value')
            .updateValueAndValidity();
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('choiceDeduction')
            .enable();
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .get('value')
            .enable();
        this.applyDeduction();
    }

    public setDeductionSelection(index: number, value: { name: string }): void {
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .patchValue({
                value: value.name,
                sign: null,
                total: null,
            });
        this.applyDeduction();
    }

    public eventChangePenaltyValue(index: number): void {
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray)
            .at(index)
            .patchValue({ sign: null, total: null });
        this.applyDeduction();
    }

    public applyDeduction(): void {
        if (null != this.deductionsTradingStatus.refTimeout) {
            clearTimeout(this.deductionsTradingStatus.refTimeout);
            this.deductionsTradingStatus.refTimeout = null;
        }
        this.deductionsTradingStatus.refRequest.unsubscribe();
        this.deductionsTradingStatus.refRequest = new Subscription();
        this.deductionsTradingStatus.isBeingCalculated = false;
        let totalNet: number = this.receivingNote.description
            .at(this.descIndex)
            .get('totalNet').value;
        this.hideHightLimitNotification();
        if (totalNet > 0) {
            this.isEnabledChangeNote = false;
            let penalties: Array<IWNPenaltyModel> = this.getPenaltiesForTrading();
            this.calculateWeightNoteTotals(this.descIndex);
            if (penalties.length > 0) {
                this.sendRequestApply(totalNet, penalties);
            } else {
                this.isEnabledChangeNote = true;
            }
        } else {
            (this.receivingNote.description
                .at(this.descIndex)
                .get('penalties') as UntypedFormArray).controls.forEach(
                    (penaltyControls: UntypedFormGroup) => {
                        penaltyControls.patchValue({ sign: null, total: null });
                    }
                );
            this.calculateWeightNoteTotals(this.descIndex);
        }
    }

    private getPenaltiesForTrading(): Array<IWNPenaltyModel> {
        let penalties: Array<IWNPenaltyModel> = [];
        (this.receivingNote.description
            .at(this.descIndex)
            .get('penalties') as UntypedFormArray).controls.forEach((g: UntypedFormGroup) => {
                let penaltyValues: IWNPenaltyModel = g.getRawValue();
                if (
                    CONSTANTS.DEDUCTION_TYPE.TABLE ==
                    penaltyValues.characteristic?.deduction?.type ||
                    CONSTANTS.DEDUCTION_TYPE.INPUT ==
                    penaltyValues.characteristic?.deduction?.type
                ) {
                    penaltyValues.value = convertStringToNumber(
                        penaltyValues.value
                    ).toString();
                }
                if (
                    penaltyValues.characteristic &&
                    (CONSTANTS.DEDUCTION_TYPE.TABLE ==
                        penaltyValues.characteristic.deduction?.type ||
                        CONSTANTS.DEDUCTION_TYPE.INPUT ==
                        penaltyValues.characteristic.deduction?.type ||
                        (CONSTANTS.DEDUCTION_TYPE.CHOICE ==
                            penaltyValues.characteristic.deduction?.type &&
                            null != penaltyValues.choiceDeduction)) &&
                    null != penaltyValues.value &&
                    '' != penaltyValues.value &&
                    '-' != penaltyValues.value &&
                    '+' != penaltyValues.value &&
                    null == g.get('value').errors
                ) {
                    penalties.push(penaltyValues);
                } else {
                    g.patchValue({ sign: null, total: null });
                }
            });
        return penalties;
    }

    private sendRequestApply(
        totalNet: number,
        penalties: Array<IWNPenaltyModel>
    ): void {
        this.deductionsTradingStatus.isBeingCalculated = true;
        this.deductionsTradingStatus.refTimeout = setTimeout(() => {
            let deductionsTrading: IWNDeductionsTradingModel = new WNDeductionsTradingModel(
                { weight: totalNet, penalties: penalties }
            );
            this.deductionsTradingStatus.refRequest.add(
                this._weightService
                    .applyDeductions(deductionsTrading)
                    .subscribe(
                        (response: any) => {
                            if (
                                response.data.timestamp >
                                this.deductionsTradingStatus.timestamp
                            ) {
                                this.deductionsTradingStatus.timestamp =
                                    response.data.timestamp;
                                let totalPercentCharacteristics = 0;
                                (this.receivingNote.description
                                    .at(this.descIndex)
                                    .get(
                                        'penalties'
                                    ) as UntypedFormArray).controls.forEach(
                                        (c: UntypedFormGroup) => {
                                            let idx: number = response.data.deductions.findIndex(
                                                (v: any) => v.id == c.get('characteristic').value?.deduction?.id
                                            );

                                            if (idx > -1) {
                                                if (
                                                    c.get('characteristic').value.deduction.type
                                                    == this.CONSTANTS.DEDUCTION_TYPE.TABLE ||
                                                    c.get('characteristic').value.deduction.type
                                                    == this.CONSTANTS.DEDUCTION_TYPE.INPUT
                                                ) {
                                                    if(this.getDeductionsAllowAction(c.get('characteristic').value) !== this.DEDUCTIONS_ALLOW_ACTIONS.NO_ACTION) {
                                                        totalPercentCharacteristics += parseFloat(response.data.deductions[idx].value);
                                                    }
                                                } else if (
                                                    c.get('characteristic').value.deduction.type
                                                    == this.CONSTANTS.DEDUCTION_TYPE.CHOICE
                                                ) {
                                                    let option: IWNOptionChoiceDeductionModel = c.get('characteristic').value.deduction?.options.find(
                                                        (o: IWNOptionChoiceDeductionModel) => o.name == response.data.deductions[idx].value
                                                    )
                                                    if (option) {
                                                        let percent = 100 - option.coefficient;
                                                        totalPercentCharacteristics += percent;
                                                    }
                                                }
                                                let totalPenalty: number = truncateDecimals(
                                                    response.data.deductions[idx]
                                                        .total,
                                                    this.DECIMAL_DIGITS
                                                );
                                                c.patchValue({
                                                    sign:
                                                        response.data.deductions[
                                                            idx
                                                        ].sign,
                                                    total: totalPenalty,
                                                });
                                            }
                                        }
                                    );
                                this.receivingNote.description.at(this.descIndex).patchValue(
                                    { totalPercentCharacteristics: totalPercentCharacteristics }
                                )
                                this.calculateWeightNoteTotals(this.descIndex);
                                this.deductionsTradingStatus.isBeingCalculated = false;
                                this.isEnabledChangeNote = true;
                            }
                        },
                        (error: HttpErrorResponse) => {
                            let message = this._errorHandlerService.handleError(
                                error,
                                't-weight-note'
                            );
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                message
                            );
                            this.deductionsTradingStatus.isBeingCalculated = false;
                            this.isEnabledChangeNote = true;
                        }
                    )
            );
        }, 600);
    }

    private clearStateCommodityContainer(): void {
        this.hideHightLimitNotification();
        this._containersSubscription.unsubscribe();
        this._containersSubscription = new Subscription();
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ isLoadingContainers: false });
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ container: null });
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ containersByCommodityTransformation: [] });
        this.receivingNote.description
            .at(this.descIndex)
            .get('container')
            .disable();
    }

    private clearStateTransformationType(): void {
        this._transformationsSubscription.unsubscribe();
        this._transformationsSubscription = new Subscription();
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ commodityTransformation: null });
    }

    private clearStateCommodityType(): void {
        this._commodityTypesSubscription.unsubscribe();
        this._commodityTypesSubscription = new Subscription();
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ isLoadingCommodityTypes: false });
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ commodityType: null });
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ commodityTypesByCommodity: [] });
        this.receivingNote.description
            .at(this.descIndex)
            .get('commodityType')
            .disable();
        this.clearCharacteristics();
    }

    public setCommodity(value: IWNCommodityModel): void {
        // Clear commodity containers
        this.clearStateCommodityContainer();
        // Clear commodity transformations
        this.clearStateTransformationType();
        // Clear commodity type
        this.clearStateCommodityType();
        // init commodity type
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ isLoadingCommodityTypes: true });
        this.receivingNote.description
            .at(this.descIndex)
            .get('commodityType')
            .enable();
        this.getCommodityTypes(null, false);
    }

    public setCommodityType(value: IWNCommodityTypeModel): void {
        // Clear commodity containers
        this.clearStateCommodityContainer();
        // Clear commodity transformations
        this.clearStateTransformationType();
        this.clearCharacteristics();
        // Set transformation type value
        this.receivingNote.description.at(this.descIndex).patchValue({
            commodityTransformation: new WNCommodityTransformationModel({
                id: value.transformationTypeId,
                name: value.transformationTypeName,
            }),
        });
        // Get data
        this.getDataByCommodityType();
    }

    public setContainer(value: IWNContainerModel): void {
        this.hideHightLimitNotification();
    }

    public setContract(value: string) {
        this.receivingNote.information.patchValue({ contractId: value })
    }

    public clearContract() {
        this.receivingNote.information.patchValue({ contractId: null });
        this.receivingNote.information.get('contractId').updateValueAndValidity();
    }

    private getDataByCommodityType(): void {
        this.isEnabledChangeNote = false;
        let commodityId: number = this.receivingNote.description
            .at(this.descIndex)
            .get('commodity').value.id;

        let params = `commodities[]=${commodityId}`;
        this.receivingNote.description.at(this.descIndex).patchValue({
            isLoadingContainers: true,
            isLoadingCharacteristics: true,
            characteristicsWasLoaded: false,
        });
        this.receivingNote.description
            .at(this.descIndex)
            .get('container')
            .enable();
        this._weightSubscription.add(
            forkJoin([
                this._weightService.getWarehouse(
                    this.receivingNote.description
                        .at(this.descIndex)
                        .get('commodityTransformation').value.id,
                    null,
                    false
                ),
                this._weightService.getCharacteristics(params),
            ]).subscribe(
                ([containers, characteristics]) => {
                    this.receivingNote.description
                        .at(this.descIndex)
                        .patchValue({
                            containersByCommodityTransformation: containers,
                            characteristics: characteristics,
                            isLoadingContainers: false,
                        });
                    characteristics.forEach((characteristic, i) => {
                        if (characteristic.mandatory) {
                            let penalty: any = new WNPenaltyModel({ characteristic: characteristic, characteristicsEnabled: [characteristic] });
                            (this.receivingNote.description
                                .at(this.descIndex)
                                .get('penalties') as UntypedFormArray).push(
                                    this.createPenaltyFormGroup(penalty)
                                );
                        }
                    });
                    const choiceByCommodityType = characteristics.length > 0 ? characteristics[characteristics
                        .findIndex(c => c.deduction.options.length > 0)]
                        .deduction.options
                        .find(o => cleanWord(this.receivingNote.description.at(this.descIndex).get('commodityType').value.transformationTypeName).includes(cleanWord(o.name))) : null;
                    (this.receivingNote.description
                        .at(this.descIndex)
                        .get('penalties') as UntypedFormArray).controls.forEach(
                            (p, i) => {
                                this.setCharacteristic(i);
                                p.get('characteristic').enable();
                                if (p.get('characteristic').value) {
                                    // Set default value in choice type deduction
                                    p.get('value').patchValue(0);
                                    const isChoiceDeduction = p.get('characteristic').value.deduction.type === CONSTANTS.DEDUCTION_TYPE.CHOICE;
                                    if (isChoiceDeduction && choiceByCommodityType) {
                                        p.get('choiceDeduction').patchValue(choiceByCommodityType);
                                        this.setDeductionSelection(i, choiceByCommodityType);
                                        this.applyDeduction();
                                    }
                                    p.get('value').enable();
                                    p.get('value').markAsDirty();
                                    p.get('choiceDeduction').markAsDirty();
                                }

                            }
                        );

                    this.receivingNote.description
                        .at(this.descIndex)
                        .patchValue({
                            isLoadingCharacteristics: false,
                            characteristicsWasLoaded: true,
                        });
                    this.isEnabledChangeNote = true;
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.receivingNote.description
                        .at(this.descIndex)
                        .patchValue({
                            isLoadingCharacteristics: false,
                            isLoadingContainers: false,
                        });
                    this.isEnabledChangeNote = true;
                }
            )
        );
    }

    private getCommodityTypes(uri: string, onSearchEvent: boolean): void {
        this.isEnabledChangeNote = false;
        this._commodityTypesSubscription.add(
            this._weightService
                .getCommodityTypes(
                    this.receivingNote.description
                        .at(this.descIndex)
                        .get('commodity').value.id,
                    uri,
                    onSearchEvent
                )
                .subscribe(
                    (response: Array<IWNCommodityTypeModel>) => {
                        if (response) {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({
                                    commodityTypesByCommodity: response,
                                });
                        } else {
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('unidentified-problem')
                            );
                        }
                        this.receivingNote.description
                            .at(this.descIndex)
                            .patchValue({ isLoadingCommodityTypes: false });
                        this.isEnabledChangeNote = true;
                    },
                    (error: HttpErrorResponse) => {
                        let message: string = this._errorHandlerService.handleError(
                            error,
                            't-weight-note'
                        );
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            message
                        );
                        this.receivingNote.description
                            .at(this.descIndex)
                            .patchValue({ isLoadingCommodityTypes: false });
                        this.isEnabledChangeNote = true;
                    }
                )
        );
    }

    private getCommodities(uri: string, onSearchEvent: boolean): void {
        this._weightSubscription.add(
            this._weightService.getCommodities(uri, onSearchEvent).subscribe(
                (response: Array<IWNCommodityModel>) => {
                    if (response) {
                        const defaultIndex = this.findDefaultCommodity(response);
                        this.commodities = response;
                        if (this.commodities.length > 0 && !this.isEditing) {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({ commodity: this.commodities[defaultIndex] });
                            this.setCommodity(this.commodities[defaultIndex])
                        }
                    } else {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                    }
                    this.isLoadingCommodities = false;
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.isLoadingCommodities = false;
                }
            )
        );
    }

    private findDefaultCommodity(commoditys: Array<IWNCommodityModel>): number {
        const { receivingDefaultCommodityId } = this.configuration;
        const index = commoditys.findIndex((item) => receivingDefaultCommodityId === item.id);
        return index != -1 ? index : 0;
    }

    private getConfiguration(): void {
        this.blockUILayout.start();
        this._purchaseOrderService.getConfiguration()
            .pipe(take(1))
            .subscribe(
                (configuration) => {
                    this.configuration = configuration;
                    this.isLoadConfiguration = false;
                    this.blockUILayout.stop();
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUILayout.stop();
                }
            )
    }

    public setSeason(value: IWNSeasonModel): void {
        this.receivingNote.description.controls.forEach((d: UntypedFormGroup) => {
            let weightNote: IWNDescriptionModel = d.getRawValue();
            weightNote.allowedMaxDate = moment(value.endDate).isSameOrBefore(
                weightNote.todayDate
            )
                ? value.endDate
                : weightNote.todayDate;
            d.get('date').clearValidators();
            d.patchValue({ allowedMaxDate: weightNote.allowedMaxDate });
            d.get('date').setValidators([
                Validators.required,
                validatorMinDateFormControl(value?.startDate),
                validatorMaxDateFormControl(weightNote.allowedMaxDate),
            ]);
            d.get('date').updateValueAndValidity();
        });
    }

    public clearProducer(event) {
        this.receivingNote.information.patchValue({ producer: null })
    }

    public setSeller(value: IWNSellerModel): void {
        this.isSelectedProducer = !!value;

        // Add seller to list
        if (
            -1 ==
            this.sellersPaginator.initialSellers.findIndex(
                (seller: IWNSellerModel) => seller.id == value.id
            )
        ) {
            this.sellersPaginator.initialSellers.push(value);
        }
        // Cancel certifications request
        this.cancelCertificationsRequest();
        this.receivingNote.information.get('contractId').reset();
        // Reset certifications, block and farm status for all weight notes
        this.receivingNote.description.controls.forEach(
            (d: AbstractControl) => {
                // Set default value
                d.patchValue({
                    farm: null,
                    block: null,
                    blocksByFarm: [],
                    cacheBlocksByFarm: [],
                    certifications: [],
                    showCertificationControls: false,
                });
                // Update enable status for farm and blocks
                if (this.isSelectedProducer) {
                    d.get('farm').enable();
                    d.get('block').enable();
                } else {
                    d.get('farm').disable();
                    d.get('block').disable();
                }
                this.updateFarmAndBlockRequiredValidator(d);
            }
        );
        if (this.isSelectedProducer) {
            // Set farms by producer
            this.farmsByProducer = sortByStringValue([...value.farms], 'name');
            this.cacheFarmsByProducer = sortByStringValue(
                [...value.farms],
                'name'
            );
            if (this.farmsByProducer.length > 0) {
                let farm = this.farmsByProducer[0];
                this.receivingNote.description.at(this.descIndex).patchValue({
                    farm: { ...farm }
                });
                this.setFarm(farm);
            } else {
                // Get certifications
                this.getCertifications(true);
                // // Get blocks
                this.getBlocks(true);
            }
            // Get contracts
            this._getContracts(value.id);
        }
    }

    private _getContracts(producerId: number, contractId?: string) {
        this.isLoadingProducerContracts = true;
        this._weightService.getContractsByProducer(producerId)
            .pipe(take(1))
            .subscribe(
                (response: IContractTrumodityModel[]) => {
                    this.producerContracts = response.map(c => c.id);
                    this.isLoadingProducerContracts = false;
                    if (this.isAllowedEditGeneralInformation) {
                        this.receivingNote.information.get('contractId').enable();
                    }
                    if (contractId) {
                        let contractIndex = this.producerContracts.findIndex(c => c == contractId);
                        if (contractIndex == -1) {
                            this.producerContracts.push(contractId);
                        }
                    }
                },
                (error: HttpErrorResponse) => {
                    if (this.isAllowedEditGeneralInformation) {
                        this.receivingNote.information.get('contractId').enable();
                    }
                    this.producerContracts = [];
                    this.receivingNote.information.get('contractId').reset();
                    this.isLoadingProducerContracts = false;
                }
            )
    }

    /**
     * Method called when the value of the checkbock control delivery by producer is changed
     * @param event of MatCheckbox control
     */
    public onDeliveryByProducerChange(event: MatCheckboxChange): void {
        if (event.checked) {
            this.receivingNote.description
                .at(this.descIndex)
                .get('driver')
                .disable();
            this.receivingNote.description
                .at(this.descIndex)
                .get('truck')
                .disable();
            this.receivingNote.description
                .at(this.descIndex)
                .patchValue({ driver: null, truck: null });
        } else {
            this.receivingNote.description
                .at(this.descIndex)
                .get('driver')
                .enable();
            this.receivingNote.description
                .at(this.descIndex)
                .get('truck')
                .enable();
        }
    }

    public setDriver(value: IWNDriverModel): void {
        if (
            -1 ==
            this.driversPaginator.initialDrivers.findIndex(
                (d: IWNDriverModel) => d.id == value.id
            )
        ) {
            this.driversPaginator.initialDrivers.push(value);
        }
    }

    public clearContainer() {
        this.receivingNote.description.at(this.descIndex).patchValue({ container: null })
        this.receivingNote.description.at(this.descIndex).get('container').updateValueAndValidity();
    }

    public clearCommodity() {
        // Clear commodity containers
        this.clearStateCommodityContainer();
        // Clear commodity transformations
        this.clearStateTransformationType();
        // Clear commodity type
        this.clearStateCommodityType();
        this.receivingNote.description.at(this.descIndex).patchValue({ commodity: null })
        this.receivingNote.description.at(this.descIndex).get('commodity').updateValueAndValidity();
    }

    public clearCommodityType() {
        this.clearStateCommodityContainer();
        // Clear commodity transformations
        this.clearStateTransformationType();
        this.clearCharacteristics();
        this.receivingNote.description.at(this.descIndex).patchValue({ commodityType: null })
        this.receivingNote.description.at(this.descIndex).get('commodityType').updateValueAndValidity();
    }

    public clearDriver() {
        this.receivingNote.description.at(this.descIndex).patchValue({ driver: null })
        this.receivingNote.description.at(this.descIndex).get('driver').updateValueAndValidity();
    }

    public clearDeductionSelection(index, event) {
        (this.receivingNote.description.at(this.descIndex).get('penalties') as UntypedFormArray).at(index).patchValue({ value: null, sign: null, total: null, });
        (this.receivingNote.description.at(this.descIndex).get('penalties') as UntypedFormArray).at(index).get('choiceDeduction').setErrors({ "required": true });
        (this.receivingNote.description.at(this.descIndex).get('penalties') as UntypedFormArray).updateValueAndValidity();;
    }

    public setTruck(value: IWNTruckModel): void {
        if (
            -1 ==
            this.trucksPaginator.initialTrucks.findIndex(
                (t: IWNTruckModel) => t.id == value.id
            )
        ) {
            this.trucksPaginator.initialTrucks.push(value);
        }
    }

    public clearTruck() {
        this.receivingNote.description.at(this.descIndex).patchValue({ truck: null })
        this.receivingNote.description.at(this.descIndex).get('truck').updateValueAndValidity();
    }

    // Seller request functionality
    public searchSellerFunction(term: string, item: IWNSellerModel): boolean {
        let searchText: string = removeAccents(term.toLowerCase());
        return removeAccents(item.fullName.toLowerCase()).includes(searchText);
    }

    public onSellerScrollToEnd(): void {
        if (
            this.sellersPaginator.nextPageUrl &&
            !this.sellersPaginator.isDataLoading &&
            !this.sellersPaginator.isExecutingSearch
        ) {
            this.getSellers(
                this.sellersPaginator.nextPageUrl,
                this.sellersPaginator.searchTerm.length > 0
            );
        }
    }

    public onChangeSearchSeller(
        term: string,
        fromOnClose: boolean = false
    ): void {
        if (null != this.refTimeoutSellersRequest) {
            clearTimeout(this.refTimeoutSellersRequest);
        }
        this.sellersPaginator.searchTerm = trimSpaces(term);
        this.sellersPaginator.isExecutingSearch =
            this.sellersPaginator.searchTerm.length > 0;
        this._sellerSubscription.unsubscribe();
        this._sellerSubscription = new Subscription();
        if (this.sellersPaginator.searchTerm.length > 0) {
            this.refTimeoutSellersRequest = setTimeout(() => {
                this.sellersPaginator.isExecutingSearch = false;
                this.getSellers('?q=' + this.sellersPaginator.searchTerm, true);
            }, 500);
        } else if (
            0 == this.sellersPaginator.sellers.length ||
            !this.sellersPaginator.wasInitialDataLoaded
        ) {
            this.sellersPaginator.sellers = [
                ...this.sellersPaginator.initialSellers,
            ];
            this.refTimeoutSellersRequest = setTimeout(
                () => {
                    this.sellersPaginator.isExecutingSearch = false;
                    this.getSellers(null, false);
                },
                fromOnClose ? 0 : 500
            );
        } else {
            this.sellersPaginator.isDataLoading = false;
            this.sellersPaginator.isExecutingSearch = false;
            this.sellersPaginator.sellers = [
                ...this.sellersPaginator.initialSellers,
            ];
            const initialNextPageUrl = this.sellersPaginator.initialNextPageUrl;
            this.sellersPaginator.nextPageUrl = initialNextPageUrl;
        }
    }

    public onSellerSelectClose(): void {
        if (this.sellersPaginator.searchTerm.length > 0) {
            this.onChangeSearchSeller('', true);
        } else {
            this.sellersPaginator.isExecutingSearch = false;
            this.sellersPaginator.searchTerm = '';
        }
    }

    private getSellers(uri: string, onSearchEvent: boolean): void {
        this.sellersPaginator.isDataLoading = true;
        this._sellerSubscription.add(
            this._weightService.getSellers(uri, onSearchEvent).subscribe(
                (response: IWNSellerListPaginatorModel) => {
                    if (response) {
                        this.setSellerPaginatorData(response, onSearchEvent);
                    } else {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                    }
                    this.sellersPaginator.isDataLoading = false;
                },
                (error: HttpErrorResponse) => {
                    this.sellersPaginator.isDataLoading = false;
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            )
        );
    }

    private setSellerPaginatorData(
        dataPaginator: IWNSellerListPaginatorModel,
        onSearchEvent: boolean
    ): void {
        let sellers: Array<IWNSellerModel> = onSearchEvent
            ? []
            : [...this.sellersPaginator.initialSellers];
        dataPaginator.sellers.forEach((newSeller: IWNSellerModel) => {
            if (
                -1 ==
                sellers.findIndex(
                    (itemSeller: IWNSellerModel) =>
                        itemSeller.id == newSeller.id
                )
            ) {
                sellers.push(newSeller);
            }
        });
        sellers = sortByStringValue(sellers, 'fullName');
        let paginator: IWNSellerListPaginatorModel = new WNSellerListPaginatorModel(
            {
                sellers: sellers,
                initialSellers: onSearchEvent
                    ? this.sellersPaginator.initialSellers
                    : sellers,
                nextPageUrl: dataPaginator.nextPageUrl,
                initialNextPageUrl: onSearchEvent
                    ? this.sellersPaginator.initialNextPageUrl
                    : dataPaginator.nextPageUrl,
                isDataLoading: this.sellersPaginator.isDataLoading,
                searchTerm: this.sellersPaginator.searchTerm,
                isExecutingSearch: this.sellersPaginator.isExecutingSearch,
                wasInitialDataLoaded: onSearchEvent
                    ? this.sellersPaginator.wasInitialDataLoaded
                    : true,
            }
        );
        this.sellersPaginator = paginator;
    }

    // Driver request functionality
    public searchDriverFunction(term: string, item: IWNDriverModel): boolean {
        let searchText: string = removeAccents(term.toLowerCase());
        return removeAccents(item.fullName.toLowerCase()).includes(searchText);
    }

    public onDriverScrollToEnd(): void {
        if (
            this.driversPaginator.nextPageUrl &&
            !this.driversPaginator.isDataLoading &&
            !this.driversPaginator.isExecutingSearch
        ) {
            this.getDrivers(
                this.driversPaginator.nextPageUrl,
                false,
                { q: this.driversPaginator.searchTerm }
            );
        }
    }

    public onChangeSearchDriver(
        term: string,
        fromOnClose: boolean = false
    ): void {
        if (null != this.refTimeoutDriversRequest) {
            clearTimeout(this.refTimeoutDriversRequest);
        }
        this.driversPaginator.searchTerm = trimSpaces(term);
        this.driversPaginator.isExecutingSearch =
            this.driversPaginator.searchTerm.length > 0;
        this._driverSubscription.unsubscribe();
        this._driverSubscription = new Subscription();
        if (this.driversPaginator.searchTerm.length > 0) {
            this.refTimeoutDriversRequest = setTimeout(() => {
                this.driversPaginator.isExecutingSearch = false;
                this.getDrivers(null, true, { q: this.driversPaginator.searchTerm });
            }, 500);
        } else if (
            0 == this.driversPaginator.drivers.length ||
            !this.driversPaginator.wasInitialDataLoaded
        ) {
            this.driversPaginator.drivers = [
                ...this.driversPaginator.initialDrivers,
            ];
            this.refTimeoutDriversRequest = setTimeout(
                () => {
                    this.driversPaginator.isExecutingSearch = false;
                    this.getDrivers(null, false);
                },
                fromOnClose ? 0 : 500
            );
        } else {
            this.driversPaginator.isDataLoading = false;
            this.driversPaginator.isExecutingSearch = false;
            this.driversPaginator.drivers = [
                ...this.driversPaginator.initialDrivers,
            ];
            const initialNextPageUrl = this.driversPaginator.initialNextPageUrl;
            this.driversPaginator.nextPageUrl = initialNextPageUrl;
        }
    }

    public onDriverSelectClose(): void {
        if (this.driversPaginator.searchTerm.length > 0) {
            this.onChangeSearchDriver('', true);
        } else {
            this.driversPaginator.isExecutingSearch = false;
            this.driversPaginator.searchTerm = '';
        }
    }

    private getDrivers(uri: string, onSearchEvent: boolean, params: any = null): void {
        this.driversPaginator.isDataLoading = true;
        this._driverSubscription.add(
            this._weightService.getDrivers(uri, params).subscribe(
                (response: IWNDriverListPaginatorModel) => {
                    if (response) {
                        this.setDriverPaginatorData(response, onSearchEvent);
                    } else {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                    }
                    this.driversPaginator.isDataLoading = false;
                },
                (error: HttpErrorResponse) => {
                    this.driversPaginator.isDataLoading = false;
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            )
        );
    }

    private setDriverPaginatorData(
        dataPaginator: IWNDriverListPaginatorModel,
        onSearchEvent: boolean
    ): void {
        let drivers: Array<IWNDriverModel> = [
            ...this.driversPaginator.initialDrivers,
        ];
        dataPaginator.drivers.forEach((newDriver: IWNDriverModel) => {
            if (
                -1 ==
                drivers.findIndex(
                    (itemDriver: IWNDriverModel) =>
                        itemDriver.id == newDriver.id
                )
            ) {
                drivers.push(newDriver);
            }
        });
        drivers = sortByStringValue(drivers, 'fullName');
        let paginator: IWNDriverListPaginatorModel = new WNDriverListPaginatorModel(
            {
                drivers: onSearchEvent ? dataPaginator.drivers : drivers,
                initialDrivers: onSearchEvent
                    ? this.driversPaginator.initialDrivers
                    : drivers,
                nextPageUrl: dataPaginator.nextPageUrl,
                initialNextPageUrl: onSearchEvent
                    ? this.driversPaginator.initialNextPageUrl
                    : dataPaginator.nextPageUrl,
                isDataLoading: this.driversPaginator.isDataLoading,
                searchTerm: this.driversPaginator.searchTerm,
                isExecutingSearch: this.driversPaginator.isExecutingSearch,
                wasInitialDataLoaded: onSearchEvent
                    ? this.driversPaginator.wasInitialDataLoaded
                    : true,
            }
        );
        this.driversPaginator = paginator;
    }

    // Truck request functionality
    public searchTruckFunction(term: string, item: IWNTruckModel): boolean {
        let searchText: string = removeAccents(term.toLowerCase());
        return removeAccents(item.name.toLowerCase()).includes(searchText);
    }

    public onTruckScrollToEnd(): void {
        if (
            this.trucksPaginator.nextPageUrl &&
            !this.trucksPaginator.isDataLoading &&
            !this.trucksPaginator.isExecutingSearch
        ) {
            this.getTrucks(
                this.trucksPaginator.nextPageUrl,
                false,
                {}
            );
        }
    }

    public onChangeSearchTruck(
        term: string,
        fromOnClose: boolean = false
    ): void {
        if (null != this.refTimeoutTrucksRequest) {
            clearTimeout(this.refTimeoutTrucksRequest);
        }
        this.trucksPaginator.searchTerm = trimSpaces(term);
        this.trucksPaginator.isExecutingSearch =
            this.trucksPaginator.searchTerm.length > 0;
        this._truckSubscription.unsubscribe();
        this._truckSubscription = new Subscription();
        if (this.trucksPaginator.searchTerm.length > 0) {
            this.trucksPaginator.isExecutingSearch = false;
            this.getTrucks(null, true, {
                q: this.trucksPaginator.searchTerm, search_field: CONSTANTS.TYPE_TRUCK_SEARCH_FIELD.LICENSE
            });

        }
        else if (
            0 == this.trucksPaginator.trucks.length ||
            !this.trucksPaginator.wasInitialDataLoaded
        ) {
            this.trucksPaginator.trucks = [
                ...this.trucksPaginator.initialTrucks,
            ];
            this.refTimeoutTrucksRequest = setTimeout(
                () => {
                    this.trucksPaginator.isExecutingSearch = false;
                    this.getTrucks(null, false);
                },
                fromOnClose ? 0 : 500
            );
        } else {
            this.trucksPaginator.isDataLoading = false;
            this.trucksPaginator.isExecutingSearch = false;
            this.trucksPaginator.trucks = [
                ...this.trucksPaginator.initialTrucks,
            ];
            const initialNextPageUrl = this.trucksPaginator.initialNextPageUrl;
            this.trucksPaginator.nextPageUrl = initialNextPageUrl;
        }
    }

    public onTruckSelectClose(): void {
        if (this.trucksPaginator.searchTerm.length > 0) {
            this.onChangeSearchTruck('', true);
        } else {
            this.trucksPaginator.isExecutingSearch = false;
            this.trucksPaginator.searchTerm = '';
        }
    }

    private getTrucks(uri: string, onSearchEvent: boolean, params: any = null): void {
        this.trucksPaginator.isDataLoading = true;
        this._truckSubscription.add(
            this._weightService.getTrucks(uri, params).subscribe(
                (response: IWNTruckListPaginatorModel) => {
                    if (response) {
                        this.setTruckPaginatorData(response, onSearchEvent);
                    } else {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                    }
                    this.trucksPaginator.isDataLoading = false;
                },
                (error: HttpErrorResponse) => {
                    this.trucksPaginator.isDataLoading = false;
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            )
        );
    }

    private setTruckPaginatorData(
        dataPaginator: IWNTruckListPaginatorModel,
        onSearchEvent: boolean
    ): void {
        let trucks: Array<IWNTruckModel> = [
            ...this.trucksPaginator.initialTrucks,
        ];
        dataPaginator.trucks.forEach((newTruck: IWNTruckModel) => {
            if (
                -1 ==
                trucks.findIndex(
                    (itemTruck: IWNTruckModel) => itemTruck.id == newTruck.id
                )
            ) {
                trucks.push(newTruck);
            }
        });
        trucks = sortByStringValue(trucks, 'name');
        let paginator: IWNTruckListPaginatorModel = new WNTruckListPaginatorModel(
            {
                trucks: onSearchEvent ? dataPaginator.trucks : trucks,
                initialTrucks: onSearchEvent
                    ? this.trucksPaginator.initialTrucks
                    : trucks,
                nextPageUrl: dataPaginator.nextPageUrl,
                initialNextPageUrl: onSearchEvent
                    ? this.trucksPaginator.initialNextPageUrl
                    : dataPaginator.nextPageUrl,
                isDataLoading: this.trucksPaginator.isDataLoading,
                searchTerm: this.trucksPaginator.searchTerm,
                isExecutingSearch: this.trucksPaginator.isExecutingSearch,
                wasInitialDataLoaded: onSearchEvent
                    ? this.trucksPaginator.wasInitialDataLoaded
                    : true,
            }
        );
        this.trucksPaginator = paginator;
    }

    public onResizeReceivingNote(event: ResizedEvent): void {
        this.checkStatusCertificationsControls();
    }

    private checkIfAllowedCloseReceivingNote() {
        this.isAllowedCloseReceivingNote =
            this.receivingNote.information.get('status').value == this.RECEIVING_NOTE_STATUS.OPEN
            && this.receivingNote.description.controls.findIndex(
                (d) => this.WEIGHT_NOTE_STATUS.OPEN == d.get('status').value
            ) == -1;
    }

    public saveAndExit(): void {
        this.isDisabledSaveAndExitBtn = true;
        if (null == this.receivingNote.information.get('id').value) {
            this.createReceivingNoteAndExit();
        } else {
            this.editReceivingNoteAndExit();
        }
    }

    private formatDescriptionValues(
        description: IWNDescriptionModel
    ): IWNDescriptionModel {
        description.weights.forEach((w: IWNWeightModel) => {
            w.sacksNumber = convertStringToNumber(
                ('' == w.sacksNumber?.toString() ? null : w.sacksNumber) as any,
                true
            );
            w.grossWeight = convertStringToNumber(
                ('' == w.grossWeight?.toString() ? null : w.grossWeight) as any,
                true
            );
            w.tare = convertStringToNumber(
                ('' == w.tare?.toString() ? null : w.tare) as any,
                true
            );
            w.featuredWeight = convertStringToNumber(
                w.featuredWeight?.toString(),
                true
            );
        });
        description.penalties.forEach((p: IWNPenaltyModel) => {
            p.total = convertStringToNumber(p.total?.toString(), true);
        });
        return description;
    }

    private getReceivingNoteValue(
        filterByValidDescription: boolean = false
    ): IReceivingNoteModel {
        let receivingNoteValue: IReceivingNoteModel = new ReceivingNoteModel();
        receivingNoteValue.information = this.receivingNote.information.getRawValue();
        receivingNoteValue.description = [];
        if (filterByValidDescription) {
            this.receivingNote.description.controls.forEach((d: UntypedFormGroup) => {
                if (d.valid) {
                    receivingNoteValue.description.push(d.getRawValue());
                }
            });
        } else {
            receivingNoteValue.description = this.receivingNote.description.getRawValue();
        }
        for (let d = 0; d < receivingNoteValue.description.length; d++) {
            receivingNoteValue.description[d] = this.formatDescriptionValues(
                receivingNoteValue.description[d]
            );
        }
        return receivingNoteValue;
    }

    public createReceivingNoteAndExit(): void {
        this.blockUILayout.start();
        let requestData: IWNRequestActionReceivingNoteModel = new WNRequestActionReceivingNoteModel(
            this.getReceivingNoteValue()
        );
        if (this.receivingNote.description.hasError('notModified')) {
            requestData.weight_notes[0].weights = [];
            requestData.weight_notes[0].weight_notes_panalties = [];
            requestData.weight_notes[0].production_tank_id = null;
        }
        this._weightSubscription.add(
            this._weightService.saveNote(requestData).subscribe(
                (result: any) => {
                    this._notifierService.notify(
                        'success',
                        this._i18nPipe.transform('t-receiving-note-created')
                    );
                    this.blockUILayout.stop();
                    this.isDisabledSaveAndExitBtn = false;
                    this._router.navigate(['/routes/weight-note/'], { queryParams: this.queryParams });
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUILayout.stop();
                    this.isDisabledSaveAndExitBtn = false;
                }
            )
        );
    }

    public editWeightNoteClosed() {
        this.blockUILayout.start();
        this._dialog.open(
            EditWeightNoteComponent,
            { data: this.receivingNote.description.at(this.descIndex).get('comments').value })
            .afterClosed()
            .pipe(take(1))
            .subscribe(
                comment => {
                    if (comment && comment != '') {
                        this.receivingNote.description.at(this.descIndex).patchValue({ comment: comment });
                        let requestData: IWNRequestActionReceivingNoteModel = new WNRequestActionReceivingNoteModel(
                            this.getReceivingNoteValue()
                        );
                        this._weightService.editNote(requestData)
                            .pipe(take(1))
                            .subscribe(
                                (result: any) => {
                                    this._notifierService.notify(
                                        'success',
                                        this._i18nPipe.transform('weight-note-edited')
                                    );
                                    this.blockUILayout.stop();
                                    this.isDisabledSaveAndExitBtn = false;
                                },
                                (error: HttpErrorResponse) => {
                                    let message: string = this._errorHandlerService.handleError(
                                        error,
                                        't-weight-note'
                                    );
                                    this._alertService.errorTitle(
                                        this._i18nPipe.transform('error-msg'),
                                        message
                                    );
                                    this.blockUILayout.stop();
                                    this.isDisabledSaveAndExitBtn = false;
                                }
                            )
                    } else {
                        this.blockUILayout.stop();
                    }
                }
            )
    }

    public editReceivingNoteAndExit(): void {
        this.blockUILayout.start();
        let requestData: IWNRequestActionReceivingNoteModel = new WNRequestActionReceivingNoteModel(
            this.getReceivingNoteValue()
        );
        if (this.receivingNote.description.hasError('notModified')) {
            requestData.weight_notes[0].weights = [];
            requestData.weight_notes[0].weight_notes_panalties = [];
            requestData.weight_notes[0].production_tank_id = null;
        }
        if (this.RECEIVING_NOTE_STATUS.CLOSED ==
            this.receivingNote.information.get('status').value && this._isAllowedEditProducer) {
            let data = new ReceivingCloseUpdateRequestModel(requestData)
            this._weightService.updateCloseReceptionNote(data, requestData.id)
                .pipe(take(1))
                .subscribe(
                    (result: any) => {
                        this._notifierService.notify(
                            'success',
                            this._i18nPipe.transform('t-receiving-note-edited')
                        );
                        this.blockUILayout.stop();
                        this.isDisabledSaveAndExitBtn = false;
                        this._router.navigate(['/routes/weight-note/'], { queryParams: this.queryParams });
                    },
                    (error: HttpErrorResponse) => {
                        let message: string = this._errorHandlerService.handleError(
                            error,
                            't-weight-note'
                        );
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            message
                        );
                        this.blockUILayout.stop();
                        this.isDisabledSaveAndExitBtn = false;
                    }
                )
        } else {
            this._weightSubscription.add(
                this._weightService.editNote(requestData).subscribe(
                    (result: any) => {
                        this._notifierService.notify(
                            'success',
                            this._i18nPipe.transform('t-receiving-note-edited')
                        );
                        this.blockUILayout.stop();
                        this.isDisabledSaveAndExitBtn = false;
                        this._router.navigateByUrl('/routes/weight-note');
                    },
                    (error: HttpErrorResponse) => {
                        let message: string = this._errorHandlerService.handleError(
                            error,
                            't-weight-note'
                        );
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            message
                        );
                        this.blockUILayout.stop();
                        this.isDisabledSaveAndExitBtn = false;
                    }
                )
            );
        }
    }

    public closeWeightNote(): void {
        if (null == this.receivingNote.description.at(this.descIndex).get('weightNoteId').value) {
            if (null == this.receivingNote.information.get('id').value) {
                this.createReceivingNoteAndCloseCurrentWeightNote();
            } else {
                this.addWeightNoteToReceivingNoteAndCloseWeightNote();
            }
        } else {
            this.editReceivingNoteAndCloseCurrentWeightNote();
        }
    }

    private disableDescriptionFormGroup(index: number) {
        this.receivingNote.description.at(index).disable();
        // Enable producer controls if is not in purchase order
        if (this._isAllowedEditProducer &&
            this.receivingNote.description.at(index).get('status').value != this.WEIGHT_NOTE_STATUS.DELETED) {
            this.receivingNote.description.at(index).get('farm').enable();
            this.receivingNote.description.at(index).get('block').enable();
            this.receivingNote.description.at(index).get('textNote').enable();
        }
    }

    private createReceivingNoteAndCloseCurrentWeightNote(): void {
        this.disableBtnCloseWeightNote = false;
        this.blockUILayout.start();
        let rn: IReceivingNoteModel = new ReceivingNoteModel(
            this.getReceivingNoteValue(),
            false,
            this.configuration
        );
        rn.description = [rn.description[this.descIndex]];
        let requestData: IWNRequestActionReceivingNoteModel = new WNRequestActionReceivingNoteModel(
            rn
        );
        this._weightSubscription.add(
            this._weightService.saveNote(requestData).subscribe(
                (result: any) => {
                    if (result.status) {
                        this.receivingNote.information.patchValue({
                            id: result.data.reception_id,
                            folio: result.data.folio,
                        });
                        this.receivingNote.description
                            .at(this.descIndex)
                            .patchValue({
                                indexSort:
                                    result.data.weight_notes[0]
                                        .transaction_in_id,
                                transactionInId:
                                    result.data.weight_notes[0]
                                        .transaction_in_id,
                                weightNoteId:
                                    result.data.weight_notes[0].weight_note_id,
                                status: result.data.weight_notes[0].status,
                                isDataLoadedOnEdit: true,
                            });
                        this.sortAndSelectWeightNotesFormArray(
                            'weightNoteId',
                            result.data.weight_notes[0].weight_note_id
                        );
                        this.updateDataReceivingNoteReference(
                            (this.receivingNote.description.at(
                                this.descIndex
                            ) as UntypedFormGroup).getRawValue(),
                            this.receivingNote.information.getRawValue()
                        );
                        this._isAllowedEditProducer = true;
                        this.submitRequestCloseCurrentWeightNote();
                    } else {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                        this.blockUILayout.stop();
                        this.disableBtnCloseWeightNote = false;
                    }
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUILayout.stop();
                    this.disableBtnCloseWeightNote = false;
                }
            )
        );
    }

    private addWeightNoteToReceivingNoteAndCloseWeightNote(): void {
        this.disableBtnCloseWeightNote = true;
        this.blockUILayout.start();
        let rn: IReceivingNoteModel = new ReceivingNoteModel(
            this.getReceivingNoteValue(),
            false,
            this.configuration
        );
        rn.description = [rn.description[this.descIndex]];
        let requestData: IWNRequestActionReceivingNoteModel = new WNRequestActionReceivingNoteModel(
            rn
        );
        this._weightSubscription.add(
            this._weightService.editNote(requestData).subscribe(
                (result: any) => {
                    let weightNote: Array<any> = [];
                    if (result.status) {
                        weightNote = result.data.weight_notes.filter(
                            (w: any) =>
                                -1 ==
                                this.receivingNote.description.controls.findIndex(
                                    (d: UntypedFormGroup) =>
                                        w.weight_note_id ==
                                        d.get('weightNoteId').value
                                ) &&
                                CONSTANTS.WEIGHT_NOTE_STATUS.OPEN == w.status
                        );
                        if (weightNote.length > 0) {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({
                                    transactionInId:
                                        weightNote[0].transaction_in_id,
                                    weightNoteId: weightNote[0].weight_note_id,
                                    status: weightNote[0].status,
                                    isDataLoadedOnEdit: true,
                                });
                            this.sortAndSelectWeightNotesFormArray(
                                'weightNoteId',
                                weightNote[0].weight_note_id
                            );
                            this.updateDataReceivingNoteReference(
                                (this.receivingNote.description.at(
                                    this.descIndex
                                ) as UntypedFormGroup).getRawValue(),
                                this.receivingNote.information.getRawValue()
                            );
                            this.submitRequestCloseCurrentWeightNote();
                        }
                    }
                    if (!result.status || 0 == weightNote.length) {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                        this.blockUILayout.stop();
                        this.disableBtnCloseWeightNote = false;
                    }
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUILayout.stop();
                    this.disableBtnCloseWeightNote = false;
                }
            )
        );
    }

    public editReceivingNoteAndCloseCurrentWeightNote(): void {
        this.disableBtnCloseWeightNote = true;
        this.blockUILayout.start();
        let rn: IReceivingNoteModel = new ReceivingNoteModel(
            this.getReceivingNoteValue(),
            false,
            this.configuration
        );
        rn.description = [rn.description[this.descIndex]];
        let requestData: IWNRequestActionReceivingNoteModel = new WNRequestActionReceivingNoteModel(
            rn
        );
        this._weightSubscription.add(
            this._weightService.editNote(requestData).subscribe(
                (result: any) => {
                    if (result.status) {
                        this.updateDataReceivingNoteReference(
                            (this.receivingNote.description.at(
                                this.descIndex
                            ) as UntypedFormGroup).getRawValue(),
                            this.receivingNote.information.getRawValue()
                        );
                        this.submitRequestCloseCurrentWeightNote();
                    } else {
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            this._i18nPipe.transform('unidentified-problem')
                        );
                        this.blockUILayout.stop();
                        this.disableBtnCloseWeightNote = false;
                    }
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUILayout.stop();
                    this.disableBtnCloseWeightNote = false;
                }
            )
        );
    }

    private submitRequestCloseCurrentWeightNote(): void {
        this.hideHightLimitNotification();
        if (!this.disableBtnCloseWeightNote) {
            this.disableBtnCloseWeightNote = true;
        }
        if (!this.blockUILayout.isActive) {
            this.blockUILayout.start();
        }
        let rn: IReceivingNoteModel = new ReceivingNoteModel(
            this.getReceivingNoteValue(),
            false,
            this.configuration
        );
        rn.description = [rn.description[this.descIndex]];
        rn.description[0].status = this.WEIGHT_NOTE_STATUS.CLOSED;
        this._weightSubscription.add(
            this._weightService
                .changeStatusNote(new WNRequestChangeStatusModel(rn))
                .subscribe(
                    (response: any) => {
                        if (response.status) {
                            let idxResp: number = response.data.weight_notes.findIndex(
                                (r: any) =>
                                    rn.description[0].weightNoteId ==
                                    r.weight_note_id
                            );
                            if (idxResp > -1) {
                                if (
                                    this.WEIGHT_NOTE_STATUS.CLOSED ==
                                    response.data.weight_notes[idxResp].status
                                ) {
                                    this._notifierService.notify(
                                        'success',
                                        this._i18nPipe.transform(
                                            't-weight-note-closed'
                                        )
                                    );
                                    this.isAllowedEditGeneralInformation = false;
                                    this.receivingNote.information.disable();
                                    this.receivingNote.information.get('producer').enable();
                                    this.receivingNote.information.get('contractId').enable();
                                }
                                this.receivingNote.description
                                    .at(this.descIndex)
                                    .patchValue({
                                        status:
                                            response.data.weight_notes[idxResp]
                                                .status,
                                    });
                                this.updateDataReceivingNoteReference(
                                    (this.receivingNote.description.at(
                                        this.descIndex
                                    ) as UntypedFormGroup).getRawValue()
                                );
                                this.dataWasModified = true;
                                this.checkIfAllowedCloseReceivingNote();
                                if (!this.hasPermissionToEditClosedNote) {
                                    this.disableDescriptionFormGroup(idxResp);
                                }
                                if (this.receivingNote.information.get('status').value == this.RECEIVING_NOTE_STATUS.CLOSED) {
                                    let weightNotesClosed = this.receivingNote.description.controls.findIndex(
                                        (d) => this.WEIGHT_NOTE_STATUS.OPEN == d.get('status').value) == -1;
                                    this.isDisabledSaveAndExitBtn = !weightNotesClosed;
                                }
                            }
                        } else if ('hight_limit' == response.data) {
                            this.hideHightLimitNotification();
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({ isWarningContainer: true });
                            this._notifierService.show({
                                message: this._i18nPipe
                                    .transform(
                                        'weight-note-container-hight-limit'
                                    )
                                    .replace(
                                        '[name]',
                                        this.receivingNote.description
                                            .at(this.descIndex)
                                            .get('container').value?.name
                                    ),
                                type: 'warning',
                                template: this.hightLimitContainerNotification,
                                id: 'CONTAINER_HIGHT_LIMIT',
                            });
                        } else if ('there_isnot_tank' == response.data) {
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('container-not-found')
                            );
                        } else {
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('unidentified-problem')
                            );
                        }
                        this.blockUILayout.stop();
                        this.disableBtnCloseWeightNote = false;
                    },
                    (error: HttpErrorResponse) => {
                        let message: string = this._errorHandlerService.handleError(
                            error,
                            't-weight-note'
                        );
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            message
                        );
                        this.blockUILayout.stop();
                        this.disableBtnCloseWeightNote = false;
                    }
                )
        );
    }

    public submitRequestCloseReceivingNote(): void {
        this.isDisabledCloseReceivingBtn = true;
        this.blockUILayout.start();
        let rn: IReceivingNoteModel = new ReceivingNoteModel(
            this.getReceivingNoteValue(),
            false,
            this.configuration
        );
        rn.information.status = this.RECEIVING_NOTE_STATUS.CLOSED;
        let data: IWNRequestChangeStatusModel = new WNRequestChangeStatusModel(
            rn
        );
        data.weight_notes = [];
        this._weightSubscription.add(
            this._weightService.changeStatusNote(data).subscribe(
                (response: any) => {
                    if (response.status && this.RECEIVING_NOTE_STATUS.CLOSED == response.data.is_close) {

                        this._notifierService.notify('success', this._i18nPipe.transform('t-receiving-note-closed'));
                        this.blockUILayout.stop();
                        this.isDisabledCloseReceivingBtn = false;
                        this._printReceptionNote(response.data.reception_id)
                    } else {

                        if (response.data == "no_external_id") {
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('receiving-note-close-error')
                            );
                        } else {

                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('unidentified-problem')
                            );
                        }
                        this.blockUILayout.stop();
                        this.isDisabledCloseReceivingBtn = false;
                    }
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUILayout.stop();
                    this.isDisabledCloseReceivingBtn = false;
                }
            )
        );
    }
    private async _printReceptionNote(receptionId: any) {
        this.blockUILayout.start();
        await this.getReportReceptionNote(CONSTANTS.FILE_REPORT_ACTIONS.FORMAT.PDF, receptionId);
        const byteArray = new Uint8Array(
            atob(this.file)
                .split('')
                .map((char) => char.charCodeAt(0))
        );
        let blob = new Blob([byteArray], {
            type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const agent = window.navigator.userAgent.toLowerCase()
        if (agent.indexOf('firefox') > -1) {
            window.open(url);
            this.blockUILayout.stop();
            this._router.navigateByUrl('/routes/weight-note');
        } else {
            printJS({
                printable: this.file,
                type: 'pdf',
                base64: true,
                onPrintDialogClose: () => {
                    this._router.navigateByUrl('/routes/weight-note');
                },
                onPdfOpen: () => {
                    this.blockUILayout.stop();
                }
            });
        }
    }
    public async getReportReceptionNote(format: string, receptionId: string) {
        try {
            let result = await this._weightService.reportReceptionNote(
                receptionId,
                format
            );
            this.file = format == 'pdf' ? result.data : null;
        } catch (e) {
            this._router.navigateByUrl('/routes/weight-note');
            let message: string = this._errorHandlerService.handleError(e, 'note');
            this._alertService.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
            throw e;
        }
    }

    public deleteWeightNote(): void {
        this.isDisabledDeleteWeightNoteBtn = true;
        this.blockUILayout.start();
        if (this.receivingNote.description.at(this.descIndex).get('weightNoteId').value == null) {
            this.receivingNote.description.removeAt(this.descIndex);
            this.selectNoteWeight(this.descIndex > 0 ? this.descIndex - 1 : 0);
            this.calculateReceivingNoteTotals();
            this.checkIfAllowedCloseReceivingNote();
            this.isDisabledDeleteWeightNoteBtn = false;
            this.dataWasModified = true;
            this.blockUILayout.stop();
        } else {
            if (this.receivingNote.description.at(this.descIndex).get('status').value == this.WEIGHT_NOTE_STATUS.CLOSED) {
                let dataRef = this._dialog.open(DeleteWeightNoteComponent, {
                    data: this.receivingNote.description.at(this.descIndex).get('transactionInId').value
                });
                dataRef.afterClosed()
                    .pipe(take(1))
                    .subscribe((reason: string) => {
                        if (reason && reason != '') {
                            this._deleteWeightNoteClosed(reason);
                            this.dataWasModified = true;
                        } else {
                            this.isDisabledDeleteWeightNoteBtn = false;
                        }
                        this.blockUILayout.stop();
                    })
            } else {
                this._weightService.deleteNote(this.receivingNote.description.at(this.descIndex).get('weightNoteId').value)
                    .pipe(take(1))
                    .subscribe(
                        (result: any) => {
                            let weightNoteId: string = this.receivingNote.description.at(this.descIndex).get('weightNoteId').value;
                            this.receivingNote.description.removeAt(this.descIndex);
                            this.selectNoteWeight(this.descIndex > 0 ? this.descIndex - 1 : 0);
                            this.calculateReceivingNoteTotals();
                            this.checkIfAllowedCloseReceivingNote();
                            let indxDescription: number = this.receivingNoteReference.description.findIndex(
                                (d) => weightNoteId == d.weightNoteId
                            );
                            if (indxDescription > -1) {
                                this.receivingNoteReference.description.splice(indxDescription, 1);
                                this.detectChangesOnEditReceivingNote();
                            }
                            this._notifierService.notify('success', this._i18nPipe.transform('t-weight-note-delete'));
                            this.isDisabledDeleteWeightNoteBtn = false;
                            this.dataWasModified = true;
                            this.blockUILayout.stop();
                        },
                        (error: HttpErrorResponse) => {
                            let message: string = this._errorHandlerService.handleError(error, 't-weight-note');
                            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                            this.isDisabledDeleteWeightNoteBtn = false;
                            this.blockUILayout.stop();
                        }
                    )
            }
        }
    }

    private _deleteWeightNoteClosed(reason: string) {
        this._weightService.deleteNote(this.receivingNote.description.at(this.descIndex).get('weightNoteId').value, reason)
            .pipe(take(1))
            .subscribe(
                (result: any) => {
                    let weightNoteId: string = this.receivingNote.description.at(this.descIndex).get('weightNoteId').value;
                    this.disableDescriptionFormGroup(this.descIndex)
                    this.receivingNote.description.at(this.descIndex).patchValue({
                        status: this.WEIGHT_NOTE_STATUS.DELETED,
                        deletionReason: reason
                    })
                    this.calculateReceivingNoteTotals();
                    this.checkIfAllowedCloseReceivingNote();
                    let indxDescription: number = this.receivingNoteReference.description.findIndex(
                        (d) => weightNoteId == d.weightNoteId
                    );
                    if (indxDescription > -1) {
                        this.receivingNoteReference.description.splice(indxDescription, 1);
                        this.detectChangesOnEditReceivingNote();
                    }
                    this._notifierService.notify('success', this._i18nPipe.transform('t-weight-note-void'));
                    this.isDisabledDeleteWeightNoteBtn = false;
                    this.blockUILayout.stop();
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(error, 't-weight-note');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isDisabledDeleteWeightNoteBtn = false;
                    this.blockUILayout.stop();
                }
            )
    }

    private updateFarmAndBlockRequiredValidator(
        control: AbstractControl
    ): void {
        let selectedFarm: IWNFarmModel = control.get('farm').value;
        let selectedBlock: IWNBlockModel = control.get('block').value;
        if (!!selectedFarm && !!selectedBlock) {
            control.get('farm').clearValidators();
            control.get('block').setValidators(Validators.required);
        } else if (!!selectedFarm) {
            control.get('farm').setValidators(Validators.required);
            control.get('block').clearValidators();
        } else {
            control.get('farm').clearValidators();
            control.get('block').setValidators(Validators.required);
        }
        control.get('farm').updateValueAndValidity();
        control.get('block').updateValueAndValidity();
    }

    public clearFarm(): void {
        // Cancel certifications request
        this.cancelCertificationsRequest();
        // clear farm, block and releated data
        this.receivingNote.description.at(this.descIndex).patchValue({
            farm: null,
            block: null,
            blocksByFarm: [],
            cacheBlocksByFarm: [],
            certifications: [],
            showCertificationControls: false,
        });
        // Update farm and block required validator
        this.updateFarmAndBlockRequiredValidator(
            this.receivingNote.description.at(this.descIndex)
        );
        // Get certifications
        this.getCertifications(false);
        // Get block
        this.getBlocks(false);
    }

    public async setFarm(value: IWNFarmModel): Promise<void> {
        // Cancel certifications request
        this.cancelCertificationsRequest();
        // Check if relate block to farm
        let blockSelected: IWNBlockModel = this.receivingNote.description
            .at(this.descIndex)
            .get('block').value;
        if (
            null != value &&
            null != blockSelected &&
            null == blockSelected.farmId
        ) {
            await this.relateBlockToFarm(value, blockSelected);
            let newValue: any = {
                blocksByFarm: [],
                cacheBlocksByFarm: [],
                certifications: [],
                showCertificationControls: false,
            };
            // Update controls status
            this.receivingNote.description
                .at(this.descIndex)
                .patchValue(newValue);
        } else {
            // Update controls status
            this.receivingNote.description.at(this.descIndex).patchValue({
                block: null,
                blocksByFarm: [],
                cacheBlocksByFarm: [],
                certifications: [],
                showCertificationControls: false,
            });
        }
        // Update farm and block required validator
        this.updateFarmAndBlockRequiredValidator(
            this.receivingNote.description.at(this.descIndex)
        );
        // Get certifications
        this.getCertifications(false);
        // Get block
        this.getBlocks(false);
    }

    public clearBlock(): void {

        // Cancel certifications request
        this.cancelCertificationsRequest();
        // clear block and releated data

        this.receivingNote.description.at(this.descIndex).patchValue({
            block: null,
        });

        // Get certifications
        this.getCertifications(false);
        this.receivingNote.description.at(this.descIndex).get('block').setErrors({ "requiered": true })
        this.receivingNote.description.at(this.descIndex).get('block').updateValueAndValidity()
    }

    public async setBlock(block: IWNBlockModel): Promise<void> {
        // Cancel certifications request
        this.cancelCertificationsRequest();
        // Check if relate block to farm
        let farmSelected: IWNFarmModel = this.receivingNote.description
            .at(this.descIndex)
            .get('farm').value;
        if (block && farmSelected && block.farmId != farmSelected.id) {
            await this.relateBlockToFarm(farmSelected, block);
        }
        // Update farm and block required validator
        this.updateFarmAndBlockRequiredValidator(
            this.receivingNote.description.at(this.descIndex)
        );
        // Get certifications
        this.getCertifications(false);
    }

    private relateBlockToFarm(
        farm: IWNFarmModel,
        block: IWNBlockModel
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let dialog = this._dialog.open(ModalConfirmComponent, {
                data: farm,
            });
            dialog.afterClosed().subscribe((response: boolean) => {
                if (response) {
                    this.blockUILayout.start();
                    let data: any = {
                        blocks: [{ block_id: block.id }],
                        farm_id: farm.id,
                    };
                    this._weightService.relatedBlocksWithFarms(data).then(
                        (response: any) => {
                            // Update the relation on all weight notes where block farm data matches
                            this.receivingNote.description.controls.forEach(
                                (d: AbstractControl) => {
                                    if (
                                        CONSTANTS.WEIGHT_NOTE_STATUS.OPEN ==
                                        d.get('status').value
                                    ) {
                                        let blocksByFarm: Array<IWNBlockModel> = d.get(
                                            'blocksByFarm'
                                        ).value;
                                        let findIndexBlock = blocksByFarm.findIndex(
                                            (b) => b.id == block.id
                                        );
                                        if (findIndexBlock > -1) {
                                            blocksByFarm[
                                                findIndexBlock
                                            ].farmId = farm.id;
                                            let selectedBlock: IWNBlockModel = d.get(
                                                'block'
                                            ).value;
                                            let newData: any = {
                                                blocksByFarm: [...blocksByFarm],
                                                cacheBlocksByFarm: [
                                                    ...blocksByFarm,
                                                ],
                                            };
                                            if (
                                                null != selectedBlock &&
                                                selectedBlock.id == block.id
                                            ) {
                                                newData.farm = farm;
                                                newData.block =
                                                    blocksByFarm[
                                                    findIndexBlock
                                                    ];
                                            }
                                            d.patchValue(newData);
                                        }
                                    }
                                }
                            );
                            this.blockUILayout.stop();
                            resolve(true);
                        },
                        (error: HttpErrorResponse) => {
                            let message: string = this._errorHandlerService.handleError(
                                error,
                                't-weight-note'
                            );
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                message
                            );
                            this.blockUILayout.stop();
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({ block: null });
                            resolve(false);
                        }
                    );
                } else {
                    this.receivingNote.description
                        .at(this.descIndex)
                        .patchValue({ block: null });
                    resolve(false);
                }
            });
        });
    }

    public async openModalNewElement(element: number) {
        let blocks: Array<TIBlockModel> = [];
        if (element == this.OPTIONS_MODAL.FARM) {
            blocks = await this.getBlocksAvailable();
        }
        let dialog = this._dialog.open(ModalNewComponent, {
            autoFocus: false,
            disableClose: true,
            data: {
                element: element,
                producerId: this.receivingNote.information.get('producer').value
                    ?.id,
                blocks: blocks,
                farm: this.receivingNote.description
                    .at(this.descIndex)
                    .get('farm').value,
            },
        });
        try {
            let response = await dialog.afterClosed().toPromise();
            if (response) {
                if (element == this.OPTIONS_MODAL.PRODUCER) {
                    let newProducer: IWNSellerModel = new WNSellerModel(
                        response
                    );
                    this.sellersPaginator.sellers.push(newProducer);
                    this.sellersPaginator.sellers = sortByStringValue(
                        this.sellersPaginator.sellers,
                        'fullName'
                    );
                    this.receivingNote.information.patchValue({
                        producer: newProducer,
                    });
                    this.setSeller(newProducer);
                } else if (element == this.OPTIONS_MODAL.FARM) {
                    let newFarm: IWNFarmModel = new WNFarmModel(response);
                    this.farmsByProducer.push(newFarm);
                    this.cacheFarmsByProducer.push(newFarm);
                    this.farmsByProducer = sortByStringValue(
                        this.farmsByProducer,
                        'name'
                    );
                    this.cacheFarmsByProducer = sortByStringValue(
                        this.cacheFarmsByProducer,
                        'name'
                    );
                    this.receivingNote.description
                        .at(this.descIndex)
                        .patchValue({
                            farm: newFarm,
                            block: null,
                        });
                    this.setFarm(newFarm);
                } else if (element == this.OPTIONS_MODAL.BLOCK) {
                    let newBlock: IWNBlockModel = new WNBlockModel(response);
                    let isReleatedToFarm: boolean = null != newBlock.farmId;
                    if (isReleatedToFarm) {
                        let releatedFarm: IWNFarmModel = this.farmsByProducer.find(
                            (f: IWNFarmModel) => f.id == newBlock.farmId
                        );
                        this.receivingNote.description
                            .at(this.descIndex)
                            .patchValue({ farm: releatedFarm ?? null });
                    }
                    this.receivingNote.description.controls.forEach(
                        (d: AbstractControl) => {
                            if (
                                CONSTANTS.WEIGHT_NOTE_STATUS.OPEN ==
                                d.get('status').value
                            ) {
                                let blocksByFarm: Array<IWNBlockModel> = d.get(
                                    'blocksByFarm'
                                ).value;
                                if (isReleatedToFarm) {
                                    let selectedFarm: IWNFarmModel = d.get(
                                        'farm'
                                    ).value;
                                    if (selectedFarm?.id == newBlock.farmId) {
                                        blocksByFarm.push(newBlock);
                                    }
                                } else {
                                    blocksByFarm.push(newBlock);
                                }
                                blocksByFarm = [
                                    ...sortByStringValue(blocksByFarm, 'name'),
                                ];
                                d.patchValue({
                                    blocksByFarm: blocksByFarm,
                                    cacheBlocksByFarm: [...blocksByFarm],
                                });
                            }
                        }
                    );
                    this.receivingNote.description
                        .at(this.descIndex)
                        .patchValue({ block: newBlock });
                    this.setBlock(newBlock);
                } else if (element == this.OPTIONS_MODAL.TRUCK) {
                    let newTruck: IWNTruckModel = new WNTruckModel(response);
                    this.trucksPaginator.trucks.push(newTruck);
                    this.trucksPaginator.trucks = sortByStringValue(
                        this.trucksPaginator.trucks,
                        'name'
                    );
                    this.receivingNote.description.controls[
                        this.descIndex
                    ].patchValue({ truck: newTruck });
                    this.setTruck(newTruck);
                } else if (element == this.OPTIONS_MODAL.DRIVER) {
                    let newDriver: IWNDriverModel = new WNDriverModel(response);
                    this.driversPaginator.drivers.push(newDriver);
                    this.driversPaginator.drivers = sortByStringValue(
                        this.driversPaginator.drivers,
                        'fullName'
                    );
                    this.receivingNote.description
                        .at(this.descIndex)
                        .patchValue({ driver: newDriver });
                    this.setDriver(newDriver);
                }
            }
        } catch (e) { }
    }

    public async getBlocksAvailable(): Promise<Array<TIBlockModel>> {
        try {
            let response: any = await this._weightService.getBlocksBySeller(
                this.receivingNote.information.get('producer').value?.id
            );
            let blocks: Array<TIBlockModel> = [];
            response.data.forEach((d: any) => {
                blocks.push(new TBlockModel(d));
            });
            return blocks;
        } catch (e) {
            let message: string = this._errorHandlerService.handleError(
                e,
                't-weight-note'
            );
            this._alertService.error(message);
            this.blockUILayout.stop();
        }
    }

    public getBlocks(isOnSelectSeller: boolean): void {
        let farm: IWNFarmModel = isOnSelectSeller
            ? null
            : this.receivingNote.description.at(this.descIndex).get('farm')
                .value;
        let farmId: number = farm ? farm.id : null;
        this.isEnabledChangeNote = false;
        this.isLoadingBlocks = true;
        this._weightSubscription.add(
            this._weightService
                .getBlocks(
                    farmId,
                    this.receivingNote.information.get('producer').value?.id
                )
                .subscribe(
                    (response: Array<IWNBlockModel>) => {
                        if (response) {
                            if (isOnSelectSeller) {
                                this.receivingNote.description.controls.forEach(
                                    (d: AbstractControl) => {
                                        if (
                                            CONSTANTS.WEIGHT_NOTE_STATUS.OPEN ==
                                            d.get('status').value
                                        ) {
                                            d.patchValue({
                                                blocksByFarm: [...response],
                                                cacheBlocksByFarm: [
                                                    ...response,
                                                ],
                                            });
                                        }
                                    }
                                );
                            } else {
                                this.receivingNote.description
                                    .at(this.descIndex)
                                    .patchValue({
                                        blocksByFarm: [...response],
                                        cacheBlocksByFarm: [...response],
                                    });
                                if (farmId != null) {
                                    let associatedBlocks = response.filter(block => block.farmId == farmId);
                                    if (associatedBlocks.length > 0) {
                                        let block = associatedBlocks[0];
                                        this.receivingNote.description.at(this.descIndex).patchValue({
                                            block: { ...block }
                                        });
                                        this.setBlock(block);
                                    }
                                }
                            }
                        } else {
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('unidentified-problem')
                            );
                        }
                        this.isLoadingBlocks = false;
                        this.isEnabledChangeNote = true;
                    },
                    (error: HttpErrorResponse) => {
                        let message: string = this._errorHandlerService.handleError(
                            error,
                            't-weight-note'
                        );
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            message
                        );
                        this.isLoadingBlocks = false;
                        this.isEnabledChangeNote = true;
                    }
                )
        );
    }

    public getFarmsByProducer(producerId: number) {
        this._weightSubscription.add(
            this._weightService.getFarmsByProducer(producerId).subscribe(
                (result: Array<IWNFarmModel>) => {
                    result.forEach((farm: IWNFarmModel) => {
                        if (
                            -1 ==
                            this.farmsByProducer.findIndex(
                                (f: IWNFarmModel) => farm.id == f.id
                            )
                        ) {
                            this.farmsByProducer.push(farm);
                        }
                        if (
                            -1 ==
                            this.cacheFarmsByProducer.findIndex(
                                (f: IWNFarmModel) => farm.id == f.id
                            )
                        ) {
                            this.cacheFarmsByProducer.push(farm);
                        }
                    });
                    this.farmsByProducer = sortByStringValue(
                        [...this.farmsByProducer],
                        'name'
                    );
                    this.cacheFarmsByProducer = sortByStringValue(
                        [...this.cacheFarmsByProducer],
                        'name'
                    );
                    let idxSellers: number = this.sellersPaginator.sellers.findIndex(
                        (s: IWNSellerModel) => producerId == s.id
                    );
                    let idxInitSellers: number = this.sellersPaginator.initialSellers.findIndex(
                        (s: IWNSellerModel) => producerId == s.id
                    );
                    if (idxSellers > -1) {
                        this.sellersPaginator.sellers[idxSellers].farms = [
                            ...this.farmsByProducer,
                        ];
                    }
                    if (idxInitSellers > -1) {
                        this.sellersPaginator.initialSellers[
                            idxSellers
                        ].farms = [...this.farmsByProducer];
                    }
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(
                        error,
                        't-weight-note'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            )
        );
    }

    private cancelCertificationsRequest(): void {
        this._certificationSubscription.unsubscribe();
        this._certificationSubscription = new Subscription();
        this.receivingNote.description.controls.forEach(
            (d: AbstractControl) => {
                if (d.get('isLoadingCertifications').value) {
                    d.patchValue({ isLoadingCertifications: false });
                }
            }
        );
        this.isLoadingCertifications = false;
    }

    public getCertifications(isOnSelectSeller: boolean) {
        // Clear certifications
        let clearData: any = {
            certifications: [],
            showCertificationControls: false,
            isLoadingCertifications: true,
            certificationsWasLoaded: false,
            totalCertifications: 0,
        };
        if (isOnSelectSeller) {
            this.receivingNote.description.controls.forEach(
                (d: AbstractControl) => {
                    if (
                        CONSTANTS.WEIGHT_NOTE_STATUS.OPEN ==
                        d.get('status').value
                    ) {
                        d.patchValue(clearData);
                    }
                }
            );
        } else {
            this.receivingNote.description
                .at(this.descIndex)
                .patchValue(clearData);
            this.isLoadingCertifications = true;
        }
        // Get ids
        let sellerId: number = !!this.receivingNote.information.get('producer')
            .value
            ? this.receivingNote.information.get('producer').value.id
            : null;
        let farmId: number = !!this.receivingNote.description
            .at(this.descIndex)
            .get('farm').value
            ? this.receivingNote.description.at(this.descIndex).get('farm')
                .value.id
            : null;
        let blockId: string = !!this.receivingNote.description
            .at(this.descIndex)
            .get('block').value
            ? this.receivingNote.description.at(this.descIndex).get('block')
                .value.id
            : null;
        // Request certifications
        this._certificationSubscription.add(
            this._weightService
                .getRelatedCertifications(sellerId, farmId, blockId)
                .subscribe(
                    (result: any) => {
                        let newData: any = {
                            certifications: result.data.certifications.map(
                                (item: any) => {
                                    item.image = this._sanitization.bypassSecurityTrustUrl(
                                        item.image
                                    );
                                    return new WNCertificationModel(item);
                                }
                            ),
                            isLoadingCertifications: false,
                            certificationsWasLoaded: true,
                            totalCertifications: result.data.total,
                        };
                        if (isOnSelectSeller) {
                            this.receivingNote.description.controls.forEach(
                                (d: AbstractControl) => {
                                    if (
                                        CONSTANTS.WEIGHT_NOTE_STATUS.OPEN ==
                                        d.get('status').value
                                    ) {
                                        d.patchValue(newData);
                                    }
                                }
                            );
                        } else {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue(newData);
                            this.isLoadingCertifications = false;
                        }
                        this.checkStatusCertificationsControls();
                    },
                    (error: HttpErrorResponse) => {
                        let message: string = this._errorHandlerService.handleError(
                            error,
                            't-weight-note'
                        );
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            message
                        );
                        if (isOnSelectSeller) {
                            this.receivingNote.description.controls.forEach(
                                (d: AbstractControl) => {
                                    if (
                                        CONSTANTS.WEIGHT_NOTE_STATUS.OPEN ==
                                        d.get('status').value
                                    ) {
                                        d.patchValue({
                                            isLoadingCertifications: false,
                                        });
                                    }
                                }
                            );
                        } else {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({ isLoadingCertifications: false });
                            this.isLoadingCertifications = false;
                        }
                    }
                )
        );
    }

    private validatorNonEmptyTotalDeductionFormArray(): ValidatorFn {
        return (formGroup: UntypedFormGroup): { [key: string]: any } | null => {
            let description: IWNDescriptionModel = formGroup.getRawValue();
            let hasTotalEmpty: boolean = false;
            let emptyTotalDeductionId: string;
            for (let p = 0; p < description.penalties.length; p++) {
                if (
                    null != description.penalties[p].characteristic &&
                    null == description.penalties[p].total
                ) {
                    hasTotalEmpty = true;
                    emptyTotalDeductionId =
                        description.penalties[p].characteristic.deduction?.id;
                    break;
                }
            }
            return hasTotalEmpty
                ? { totalDeductionEmpty: { value: emptyTotalDeductionId } }
                : null;
        };
    }

    private validatorNonNegativeTotalFormArray(): ValidatorFn {
        return (formGroup: UntypedFormGroup): { [key: string]: any } | null => {
            let description: IWNDescriptionModel = formGroup.getRawValue();
            let hasTotalNegative: boolean = false;
            let totalNegative: number;
            if (description.totalNet < 0) {
                hasTotalNegative = true;
                totalNegative = description.totalNet;
            } else if (description.totalNetDryWt < 0) {
                hasTotalNegative = true;
                totalNegative = description.totalNetDryWt;
            }
            return hasTotalNegative
                ? { negativeTotal: { value: totalNegative } }
                : null;
        };
    }

    private validatorDataModifiedFormArray(
        reference: IWNDescriptionValidatorModel
    ): ValidatorFn {
        return (formArray: UntypedFormArray): { [key: string]: any } | null => {
            if (1 != formArray.controls.length) {
                return null;
            }
            let dataFirstDescription: IWNDescriptionModel = this.formatDescriptionValues(
                (formArray.at(0) as UntypedFormGroup).getRawValue()
            );
            delete dataFirstDescription.weightNoteId;
            let firstDescription: IWNDescriptionValidatorModel = new WNDescriptionValidatorModel(
                dataFirstDescription
            );
            let referenceValue: string = JSON.stringify(reference);
            let firstDescriptionValue: string = JSON.stringify(
                firstDescription
            );
            let isContentModified: boolean =
                referenceValue != firstDescriptionValue;
            return isContentModified ? null : { notModified: { value: '' } };
        };
    }

    private sortAndSelectWeightNotesFormArray(
        propertyName: string,
        propertyValue: any
    ): void {
        this.receivingNote.description = sortFormArrayBykey(
            this.receivingNote.description,
            'indexSort'
        );
        this.receivingNote.description.setValidators([
            this.validatorDataModifiedFormArray(this.emptyDescriptionReference),
        ]);
        this.receivingNote.description.updateValueAndValidity();
        let newIdx: number = this.receivingNote.description.controls.findIndex(
            (d: UntypedFormGroup) => d.get(propertyName).value == propertyValue
        );
        if (newIdx > -1) {
            this.selectNoteWeight(newIdx);
        }
    }

    private setReceivingNoteExistentData(data: IReceivingNoteModel): void {
        this.isAllowedEditGeneralInformation =
            data.description.findIndex(
                (d: IWNDescriptionModel) => CONSTANTS.WEIGHT_NOTE_STATUS.OPEN != d.status
            ) == -1;
        this._isAllowedEditProducer = data.description.findIndex(d => d.inPurchaseOrder) == -1;
        // Set data
        this.receivingNote.description.clear();
        this.receivingNote.information.patchValue(data.information);
        this.isSelectedProducer = !!this.receivingNote.information.get('producer').value;
        if (!this.isAllowedEditGeneralInformation) {
            this.receivingNote.information.disable();
            if (this._isAllowedEditProducer) {
                this.receivingNote.information.get('producer').enable();
                this.receivingNote.information.get('contractId').enable();
            }
        }
        //Get contracts
        if (this.isSelectedProducer) {
            this._getContracts(data.information.producer.id, data.information.contractId)
        }
        for (let d = 0; d < data.description.length; d++) {
            // Sanitize images of the certifications
            data.description[d].certifications.forEach(
                (c: IWNCertificationModel) => {
                    c.image = this._sanitization.bypassSecurityTrustUrl(c.image);
                }
            );
            this.receivingNote.description.push(
                this.createDescriptionFormGroup(data.description[d])
            );
            if (data.description[d].deliveredByProducer) {
                // Disable driver and truck if is delivered by producer
                this.receivingNote.description.at(d).get('driver').disable();
                this.receivingNote.description.at(d).get('truck').disable();
            }
        }
        // Save reference for changes comparison
        this.receivingNoteReference = new ReceivingNoteValidatorModel(data);
        // Add producer selected to list
        if (data.information.producer) {
            this.sellersPaginator.sellers = [...[data.information.producer]];
            this.sellersPaginator.initialSellers = [...[data.information.producer]];
        }
        // Add season selected to list
        if (data.information.season) {
            this.seasons = [...this.seasons, data.information.season];
        }
        data.description.forEach((d: IWNDescriptionModel, index: number) => {
            // Add commodity selected to list
            if (
                d.commodity &&
                this.commodities.findIndex((c: IWNCommodityModel) => d.commodity.id == c.id) == -1
            ) {
                this.commodities = [
                    ...this.commodities,
                    new WNCommodityModel(d.commodity),
                ];
            }
            // If driver is selected
            if (d.driver) {
                // Add driver selected to list
                if (this.driversPaginator.drivers.findIndex(r => d.driver.id == r.id) == -1) {
                    this.driversPaginator.drivers = [
                        ...this.driversPaginator.drivers,
                        new WNDriverModel(d.driver),
                    ];
                }
                if (this.driversPaginator.initialDrivers.findIndex(r => d.driver.id == r.id) == -1) {
                    this.driversPaginator.initialDrivers = [
                        ...this.driversPaginator.initialDrivers,
                        new WNDriverModel(d.driver),
                    ];
                }
            }
            // If truck is selected
            if (d.truck) {
                // Add truck selected to list
                if (this.trucksPaginator.trucks.findIndex(r => d.truck.id == r.id) == -1) {
                    this.trucksPaginator.trucks = [
                        ...this.trucksPaginator.trucks,
                        new WNTruckModel(d.truck),
                    ];
                }
                if (this.trucksPaginator.initialTrucks.findIndex(r => d.truck.id == r.id) == -1) {
                    this.trucksPaginator.initialTrucks = [
                        ...this.trucksPaginator.initialTrucks,
                        new WNTruckModel(d.truck),
                    ];
                }
            }
            // If farm is selected
            if (d.farm) {
                // Add farm selected to list
                if (this.farmsByProducer.findIndex(f => d.farm.id == f.id) == -1) {
                    this.farmsByProducer = [
                        ...this.farmsByProducer,
                        new WNFarmModel(d.farm),
                    ];
                }
                if (this.cacheFarmsByProducer.findIndex(f => d.farm.id == f.id) == -1
                ) {
                    this.cacheFarmsByProducer = [
                        ...this.cacheFarmsByProducer,
                        new WNFarmModel(d.farm),
                    ];
                }
            }

            this.weights[index] = [...d.weights];
        });
        // Sort data
        this.commodities = sortByStringValue(this.commodities, 'name');
        this.driversPaginator.drivers = sortByStringValue(
            this.driversPaginator.drivers,
            'fullName'
        );
        this.driversPaginator.initialDrivers = sortByStringValue(
            this.driversPaginator.initialDrivers,
            'fullName'
        );
        this.trucksPaginator.trucks = sortByStringValue(
            this.trucksPaginator.trucks,
            'fullName'
        );
        this.trucksPaginator.initialTrucks = sortByStringValue(
            this.trucksPaginator.initialTrucks,
            'fullName'
        );
        this.farmsByProducer = sortByStringValue(this.farmsByProducer, 'name');
        this.cacheFarmsByProducer = sortByStringValue(
            this.cacheFarmsByProducer,
            'name'
        );
        let weightNoteIndex: number = 0;
        this.receivingNote.description.controls.forEach((c: UntypedFormGroup) => {
            let weightIndex: number = 0;
            if (c.get('commodity').value) {
                c.get('commodityType').enable();
                c.get('isLoadingCommodityTypes').patchValue(true);
                c.get('commodityTypesByCommodity').patchValue([
                    c.get('commodityType').value,
                ]);
            } else {
                c.get('commodityType').disable();
                c.get('isLoadingCommodityTypes').patchValue(false);
            }

            if (c.get('commodityTransformation').value) {
                c.get('container').enable();
                c.get('isLoadingContainers').patchValue(true);
                c.get('containersByCommodityTransformation').patchValue([
                    c.get('container').value,
                ]);
            } else {
                c.get('container').disable();
                c.get('isLoadingContainers').patchValue(false);
            }

            this.isLoadingBlocks = true;

            // Update farm and block required validator
            this.updateFarmAndBlockRequiredValidator(c);

            (c.get('penalties') as UntypedFormArray).controls.forEach(
                (p: UntypedFormGroup) => {
                    let penalty: IWNPenaltyModel = p.getRawValue();
                    if (penalty.characteristic) {
                        p.get('value').enable();
                        p.get('characteristicsEnabled').patchValue([
                            penalty.characteristic,
                        ]);
                    } else {
                        p.get('value').disable();
                    }
                }
            );

            // Disable weight note if is deleted or in process or processed or in purchase order
            if (
                c.get('status').value == this.WEIGHT_NOTE_STATUS.DELETED ||
                c.get('inProcess').value == this.TYPE_WEIGHT_NOTE.PRODUCTION ||
                c.get('statusLot').value == this.LOT_STATUS.PROCESSED ||
                c.get('inPurchaseOrder').value ||
                c.get('status').value == this.WEIGHT_NOTE_STATUS.CLOSED && !this.hasPermissionToEditClosedNote
            ) {
                this.disableDescriptionFormGroup(weightNoteIndex);
            }
            weightNoteIndex++;
        });
        // Get producers
        this.getSellers(null, false);
        // Get farms by producer
        if (data.information.producer) {
            this.getFarmsByProducer(data.information.producer.id);
        }
        // Get seasons
        this.getSeasons();
        // Get commodities
        this.getCommodities(null, false);
        // Get drivers
        this.getDrivers(null, false);
        // Get trucks
        this.getTrucks(null, false);
        // Check if is allowed close receiving note
        this.checkIfAllowedCloseReceivingNote();
        // Selected weight note
        if (null != this.selectedWeightNote) {
            let idxDesc: number = this.receivingNote.description.controls.findIndex(
                (d) => d.get('transactionInId').value == this.selectedWeightNote
            );
            if (
                idxDesc > -1 &&
                (this.receivingNote.information.disabled || this.receivingNote.information.valid)
            ) {
                this.descIndex = idxDesc;
                this.captureWeight();
            }
        }
        // Load data from selected weight note
        this.loadDataForSelectedWeightNoteOnEdit();
    }

    private loadDataForSelectedWeightNoteOnEdit(): void {
        if (
            this.receivingNote.description.at(this.descIndex).get('commodity')
                .value &&
            this.receivingNote.description
                .at(this.descIndex)
                .get('commodityTransformation').value
        ) {
            if (!this.blockUILayout.isActive) {
                this.blockUILayout.start();
            }
            let seller: IWNSellerModel = this.receivingNote.information.get(
                'producer'
            ).value;
            let farm: IWNFarmModel = this.receivingNote.description
                .at(this.descIndex)
                .get('farm').value;
            let block: IWNBlockModel = this.receivingNote.description
                .at(this.descIndex)
                .get('block').value;
            let sellerId: number = null == seller ? null : seller.id;
            let farmId: number = null == farm ? null : farm.id;
            let blockId: string = null == block ? null : block.id;
            let params = `commodities[]=${this.receivingNote.description
                .at(this.descIndex)
                .get('commodity').value?.id
                }`;
            forkJoin([
                this._weightService.getCommodityTypes(
                    this.receivingNote.description
                        .at(this.descIndex)
                        .get('commodity').value?.id,
                    null,
                    false
                ),
                this._weightService.getWarehouse(
                    this.receivingNote.description
                        .at(this.descIndex)
                        .get('commodityTransformation').value?.id,
                    null,
                    false
                ),
                this._weightService.getBlocks(
                    farmId,
                    this.receivingNote.information.get('producer').value?.id
                ),
                this._weightService.getRelatedCertifications(
                    sellerId,
                    farmId,
                    blockId
                ),
                this._weightService.getCharacteristics(params),
            ])
                .pipe(take(1))
                .subscribe(
                    ([
                        commodityTypes,
                        containers,
                        blocks,
                        certifications,
                        characteristics,
                    ]) => {
                        // Commodity type by commodity
                        if (commodityTypes) {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({
                                    commodityTypesByCommodity: commodityTypes,
                                });
                        }
                        // containers By Commodity Transformation
                        if (containers) {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({
                                    containersByCommodityTransformation: containers,
                                });
                        }
                        // blocks
                        if (
                            CONSTANTS.WEIGHT_NOTE_STATUS.DELETED !=
                            this.receivingNote.description.at(this.descIndex).get('status').value
                        ) {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue({
                                    blocksByFarm: [...blocks],
                                    cacheBlocksByFarm: [...blocks],
                                });
                        }
                        // Certifications
                        if (
                            CONSTANTS.WEIGHT_NOTE_STATUS.DELETED !=
                            this.receivingNote.description.at(this.descIndex).get('status').value
                        ) {
                            let newData: any = {
                                certifications: certifications.data.certifications.map(
                                    (item: any) => {
                                        item.image = this._sanitization.bypassSecurityTrustUrl(
                                            item.image
                                        );
                                        return new WNCertificationModel(item);
                                    }
                                ),
                                isLoadingCertifications: false,
                                certificationsWasLoaded: true,
                                totalCertifications: certifications.data.total,
                            };
                            this.receivingNote.description
                                .at(this.descIndex)
                                .patchValue(newData);
                            this.checkStatusCertificationsControls();
                        }
                        // Characteristics By Commodity Transformation
                        this.receivingNote.description
                            .at(this.descIndex)
                            .patchValue({
                                characteristics: characteristics,
                                isLoadingCharacteristics: false,
                                characteristicsWasLoaded: true,
                            });
                        (this.receivingNote.description
                            .at(this.descIndex)
                            .get('penalties') as UntypedFormArray).controls.forEach(
                                (p: UntypedFormGroup) => {
                                    let characteristicSelected: IWNCharacteristicModel = p.get(
                                        'characteristic'
                                    ).value;
                                    let choiceDeduction: IWNOptionChoiceDeductionModel = p.get(
                                        'choiceDeduction'
                                    ).value;
                                    let deductionIdSelected: string = p.get('characteristic')
                                        .value?.deduction?.id;
                                    let idxMatch: number = characteristics.findIndex(
                                        (c: IWNCharacteristicModel) =>
                                            deductionIdSelected == c.deduction.id
                                    );
                                    if (idxMatch > -1) {
                                        characteristicSelected =
                                            characteristics[idxMatch];
                                        if (
                                            CONSTANTS.DEDUCTION_TYPE.CHOICE ==
                                            characteristicSelected?.deduction?.type
                                        ) {
                                            let idxMatchOption: number = characteristicSelected.deduction.options.findIndex(
                                                (
                                                    o: IWNOptionChoiceDeductionModel
                                                ) => p.get('value').value == o.name
                                            );
                                            if (idxMatchOption > -1) {
                                                choiceDeduction =
                                                    characteristicSelected.deduction
                                                        .options[idxMatchOption];
                                            }
                                            p.get('choiceDeduction').setValidators(
                                                Validators.required
                                            );
                                        }
                                        if (CONSTANTS.DEDUCTION_TYPE.TABLE == characteristicSelected?.deduction?.type || CONSTANTS.DEDUCTION_TYPE.INPUT == characteristicSelected?.deduction?.type) {
                                            let validatorsValue = [];
                                            validatorsValue.push(
                                                validatorNumericalRangeFormControl(
                                                    characteristicSelected.deduction.min,
                                                    characteristicSelected.deduction.max
                                                )
                                            );
                                            if (characteristicSelected.mandatory) {
                                                validatorsValue.push(Validators.required)
                                                p.get('value').setValidators(validatorsValue)
                                            }
                                        }
                                    }
                                    p.patchValue({
                                        characteristic: characteristicSelected,
                                        choiceDeduction: choiceDeduction,
                                    });
                                    p.patchValue({
                                        characteristicsEnabled: this.updateCharacteristicsList(
                                            (p as UntypedFormGroup).getRawValue()
                                        ),
                                    });
                                    if (
                                        this.receivingNote.description.at(this.descIndex).get('status').value != this.WEIGHT_NOTE_STATUS.DELETED ||
                                        this.receivingNote.description.at(this.descIndex).get('inProcess').value != this.TYPE_WEIGHT_NOTE.PRODUCTION ||
                                        this.receivingNote.description.at(this.descIndex).get('statusLot').value != this.LOT_STATUS.PROCESSED ||
                                        !this.receivingNote.description.at(this.descIndex).get('inPurchaseOrder').value ||
                                        (this.receivingNote.description.at(this.descIndex).get('status').value != this.WEIGHT_NOTE_STATUS.CLOSED &&
                                            this.hasPermissionToEditClosedNote)
                                    ) {
                                        p.get('characteristic').enable();
                                        if (p.get('characteristic').value) {
                                            if (
                                                CONSTANTS.DEDUCTION_TYPE.CHOICE ==
                                                characteristicSelected?.deduction
                                                    ?.type
                                            ) {
                                                p.get('choiceDeduction').enable();
                                            }
                                            p.get('value').enable();
                                        }
                                    }
                                }
                            );
                        if (
                            this.receivingNote.description.at(this.descIndex).get('status').value == this.WEIGHT_NOTE_STATUS.DELETED ||
                            this.receivingNote.description.at(this.descIndex).get('inProcess').value == this.TYPE_WEIGHT_NOTE.PRODUCTION ||
                            this.receivingNote.description.at(this.descIndex).get('statusLot').value == this.LOT_STATUS.PROCESSED ||
                            this.receivingNote.description.at(this.descIndex).get('inPurchaseOrder').value ||
                            (this.receivingNote.description.at(this.descIndex).get('status').value == this.WEIGHT_NOTE_STATUS.CLOSED &&
                                !this.hasPermissionToEditClosedNote)
                        ) {
                            (this.receivingNote.description
                                .at(this.descIndex)
                                .get('penalties') as UntypedFormArray).disable();
                        }
                        if (null == commodityTypes) {
                            this._alertService.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                this._i18nPipe.transform('unidentified-problem')
                            );
                        } else {
                            this.receivingNote.description
                                .at(this.descIndex)
                                .get('isDataLoadedOnEdit')
                                .patchValue(true);
                        }

                        this.receivingNote.description
                            .at(this.descIndex)
                            .get('isLoadingCommodityTypes')
                            .patchValue(false);
                        this.receivingNote.description
                            .at(this.descIndex)
                            .get('isLoadingContainers')
                            .patchValue(false);
                        this.isLoadingBlocks = false;
                        this.blockUILayout.stop();
                    },
                    (error: HttpErrorResponse) => {
                        let message: string = this._errorHandlerService.handleError(
                            error,
                            't-weight-note'
                        );
                        this._alertService.errorTitle(
                            this._i18nPipe.transform('error-msg'),
                            message
                        );
                        this.receivingNote.description
                            .at(this.descIndex)
                            .get('isLoadingCommodityTypes')
                            .patchValue(false);
                        this.receivingNote.description
                            .at(this.descIndex)
                            .get('isLoadingContainers')
                            .patchValue(false);
                        this.isLoadingBlocks = false;
                        this.blockUILayout.stop();
                    }
                );
        } else {
            if (this.blockUILayout.isActive) {
                this.blockUILayout.stop();
            }
        }
    }

    /**
     * Hide hight limit notification alert in container control and snack-bar
     * @param hideOnlySnackBar indicates whether only the snack-bar notification alert should be hidden
     */
    public hideHightLimitNotification(hideOnlySnackBar: boolean = false): void {
        this._notifierService.hide('CONTAINER_HIGHT_LIMIT');
        if (!hideOnlySnackBar) {
            this.receivingNote.description
                .at(this.descIndex)
                .patchValue({ isWarningContainer: false });
        }
    }

    private updateDataReceivingNoteReference(
        description: IWNDescriptionModel,
        information: IWNGeneralInformationModel = null
    ): void {
        let idxDescription: number = -1;
        if (null == this.receivingNoteReference) {
            this.receivingNoteReference = new ReceivingNoteValidatorModel();
            information = this.receivingNote.information.getRawValue();
            idxDescription = 0;
        } else {
            idxDescription = this.receivingNoteReference.description.findIndex(
                (d: IWNDescriptionValidatorModel) =>
                    description.weightNoteId == d.weightNoteId
            );
        }
        if (idxDescription > -1) {
            this.receivingNoteReference.description[
                idxDescription
            ] = new WNDescriptionValidatorModel(description);
        } else {
            this.receivingNoteReference.description.push(
                new WNDescriptionValidatorModel(description)
            );
            this.receivingNoteReference.description = sortByStringValue(
                this.receivingNoteReference.description,
                'indexSort'
            );
        }
        if (information) {
            this.receivingNoteReference.information = new WNGeneralInformationValidatorModel(
                information
            );
        }
        if (information || idxDescription > -1) {
            this.detectChangesOnEditReceivingNote();
        }
    }

    private detectChangesOnEditReceivingNote(): void {
        if (
            this.receivingNote.information.get('id').value &&
            this.receivingNoteReference
        ) {
            let data: IReceivingNoteValidatorModel = new ReceivingNoteValidatorModel(
                this.getReceivingNoteValue()
            );
            this.dataWasModified =
                JSON.stringify(this.receivingNoteReference) !=
                JSON.stringify(data);
        }
    }

    public searchFarm(searchText: string) {
        if (searchText) {
            this.farmsByProducer = this.cacheFarmsByProducer.filter((farm) =>
                farm.name.toLocaleLowerCase().includes(searchText.toLowerCase())
            );
        } else {
            this.farmsByProducer = [...this.cacheFarmsByProducer];
        }
    }

    public searchBlock(searchText: string) {
        let blocks: Array<IWNBlockModel> = this.receivingNote.description
            .at(this.descIndex)
            .get('cacheBlocksByFarm').value;
        if (searchText) {
            blocks = blocks.filter((block: IWNBlockModel) =>
                block.name
                    .toLocaleLowerCase()
                    .includes(searchText.toLowerCase())
            );
        }
        this.receivingNote.description
            .at(this.descIndex)
            .patchValue({ blocksByFarm: blocks });
    }

    public saveExitDisabled() {
        return this.receivingNote.information.invalid ||
            this.receivingNote.information.pending ||
            this.receivingNote.description.invalid ||
            this.receivingNote.description.pending ||
            !this.isEnabledChangeNote ||
            this.isDisabledSaveAndExitBtn ||
            this.isLoadingCertifications ||
            (this.isEditing && !this.dataWasModified) ||
            this.disableBtnCloseWeightNote
    }

    public formWeightCaptureReady(formWeighingTable: UntypedFormGroup, descriptionIndex: number): void {
        const weights = formWeighingTable.get('weights');
        ((this.receivingNote.description as UntypedFormArray).at(descriptionIndex) as UntypedFormGroup).setControl("weights", weights);
        formWeighingTable.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes: IWNDescriptionModel) => {
            this.receivingNote.description.at(descriptionIndex).patchValue({
                totalGross: changes.totalGross,
                totalNet: changes.totalNet,
                totalNetQQ: changes.totalNetQQ,
                totalSacks: changes.totalSacks,
                totalTare: changes.totalTare,
                totalTareAditional: changes.totalTareAditional
            })
            this.calculateWeightNoteTotals(descriptionIndex);
            this.applyDeduction();
            this.isEnabledChangeNote = this.isEditing ? true : this.isEnabledChangeNote;
        })
    }

    public getDeductionsAllowAction(characteristic: IWNCharacteristicModel): string {
        return characteristic.deduction.allowedActions ? Object.values(characteristic.deduction.allowedActions)[0][0] : '';
    }
}
