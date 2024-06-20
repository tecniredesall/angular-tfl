import { DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ILotListWeightNoteGrouper } from '../../models/lot-list-weight-note-grouper.model';
import { LotSplitModel, SplitLotRequestCreate } from '../../models/lot-split.model'
import { LotsService } from '../../services/lots.service';
@Component({
    selector: 'app-lot-split-dialog',
    templateUrl: './lot-split-dialog.component.html',
    styleUrls: ['./lot-split-dialog.component.scss']
})
export class LotSplitDialogComponent implements OnInit {
    @BlockUI('split-lot') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).general : 2;
    private _timeout: any;
    public currentLot: ILotListWeightNoteGrouper;
    public splitLots: LotSplitModel[] = [];
    public remainingPercentage: number = 100;
    public remainingWeight: number;
    public isSplitValid: boolean = true;
    public positiveDecimalNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: this.DECIMAL_DIGITS,
        integerLimit: 2,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false,
    });
    public positiveWeightNumberMask: any = createNumberMask({
        prefix: '',
        suffix: ' qq',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: this.DECIMAL_DIGITS,
        integerLimit: 12,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false
    });
    public initialFeaturedWeight: number;
    public configuration: ITRConfiguration = new TRConfiguration();

    constructor(
        public dialogRef: MatDialogRef<LotSplitDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {lot: ILotListWeightNoteGrouper, configuration: ITRConfiguration},
        private decimalPipe: DecimalPipe,
        private _lotService: LotsService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _notifier: NotifierService) {
        this.currentLot = data.lot;
        this.configuration = data.configuration;
        this.initialFeaturedWeight = convertLbtoQQ(this.currentLot.currentTransition.initialFeaturedWeight);
    }

    ngOnInit() {
        this.splitLots.push(new LotSplitModel());
        this.remainingWeight = this.initialFeaturedWeight;
    }

    public onEventSplitLot(action): void {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.CREATE:
                this._splitLot();
                break;
            default:
                this.dialogRef.close(false);
                break;
        }
    }

    public setLotPercentage(lot: LotSplitModel): void {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            lot.weight = (+lot.percentage * this.initialFeaturedWeight) / 100;
            this._setTotals();
        }, 400);
    }

    public setLotWeight(lot: LotSplitModel): void {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            if (typeof lot.weight === 'string' && lot.weight != "") {
                if ((String(lot.weight)).includes(',')) {
                    lot.weight = convertStringToNumber(String(lot.weight).replace(/,/g, ""));
                }
            }
            lot.percentage = (convertStringToNumber(String(lot.weight).replace(/q/g, "")) * 100) / this.initialFeaturedWeight;
            this._setTotals();
        }, 600);
    }


    private _setTotals(): void {
        let totalPercentage = 0;
        this.splitLots.forEach(lot => {
            if (lot.percentage) {
                totalPercentage += +lot.percentage;
            }
        });
        this.remainingPercentage = 100 - totalPercentage;
        this.remainingWeight = (this.initialFeaturedWeight * this.remainingPercentage) / 100;
        this.remainingWeight = truncateDecimals(this.remainingWeight,this.DECIMAL_DIGITS);
        const haveEmptyValue = this.splitLots.filter(x => !x.percentage || +x.percentage == 0).length > 0;
        this.isSplitValid = (this.remainingPercentage <= 0 || this.remainingPercentage == 100) || haveEmptyValue;
    }

    private _splitLot(): void {
        this.currentLot.currentWeightQQ = this.remainingWeight;
        const lots = new SplitLotRequestCreate(this.currentLot, this.splitLots);
        this.blockUI.start();
        this._lotService.SplitLot(lots)
            .pipe(take(1))
            .subscribe((result: any) => {
                const data = result.data;
                let msg = this._i18nPipe.transform('split-lot-success').replace('value', this.currentLot.folio);
                const tempt: Array<string> = [];
                data.forEach(current => {
                    tempt.push(String(current).padStart(6, '0'));
                });
                this._notifier.notify('success', msg.replace('lotsValues', tempt));
                this.dialogRef.close(true);
            },
                (error) => {
                    this.blockUI.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'split-lot')
                    );
                });
    }

    public onBlurLotWeight(lot: LotSplitModel): void {
        if (lot.weight) {
            lot.weight = this.decimalPipe.transform(String(lot.weight).replace(/q/g, ""),
                '1.' + this.DECIMAL_DIGITS + '-' + this.DECIMAL_DIGITS, 'en') + ' qq';
        }
    }

    public onAddSplitLot(): void {
        this.splitLots.push(new LotSplitModel());
        this._setTotals();
    }
    /**
     * remove split lot
     * @param index index
     */
    public onRemoveSplitLot(index: number): void {
        this.splitLots.splice(index, 1);
        this._setTotals();
    }
}
