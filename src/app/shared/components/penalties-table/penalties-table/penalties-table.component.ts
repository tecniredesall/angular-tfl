import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { IWNCharacteristicModel } from 'src/app/routes/weight-note/models/wn-characteristic.model';
import { IWNDeductionTradingStatusModel, WNDeductionTradingStatusModel } from 'src/app/routes/weight-note/models/wn-deduction-trading-status.model';
import { IWNOptionChoiceDeductionModel } from 'src/app/routes/weight-note/models/wn-option-choice-deduction.model';
import { IWNPenaltyModel, WNPenaltyModel } from 'src/app/routes/weight-note/models/wn-penalty.model';
import { IWNDeductionsTradingModel, WNDeductionsTradingModel } from 'src/app/routes/weight-note/models/wn-request-deductions-trading.model';
import { WeightService } from 'src/app/routes/weight-note/services/weight.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { accurateDecimalSubtraction, accurateDecimalSum } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { validatorNumericalRangeFormControl } from 'src/app/shared/validators/validator-numerical-range-form-control';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    selector: 'app-penalties-table',
    templateUrl: './penalties-table.component.html',
    styleUrls: ['./penalties-table.component.scss']
})
export class PenaltiesTableComponent implements OnInit, OnChanges {

    @Input() commodityId: string;
    @Input() totalNetWeight: number = 0;
    @Input() penalties: IWNPenaltyModel[] = [new WNPenaltyModel()];
    @Input() configuration: ITRConfiguration = new TRConfiguration();
    @Input() readOnly: boolean = false;
    @Input() characteristicsAreMandatory: boolean = true;
    @Output() setPenaltiesFormArray: EventEmitter<UntypedFormGroup> = new EventEmitter();
    public characteristics: IWNCharacteristicModel[] = [];
    public allowAddPenalty: boolean = true;
    public penaltiesTableForm = new UntypedFormGroup({})
    public penaltiesFormArray: UntypedFormArray = new UntypedFormArray([]);
    public characteristicsForm: UntypedFormControl = new UntypedFormControl();
    public isLoadingCharacteristics: boolean = false;
    public deductionsTradingStatus: IWNDeductionTradingStatusModel = new WNDeductionTradingStatusModel();
    readonly CHARACTERISTICS_DECIMAL: number = JSON.parse(localStorage.getItem('decimals')).characteristics;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly DEDUCTION_TYPE = CONSTANTS.DEDUCTION_TYPE;
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

    constructor(
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _weightService: WeightService,
        private _error: ResponseErrorHandlerService,
    ) { }

    ngOnInit(): void {
        this._createPenaltiesFromGroup()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.commodityId?.currentValue) {
            this._getCharacteristics();
        }

        if (changes.totalNetWeight?.currentValue) {
            this._applyDeduction();
        }

        if (changes.penalties && changes.penalties.currentValue.length > 0) {
            this._createPenaltiesFromGroup();
        }
    }

    private _createPenaltiesFromGroup() {
        this.penalties.forEach((p: IWNPenaltyModel) => {
            this.penaltiesFormArray.push(this._createPenaltyFormGroup(p));
        });
        this.penaltiesTableForm = new UntypedFormGroup({
            penalties: this.penaltiesFormArray,
            totalCharacteristics: new UntypedFormControl('0'),
            totalPercentCharacteristics: new UntypedFormControl('0')
        });

        this.setPenaltiesFormArray.emit(this.penaltiesTableForm)


    }

    public addPenalty(): void {
        let penalty: IWNPenaltyModel = new WNPenaltyModel({
            characteristicsEnabled: this._updateCharacteristicsList(),
        });
        (this.penaltiesFormArray as UntypedFormArray).push(
            this._createPenaltyFormGroup(penalty)
        );
    }

    public removePenalty(index: number): void {
        this.penaltiesFormArray.removeAt(index);
        this.penaltiesFormArray.controls.forEach(
            (p) => {
                p.patchValue({
                    characteristicsEnabled: this._updateCharacteristicsList(
                        (p as UntypedFormGroup).getRawValue()
                    ),
                });
            }
        );
        this._applyDeduction();
    }

    public setCharacteristic(index: number): void {
        const { TABLE, CHOICE, INPUT } = CONSTANTS.DEDUCTION_TYPE;
        let validatorsValue: Array<ValidatorFn> = [Validators.required];
        const characteristic: IWNCharacteristicModel = this.penaltiesFormArray.at(index).get('characteristic').value;
        this.penaltiesFormArray.controls.forEach(
            penalty => {
                let characteristicsEnabled = this._updateCharacteristicsList((penalty as UntypedFormGroup).getRawValue());
                penalty.patchValue({
                    characteristicsEnabled: characteristicsEnabled.slice(),
                });
            }
        );
        this.penaltiesFormArray.at(index).get('choiceDeduction').clearValidators();
        this.penaltiesFormArray.at(index).get('choiceDeduction').updateValueAndValidity();
        this.penaltiesFormArray.at(index).get('value').clearValidators();
        this.penaltiesFormArray.at(index).get('value').updateValueAndValidity();
        this.penaltiesFormArray.at(index).patchValue({
            choiceDeduction: null,
            value: characteristic.defaultValue ?? null,
            sign: null,
            total: null,
        });
        if (characteristic.deduction?.type == TABLE || characteristic.deduction?.type == INPUT) {
            validatorsValue.push(
                validatorNumericalRangeFormControl(
                    characteristic.deduction.min,
                    characteristic.deduction.max
                )
            );
        } else {
            this.penaltiesFormArray.at(index).get('choiceDeduction').setValidators(Validators.required);
            this.penaltiesFormArray.at(index).get('choiceDeduction').updateValueAndValidity();
        }
        this.penaltiesFormArray.at(index).get('value').setValidators(validatorsValue);
        this.penaltiesFormArray.at(index).get('value').updateValueAndValidity();
        this.penaltiesFormArray.at(index).get('choiceDeduction').enable();
        this.penaltiesFormArray.at(index).get('value').enable();
        this._applyDeduction();
    }

    public eventChangePenaltyValue(index: number): void {
        this.penaltiesFormArray.at(index).patchValue({ sign: null, total: null });
        this._applyDeduction();
    }

    public setDeductionSelection(index: number, value: { name: string }): void {
        this.penaltiesFormArray.at(index).patchValue({
            value: value.name,
            sign: null,
            total: null,
        });
        this._applyDeduction();
    }

    private _getCharacteristics() {
        this.isLoadingCharacteristics = true;
        const params = `commodities[]=${this.commodityId}`;
        this._weightService.getCharacteristics(params)
            .pipe(take(1))
            .subscribe(
                (characteristics: IWNCharacteristicModel[]) => {
                    this.characteristics = characteristics;
                    this.penaltiesFormArray.controls.forEach(
                        penalty => {
                            penalty.patchValue({ characteristicsEnabled: this.characteristics });
                            if (penalty.get('characteristic').value) {
                                penalty.get('value').enable();
                            }
                        }
                    );
                    this.penaltiesFormArray.enable();
                    this.isLoadingCharacteristics = false;
                    this._setPenaltiesCharacteristic();
                },
                (error: HttpErrorResponse) => {
                    this.isLoadingCharacteristics = false;
                }
            )
    }

    private _applyDeduction(): void {
        if (this.deductionsTradingStatus.refTimeout) {
            clearTimeout(this.deductionsTradingStatus.refTimeout);
            this.deductionsTradingStatus.refTimeout = null;
        }
        this.deductionsTradingStatus.refRequest.unsubscribe();
        this.deductionsTradingStatus.refRequest = new Subscription();
        this.deductionsTradingStatus.isBeingCalculated = false;
        let totalNet: number = this.totalNetWeight;
        if (totalNet > 0) {
            const penalties: Array<IWNPenaltyModel> = this._getPenaltiesForTrading();
            if (penalties.length > 0) {
                this._sendRequestApply(totalNet, penalties);
            }else{
                this.penaltiesTableForm.controls.totalPercentCharacteristics.setValue(0);
                this.penaltiesTableForm.controls.totalCharacteristics.setValue(0);
            }
        } else {
            this.penaltiesFormArray.controls.forEach(
                (penaltyControls: UntypedFormGroup) => {
                    penaltyControls.patchValue({ sign: null, total: null });
                }
            );
        }
    }

    private _getPenaltiesForTrading(): Array<IWNPenaltyModel> {
        const { TABLE, INPUT, CHOICE } = CONSTANTS.DEDUCTION_TYPE;
        const penalties: Array<IWNPenaltyModel> = [];
        this.penaltiesFormArray.controls.forEach((g: UntypedFormGroup) => {
            let penaltyValues: IWNPenaltyModel = g.getRawValue();
            if (
                penaltyValues.characteristic?.deduction?.type == TABLE ||
                penaltyValues.characteristic?.deduction?.type == INPUT
            ) {
                penaltyValues.value = convertStringToNumber(
                    penaltyValues.value
                ).toString();
            }
            if (
                penaltyValues.characteristic &&
                (
                    penaltyValues.characteristic.deduction?.type == TABLE ||
                    penaltyValues.characteristic.deduction?.type == INPUT ||
                    (
                        penaltyValues.characteristic.deduction?.type == CHOICE &&
                        penaltyValues.choiceDeduction != null
                    )
                ) &&
                penaltyValues.value != null &&
                penaltyValues.value != '' &&
                penaltyValues.value != '-' &&
                penaltyValues.value != '+' &&
                g.get('value').errors == null
            ) {
                penalties.push(penaltyValues);
            } else {
                g.patchValue({ sign: null, total: null });
            }
        });
        return penalties;
    }

    private _sendRequestApply(
        totalNet: number,
        penalties: Array<IWNPenaltyModel>
    ): void {
        const { TABLE, INPUT, CHOICE } = CONSTANTS.DEDUCTION_TYPE;
        this.deductionsTradingStatus.isBeingCalculated = true;
        this.deductionsTradingStatus.refTimeout = setTimeout(() => {
            let deductionsTrading: IWNDeductionsTradingModel = new WNDeductionsTradingModel(
                { weight: totalNet, penalties: penalties }
            );
            //this.totalCharacteristics = 0;
            this.deductionsTradingStatus.refRequest.add(
                this._weightService
                    .applyDeductions(deductionsTrading)
                    .subscribe(
                        (response: any) => {
                            if (response.data.timestamp > this.deductionsTradingStatus.timestamp) {
                                this.deductionsTradingStatus.timestamp = response.data.timestamp;
                                let totalPercentCharacteristics = 0;
                                let totalDiscount = 0;
                                let totalAddition = 0;
                                this.penaltiesFormArray.controls.forEach(
                                    (c: UntypedFormGroup) => {
                                        let idx: number = response.data.deductions.findIndex(
                                            (v: any) => v.id == c.get('characteristic').value?.deduction?.id
                                        );
                                        if (idx > -1) {
                                            if (
                                                c.get('characteristic').value.deduction.type == TABLE ||
                                                c.get('characteristic').value.deduction.type == INPUT
                                            ) {
                                                if(this.getDeductionsAllowAction(c.get('characteristic').value) !== this.DEDUCTIONS_ALLOW_ACTIONS.NO_ACTION) {
                                                    totalPercentCharacteristics += parseFloat(response.data.deductions[idx].value);
                                                }
                                            } else if (
                                                c.get('characteristic').value.deduction.type == CHOICE
                                            ) {
                                                let option: IWNOptionChoiceDeductionModel = c.get('characteristic').value.deduction?.options.find(
                                                    (o: IWNOptionChoiceDeductionModel) => o.name == response.data.deductions[idx].value
                                                )
                                                if (option) {
                                                    let percent = 100 - option.coefficient;
                                                    totalPercentCharacteristics += percent;
                                                }
                                            }
                                            let totalPenalty: number = truncateDecimals(response.data.deductions[idx].total, this.DECIMAL_DIGITS);
                                            c.patchValue({
                                                sign: response.data.deductions[idx].sign,
                                                total: totalPenalty,
                                            });
                                            if (response.data.deductions[idx].sign == '-') {
                                                totalDiscount = accurateDecimalSum(
                                                    [totalDiscount, totalPenalty],
                                                    this.DECIMAL_DIGITS
                                                );
                                            } else {
                                                totalAddition = accurateDecimalSum(
                                                    [totalAddition, totalPenalty],
                                                    this.DECIMAL_DIGITS
                                                );
                                            }
                                            //this.totalCharacteristics
                                            this.penaltiesTableForm.controls.totalCharacteristics.setValue(accurateDecimalSubtraction(
                                                [totalAddition, totalDiscount],
                                                this.DECIMAL_DIGITS
                                            ));

                                        }
                                    }
                                );
                                //this.totalPercentCharacteristics = totalPercentCharacteristics;
                                this.penaltiesTableForm.controls.totalPercentCharacteristics.setValue(totalPercentCharacteristics)
                                this.deductionsTradingStatus.isBeingCalculated = false;
                                // this.penaltiesTableForm.patchValue({
                                //     totalCharacteristics:this.totalCharacteristics,
                                //     totalPercentCharacteristics:this.totalPercentCharacteristics})
                            }
                        },
                        (error: HttpErrorResponse) => {
                            let message = this._error.handleError(error, 't-weight-note');
                            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                            this.deductionsTradingStatus.isBeingCalculated = false;
                        }
                    )
            );
        }, 600);
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


    private _updateCharacteristicsList(
        penalty: IWNPenaltyModel = null
    ): Array<IWNCharacteristicModel> {
        const characteristics: Array<IWNCharacteristicModel> = [];
        this.characteristics.forEach((characteristic: IWNCharacteristicModel) => {
            if (penalty && characteristic.id == penalty.characteristic.id) {
                characteristic.disabled = true;
            } else {
                characteristic.disabled =
                    this.penaltiesFormArray.value.findIndex((p: IWNPenaltyModel) => p.characteristic?.id == characteristic.id) > -1;
            }
            characteristics.push(characteristic);
        });
        return characteristics;
    }

    private _setPenaltiesCharacteristic() {

        this.penaltiesFormArray.controls.forEach(
            (p: UntypedFormGroup) => {
                let characteristicSelected: IWNCharacteristicModel = p.get('characteristic').value;
                let choiceDeduction: IWNOptionChoiceDeductionModel = p.get(
                    'choiceDeduction'
                ).value;
                let deductionIdSelected: string = p.get('characteristic')
                    .value?.deduction?.id;
                let idxMatch: number = this.characteristics.findIndex(
                    (c: IWNCharacteristicModel) =>
                        deductionIdSelected == c.deduction.id
                );
                if (idxMatch > -1) {
                    characteristicSelected = this.characteristics[idxMatch];
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
                        if (characteristicSelected.mandatory && this.characteristicsAreMandatory) {
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
                    characteristicsEnabled: this._updateCharacteristicsList(
                        (p as UntypedFormGroup).getRawValue()
                    ),
                });
                if (this.readOnly) {
                    p.get('characteristic').disable();
                    p.get('value').disable();
                    p.get('choiceDeduction').disable();

                }else{
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
    }

    public getDeductionsAllowAction(characteristic: IWNCharacteristicModel): string {
        return characteristic.deduction.allowedActions ? Object.values(characteristic.deduction.allowedActions)[0][0] : '';
    }

}
