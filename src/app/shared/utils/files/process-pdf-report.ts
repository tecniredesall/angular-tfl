import { NgBlockUI } from "ng-block-ui";
import { CONSTANTS } from "../constants/constants";
import * as FileSaver from 'file-saver';
import * as printJS from 'print-js';
import { Router } from "@angular/router";
import { ResponseErrorHandlerService } from "../response-error-handler/response-error-handler.service";
import { AlertService } from "../alerts/alert.service";
import { I18nPipe } from "../../i18n/i18n.pipe";

export const  proccessReportPdf =
(
    alert: AlertService,
    errorHandler: ResponseErrorHandlerService,
    i18nPipe: I18nPipe,
    router:Router , blockUI: NgBlockUI, file:any, fileName: string, action: number, urlRedirection: string = null) =>
{

    const byteArray = new Uint8Array(
        atob(file)
            .split('')
            .map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([byteArray], {
        type: 'application/pdf',
    });
    const url = window.URL.createObjectURL(blob);
    if (action === CONSTANTS.CRUD_ACTION.DOWNLOAD) {
        FileSaver.saveAs(url, `${fileName}-report.pdf`);
    } else {
        const agent = window.navigator.userAgent.toLowerCase()
        if (agent.indexOf('firefox') > -1) {
            window.open(url);
            blockUI.stop();
            if (urlRedirection !== null) {
                router.navigateByUrl(urlRedirection);
            }
        } else {
            printJS({
                printable: file,
                type: 'pdf',
                base64: true,
                onError: (error) => {
                    const message: string =
                        errorHandler.handleError(
                            error,
                            'print'
                        );
                    blockUI.stop();
                    alert.errorTitle(
                        i18nPipe.transform('error-msg'),
                        message
                    );
                },
                onPrintDialogClose: () => {
                    blockUI.stop();
                    if (urlRedirection !== null) {
                        router.navigateByUrl(urlRedirection);
                    }
                }
            });
        }
    }
    blockUI.stop();
}
