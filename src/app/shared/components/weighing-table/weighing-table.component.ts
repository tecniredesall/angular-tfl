import { WeighingTableModel } from './../../models/weighing-table-model';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CONSTANTS } from '../../utils/constants/constants';
import { IWNWeightModel, WNWeightModel } from 'src/app/routes/weight-note/models/wn-weight.model';
import { validatorNonZeroFormControl } from '../../validators/validator-non-zero-form-control';
import { convertStringToNumber } from '../../utils/functions/string-to-number';
import { accurateDecimalSubtraction, accurateDecimalSum, roundDecimal } from '../../utils/functions/accurate-decimal-operation';
import { ScaleDialogComponent } from 'src/app/routes/iot-devices/components/scale-dialog/scale-dialog.component';
import { take, takeUntil } from 'rxjs/operators';
import { IScaleData } from '../../models/scale-data.model';
import { truncateDecimals } from '../../utils/functions/truncate-decimals';
import { ITRConfiguration } from '../../utils/models/configuration.model';
import { IotDevicesService } from 'src/app/routes/iot-devices/services/iot-devices/iot-devices.service';
import { IIoTRecord } from 'src/app/routes/iot-devices/models/iot-record.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../utils/alerts/alert.service';
import { I18nPipe } from '../../i18n/i18n.pipe';
import { ResponseErrorHandlerService } from '../../utils/response-error-handler/response-error-handler.service';
import { CompanyInfoService } from '../../services/company-info/company-info.service';
import { IWeighingTableConfigurationModel, WeighingTableConfigurationModel } from '../../models/weighing-table-configuration.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from '../../block/block-modal.component';
import { convertLbtoQQ } from '../../utils/functions/convert-qq-to-lb';
import { LotsService } from '../../services/lots/lots.service';

@Component({
    selector: 'app-weighing-table',
    templateUrl: './weighing-table.component.html',
    styleUrls: ['./weighing-table.component.scss']
})
export class WeighingTableComponent implements OnInit, OnDestroy, OnChanges {

    /************OUTPUT & INPUT EVENTS******************** */
    @Input() configuration: ITRConfiguration;
    @Input() isContainer: boolean = false;
    @Input() placeholderContainerColumn: string = "";
    @Input() readOnly: boolean = false;
    @Input() weights: Array<IWNWeightModel> = [];
    @Input() tableBodySubtitle: string = "";
    @Input() component: string;
    @Input() viewMode: boolean = false;
    @Output() formWeightCaptureReady = new EventEmitter<UntypedFormGroup>();
    @Input() isLotId: boolean = false;

    @BlockUI('weighing-table-layout') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    readonly CONSTANTS = CONSTANTS;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals'))?.general;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private indexScaleWeight: number = 0;
    private _scales: IIoTRecord[] = [];
    public weighingTableForm: UntypedFormGroup;
    public userHasScalesLinked: boolean = false;
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

    public negativeDecimalNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: this.DECIMAL_DIGITS,
        integerLimit: 12,
        requireDecimal: false,
        allowNegative: true,
        allowLeadingZeroes: false,
    });

    public weighingTableConfiguration: IWeighingTableConfigurationModel;
    public withNetWeight: boolean = true;
    public lotsFinalized = [];

    constructor(
        private _dialog: MatDialog,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _iotDevicesService: IotDevicesService,
        private _companyInfoService: CompanyInfoService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _LotsService: LotsService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.weights && changes.weights.currentValue.length > 0) {
            this.getConfigWeighingTable();
        }
    }

    ngOnInit() {
        this.getConfigWeighingTable();
        this.getScales()
        if (this.isLotId) {
            this._getLotsIds();
        }
    }

    private _getLotsIds() {
        this._LotsService.getLots().pipe(takeUntil(this.destroy$)).subscribe(({ data }: any) => {
            this.lotsFinalized = data;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true)
        this.destroy$.complete()
    }

    get weighingTableWeightsForm(): UntypedFormArray {
        return this.weighingTableForm.controls.weights as UntypedFormArray;
    }

    private _createWeightCaptureFormGroup(): void {
        let weighingModel: WeighingTableModel = new WeighingTableModel();
        this.weighingTableForm = new UntypedFormGroup({
            weights: this.loadWeights(),
            totalSacks: new UntypedFormControl(weighingModel.totalSacks),
            totalGross: new UntypedFormControl(weighingModel.totalGross),
            totalTare: new UntypedFormControl(weighingModel.totalTare),
            totalNet: new UntypedFormControl(weighingModel.totalNet),
            totalNetQQ: new UntypedFormControl(weighingModel.totalNetQQ),
            totalTareAditional: new UntypedFormControl(weighingModel.totalTareAditional),
        })
        this.calculateTareLoadWeights();
        this.calculateWeightTotals();
        this.disableForm();
        this.formWeightCaptureReady.emit(this.weighingTableForm)
        this.weighingTableForm.updateValueAndValidity();

    }

    private loadWeights(): UntypedFormArray {
        let weightsFormArray: UntypedFormArray = new UntypedFormArray([]);
        if (this.weights.length > 0) {
            this.weights.forEach(x => weightsFormArray.push(this._createWeightFormGroup(x)))
        } else {
            let weightModel: WNWeightModel = new WNWeightModel();
            weightsFormArray.push(this._createWeightFormGroup(weightModel));
        }

        return weightsFormArray;
    }

    private calculateTareLoadWeights(): void {
        for (var index = 0; index < this.weights.length; index++) {
            let weightFormGroup = ((this.weighingTableForm.get('weights') as UntypedFormArray).at(index) as UntypedFormGroup);
            weightFormGroup = this.calculateTareByIndex(weightFormGroup, this.weighingTableConfiguration);
            ((this.weighingTableForm.get('weights') as UntypedFormArray).at(index) as UntypedFormGroup).patchValue(weightFormGroup)
            this.calculateNetWeight(index)
        }
    }


    private disableForm(): void {
        if (this.readOnly)
            this.weighingTableForm.disable()
    }

    private _createWeightFormGroup(weight: IWNWeightModel): UntypedFormGroup {
        const sacksNumber = this.weighingTableConfiguration.container.defaultValue;
        const tare = this.weighingTableConfiguration.tare.defaultValue;
        const tareAdditional = this.weighingTableConfiguration.transportTare.defaultValue;
        let weightFormGroup: UntypedFormGroup = new UntypedFormGroup({
            sacksNumber: new UntypedFormControl(weight.sacksNumber ?? sacksNumber, [
                Validators.required,
            ]),
            grossWeight: new UntypedFormControl(weight.grossWeight, [
                Validators.required,
            ]),
            tare: new UntypedFormControl(weight.tare ?? tare, [
                Validators.required,
            ]),
            tareAditional: new UntypedFormControl(weight.tareAditional ?? tareAdditional, [
                Validators.required,
            ]),
            featuredWeight: new UntypedFormControl(weight.featuredWeight),
            index: new UntypedFormControl(weight.index),
            isWarningSacks: new UntypedFormControl(weight.isWarningSacks),
            netWeightQQ: new UntypedFormControl(weight.netWeightQQ),
            lotId: new UntypedFormControl(weight.lotId),
        });
        weightFormGroup = this.addValidationWeightFormGroup(weightFormGroup, this.weighingTableConfiguration)
        weightFormGroup.updateValueAndValidity();
        return weightFormGroup;
    }

    public addValidationWeightFormGroup(weightFormGroup: UntypedFormGroup, weighingTableConfiguration: WeighingTableConfigurationModel) {
        if (!weighingTableConfiguration?.container.allowEmpty) {
            weightFormGroup.controls.sacksNumber.setValidators(validatorNonZeroFormControl());
        }
        if (!weighingTableConfiguration?.tare.allowEmpty) {
            weightFormGroup.controls.tare.setValidators(validatorNonZeroFormControl());
        }
        if (!weighingTableConfiguration?.transportTare.allowEmpty) {
            weightFormGroup.controls.tareAditional.setValidators(validatorNonZeroFormControl());
        }
        return weightFormGroup;
    }

    public onChangeInputSacksNumber(weightIndex: number): void {
        let weightFormGroup = ((this.weighingTableForm.get('weights') as UntypedFormArray).at(weightIndex) as UntypedFormGroup);
        weightFormGroup = this.calculateTareByIndex(weightFormGroup, this.weighingTableConfiguration, true);
        ((this.weighingTableForm.get('weights') as UntypedFormArray).at(weightIndex) as UntypedFormGroup).patchValue(weightFormGroup)
        this.calculateNetWeight(weightIndex)
    }

    public calculateTareByIndex(weightFormGroup: UntypedFormGroup, weighingTableConfiguration: WeighingTableConfigurationModel, isFromSacks = false): UntypedFormGroup {
        let sacksNumber: number = weightFormGroup.get('sacksNumber').value;
        sacksNumber = convertStringToNumber(sacksNumber?.toString());
        const tareAditional: number = weightFormGroup.get('tareAditional').value;
        const tare = weightFormGroup.get('tare').value;
        const tareFromSacks = roundDecimal(sacksNumber * weighingTableConfiguration.tare.tareWeight, this.DECIMAL_DIGITS);
        weightFormGroup.patchValue({
            tare: isFromSacks ? tareFromSacks : tare,
        });

        weightFormGroup.patchValue({
            tareAditional: tareAditional ?? roundDecimal(sacksNumber * weighingTableConfiguration.transportTare.tareWeight, this.DECIMAL_DIGITS),
        });

        return weightFormGroup;
    }

    public calculateNetWeight(weightIndex: number): void {

        let weightValue: IWNWeightModel = ((this.weighingTableForm
            .get('weights') as UntypedFormArray).at(weightIndex) as UntypedFormGroup).getRawValue();
        weightValue.isWarningSacks =
            weightValue.sacksNumber &&
            weightValue.sacksNumber.toString() != '' &&
            weightValue.grossWeight &&
            weightValue.grossWeight.toString() != '' &&
            convertStringToNumber(weightValue.grossWeight?.toString()) >
            roundDecimal(
                convertStringToNumber(weightValue.sacksNumber?.toString()) * 132,
                this.DECIMAL_DIGITS
            );
        weightValue.isWarningSacks = false
        weightValue.grossWeight = convertStringToNumber(
            weightValue.grossWeight?.toString()
        );
        weightValue.tare = convertStringToNumber(weightValue.tare?.toString());
        weightValue.tareAditional = convertStringToNumber(weightValue.tareAditional?.toString());
        weightValue.featuredWeight = accurateDecimalSubtraction(
            [weightValue.grossWeight, (weightValue.tare + weightValue.tareAditional)],
            this.DECIMAL_DIGITS
        );
        weightValue.netWeightQQ = roundDecimal(
            weightValue.featuredWeight *
            this.configuration.baseMeasurementUnitFactor,
            this.DECIMAL_DIGITS
        );

        (this.weighingTableForm.get('weights') as UntypedFormArray).at(weightIndex)
            .patchValue({
                isWarningSacks: weightValue.isWarningSacks,
                featuredWeight: weightValue.featuredWeight,
                netWeightQQ: weightValue.netWeightQQ,
            });
        this.calculateWeightTotals();
    }

    public calculateWeightTotals(): void {
        let weight: IWNWeightModel = null;
        let totalSacks: number = 0;
        let totalGross: number = 0;
        let totalTare: number = 0;
        let totalTareAditional: number = 0;
        let totalNet: number = 0;
        let totalNetQQ: number = 0;

        // Weights
        (this.weighingTableForm
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
                    [totalTare, weight.tare],
                    this.DECIMAL_DIGITS
                );

                weight.tareAditional = convertStringToNumber(weight.tareAditional?.toString());
                totalTareAditional = accurateDecimalSum(
                    [totalTareAditional, weight.tareAditional],
                    this.DECIMAL_DIGITS
                );
            });

        totalNet = accurateDecimalSubtraction(
            [totalGross, (totalTare + totalTareAditional)],
            this.DECIMAL_DIGITS
        );

        totalNetQQ = convertLbtoQQ(
            totalNet,
            this.configuration.conversionMeasurementUnitFactor
        );
        this.weighingTableForm.patchValue({
            totalSacks: totalSacks,
            totalGross: totalGross,
            totalTare: totalTare,
            totalNet: totalNet,
            totalNetQQ: totalNetQQ,
            totalTareAditional: totalTareAditional
        });
    }

    public openScaleDialog(index: number, event: any): void {
        event.stopPropagation();
        this.indexScaleWeight = index;
        this._dialog
            .open(ScaleDialogComponent, {
                autoFocus: false,
                disableClose: true
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe((response: IScaleData) => {
                if (CONSTANTS.CRUD_ACTION.ACCEPT == response.action) {
                    (this.weighingTableForm
                        .get('weights') as UntypedFormArray)
                        .at(this.indexScaleWeight)
                        .patchValue({
                            grossWeight: truncateDecimals(response.weight, this.DECIMAL_DIGITS),
                        });
                    this.calculateNetWeight(this.indexScaleWeight);
                }
            });
    }

    public deleteWeight(index: number, event: any): void {
        event.stopPropagation();
        (this.weighingTableForm.get('weights') as UntypedFormArray).removeAt(index);
        this.calculateWeightTotals();
    }

    public addNewWeigth(): void {
        let weight: IWNWeightModel = new WNWeightModel();
        weight.index = (this.weighingTableForm.get('weights') as UntypedFormArray).length;
        weight.sacksNumber = this.weighingTableConfiguration.container.defaultValue;
        (this.weighingTableForm.get('weights') as UntypedFormArray).push(
            this._createWeightFormGroup(weight)
        );
        this.calculateWeightTotals();
    }

    public getScales(): void {
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

    public getConfigWeighingTable() {
        this.blockUI.start();
        this._companyInfoService.getConfigWeighingTable(this.component)
            .pipe(take(1))
            .subscribe(
                (weighingTableConfig: IWeighingTableConfigurationModel) => {
                    this.weighingTableConfiguration = weighingTableConfig;
                    this.withNetWeight = this.weighingTableConfiguration.featuredWeightOut;
                    this._createWeightCaptureFormGroup()
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(error, 'weighing-table');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                },
                () => this.blockUI.stop()
            );
    }

}
