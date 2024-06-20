import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take } from 'rxjs/operators';
import { ISortMachineListenerEvent } from 'src/app/routes/iot-devices/models/sort-machine-listener-event.model';
import { ITransitionModel, TransitionViewRequestModel } from 'src/app/routes/kanban/models/transition.model';
import { KanbanService } from 'src/app/routes/kanban/services/kanban.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ILotListWeightNoteGrouper } from '../../models/lot-list-weight-note-grouper.model';
import { ILotProductionFlowModel } from '../../models/lot-production-flow.model';
import { LotRequestAtionCreateModel } from '../../models/lot-request-ation-create.model';
import { LotsService } from '../../services/lots.service';

@Component({
    selector: 'app-lot-transfer-dialog',
    templateUrl: './lot-transfer-dialog.component.html',
    styleUrls: ['./lot-transfer-dialog.component.scss']
})
export class LotTransferDialogComponent implements OnInit {
    public currentLot: ILotListWeightNoteGrouper = null;
    public componentSelected: 0 | 1 = 0;
    @BlockUI('lot-transfer') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).general : 2;
    public transitioWeightSummary: {
        totalWeightQQ: number,
        lotWeightQQ: number,
        rejectedWeightQQ: number,
        conversionMeasurementUnitAbbreviation: string
    }
    constructor(
        private _alertService: AlertService,
        private _kanbanService: KanbanService,
        private _lotsService: LotsService,
        private _router: Router,
        private _i18nPipe: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _notifier: NotifierService,
        public dialogRef: MatDialogRef<LotTransferDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            lot: ILotListWeightNoteGrouper,
            transition: ITransitionModel,
            configuration: TRConfiguration,
            sorter: ISortMachineListenerEvent,
        }
    ) {
        this.currentLot = this.data.lot;
        this.transitioWeightSummary = {
            totalWeightQQ: data.transition.weight,
            lotWeightQQ: 0 ,
            rejectedWeightQQ: truncateDecimals((truncateDecimals(data.sorter.bad, this.DECIMAL_DIGITS)) * data.configuration.baseMeasurementUnitFactor, this.DECIMAL_DIGITS),
            conversionMeasurementUnitAbbreviation: data.configuration.conversionMeasurementUnitAbbreviation

        };
        this.transitioWeightSummary.lotWeightQQ = data.transition.weight - this.transitioWeightSummary.rejectedWeightQQ;


    }

    ngOnInit() {
    }

    public onEventActionSummary(action): void {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.CREATE:
                this.componentSelected = 1;
                break;
            default:
                this.dialogRef.close(false);
                break;
        }
    }

    public onEventProductionFlow(event: any): void {
        switch (event.action) {
            case CONSTANTS.CRUD_ACTION.CREATE:
                this._sentToTransferAndCreateLot(event.flow);
                break;
            default:
                this.dialogRef.close(false);
                break;
        }
    }
    private _sentToTransferAndCreateLot(flow: ILotProductionFlowModel) {
        const lotModel = new LotRequestAtionCreateModel(
            [],
            flow.id,
            this.currentLot.transformationTypeId,
            this.currentLot.productionTanks,
        );
        lotModel.weight = this.transitioWeightSummary.rejectedWeightQQ * this.data.configuration.conversionMeasurementUnitFactor;
        lotModel.create = true;
        lotModel.decrease = true;
        this.data.transition.weight = truncateDecimals(this.transitioWeightSummary.lotWeightQQ, this.DECIMAL_DIGITS);
        let request = new TransitionViewRequestModel(
            { lotId: this.data.lot.id, current: this.data.transition, target: null },
            {
              baseMeasurementUnitFactor: this.data.configuration.baseMeasurementUnitFactor,
              decimalPlaces: this.DECIMAL_DIGITS
            }
        )
        const modelData = {
            transition: request,
            lots: [lotModel],
        }
        this.blockUI.start();
        this._lotsService.postTransferLot(modelData)
            .pipe(take(1))
            .subscribe(
                (response: any) => {
                    const msg = this._i18nPipe.transform('lot-transfer-success')
                        .replace('lotResult', response)
                        .replace('lotOrigin', this.data.lot.folio);
                    this._notifier.notify('success', msg);
                    this.blockUI.stop();
                    this.dialogRef.close();
                    this._router.navigateByUrl(`/routes/kanban/dashboard/${flow.id}`);

                },
                (error: HttpErrorResponse) => {
                    this.blockUI.stop();
                    const message = this._errorHandlerService.handleError(error, 'lot');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
    }

}
