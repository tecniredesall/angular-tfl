import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, Pipe } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { LotsService } from 'src/app/routes/lots/services/lots.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import * as FileSaver from 'file-saver';
import * as printJS from 'print-js';
import { Subject } from 'rxjs';
import { FileDownloadService } from 'src/app/shared/services/file-download/file-download.service';
@Component({
    selector: 'app-lot-processing-order-general-view',
    templateUrl: './lot-processing-order-general-view.component.html',
    styleUrls: ['./lot-processing-order-general-view.component.scss']
})
export class LotProcessingOrderGeneralViewComponent implements OnInit {
    @Input() lot: LotListWeightNoteGrouper;
    @Input() public configuration = new TRConfiguration();

    @BlockUI('lot-processing-order') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public panelOpened = false;
    public panelDetailOpened = false;
    public isDisabledPrint = false;
    readonly DECIMAL_DIGITS: number = JSON.parse(
        localStorage.getItem('decimals')
    ).general;
    private file: any;
    readonly REPORT_ACTIONS = CONSTANTS.FILE_REPORT_ACTIONS;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public dateFormat: string = CONSTANTS.DATE_FORMAT_LOCALE.es;
    public isLotDivided: boolean = false;
    constructor(
        private _alert: AlertService,
        private _i18nPipe: I18nPipe,
        private _lotService: LotsService,
        private _i18nService: I18nService,
        private _fileDownLoader: FileDownloadService,
        private _errorHandler: ResponseErrorHandlerService,
    ) {
        this._i18nService.lang.pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.dateFormat = CONSTANTS.DATE_FORMAT_LOCALE[result];
            });
    }

    ngOnInit() {
        for (let i = 0; i < this.lot.transitions.length; i++) {
            const transition = this.lot.transitions[i];
            if(transition.processId == ''){
                this.isLotDivided = true;
                break
            }
        }
    }
    onPanelOpened(): void {
        this.panelOpened = !this.panelOpened;
    }
    public async actionPDF($event: Event, format: string, action: string, lotId: string) {
        $event.stopPropagation();
        if (!this.isDisabledPrint) {
            this.blockUI.start();
            try {
                if (format === this.REPORT_ACTIONS.FORMAT.PDF) {
                    await this.getReportProcessingOrder(format, lotId);
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
                } else if(format === this.REPORT_ACTIONS.FORMAT.CSV) {
                    let csv = await this._lotService.getReportProcessingOrderCsv(format, lotId, true);
                    this._fileDownLoader.downloadFromURL(
                      csv,
                      `${this._i18nPipe.transform(
                          'process-order-file'
                      )}.csv`
                    );
                    this.blockUI.stop();
                } else {
                    await this.getReportProcessingOrder(format, lotId);
                    this.blockUI.stop();
                }
            } catch (error) {
                this.blockUI.stop();
            }
        }
    }
    private async getReportProcessingOrder(format: string, lotId: string) {
        try {
            let result = await this._lotService.getReportProcessingOrder(format, lotId, true);
            this.file = (format === this.REPORT_ACTIONS.FORMAT.PDF
                || format === this.REPORT_ACTIONS.FORMAT.CSV)
                ? result.data : null;
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
