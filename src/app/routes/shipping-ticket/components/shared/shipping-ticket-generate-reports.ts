import { ResponseErrorHandlerService } from './../../../../shared/utils/response-error-handler/response-error-handler.service';
import { AlertService } from './../../../../shared/utils/alerts/alert.service';
import { NgBlockUI } from 'ng-block-ui';
import { ISTGeneralInformationModel } from '../../models/st-general-information.model';
import { ShippingTicketService } from './../../services/shipping-ticket.service';

import * as FileSaver from 'file-saver';
import * as printJS from 'print-js';
import { take } from 'rxjs/operators';
import { I18nPipe } from '../../../../shared/i18n/i18n.pipe';
import { CONSTANTS } from '../../../../shared/utils/constants/constants';
import { Router } from '@angular/router';
export class ShippingTicketGenerateReports {
    /**
     * ctr
     * @param _shippingService service
     * @param _alert alert
     * @param _i18nPipe pipe translate
     * @param _errorHandler error hanlder
     */
    constructor(private _shippingService: ShippingTicketService,
        private _alert: AlertService,
        private _i18nPipe: I18nPipe,
        private _errorHandler: ResponseErrorHandlerService,
        private _router?: Router
    ) { }

    public onGenerateReportPdf(blockUI: NgBlockUI, language: string, shippingTicktet: ISTGeneralInformationModel, action: number, urlComponent: string = null) {
        blockUI.start();
        this._shippingService
            .getShippingReportPDF(shippingTicktet.id, language)
            .pipe(take(1))
            .subscribe(
                (file: any) => {
                    const byteArray = new Uint8Array(
                        atob(file.data)
                            .split('')
                            .map((char) => char.charCodeAt(0))
                    );
                    const blob = new Blob([byteArray], {
                        type: 'application/pdf',
                    });
                    const url = window.URL.createObjectURL(blob);
                    if (action === CONSTANTS.CRUD_ACTION.DOWNLOAD) {
                        FileSaver.saveAs(url, `${shippingTicktet.folio}-report.pdf`);
                    } else {
                        const agent = window.navigator.userAgent.toLowerCase()
                        if (agent.indexOf('firefox') > -1) {
                            window.open(url);
                            blockUI.stop();
                            if (urlComponent !== null) {
                                this._router.navigateByUrl(urlComponent);
                            }
                        } else {
                            printJS({
                                printable: file.data,
                                type: 'pdf',
                                base64: true,
                                onError: (error) => {
                                    const message: string =
                                        this._errorHandler.handleError(
                                            error,
                                            'print'
                                        );
                                    blockUI.stop();
                                    this._alert.errorTitle(
                                        this._i18nPipe.transform('error-msg'),
                                        message
                                    );
                                },
                                onPrintDialogClose: () => {
                                    blockUI.stop();
                                    if (urlComponent !== null) {
                                        this._router.navigateByUrl(urlComponent);
                                    }
                                }
                            });
                        }
                    }
                    blockUI.stop();
                },
                () => {
                    blockUI.stop();
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
            );
    }
}
