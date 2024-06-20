import { Component, Input, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { ProcessingOrderModel } from 'src/app/routes/lots/models/lot-processing-order.model';
import { LotsService } from 'src/app/routes/lots/services/lots.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import * as FileSaver from 'file-saver';
import * as printJS from 'print-js';
@Component({
    selector: 'app-lot-processing-order-detailed-view',
    templateUrl: './lot-processing-order-detailed-view.component.html',
    styleUrls: ['./lot-processing-order-detailed-view.component.scss']
})
export class LotProcessingOrderDetailedViewComponent implements OnInit {
    @Input() lot: LotListWeightNoteGrouper;
    @BlockUI('lot-processing-order') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public panelOpened = false;
    public panelDetailOpened = false;
    public isDisabledPrint = false;
    public transitions: ProcessingOrderModel[] = [];
    readonly DECIMAL_DIGITS: number = JSON.parse(
        localStorage.getItem('decimals')
    ).general;
    private file: any;
    readonly REPORT_ACTIONS = CONSTANTS.FILE_REPORT_ACTIONS;
    constructor(private _lotService: LotsService,
        private _alert: AlertService,
        private _i18nPipe: I18nPipe,
        private _errorHandler: ResponseErrorHandlerService) { }

    ngOnInit() {
        this.buildTransitionOrders();
    }

    private buildTransitionOrders(): void {
        this.lot.transitions.forEach((t, index) => {
            let trans: ProcessingOrderModel = new ProcessingOrderModel();
            if (index === 0) {
                trans.origin = {
                    warehouse: null,
                    date: t.initialDate,
                    commodityType: this.lot.commodityType,
                    quantity: this.lot.netWeightQQ
                };
                trans.destination = {
                    warehouse: t.warehouse,
                    date: t.closeDate,
                    commodityType: t.commodityType,
                    quantity: t.weightQQ
                };
            } else {
                const prev = this.lot.transitions[index - 1];
                trans.origin = {
                    warehouse: prev.warehouse,
                    date: t.initialDate,
                    commodityType: prev.commodityType,
                    quantity: prev.weightQQ
                };
                trans.destination = {
                    warehouse: t.warehouse,
                    date: t.closeDate,
                    commodityType: t.commodityType,
                    quantity: t.weightQQ
                };
            }
            trans.efficiency = t.efficiency;
            trans.folio = t.folio;
            trans.id = t.id;
            trans.color = t.color;
            trans.note = t.note;
            trans.process = t.process;
            trans.moisture = t.moisture
            trans.hours = t.hours
            this.transitions.push(trans);
        });
    }

    onPanelOpened(): void {
        this.panelOpened = !this.panelOpened;
    }

    onPanelDetailOpened(trans: ProcessingOrderModel): void {
        trans.opened = !trans.opened;
    }

    public async actionPDF($event: Event, format: string, action: string, transitionId: string) {
        $event.stopPropagation();
        if (!this.isDisabledPrint) {
            this.blockUI.start();
            try {
                if (format === this.REPORT_ACTIONS.FORMAT.PDF) {
                    await this.getReportProcessingOrder(format, transitionId);
                    const byteArray = new Uint8Array(
                        atob(this.file)
                            .split('')
                            .map((char) => char.charCodeAt(0))
                    );
                    let blob = new Blob([byteArray], {
                        type: 'application/pdf',
                    });
                    const url = window.URL.createObjectURL(blob);
                    if (action == this.REPORT_ACTIONS.DOWNLOAD) {
                        FileSaver.saveAs(url, 'report.pdf');
                    } else {
                        printJS({
                            printable: this.file,
                            type: 'pdf',
                            base64: true,
                            onError: (error) => {
                                let message: string = this._errorHandler.handleError(error, 'print');
                                this._alert.errorTitle(
                                    this._i18nPipe.transform('error-msg'),
                                    message
                                );
                            }
                        });
                    }
                    this.blockUI.stop();
                } else {
                    await this.getReportProcessingOrder(format, transitionId);
                    this.blockUI.stop();
                }
            } catch (error) {
                this.blockUI.stop();
            }
        }
    }
    private async getReportProcessingOrder(format: string, transitionId: string) {
        try {
            let result = await this._lotService.getReportProcessingOrder(format, transitionId);
            this.file = format === this.REPORT_ACTIONS.FORMAT.PDF ? result.data : null;
        } catch (error) {
            let message: string = this._errorHandler.handleError(error, 'lot');
            this._alert.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
            throw error;
        }
    }
}
