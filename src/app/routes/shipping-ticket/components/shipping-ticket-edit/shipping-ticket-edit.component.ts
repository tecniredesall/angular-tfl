import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { merge, Subject } from 'rxjs';
import { mergeAll, take, takeUntil } from 'rxjs/operators';
import { ITDriverModel } from 'src/app/routes/drivers/models/driver.model';
import { IIoTRecord } from 'src/app/routes/iot-devices/models/iot-record.model';
import { IotDevicesService } from 'src/app/routes/iot-devices/services/iot-devices/iot-devices.service';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { TrucksModel } from 'src/app/routes/trucks/models/trucks.model';
import { ISubtankModel } from 'src/app/routes/warehouse/models/subtank.model';
import { IWNCharacteristicModel } from 'src/app/routes/weight-note/models/wn-characteristic.model';
import { IWNCommodityTypeModel } from 'src/app/routes/weight-note/models/wn-commodity-type.model';
import { IWNCommodityModel } from 'src/app/routes/weight-note/models/wn-commodity.model';
import { IWNConfigurationModel, WNConfigurationModel } from 'src/app/routes/weight-note/models/wn-configuration.model';
import { IWNContainerModel } from 'src/app/routes/weight-note/models/wn-container.model';
import { IWNDeductionTradingStatusModel, WNDeductionTradingStatusModel } from 'src/app/routes/weight-note/models/wn-deduction-trading-status.model';
import { IWNOptionChoiceDeductionModel } from 'src/app/routes/weight-note/models/wn-option-choice-deduction.model';
import { IWNPenaltyModel, WNPenaltyModel } from 'src/app/routes/weight-note/models/wn-penalty.model';
import { IWNDeductionsTradingModel, WNDeductionsTradingModel } from 'src/app/routes/weight-note/models/wn-request-deductions-trading.model';
import { IWNWeightModel } from 'src/app/routes/weight-note/models/wn-weight.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { ICompanyModel } from 'src/app/shared/models/company.model';
import { IPaginator } from 'src/app/shared/models/paginator.model';
import { ITRDialogSettings } from 'src/app/shared/models/tr-dialog-settings';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { accurateDecimalSubtraction, accurateDecimalSum, roundDecimal } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { arrayUnique } from 'src/app/shared/utils/functions/array-unique';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { roundUp } from 'src/app/shared/utils/functions/round-up';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { validatorNonZeroFormControl } from 'src/app/shared/validators/validator-non-zero-form-control';
import { validatorNumericalRangeFormControl } from 'src/app/shared/validators/validator-numerical-range-form-control';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { IShippingTicketRequestModel, ShippingTicketRequestModel } from '../../models/shipping-ticket-request.model';
import { IShippingTicketModel, ShippingTicketModel } from '../../models/shipping-ticket.model';
import { ISTBuyerLocationPaginatorModel, STBuyerLocationPaginatorModel } from '../../models/st-buyer-location-paginator.model';
import { ISTBuyerPaginatorModel, STBuyerPaginatorModel } from '../../models/st-buyer-paginator.model';
import { ISTCompanyBranchPaginatorModel, STCompanyBranchPaginatorModel } from '../../models/st-company-branch-paginator.model';
import { ISTCompanyBranchPointPaginatorModel, STCompanyBranchPointPaginatorModel } from '../../models/st-company-branch-point-paginator.model';
import { ISTConfigurationCompanyModel } from '../../models/st-configuration-company.model';
import { ISTDriverPaginatorModel, STDriverPaginatorModel } from '../../models/st-driver-paginator.model';
import { ISTReasonTransferModel } from '../../models/st-reason-transfer.model';
import { ISTVehiclePaginatorModel, STVehiclePaginatorModel } from '../../models/st-vehicle-paginator.model';
import { ShippingTicketService } from '../../services/shipping-ticket.service';
import { ShippingTicketGenerateReports } from '../shared/shipping-ticket-generate-reports';

@Component({
    selector: 'app-shipping-ticket-edit',
    templateUrl: './shipping-ticket-edit.component.html',
    styleUrls: ['./shipping-ticket-edit.component.scss']
})
export class ShippingTicketEditComponent implements OnInit {

    @ViewChild('hightLimitContainerNotification', { static: true }) hightLimitContainerNotification;
    @BlockUI('shipping-ticket-layout') blockUILayout: NgBlockUI;
    @BlockUI('weights-section') blockWeightsSection: NgBlockUI;
    readonly templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    readonly templateBlockUiModalST: BlockModalUiComponent = BlockModalUiComponent;
    readonly CONSTANTS = CONSTANTS;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly CHARACTERISTICS_DECIMAL: number = JSON.parse(localStorage.getItem('decimals')).characteristics;
    readonly DEDUCTION_TYPE: any = CONSTANTS.DEDUCTION_TYPE;
    readonly PARAM_WEIGHING_TABLE = CONSTANTS.PARAM_WEIGHING_TABLE;
    readonly DEDUCTIONS_ALLOW_ACTIONS = CONSTANTS.DEDUCTIONS_ALLOW_ACTIONS;
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
    public sections = {
        generalInformation: {
            open: true,
            disabled: false
        },
        weightCapture: {
            open: false,
            disabled: true
        },
        driverInformation: {
            open: false,
            disabled: true
        }
    }
    public shippingTicket: {
        generalInformation: UntypedFormGroup,
        weightCapture: UntypedFormArray,
        driverInformation: UntypedFormGroup,
    };
    public maxDate: moment.Moment = moment();
    public commodities: IWNCommodityModel[] = [];
    public isCommoditiesLoading: boolean = true;
    public commodityTypes: IWNCommodityTypeModel[] = [];
    public isCommodityTypesLoading: boolean = false;
    public reasonsTransfer: ISTReasonTransferModel[] = [];
    public isReasonsTransferLoading: boolean = true;
    public warehouses: IWNContainerModel[] | any = [[]];
    public isWarehousesLoading: boolean = false;
    public configuration: ITRConfiguration = new TRConfiguration();
    public buyersPaginator: ISTBuyerPaginatorModel = new STBuyerPaginatorModel();
    public characteristics = [];
    public isCharacteristicsLoading: boolean = false;
    public characteristicsWasLoaded: boolean = false;
    public buyersLocationPaginator: ISTBuyerLocationPaginatorModel = new STBuyerLocationPaginatorModel();
    public companyBranchesPaginator: ISTCompanyBranchPaginatorModel = new STCompanyBranchPaginatorModel();
    public companyBranchesPointPaginator: ISTCompanyBranchPointPaginatorModel = new STCompanyBranchPointPaginatorModel();
    public driversPaginator: ISTDriverPaginatorModel = new STDriverPaginatorModel();
    public vehiclesPaginator: ISTVehiclePaginatorModel = new STVehiclePaginatorModel();
    public isEdit: boolean = false;
    public dataWasModified: boolean = false;
    public warehouse: ISubtankModel;
    public characteristicsError: boolean | any = false;
    public userHasScalesLinked: boolean = false;
    private _shippingTicket: IShippingTicketModel;
    private _shippingTicketId: string;
    private _shippingTicketReques: ShippingTicketRequestModel;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private destroyDeductionRequest$: Subject<boolean> = new Subject<boolean>();
    private deductionsTradingStatus: IWNDeductionTradingStatusModel = new WNDeductionTradingStatusModel();
    private generateReportsHelpClass: ShippingTicketGenerateReports;
    private _scales: IIoTRecord[] = [];
    public showTabWeigthNotes = 0;
    public deliveredBy: number = 1;
    public transportCompanies: Array<ICompanyModel> = [];
    private _transportCompanyPaginator: IPaginator;
    public transportCompaniesLoading = false;
    public companyInfo: any;
    public wnLastIndex = 0;
    public tabsWeigthArray = [{
        disable: false,
        noteFolio: null
    }]
    public weights: Array<Array<IWNWeightModel>> = [[]];
    public formWeigth: UntypedFormGroup;
    public isLoadConfiguration = false;

    constructor(
        private _router: Router,
        private _dialog: MatDialog,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _activatedRouter: ActivatedRoute,
        private _notifierService: NotifierService,
        private _shippingTicketService: ShippingTicketService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _companyService: CompanyService,
        private _iotDevicesService: IotDevicesService,
        private _purchaseOrderService: PurchaseOrdersService,
    ) {
        this._shippingTicketId = this._activatedRouter.snapshot.params?.id;
        this.isEdit = !!this._shippingTicketId;

    }

    ngOnInit() {

        if (this.isEdit) {
            this._getShippingTicket();
        } else {
            this._createShippingTickerForm();

        }
        this._getConfiguration();
        this._getReasonTransfer();
        this._getBuyers();
        this._getScales();

        if (!this.isEdit) {
            this._getDrivers();
            this._getVehicles();
        }
        this.generateReportsHelpClass = new ShippingTicketGenerateReports(this._shippingTicketService, this._alertService, this._i18nPipe, this._errorHandlerService, this._router);

    }

    private _isEmptyLoadAllowed(): any {
        const { LOADS_CONFIG } = CONSTANTS;
        const { LOAD_EMPTY_ALLOWED, NOT_ALLOWABLE_EMPTY_LOAD_VALUE, ALLOWABLE_EMPTY_LOAD_VALUE } = LOADS_CONFIG;
        const emptyLoadAllowed = this._getConfigurationOfCompanyByName(LOAD_EMPTY_ALLOWED) || { value: NOT_ALLOWABLE_EMPTY_LOAD_VALUE };
        return emptyLoadAllowed.value === ALLOWABLE_EMPTY_LOAD_VALUE;
    }

    private _getValidatorForLoads() {
        if (this._isEmptyLoadAllowed()) {
            return () => null;
        }

        return validatorNonZeroFormControl();
    }

    private _getCompanyInfo() {
        this._shippingTicketService.getCompanyInfo().subscribe(
            (response) => {
                this.companyInfo = response.data;
            },
            (error) => {
                const message = this._errorHandlerService.handleError(error, 'config');

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );
            }
        );

    }

    private _getShippingTicket() {
        this._shippingTicketService.getShippingTicketDetail(this._shippingTicketId)
            .pipe(take(1))
            .subscribe(
                (response: IShippingTicketModel) => {

                    this.weights = [];
                    this._shippingTicket = response;
                    this.shippingTicket = {
                        generalInformation: this._createInformationFormGroup(this._shippingTicket),
                        driverInformation: this._createDriverInformationFormGroup(this._shippingTicket),
                        weightCapture: new UntypedFormArray([])
                    };

                    this._shippingTicket.weightCapture.forEach((wn, index: number) => {

                        this.weights.push(this._shippingTicket.weightCapture[index].weights);

                        this.tabsWeigthArray[index] = {
                            disable: wn.status == 1 ? false : true,
                            noteFolio: wn.noteFolio
                        }


                        this.shippingTicket.weightCapture.push(this._createWeightCaptureFormGroup(this._shippingTicket, index));

                        if (wn.commodityId) {
                            this._getCommodities(0);
                            this.setCommodity(false, index)
                        }
                        if (wn.commodityTypeId) {
                            this._getWarehouses(index);
                        }

                        (this.shippingTicket.weightCapture.at(index).get('weights') as UntypedFormArray).controls.forEach((w: UntypedFormGroup, i: number) => {
                            (this.shippingTicket.weightCapture.at(index).get('weights') as UntypedFormArray).at(i).disable();
                        });
                    });

                    this.wnLastIndex = this.tabsWeigthArray.length - 1;

                    this._shippingTicketReques = new ShippingTicketRequestModel(response);


                    this.sections.generalInformation.disabled = false;
                    this.sections.weightCapture.disabled = false;
                    this.sections.driverInformation.disabled = false;

                    if (this._shippingTicket.generalInformation.companyBranchId) {
                        this.setCompanyBranch();
                    }
                    if (this._shippingTicket.generalInformation.buyerId) {
                        this.buyersLocationPaginator.initialItems = [];
                        this.buyersLocationPaginator.isLoading = true;
                        this._getBuyerLocation();
                    }

                    if (this._shippingTicket.generalInformation.buyerId) {
                        this._setInitialItem(this._shippingTicket.generalInformation.buyer, this.buyersPaginator.initialItems, 'id');
                    }
                    if (this._shippingTicket.driverInformation.driver) {
                        this._setInitialItem(this._shippingTicket.driverInformation.driver, this.driversPaginator.initialItems, 'id');
                    }
                    if (this._shippingTicket.driverInformation.vehicle) {
                        this._setInitialItem(this._shippingTicket.driverInformation.vehicle, this.vehiclesPaginator.initialItems, 'truckId');
                    }

                    const DELIVERED_BY = { owner: 1, third: 2 }
                    this.deliveredBy = this._shippingTicket.driverInformation.transportCompanyId ? DELIVERED_BY['third'] : DELIVERED_BY['owner'];
                    this._getDrivers();
                    this._getVehicles();
                    if (this._shippingTicket.driverInformation.transportCompanyId) {


                        this._getTransportCompanies(null);
                    }
                    merge([
                        this.shippingTicket.generalInformation.valueChanges,
                        this.shippingTicket.weightCapture.valueChanges,
                        this.shippingTicket.driverInformation.valueChanges
                    ])
                        .pipe(
                            mergeAll(),
                            takeUntil(this.destroy$)
                        )
                        .subscribe(_ => this._checkIfDataWasModified());

                    this.shippingTicket.weightCapture.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(_ => {
                        this._checkIfDataWasModified()
                    });

                    this.shippingTicket.weightCapture.getRawValue().forEach((element, index) => {

                        this.tabsWeigthArray[index].disable ?
                            this.shippingTicket.weightCapture.at(index).disable() :
                            this.shippingTicket.weightCapture.at(index).enable();

                    });
                    this._getCompanyBranches();
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
    }

    private _disabledweightCaptureClosed(index: number) {
        this.shippingTicket.weightCapture.at(index).disable();
        this.shippingTicket.weightCapture.at(index).get('penalties').disable();
    }

    private _checkIfDataWasModified() {
        let shippingTicket: IShippingTicketModel = {
            generalInformation: this.shippingTicket.generalInformation.getRawValue(),
            weightCapture: this.shippingTicket.weightCapture.getRawValue(),
            driverInformation: this.shippingTicket.driverInformation.getRawValue()
        };
        let shippingTicketRequest: IShippingTicketRequestModel = new ShippingTicketRequestModel(shippingTicket);
        this.dataWasModified = JSON.stringify(this._shippingTicketReques) != JSON.stringify(shippingTicketRequest);

    }

    private _setExistCharacteristic(index: number) {
        (this.shippingTicket.weightCapture.at(index).get('penalties') as UntypedFormArray).controls.forEach(
            (p: UntypedFormGroup) => {
                let characteristicSelected: IWNCharacteristicModel = p.get('characteristic').value;
                let choiceDeduction: IWNOptionChoiceDeductionModel = p.get('choiceDeduction').value;
                let deductionIdSelected: string = p.get('characteristic').value?.deduction?.id;
                let characteristicIndex: number = this.characteristics.findIndex(
                    (c: IWNCharacteristicModel) => deductionIdSelected == c.deduction.id
                );
                if (characteristicIndex > -1) {
                    characteristicSelected = this.characteristics[characteristicIndex];
                    if (CONSTANTS.DEDUCTION_TYPE.CHOICE == characteristicSelected?.deduction?.type) {
                        let idxMatchOption: number = characteristicSelected.deduction.options.findIndex(
                            (o: IWNOptionChoiceDeductionModel) => p.get('value').value == o.name
                        );
                        if (idxMatchOption > -1) {
                            choiceDeduction = characteristicSelected.deduction.options[idxMatchOption];
                        }
                        p.get('choiceDeduction').setValidators(Validators.required);
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
                    characteristicsEnabled: this._updateCharacteristicsList(p.getRawValue(), 0),
                });
            }
        );
    }

    private _createShippingTickerForm(): void {
        let shippingTicket: IShippingTicketModel = new ShippingTicketModel();

        let weightFormArray: UntypedFormArray = new UntypedFormArray(
            [this._createWeightCaptureFormGroup(shippingTicket, 0)],
        );

        this.shippingTicket = {
            generalInformation: this._createInformationFormGroup(shippingTicket),
            weightCapture: weightFormArray,
            driverInformation: this._createDriverInformationFormGroup(shippingTicket),
        };

        this.shippingTicket.weightCapture.at(0).patchValue({
            commodityId: 1
        });
        this._getCommodities(0);
        this._getCompanyBranches();
    }

    private _createInformationFormGroup(shippingTicket: IShippingTicketModel): UntypedFormGroup {
        let generalInformation: UntypedFormGroup = new UntypedFormGroup({
            id: new UntypedFormControl(shippingTicket.generalInformation.id),
            ticketDate: new UntypedFormControl(
                shippingTicket.generalInformation.ticketDate, Validators.required),
            folio: new UntypedFormControl(shippingTicket.generalInformation.folio),
            buyerId: new UntypedFormControl(
                shippingTicket.generalInformation.buyerId, Validators.required),
            companyBranchId: new UntypedFormControl(
                shippingTicket.generalInformation.companyBranchId, Validators.required),
            companyBranchPointId: new UntypedFormControl(
                { value: shippingTicket.generalInformation.companyBranchPointId, disabled: true },
                Validators.required),
            buyerLocationId: new UntypedFormControl(
                { value: shippingTicket.generalInformation.buyerLocationId, disabled: true },
                Validators.required),
            reasonTransferId: new UntypedFormControl(
                shippingTicket.generalInformation.reasonTransferId, Validators.required),
            close: new UntypedFormControl(shippingTicket.generalInformation.close)
        });
        return generalInformation
    }

    private _createWeightCaptureFormGroup(shippingTicket: IShippingTicketModel, index: number = 0): UntypedFormGroup {
        let weightsFormArray: UntypedFormArray = new UntypedFormArray([]);
        shippingTicket.weightCapture[index].weights.forEach((w: IWNWeightModel) => {
            weightsFormArray.push(this._createWeightFormGroup(w));
        });

        const penaltiesFormArray: UntypedFormArray = new UntypedFormArray([]);
        shippingTicket.weightCapture[index].penalties.forEach((p: IWNPenaltyModel) => {
            penaltiesFormArray.push(this._createPenaltyFormGroup(p));
        });
        const weightCapture: UntypedFormGroup = new UntypedFormGroup({
            shippingNoteId: new UntypedFormControl(shippingTicket.weightCapture[index].shippingNoteId),
            commodityId: new UntypedFormControl(
                shippingTicket.weightCapture[index].commodityId,
                Validators.required
            ),
            commodityTypeId: new UntypedFormControl(
                { value: shippingTicket.weightCapture[index].commodityTypeId, disabled: true },
                Validators.required
            ),
            commodityTransformationId: new UntypedFormControl(
                { value: shippingTicket.weightCapture[index].commodityTransformationId, disabled: true }
            ),
            commodityTransformationName: new UntypedFormControl(
                { value: shippingTicket.weightCapture[index].commodityTransformationName, disabled: true }
            ),
            warehouseId: new UntypedFormControl(
                { value: shippingTicket.weightCapture[index].warehouseId, disabled: true },
                Validators.required
            ),
            weights: weightsFormArray,
            penalties: penaltiesFormArray,
            totalSacks: new UntypedFormControl(shippingTicket.weightCapture[index].totalSacks),
            totalGross: new UntypedFormControl(shippingTicket.weightCapture[index].totalGross),
            totalGrossQQ: new UntypedFormControl(shippingTicket.weightCapture[index].totalGrossQQ),
            totalTare: new UntypedFormControl(shippingTicket.weightCapture[index].totalTare),
            totalTareQQ: new UntypedFormControl(shippingTicket.weightCapture[index].totalTareQQ),
            totalDiscount: new UntypedFormControl(shippingTicket.weightCapture[index].totalDiscount),
            totalDiscountQQ: new UntypedFormControl(shippingTicket.weightCapture[index].totalDiscountQQ),
            totalAddition: new UntypedFormControl(shippingTicket.weightCapture[index].totalAddition),
            totalAdditionQQ: new UntypedFormControl(shippingTicket.weightCapture[index].totalAdditionQQ),
            totalNet: new UntypedFormControl(shippingTicket.weightCapture[index].totalNet),
            totalNetQQRow: new UntypedFormControl(shippingTicket.weightCapture[index].totalNetQQRow),
            totalNetQQ: new UntypedFormControl(shippingTicket.weightCapture[index].totalNetQQ),
            totalNetDryWt: new UntypedFormControl(shippingTicket.weightCapture[index].totalNetDryWt),
            totalNetDryWtQQ: new UntypedFormControl(shippingTicket.weightCapture[index].totalNetDryWtQQ),
            totalCharacteristics: new UntypedFormControl(shippingTicket.weightCapture[index].totalCharacteristics),
            totalCharacteristicsPercent: new UntypedFormControl(shippingTicket.weightCapture[index].totalCharacteristicsPercent),
            status: new UntypedFormControl(shippingTicket.weightCapture[index].status),
            isDataLoadedOnEdit: new UntypedFormControl(shippingTicket.weightCapture[index].isDataLoadedOnEdit),
            isWarningContainer: new UntypedFormControl(shippingTicket.weightCapture[index].isWarningContainer),
            textNote: new UntypedFormControl(shippingTicket.weightCapture[index].textNote),
            close: new UntypedFormControl(shippingTicket.weightCapture[index].close),
            noteDescription: new UntypedFormControl(shippingTicket.weightCapture[index].noteDescription),
            noteFolio: new UntypedFormControl(shippingTicket.weightCapture[index].noteFolio)
        });

        this.formWeigth && ((this.shippingTicket.weightCapture as UntypedFormArray).at(index) as UntypedFormGroup).setControl("weights", this.formWeigth);


        return weightCapture;
    }

    private _createDriverInformationFormGroup(shippingTicket: IShippingTicketModel): UntypedFormGroup {
        const driverInformation: UntypedFormGroup = new UntypedFormGroup({
            driverId: new UntypedFormControl(shippingTicket.driverInformation.driverId, Validators.required),
            driverIdentity: new UntypedFormControl({
                value: shippingTicket.driverInformation.driverIdentity,
                disabled: true
            }),
            vehicleId: new UntypedFormControl(shippingTicket.driverInformation.vehicleId, Validators.required),
            vehicleModel: new UntypedFormControl({
                value: shippingTicket.vehicleInformation.truck.name,
                disabled: true
            }),
            vehicleType: new UntypedFormControl({
                value: shippingTicket.vehicleInformation.vehicleType.type,
                disabled: true
            }),
            transportCompanyId: new UntypedFormControl({
                value: shippingTicket.driverInformation.transportCompanyId,
                disabled: true
            }),
            vehicleLicense: new UntypedFormControl({
                value: shippingTicket.vehicleInformation.truck.license,
                disabled: false
            }),
            labelNumber: new UntypedFormControl(shippingTicket.driverInformation.labelNumber),
        });
        return driverInformation
    }

    private _createWeightFormGroup(weight: IWNWeightModel): UntypedFormGroup {
        const weightFormGroup: UntypedFormGroup = new UntypedFormGroup({
            sacksNumber: new UntypedFormControl(this._getDefaultSacksValue(weight.sacksNumber), [
                Validators.required,
                this._getValidatorForLoads(),
            ]),
            grossWeight: new UntypedFormControl(weight.grossWeight, [
                Validators.required,
                validatorNonZeroFormControl(),
            ]),
            tare: new UntypedFormControl(this._getDefaultTareValue(weight.tare), [
                Validators.required,
                this._getValidatorForLoads(),
            ]),
            featuredWeight: new UntypedFormControl(weight.featuredWeight),
            index: new UntypedFormControl(weight.index),
            isWarningSacks: new UntypedFormControl(weight.isWarningSacks),
            netWeightQQ: new UntypedFormControl(weight.netWeightQQ),
        });
        weightFormGroup.updateValueAndValidity();
        return weightFormGroup;
    }

    private _createPenaltyFormGroup(penalty: IWNPenaltyModel): UntypedFormGroup {
        let penaltyFormGroup: UntypedFormGroup = new UntypedFormGroup({
            characteristic: new UntypedFormControl({
                value: penalty.characteristic,
                disabled: penalty.characteristicsEnabled.length === 0
            }),
            choiceDeduction: new UntypedFormControl(penalty.choiceDeduction),
            sign: new UntypedFormControl(penalty.sign),
            value: new UntypedFormControl({ value: penalty.value, disabled: true }),
            total: new UntypedFormControl(penalty.total),
            characteristicsEnabled: new UntypedFormControl(penalty.characteristicsEnabled)
        });
        return penaltyFormGroup;
    }

    private _getConfiguration(): void {
        this.isLoadConfiguration = true;
        this.blockUILayout.start();
        this._purchaseOrderService.getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response: ITRConfiguration) => {
                    this.configuration = response;
                    this.blockUILayout.stop();
                    this._getCompanyInfo();
                    this.isLoadConfiguration = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUILayout.stop();
                    this.isLoadConfiguration = false;
                }
            )
    }

    // CATALOGS
    private _getReasonTransfer(): void {
        this.isReasonsTransferLoading = true;
        this._shippingTicketService.getReasonTransfer()
            .pipe(take(1))
            .subscribe(
                response => {
                    this.reasonsTransfer = response;
                    this.isReasonsTransferLoading = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isReasonsTransferLoading = false;
                }
            )

    }

    private _getCompanyBranches(url?: string): void {
        this.companyBranchesPaginator.isLoading = true;
        this._shippingTicketService.getCompanyBranches(url, this._getParams(this.companyBranchesPaginator.searchTerm))
            .pipe(take(1))
            .subscribe(
                (response: ISTCompanyBranchPaginatorModel) => {
                    if (this.companyBranchesPaginator.initialItems.length > 0) {
                        this.companyBranchesPaginator.items = this.companyBranchesPaginator.initialItems.concat(response.items)
                    } else {
                        this.companyBranchesPaginator.items = response.items;
                    }
                    this.companyBranchesPaginator.initialItems = this.companyBranchesPaginator.items;
                    this.companyBranchesPaginator.paginator = response.paginator;
                    this.companyBranchesPaginator.isLoading = false;
                    if (this.companyBranchesPaginator.items.length > 0) {
                        const companyBranchId: number = this.shippingTicket.generalInformation.get('companyBranchId').value;

                        this.shippingTicket.generalInformation.patchValue({
                            companyBranchId: companyBranchId ?? this.companyBranchesPaginator.items[0].id
                        })
                        this.setCompanyBranch()
                    }
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.companyBranchesPaginator.isLoading = false;
                }
            )
    }

    private _getCompanyBranchesPoint(url?: string): void {
        this.companyBranchesPointPaginator.isLoading = true;
        this.companyBranchesPointPaginator.items = null;
        let companyBranchId: number = this.shippingTicket.generalInformation.get('companyBranchId').value;
        this.shippingTicket.generalInformation.patchValue({
            companyBranchPointId: null
        });
        this._shippingTicketService.getCompanyBranchesPoints(companyBranchId, url, this._getParams(this.companyBranchesPointPaginator.searchTerm))
            .pipe(take(1))
            .subscribe(
                (response: ISTCompanyBranchPointPaginatorModel) => {
                    if (this.companyBranchesPointPaginator.initialItems && this.companyBranchesPointPaginator.initialItems.length > 0) {
                        this.companyBranchesPointPaginator.items = this.companyBranchesPointPaginator.initialItems.concat(response.items)
                    } else {
                        this.companyBranchesPointPaginator.items = response.items;
                    }
                    setTimeout(() => {
                        this.companyBranchesPointPaginator.initialItems = this.companyBranchesPointPaginator.items;
                        this.companyBranchesPointPaginator.paginator = response.paginator;
                        this.companyBranchesPointPaginator.isLoading = false;
                        this.shippingTicket.generalInformation.get('companyBranchPointId').enable();
                        if (this.companyBranchesPointPaginator.items && this.companyBranchesPointPaginator.items.length > 0) {
                            this.shippingTicket.generalInformation.patchValue({
                                companyBranchPointId: this.companyBranchesPointPaginator.items[0].id
                            })
                        }
                    }, 500);
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.companyBranchesPointPaginator.isLoading = false;
                }
            )
    }

    private _getBuyers(url?: string): void {
        this._shippingTicketService.getBuyers(url, this._getParams(this.buyersPaginator.searchTerm))
            .pipe(take(1))
            .subscribe(
                (response: ISTBuyerPaginatorModel) => {
                    if (this.buyersPaginator.initialItems.length > 0) {
                        this.buyersPaginator.items = this.buyersPaginator.initialItems.concat(response.items)
                    } else {
                        this.buyersPaginator.items = response.items;
                    }
                    this.buyersPaginator.initialItems = this.buyersPaginator.items;
                    this.buyersPaginator.paginator = response.paginator;
                    this.buyersPaginator.isLoading = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.buyersPaginator.isLoading = false;
                }
            )
    }

    private _getBuyerLocation(url?: string): void {
        let buyerId: number = this.shippingTicket.generalInformation.get('buyerId').value;
        this._shippingTicketService.getBuyerLocation(buyerId, url, this._getParams(this.buyersLocationPaginator.searchTerm))
            .pipe(take(1))
            .subscribe(
                (response: ISTBuyerLocationPaginatorModel) => {
                    if (this.buyersLocationPaginator.initialItems.length > 0) {
                        this.buyersLocationPaginator.items = this.buyersLocationPaginator.initialItems.concat(response.items)
                    } else {
                        this.buyersLocationPaginator.items = response.items;
                    }
                    this.buyersLocationPaginator.initialItems = this.buyersLocationPaginator.items;
                    this.buyersLocationPaginator.paginator = response.paginator;
                    this.buyersLocationPaginator.isLoading = false;
                    this.shippingTicket.generalInformation.get('buyerLocationId').enable();
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.buyersLocationPaginator.isLoading = false;
                }
            )
    }

    private _getCommodities(index: any): void {
        this.isCommoditiesLoading = true;
        this._shippingTicketService.getCommodities()
            .pipe(take(1))
            .subscribe(
                (response: IWNCommodityModel[]) => {
                    this.commodities = response;
                    this.isCommoditiesLoading = false;
                    this.characteristicsWasLoaded = false;
                    if (this.commodities.length > 0) {
                        if (!this.isEdit) {
                            this.shippingTicket.weightCapture.at(index).patchValue({
                                commodityId: this.commodities[0].id
                            })
                        }

                        this.setCommodity(false, index);
                    }
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isCommoditiesLoading = false;
                }
            )
    }

    private _getCommodityTypes(index: number): void {
        let commodityId = this.shippingTicket && this.shippingTicket.weightCapture.at(index).get('commodityId').value;
        this.isCommodityTypesLoading = true;

        if (commodityId) {
            this._shippingTicketService.getCommodityTypes(commodityId)
                .pipe(take(1))
                .subscribe(
                    (response: IWNCommodityTypeModel[]) => {
                        this.commodityTypes = response;
                        this.isCommodityTypesLoading = false;
                        this.shippingTicket.weightCapture.at(index).get('commodityTypeId').enable();
                        this.characteristicsWasLoaded = false;
                    },
                    (error: HttpErrorResponse) => {
                        let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                        this.isCommodityTypesLoading = false;
                    }
                )
        }
    }

    private _getWarehouses(index: number): void {
        this.isWarehousesLoading = true;
        let commodityTransformationId: number = this.shippingTicket.weightCapture.at(index).get('commodityTransformationId').value;
        this._shippingTicketService.getWarehouses(commodityTransformationId)
            .pipe(take(1))
            .subscribe(
                (response: IWNContainerModel[]) => {
                    this.warehouses[index] = response;
                    this.isWarehousesLoading = false;
                    this.shippingTicket.weightCapture.at(index).get('warehouseId').enable();
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.isWarehousesLoading = false;
                }
            )
    }

    private _getCharacteristics(index: any): void {
        this.isCharacteristicsLoading = true;
        let commodityId: number = this.shippingTicket && this.shippingTicket.weightCapture.at(index).get('commodityId').value;
        let params = { 'commodities[]': commodityId }

        if (commodityId) {
            this._shippingTicketService.getCharacteristics(params)
                .pipe(take(1))
                .subscribe(
                    (response: IWNCharacteristicModel[]) => {
                        this.characteristics = response;
                        this.isCharacteristicsLoading = false;
                        this.characteristicsWasLoaded = true;
                        (this.shippingTicket.weightCapture.at(index).get('penalties') as UntypedFormArray).controls.forEach(
                            penalty => {
                                penalty.patchValue({ characteristicsEnabled: this.characteristics });
                                if (penalty.get('characteristic').value) {
                                    penalty.get('value').enable();
                                }
                            }
                        );
                        this.shippingTicket.weightCapture.at(index).get('penalties').enable();
                        if (this.isEdit) {
                            this._setExistCharacteristic(index);
                        }
                    },
                    (error: HttpErrorResponse) => {
                        let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                        this.isCharacteristicsLoading = false;
                    }, () => {
                        this.shippingTicket.weightCapture.getRawValue().forEach((element, index) => {
                            this.tabsWeigthArray[index].disable ?
                                this._disabledweightCaptureClosed(index) :
                                this.shippingTicket.weightCapture.at(index).enable();
                        });
                    }
                )
        }
    }

    private _getDrivers(url?: string): void {
        this.driversPaginator.isLoading = true;
        this._shippingTicketService.getDrivers(url, this._getParams(this.driversPaginator.searchTerm))
            .pipe(take(1))
            .subscribe(
                (response: ISTDriverPaginatorModel) => {
                    if (this.driversPaginator.initialItems.length > 0) {
                        this.driversPaginator.items = this.driversPaginator.initialItems.concat(response.items);
                        this.driversPaginator.items = this.driversPaginator.items.filter((item, index) => this.driversPaginator.items.findIndex(x => x.id === item.id) == index);
                    } else {
                        this.driversPaginator.items = response.items;
                    }
                    this.driversPaginator.initialItems = this.driversPaginator.items;
                    this.driversPaginator.paginator = response.paginator;
                    this.driversPaginator.isLoading = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.driversPaginator.isLoading = false;
                }, () => {
                    this.driversPaginator.isLoading = false;
                }
            )
    }

    private _getVehicles(url?: string): void {
        this.vehiclesPaginator.isLoading = true;
        this._shippingTicketService.getTrucks(url, this._getParams(this.vehiclesPaginator.searchTerm))
            .pipe(take(1))
            .subscribe(
                (response: ISTVehiclePaginatorModel) => {
                    if (this.vehiclesPaginator.initialItems.length > 0) {
                        this.vehiclesPaginator.items = this.vehiclesPaginator.initialItems.concat(response.items)
                        this.vehiclesPaginator.items = this.vehiclesPaginator.items.filter((item, index) => this.vehiclesPaginator.items.findIndex(x => x.truckId === item.truckId) == index);
                    } else {
                        this.vehiclesPaginator.items = response.items;
                    }
                    this.vehiclesPaginator.initialItems = this.vehiclesPaginator.items;
                    this.vehiclesPaginator.paginator = response.paginator;
                    this.vehiclesPaginator.isLoading = false;
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.vehiclesPaginator.isLoading = false;
                }
            )
    }

    private _getParams(searchTerm: string): {} {

        if (this.shippingTicket) {
            let company = this.shippingTicket.driverInformation.get('transportCompanyId').value;

            let params: any = searchTerm ?
                { q: searchTerm, type: this.deliveredBy, search_field: CONSTANTS.TYPE_TRUCK_SEARCH_FIELD.LICENSE }
                : { type: this.deliveredBy, search_field: CONSTANTS.TYPE_TRUCK_SEARCH_FIELD.LICENSE };
            params = Object.assign(params,
                company === null ? null : { company },
            );
            return params;

        } return null;


    }
    public formWeightCaptureReady(event, i: number) {
        this.formWeigth = event.get('weights');
        ((this.shippingTicket.weightCapture as UntypedFormArray).at(i) as UntypedFormGroup).setControl("weights", this.formWeigth);
        this.formWeigth.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(_ => {
            this.calculateWeightTotals(i);
            this.recalculateCharacteristicsValues();
        });



    }


    // PAGINATION
    public onCompanyBranchScrollToEnd(): void {
        if (this.companyBranchesPaginator.paginator.nextPageUrl) {
            this._getCompanyBranches(this.companyBranchesPaginator.paginator.nextPageUrl)
        }
    }

    public onCompanyBranchPointScrollToEnd(): void {
        if (this.companyBranchesPointPaginator.paginator.nextPageUrl) {
            this._getCompanyBranchesPoint(this.companyBranchesPointPaginator.paginator.nextPageUrl)
        }
    }

    public onBuyersScrollToEnd(): void {
        if (this.buyersPaginator.paginator.nextPageUrl) {
            this._getBuyers(this.buyersPaginator.paginator.nextPageUrl)
        }
    }

    public onBuyersLocationsScrollToEnd(): void {
        if (this.buyersLocationPaginator.paginator.nextPageUrl) {
            this._getBuyerLocation(this.buyersLocationPaginator.paginator.nextPageUrl)
        }
    }

    public onDriverScrollToEnd(): void {
        if (this.driversPaginator.paginator.nextPageUrl) {
            this._getDrivers(this.driversPaginator.paginator.nextPageUrl)
        }
    }

    public onVehicleScrollToEnd(): void {
        if (this.vehiclesPaginator.paginator.nextPageUrl) {
            this._getVehicles(this.vehiclesPaginator.paginator.nextPageUrl)
        }
    }

    // SEARCH
    public onSearchCompanyBranch(searchTerm: string): void {
        this.companyBranchesPaginator.initialItems = []
        this.companyBranchesPaginator.initialItems = []
        this.companyBranchesPaginator.searchTerm = searchTerm ?? null;
        this._getCompanyBranches();
    }

    public onSearchCompanyBranchPoint(searchTerm: string): void {
        this.companyBranchesPointPaginator.initialItems = []
        this.companyBranchesPointPaginator.searchTerm = searchTerm ?? null;
        this._getCompanyBranchesPoint();
    }

    public onSearchBuyers(searchTerm: string): void {
        this.buyersPaginator.initialItems = []
        this.buyersPaginator.searchTerm = searchTerm ?? null;
        this._getBuyers();
    }

    public onSearchBuyerLocation(searchTerm: string): void {
        this.buyersLocationPaginator.initialItems = [];
        this.buyersLocationPaginator.searchTerm = searchTerm ?? null;
        this._getBuyerLocation();
    }

    public onSearchDriver(searchTerm: string): void {
        this.driversPaginator.initialItems = []
        this.driversPaginator.searchTerm = searchTerm ?? null;
        this._getDrivers();
    }

    public onSearchVehicle(searchTerm: string): void {
        this.vehiclesPaginator.initialItems = []
        this.vehiclesPaginator.searchTerm = searchTerm ?? null;
        this._getVehicles();
    }

    // SETTERS
    public setCompanyBranch(): void {
        this.companyBranchesPointPaginator.initialItems = [];
        this._getCompanyBranchesPoint();
    }

    public setBuyer(): void {
        this.buyersLocationPaginator.initialItems = [];
        this.buyersLocationPaginator.isLoading = true;
        this.shippingTicket.generalInformation.get('buyerLocationId').reset();
        this._getBuyerLocation();
    }

    public setCommodity(isFromChangeEvent: boolean = true, index: number): void {
        this._getCommodityTypes(index);
        this._getCharacteristics(index);
        this.shippingTicket && this.shippingTicket.weightCapture.at(index).patchValue({ isWarningContainer: false });
        if (isFromChangeEvent) {
            this.shippingTicket.weightCapture.at(index).get('commodityTypeId').reset();
            this.shippingTicket.weightCapture.at(index).get('commodityTransformationId').reset();
            this.shippingTicket.weightCapture.at(index).get('commodityTransformationName').reset();
            this.shippingTicket.weightCapture.at(index).get('warehouseId').reset();
        }
    }

    public setCommodityType(commodityType: IWNCommodityTypeModel, index: number): void {
        this.shippingTicket.weightCapture.at(index).patchValue({
            commodityTransformationId: commodityType.transformationTypeId,
            commodityTransformationName: commodityType.transformationTypeName
        })
        this.shippingTicket.weightCapture.at(index).get('warehouseId').reset();
        this._getWarehouses(index);


    }

    public setCharacteristic(index: number, indexForm: number): void {
        let validatorsValue: Array<ValidatorFn> = [Validators.required];
        let characteristic: IWNCharacteristicModel = (this.shippingTicket.weightCapture.at(indexForm)
            .get('penalties') as UntypedFormArray).at(index).get('characteristic').value;
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).controls.forEach(
            penalty => {
                let characteristicsEnabled = this._updateCharacteristicsList((penalty as UntypedFormGroup).getRawValue(), indexForm);
                penalty.patchValue({
                    characteristicsEnabled: characteristicsEnabled.slice(),
                });
            }
        );
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('choiceDeduction').clearValidators();
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('choiceDeduction').updateValueAndValidity();
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('value').clearValidators();
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('value').updateValueAndValidity();
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).patchValue({
            choiceDeduction: null,
            value: characteristic.defaultValue ?? null,
            sign: null,
            total: null,
        });
        if (CONSTANTS.DEDUCTION_TYPE.TABLE == characteristic.deduction.type || CONSTANTS.DEDUCTION_TYPE.INPUT == characteristic.deduction.type) {
            validatorsValue.push(validatorNumericalRangeFormControl(
                characteristic.deduction.min,
                characteristic.deduction.max
            ));
        } else {
            (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('choiceDeduction').setValidators(Validators.required);
            (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('choiceDeduction').updateValueAndValidity();
        }
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('value').setValidators(validatorsValue);
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('value').updateValueAndValidity();
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('choiceDeduction').enable();
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).at(index).get('value').enable();
        this._applyDeduction(index, indexForm);
    }

    public setDriver(driver: ITDriverModel) {
        this.shippingTicket.driverInformation.patchValue({
            driverIdentity: driver.identity
        })
    }

    public setVehicle(vehicle: TrucksModel) {
        this.shippingTicket.driverInformation.patchValue({
            vehicleType: vehicle.vehicleType,
            vehicleId: vehicle.truckId,
            vehicleModel: vehicle.name
        })
    }

    public setWarehouse(even, index: number) {
        this.hideHightLimitNotification(false, index);
    }

    //INITIAL SETTERS
    private _setInitialItem(item: any, initialItems: any[], key: string) {
        let itemIndex = initialItems.findIndex(i => i[key] == i[key]);
        if (itemIndex == -1) {
            initialItems.push(item)
        }
    }

    public tooglePanel(section: string, open: boolean): void {
        this.calculateWeightTotals();
        if (this.sections[section].open != open)
            this.sections[section].open = open;
    }

    public captureWeight(): void {
        Object.keys(this.sections).map(section => this.sections[section].open = false)
        this.sections.weightCapture.disabled = false;
        this.sections.weightCapture.open = true;
    }

    public nextSection() {
        Object.keys(this.sections).map(section => this.sections[section].open = false)
        this.sections.driverInformation.disabled = false;
        this.sections.driverInformation.open = true;
    }


    public addNewNoteWeigth(): void {
        this.weights.push([]);

        this.tabsWeigthArray.push({
            disable: false,
            noteFolio: ''
        });
        this.wnLastIndex++;
        this.warehouses[this.wnLastIndex] = [];
        this.showTabWeigthNotes = this.wnLastIndex;
        let shippingTicket: IShippingTicketModel = new ShippingTicketModel();

        let weightFormGroup: UntypedFormGroup = this._createWeightCaptureFormGroup(shippingTicket, 0);
        this.shippingTicket.weightCapture.push(weightFormGroup)

        if (this.wnLastIndex > 0) {

            let valuefirst = this.shippingTicket.weightCapture.at(0).get('commodityId').value;

            this.shippingTicket.weightCapture.at(this.wnLastIndex).patchValue({
                commodityId: valuefirst
            });
            this.setCommodity(false, this.wnLastIndex);
        }

    }

    public deleteWeight(index: number, event: any, indexForm: number): void {
        event.stopPropagation();
        (this.shippingTicket.weightCapture.at(indexForm).get('weights') as UntypedFormArray).removeAt(index);
        this.calculateWeightTotals(indexForm);
        this._applyDeduction(index, indexForm);
    }


    private _applyDeduction(index: number, indexForm: number): void {
        if (this.deductionsTradingStatus.refTimeout) {
            clearTimeout(this.deductionsTradingStatus.refTimeout);
            this.deductionsTradingStatus.refTimeout = null;
        }
        this.destroyDeductionRequest$.next(true);
        this.destroyDeductionRequest$.complete();
        this.destroyDeductionRequest$ = new Subject();
        this.deductionsTradingStatus.isBeingCalculated = false;
        let totalNet: number = this.shippingTicket.weightCapture.at(indexForm).get('totalNet').value;
        this.hideHightLimitNotification(false, indexForm);
        if (totalNet > 0) {
            let penalties: Array<IWNPenaltyModel> = this._getPenaltiesForTrading(index, indexForm);
            this.calculateWeightTotals(indexForm);
            if (penalties.length > 0) {
                this._sendRequestApply(totalNet, penalties, indexForm);
            } else {
                this.shippingTicket.weightCapture.at(indexForm).patchValue({ totalCharacteristicsPercent: 0 })
            }
        } else {
            (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).controls.forEach(
                (penaltyControls: UntypedFormGroup) => penaltyControls.patchValue({ sign: null, total: null })
            );
            this.calculateWeightTotals(indexForm);
        }
    }

    private _sendRequestApply(
        totalNet: number,
        penalties: Array<IWNPenaltyModel>,
        index
    ): void {
        this.deductionsTradingStatus.isBeingCalculated = true;
        this.deductionsTradingStatus.refTimeout = setTimeout(() => {
            let deductionsTrading: IWNDeductionsTradingModel = new WNDeductionsTradingModel(
                { weight: totalNet, penalties: penalties }
            );
            this._shippingTicketService
                .applyDeductions(deductionsTrading)
                .pipe(takeUntil(this.destroyDeductionRequest$))
                .subscribe(
                    (response: any) => {
                        if (response.data.timestamp > this.deductionsTradingStatus.timestamp) {
                            this.deductionsTradingStatus.timestamp = response.data.timestamp;
                            let totalCharacteristicsPercent = 0;
                            (this.shippingTicket.weightCapture.at(index).get('penalties') as UntypedFormArray).controls.forEach(
                                (c: UntypedFormGroup) => {
                                    let idx: number = response.data.deductions.findIndex(
                                        (v: any) => v.id == c.get('characteristic').value?.deduction?.id
                                    );
                                    if (idx > -1) {
                                        if (
                                            c.get('characteristic').value.deduction.type == this.CONSTANTS.DEDUCTION_TYPE.TABLE ||
                                            c.get('characteristic').value.deduction.type == this.CONSTANTS.DEDUCTION_TYPE.INPUT
                                        ) {
                                            if(this.getDeductionsAllowAction(c.get('characteristic').value) !== this.DEDUCTIONS_ALLOW_ACTIONS.NO_ACTION) {
                                                totalCharacteristicsPercent += parseFloat(response.data.deductions[idx].value);
                                            }
                                        } else if (c.get('characteristic').value.deduction.type == this.CONSTANTS.DEDUCTION_TYPE.CHOICE) {
                                            let option: IWNOptionChoiceDeductionModel = c.get('characteristic').value.deduction?.options.find(
                                                (o: IWNOptionChoiceDeductionModel) => o.name == response.data.deductions[idx].value
                                            )
                                            if (option) {
                                                let percent = 100 - option.coefficient;
                                                totalCharacteristicsPercent += percent;
                                            }
                                        }
                                        let totalPenalty: number = truncateDecimals(
                                            response.data.deductions[idx].total,
                                            this.DECIMAL_DIGITS
                                        );
                                        c.patchValue({
                                            sign: response.data.deductions[idx].sign,
                                            total: totalPenalty,
                                        });
                                    }
                                }
                            );
                            this.shippingTicket.weightCapture.at(index).patchValue({ totalCharacteristicsPercent })
                            this.calculateWeightTotals(index);
                            this.deductionsTradingStatus.isBeingCalculated = false;
                        }
                    },
                    (error: HttpErrorResponse) => {
                        let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                        this.deductionsTradingStatus.isBeingCalculated = false;
                    }
                )
        }, 600);
    }

    private _getPenaltiesForTrading(index: number, indexForm: number): Array<IWNPenaltyModel> {
        let penalties: Array<IWNPenaltyModel> = [];
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).controls.forEach((g: UntypedFormGroup) => {
            let penaltyValues: IWNPenaltyModel = g.getRawValue();
            if (CONSTANTS.DEDUCTION_TYPE.TABLE == penaltyValues.characteristic?.deduction?.type ||
                CONSTANTS.DEDUCTION_TYPE.INPUT == penaltyValues.characteristic?.deduction?.type) {
                penaltyValues.value = convertStringToNumber(penaltyValues.value).toString();
            }
            if (
                penaltyValues.characteristic &&
                (CONSTANTS.DEDUCTION_TYPE.TABLE == penaltyValues.characteristic.deduction?.type ||
                    CONSTANTS.DEDUCTION_TYPE.INPUT == penaltyValues.characteristic.deduction?.type ||
                    (CONSTANTS.DEDUCTION_TYPE.CHOICE == penaltyValues.characteristic.deduction?.type &&
                        penaltyValues.choiceDeduction)) &&
                penaltyValues.value &&
                penaltyValues.value != '' &&
                penaltyValues.value != '-' &&
                penaltyValues.value != '+' &&
                !g.get('value').errors
            ) {
                penalties.push(penaltyValues);
            } else {
                g.patchValue({ sign: null, total: null });
            }
        });
        return penalties;
    }

    public calculateWeightTotals(formIndex: number = 0): void {

        let weight: IWNWeightModel = null;
        let penalty: IWNPenaltyModel = null;
        let totalSacks: number = 0;
        let totalGross: number = 0;
        let totalTare: number = 0;
        let totalDiscount: number = 0;
        let totalAddition: number = 0;
        let totalSubtraction: number = 0;
        let totalNet: number = 0;
        let totalNetDryWt: number = 0;
        let totalCharacteristics: number = 0;
        let totalGrossQQ: number = 0;
        let totalTareQQ: number = 0;
        let totalDiscountQQ: number = 0;
        let totalAdditionQQ: number = 0;
        let totalSubtractionQQ: number = 0;
        let totalNetQQ: number = 0;
        let totalNetQQRow: number = 0;
        let totalNetDryWtQQ: number = 0;

        this.hideHightLimitNotification(false, formIndex);
        // Weights
        (this.shippingTicket.weightCapture.at(formIndex)
            .get('weights') as UntypedFormArray).controls.forEach((w: UntypedFormGroup) => {
                weight = w.getRawValue();
                weight.sacksNumber = convertStringToNumber(
                    weight.sacksNumber?.toString()
                );
                weight.grossWeight = convertStringToNumber(
                    weight.grossWeight?.toString()
                );
                weight.tare = convertStringToNumber(weight.tare?.toString());
                totalSacks += weight.sacksNumber;
                totalGross = accurateDecimalSum(
                    [totalGross, weight.grossWeight],
                    this.DECIMAL_DIGITS
                );
                totalTare = accurateDecimalSum(
                    [totalTare, weight.tare, weight.tareAditional],
                    this.DECIMAL_DIGITS
                );
                totalNetQQRow = accurateDecimalSum(
                    [
                        totalNetQQRow,
                        convertStringToNumber(weight.netWeightQQ?.toString()),
                    ],
                    this.DECIMAL_DIGITS
                );
            });
        // Penalties
        (this.shippingTicket.weightCapture.at(formIndex)
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
            [totalGross, totalTare, totalDiscount],
            this.DECIMAL_DIGITS
        );
        totalNet = accurateDecimalSubtraction(
            [totalGross, totalTare],
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

        totalGrossQQ = roundDecimal(
            totalGross * this.configuration.baseMeasurementUnitFactor,
            this.DECIMAL_DIGITS
        );
        totalTareQQ = roundUp(
            totalTare * this.configuration.baseMeasurementUnitFactor,
            this.DECIMAL_DIGITS
        );
        totalDiscountQQ = roundUp(
            totalDiscount * this.configuration.baseMeasurementUnitFactor,
            this.DECIMAL_DIGITS
        );
        totalAdditionQQ = roundDecimal(
            totalAddition * this.configuration.baseMeasurementUnitFactor,
            this.DECIMAL_DIGITS
        );
        totalSubtractionQQ = totalGrossQQ - totalTareQQ - totalDiscountQQ;
        totalNetQQ = totalGrossQQ - totalTareQQ;
        totalNetDryWtQQ = convertLbtoQQ(totalNet - totalDiscount);

        this.shippingTicket.weightCapture.at(formIndex).patchValue({
            totalSacks: totalSacks,
            totalGross: totalGross,
            totalTare: totalTare,
            totalDiscount: totalDiscount,
            totalAddition: totalAddition,
            totalNet: totalNet,
            totalNetDryWt: totalNetDryWt,
            totalCharacteristics: totalCharacteristics,
            totalGrossQQ: totalGrossQQ,
            totalTareQQ: totalTareQQ,
            totalDiscountQQ: totalDiscountQQ,
            totalAdditionQQ: totalAdditionQQ,
            totalNetQQRow: totalNetQQRow,
            totalNetQQ: totalNetQQ,
            totalNetDryWtQQ: totalNetDryWtQQ,
        });
        if (this.warehouse) {
            let isWarningContainer = totalNetDryWt > this.warehouse.stockLb;
            this.shippingTicket.weightCapture.at(formIndex).patchValue({ isWarningContainer });
        }
        this.characteristicsError = this.shippingTicket.weightCapture.at(formIndex).get('totalCharacteristicsPercent').value > 100;

    }

    public onWarehouseEvent(warehouse: ISubtankModel, index: number) {

        this.warehouse = warehouse;
        let totalNetDryWt = this.shippingTicket.weightCapture.at(index).get('totalNetDryWt').value;
        let isWarningContainer = totalNetDryWt > this.warehouse.stockLb;
        this.shippingTicket.weightCapture.at(index).patchValue({ isWarningContainer });
    }

    public hideHightLimitNotification(hideOnlySnackBar: boolean = false, index: number): void {
        if (!hideOnlySnackBar) {
            this.shippingTicket.weightCapture.at(index).patchValue({ isWarningContainer: false });
        }
    }


    private _updateCharacteristicsList(penalty: IWNPenaltyModel = null, index): Array<IWNCharacteristicModel> {
        let characteristics: Array<IWNCharacteristicModel> = [];
        let weightCapture = this.shippingTicket.weightCapture.getRawValue();
        this.characteristics.forEach(
            (item: IWNCharacteristicModel) => {
                if (penalty && item.id == penalty.characteristic?.id) {
                    item.disabled = false;
                } else {
                    item.disabled = weightCapture[index].penalties.findIndex(
                        (p: IWNPenaltyModel) => p.characteristic?.id == item.id) > -1;
                }
                characteristics.push(item);
            });
        return characteristics;
    }

    public eventChangePenaltyValue(index: number, indexForm: number): void {
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray)
            .at(index)
            .patchValue({ sign: null, total: null });
        this._applyDeduction(index, indexForm);
    }

    public recalculateCharacteristicsValues() {
        let activeTab = this.showTabWeigthNotes;
        let characteristic = (this.shippingTicket.weightCapture.at(activeTab).get('penalties') as UntypedFormArray).getRawValue()
        if (characteristic[0].characteristic) {
            characteristic.forEach((index) => {
                this._applyDeduction(index, activeTab);
            })
        }
    }

    public addPenalty(index: number): void {
        let penalty: IWNPenaltyModel = new WNPenaltyModel({
            characteristicsEnabled: this._updateCharacteristicsList(null, index),
        });
        (this.shippingTicket.weightCapture.at(index).get('penalties') as UntypedFormArray).push(
            this._createPenaltyFormGroup(penalty)
        );
    }

    public removePenalty(index: number, indexForm: number): void {
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).removeAt(index);
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray).controls.forEach(
            (p) => {
                p.patchValue({
                    characteristicsEnabled: this._updateCharacteristicsList(
                        (p as UntypedFormGroup).getRawValue(), indexForm
                    ),
                });
            }
        );
        this.calculateWeightTotals(indexForm);
        this._applyDeduction(index, indexForm);
    }

    public setDeductionSelection(index: number, value: { name: string }, indexForm: number): void {
        (this.shippingTicket.weightCapture.at(indexForm).get('penalties') as UntypedFormArray)
            .at(index)
            .patchValue({
                value: value.name,
                sign: null,
                total: null,
            });
        this._applyDeduction(index, indexForm);
    }

    public submit(index) {

        if (this._shippingTicketId) {
            this.updateShippingTicket(false, index);
        } else {
            this.createShippingTicket(false, index);
        }
    }

    public createShippingTicket(isBeforeClose: boolean = false, index: number) {
        this.blockUILayout.start();

        let shippingTicket: IShippingTicketModel = {
            generalInformation: this.shippingTicket.generalInformation.getRawValue(),
            weightCapture: this.shippingTicket.weightCapture.getRawValue(),
            driverInformation: this.shippingTicket.driverInformation.getRawValue()
        }
        shippingTicket.generalInformation.close = isBeforeClose;
        let request = new ShippingTicketRequestModel(shippingTicket)

        this._shippingTicketService.createShippingTicket(request)
            .pipe(take(1))
            .subscribe(
                (response: any) => {
                    const navigateRoute = '/routes/shipping-ticket';
                    this._notifierService.notify('success', this._i18nPipe.transform("t-receiving-note-created"));
                    if (isBeforeClose) {
                        this._shippingTicketId = response.data.shipping_ticket_id;
                        shippingTicket.generalInformation.id = this._shippingTicketId;
                        const lang = localStorage.getItem('lang') ?? CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG;
                        this.generateReportsHelpClass
                            .onGenerateReportPdf(this.blockUILayout, lang, shippingTicket.generalInformation, CONSTANTS.CRUD_ACTION.PRINT, navigateRoute);
                    } else {
                        this.blockUILayout.stop();
                        this._router.navigateByUrl(navigateRoute);
                    }
                },
                (error: HttpErrorResponse) => {
                    this.blockUILayout.stop();
                    if (error.error.message == 'Error saving weight notes: Available stock is low') {
                        this.hideHightLimitNotification(false, index);
                        let warehouse = this.warehouses[index].find(
                            w => w.id == this.shippingTicket.weightCapture.at(index).get('warehouseId').value
                        )
                        // revisar cero
                        this.shippingTicket.weightCapture.at(index).patchValue({ isWarningContainer: true });
                        this._notifierService.show({
                            message: this._i18nPipe.transform('shipping-ticket-container-hight-limit')
                                .replace('[name]', warehouse?.name),
                            type: 'warning',
                            template: this.hightLimitContainerNotification,
                            id: 'CONTAINER_HIGHT_LIMIT',
                        });
                    } else {
                        let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    }
                }
            )
    }

    public closeShippingticketDialog(index: number) {
        const settingsDialogComponent: ITRDialogSettings = {
            title: this._i18nPipe.transform('shipping-note-close-dialog-confirmation').replace('value', this.shippingTicket.generalInformation.get('folio').value),
        }
        this.blockUILayout.start();
        this._dialog.open(ConfirmationDialogComponent, {
            autoFocus: false,
            disableClose: true,
            data: settingsDialogComponent,
        }).afterClosed().pipe(takeUntil(this.destroy$)).subscribe(
            (action: number) => {
                action === CONSTANTS.CRUD_ACTION.ACCEPT && this.closeCompleteShippingTicket(index);
            }, null, () => {
                this.blockUILayout.stop();
            });
    }

    private closeCompleteShippingTicket(index: number) {
        this.blockUILayout.start();
        const navigateRoute = '/routes/shipping-ticket';

        let shippingTicket: IShippingTicketModel = {
            generalInformation: this.shippingTicket.generalInformation.getRawValue(),
            weightCapture: this.shippingTicket.weightCapture.getRawValue(),
            driverInformation: this.shippingTicket.driverInformation.getRawValue()
        }
        this._shippingTicketService.closeShippingTicket(this._shippingTicketId)
            .pipe(take(1))
            .subscribe(
                response => {
                    this._notifierService.notify('success', this._i18nPipe.transform('shipping-ticket-closed'));
                    const lang = localStorage.getItem('lang') ?? CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG;
                    shippingTicket.generalInformation.id = this._shippingTicketId;
                    this.generateReportsHelpClass
                        .onGenerateReportPdf(this.blockUILayout, lang, shippingTicket.generalInformation, CONSTANTS.CRUD_ACTION.PRINT, navigateRoute);

                }, error => {

                    let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }, () => {
                    this._router.navigateByUrl(navigateRoute);
                    this.blockUILayout.stop();
                })
    }

    public updateShippingTicket(isBeforeClose: boolean = false, index: number) {

        let arrayNews = []
        let saveNoCloses = [

            this.tabsWeigthArray.forEach((item, index) => {
                if (!item.disable) {
                    arrayNews.push(this.shippingTicket.weightCapture.getRawValue()[index])
                }
            })

        ]
        const navigateRoute = '/routes/shipping-ticket';

        if (arrayNews.length > 0) {

            let shippingTicket: IShippingTicketModel = {
                generalInformation: this.shippingTicket.generalInformation.getRawValue(),
                weightCapture: arrayNews,
                driverInformation: this.shippingTicket.driverInformation.getRawValue()
            }

            shippingTicket.generalInformation.close = isBeforeClose;

            let request = new ShippingTicketRequestModel(shippingTicket)


            this._shippingTicketService.updateShippingTicket(request, this._shippingTicketId)
                .pipe(take(1))
                .subscribe(
                    response => {
                        this.blockUILayout.stop();

                        if (isBeforeClose) {
                            this._notifierService.notify('success', this._i18nPipe.transform("t-receiving-note-created"));
                            const lang = localStorage.getItem('lang') ?? CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG;
                            shippingTicket.generalInformation.id = this._shippingTicketId;
                            this.generateReportsHelpClass
                                .onGenerateReportPdf(this.blockUILayout, lang, shippingTicket.generalInformation, CONSTANTS.CRUD_ACTION.PRINT, navigateRoute);
                        } else {
                            this._notifierService.notify('success', this._i18nPipe.transform('shipping-ticket-updated'));
                        }
                        this._router.navigateByUrl(navigateRoute);
                    },
                    (error: HttpErrorResponse) => {
                        this.blockUILayout.stop();
                        if (error.error.message == 'Error saving weight notes: Available stock is low') {
                            this.hideHightLimitNotification(false, index);
                            let warehouse = this.warehouses[index].find(
                                w => w.id == this.shippingTicket.weightCapture.at(index).get('warehouseId').value
                            )
                            this.shippingTicket.weightCapture.at(0).patchValue({ isWarningContainer: true });
                            this._notifierService.show({
                                message: this._i18nPipe.transform('shipping-ticket-container-hight-limit')
                                    .replace('[name]', warehouse?.name),
                                type: 'warning',
                                template: this.hightLimitContainerNotification,
                                id: 'CONTAINER_HIGHT_LIMIT',
                            });
                        } else {
                            let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
                            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                        }
                    }
                )
        } else {
            this._router.navigateByUrl(navigateRoute);
        }

    }


    public closeWeightNote(index: number) {
        if (this._shippingTicketId) {
            this.createSecondShippingTicket(index)
        } else {
            this.closeFirstWeightNote(index);
        }
    }

    public createSecondShippingTicket(index: number) {
        this.blockUILayout.start();

        let shippingTicket: IShippingTicketModel = {
            generalInformation: this.shippingTicket.generalInformation.getRawValue(),
            weightCapture: [this.shippingTicket.weightCapture.getRawValue()[index]],
            driverInformation: this.shippingTicket.driverInformation.getRawValue()
        }

        let request = new ShippingTicketRequestModel(shippingTicket);
        request.weight_notes[0].close = true;
        this._shippingTicketService.updateShippingTicket(request, this._shippingTicketId)
            .pipe(take(1))
            .subscribe(
                (response: any) => {
                    this._shippingTicket = response.data;
                    this.tabsWeigthArray[index].disable = true;
                    this._closeIndividualNote(response?.data, index);
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                },
                () => {
                    this.blockUILayout.stop();
                });

    }

    public closeFirstWeightNote(index: number) {

        this.blockUILayout.start();

        let shippingTicket: IShippingTicketModel = {
            generalInformation: this.shippingTicket.generalInformation.getRawValue(),
            weightCapture: [this.shippingTicket.weightCapture.getRawValue()[index]],
            driverInformation: this.shippingTicket.driverInformation.getRawValue()
        }


        let request = new ShippingTicketRequestModel(shippingTicket)
        request.weight_notes[0].close = true;

        this._shippingTicketService.createShippingTicket(request)
            .pipe(take(1))
            .subscribe(
                (response: any) => {

                    this._notifierService.notify('success', this._i18nPipe.transform('t-weight-note-closed'));

                    const folio = String(response.data.ticket_number).padStart(5, '0');
                    this.shippingTicket.weightCapture.at(index).patchValue({ 'noteFolio': folio });
                    this.shippingTicket.generalInformation.patchValue({ 'folio': folio });

                    this.tabsWeigthArray[index].disable = true;
                    this._closeIndividualNote(response?.data, index, true);

                    this.shippingTicket.weightCapture.at(0).get('commodityId').disable()
                },
                (error) => {
                    let message: string = this._errorHandlerService.handleError(error, 'shipping-ticket');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                },
                () => {
                    this.blockUILayout.stop();
                });

    }

    private _closeIndividualNote(data, index: number, first = false) {
        const indexNote = data.weight_notes.length - 1;
        this.shippingTicket.weightCapture.at(index).patchValue({ 'noteFolio': data.weight_notes[indexNote].note_folio });
        this._shippingTicketId = data.shipping_ticket_id;
        this.tabsWeigthArray[index] = {
            noteFolio: data.weight_notes[indexNote].note_folio,
            disable: data.note_status == 1 ? false : true
        };

        this.shippingTicket.weightCapture.at(index).disable()
    }

    public deleteWeightNote(index: number, wn) {
        wn.value.shippingNoteId ? this.deleteNoteService(wn.value.shippingNoteId, index) : this.deleteViewWeightNote(index);
    }

    public deleteNoteService(shippingNoteId: string, index: number) {

        this._shippingTicketService.deleteShippingNote(shippingNoteId).pipe(take(1)).subscribe(resp => {
            this.deleteViewWeightNote(index);
        })
    }

    public deleteViewWeightNote(index: number) {
        this.tabsWeigthArray.splice(index, 1);
        this.warehouses.splice(index, 1);
        this.shippingTicket.weightCapture.removeAt(index);
        this.showTabWeigthNotes = this.shippingTicket.weightCapture.controls.length - 1;
        this.wnLastIndex--;
    }


    public disabledCloseNote(index: number) {
        return this.shippingTicket.generalInformation.invalid
            || this.shippingTicket.driverInformation.invalid
            || this.shippingTicket.weightCapture.at(index).invalid
            || this.shippingTicket.weightCapture.at(index).disabled
            || this.tabsWeigthArray[index].disable
            || this.shippingTicket.weightCapture.at(index).get('isWarningContainer').value
    }

    public disabledCloseShippingTicket() {
        return !this.tabsWeigthArray.every((item) => item.disable === true)
    }

    public setOwnerType(type: number) {
        if (type !== this.deliveredBy) {
            this.deliveredBy = type;
            this.driversPaginator = new STDriverPaginatorModel();
            this.vehiclesPaginator = new STVehiclePaginatorModel();
            const transportCompanyControl = this.shippingTicket.driverInformation.get('transportCompanyId');
            const labelCacheValue = this.shippingTicket.driverInformation.get('labelNumber').value;
            this.shippingTicket.driverInformation.reset();
            transportCompanyControl.clearValidators();
            this.transportCompanies = [];
            if (type == 2) {
                this._getTransportCompanies(null);
                this.shippingTicket.driverInformation.get('driverId').disable();
                this.shippingTicket.driverInformation.get('vehicleId').disable();
                this.driversPaginator.isLoading = false;
                this.vehiclesPaginator.isLoading = false;
            } else {
                this._getDrivers();
                this._getVehicles();
                this.shippingTicket.driverInformation.get('driverId').enable();
                this.shippingTicket.driverInformation.get('vehicleId').enable();
                transportCompanyControl.patchValue(null);
                transportCompanyControl.disable();
            }
            this.shippingTicket.driverInformation.get('labelNumber').patchValue(labelCacheValue);
            transportCompanyControl.updateValueAndValidity();
        }
    }

    public paginationTransport() {
        if (this._transportCompanyPaginator.nextPageUrl) {
            this._getTransportCompanies(this._transportCompanyPaginator.nextPageUrl)
        }
    }

    public _getTransportCompanies(url: string) {
        this.transportCompaniesLoading = true;
        this._companyService.getTransportCompanies(url)
            .pipe(take(1))
            .subscribe(
                (response: { data: ICompanyModel[], paginator: IPaginator }) => {
                    let transportCompanies = response.data;
                    this.transportCompanies = arrayUnique(this.transportCompanies.concat(transportCompanies), 'id');
                    this._transportCompanyPaginator = response.paginator;
                    this.transportCompaniesLoading = false;
                    const transportCompanyControl = this.shippingTicket.driverInformation.get('transportCompanyId');
                    transportCompanyControl.setValidators([Validators.required]);
                    transportCompanyControl.enable();
                    transportCompanyControl.updateValueAndValidity();

                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(error, 't-drivers');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.transportCompaniesLoading = false;
                }
            )
    }

    public setCompanyDelivered(company: ICompanyModel) {
        this.shippingTicket.driverInformation.patchValue({
            transportCompanyId: company.id
        });
        this.driversPaginator = new STDriverPaginatorModel();
        this.vehiclesPaginator = new STVehiclePaginatorModel();
        this.shippingTicket.driverInformation.get('driverId').patchValue(null);
        this.shippingTicket.driverInformation.get('vehicleId').patchValue(null);
        this.shippingTicket.driverInformation.get('driverId').enable();
        this.shippingTicket.driverInformation.get('vehicleId').enable();
        this.shippingTicket.driverInformation.updateValueAndValidity();
        this._getDrivers();
        this._getVehicles();
    }

    private _getDefaultSacksValue(defaultValue: number) {
        const defaultContainer: ISTConfigurationCompanyModel = this._getConfigurationOfCompanyByName(CONSTANTS.LOADS_CONFIG.LOAD_DEFAULT_CONTAINER);

        if (defaultContainer.value > -1 && defaultValue === null) {
            return defaultContainer.value;
        }

        return defaultValue;
    }

    private _getDefaultTareValue(defaultValue: number) {
        const defaultTare: ISTConfigurationCompanyModel = this._getConfigurationOfCompanyByName(CONSTANTS.LOADS_CONFIG.LOAD_DEFAULT_TARE);
        let tareValue = defaultValue;

        if (defaultTare.value > -1 && defaultValue === null) {
            tareValue = defaultTare.value as number;
        }

        return defaultValue ?? this.configuration.tareFactor * tareValue;
    }

    private _getConfigurationOfCompanyByName(name: string): ISTConfigurationCompanyModel {
        const { config = [] } = this.companyInfo || {};

        return config.find((item: ISTConfigurationCompanyModel) => item.name === name) || {};
    }

    public disabledDeleteWn(i: number) {
        return this.shippingTicket.weightCapture.controls.length <= 1 || this.tabsWeigthArray[i].disable;
    }

    get disableSaveExit(): boolean {
        return this.shippingTicket.generalInformation.invalid ||
            this.shippingTicket.generalInformation.pending ||
            this.shippingTicket.weightCapture.invalid ||
            this.shippingTicket.weightCapture.pending ||
            this.shippingTicket.driverInformation.invalid ||
            this.shippingTicket.driverInformation.pending ||
            (this.isEdit && !this.dataWasModified) ||
            this.characteristicsError
    }

    private _getScales(): void {
        this._iotDevicesService.getScalesByUser().pipe(
            take(1)
        ).subscribe(
            (response: IIoTRecord[]) => {
                this._scales = Array.from(response);
                this.userHasScalesLinked = this._scales.length > 0
            },
            (error: HttpErrorResponse) => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'kanban')
                );

            }
        )
    }

    public getDeductionsAllowAction(characteristic: IWNCharacteristicModel): string {
        return characteristic.deduction.allowedActions ? Object.values(characteristic.deduction.allowedActions)[0][0] : '';
    }
}
