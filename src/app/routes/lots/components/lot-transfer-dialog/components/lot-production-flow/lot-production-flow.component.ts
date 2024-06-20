import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take } from 'rxjs/operators';
import { ILotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { ILotProductionFlowModel } from 'src/app/routes/lots/models/lot-production-flow.model';
import { LotsService } from 'src/app/routes/lots/services/lots.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

@Component({
    selector: 'app-lot-production-flow',
    templateUrl: './lot-production-flow.component.html',
    styleUrls: ['./lot-production-flow.component.scss']
})
export class LotProductionFlowComponent implements OnInit {
    @Input() lot: ILotListWeightNoteGrouper;
    @Output() actionSelected: EventEmitter<any> = new EventEmitter();
    @BlockUI('lot-production-flow') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public productionFlows: Array<ILotProductionFlowModel> = [];
    public productionFlow: ILotProductionFlowModel = null;
    readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;
    constructor(private _lotsService: LotsService,
        private _alertService: AlertService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _i18nPipe: I18nPipe) { }

    ngOnInit() {
        this.getProductionFlows(this.lot.commodityId, this.lot.transformationTypeId);
    }
    private getProductionFlows(commodityId: number, commodityTypeId: string): void {
        this.blockUI.start();
        this._lotsService.getProductionFlows(commodityId, commodityTypeId)
            .pipe(take(1))
            .subscribe(
                (response: Array<ILotProductionFlowModel>) => {
                    this.productionFlows = response;
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    this.blockUI.stop();
                    let message = this._errorHandlerService.handleError(error, 'production-flows');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            );
    }
    /**
     *
     * @param productionFlow production flow selected
     */
    public onClickProductionFlowCard(productionFlow) {
        this.productionFlow = productionFlow;
    }
    /**
     * Accept
     */
    public onEventProductionFlow(action) {
        this.actionSelected.emit(
            {
                action,
                flow: this.productionFlow
            }
        );
    }
}
