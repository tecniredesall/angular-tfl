import swal from 'sweetalert2';

/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/04/30
 * Description: alert service class, main class for control
 *              alert to show in view
 * Updated:
 * Comments:
 * Version: 2019.04.30.4000
 * Owner: Grain Chain
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { I18nPipe } from '../../i18n/i18n.pipe';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    // tslint:disable-next-line: variable-name
    constructor(private _route: Router, private _i18n: I18nPipe) {}

    public showAlert(statusCode: number, msg: string) {
        switch (statusCode) {
            case 404: {
                this.error(msg);
                break;
            }
            case 401: {
                const userType = localStorage.getItem('user_type')
                    ? localStorage.getItem('user_type')
                    : 0;
                if (Number(userType) !== 2) {
                    this.error('Unauthenticated');
                    this._route.navigateByUrl('login');
                    localStorage.clear();
                }
                break;
            }
            case 403: {
                this._route.navigateByUrl('/routes/forbidden');
                break;
            }
            case 500: {
                this.errorTitle('ERROR', this._i18n.transform('unknow-error'));
                break;
            }
            case 524: {
                this.error('A timeout occurred.');
                break;
            }
            default: {
                this.errorTitle('ERROR', this._i18n.transform('unknow-error'));
                break;
            }
        }
    }
    /**
     * show error msg
     * @param title tile of message
     * @param msg msg body
     */
    errorTitle(title: string, msg: string) {
        swal.fire(title, msg, 'error');
    }
    /**
     * show error alert
     * @param msg msg body
     */
    error(msg: string) {
        swal.fire('', msg, 'error');
    }
    /**
     * success alert
     * @param msg msg to show
     */
    public success(msg: string) {
        swal.fire('OK!', msg, 'success');
    }

    public info(msg: string) {
        swal.fire('Info !', msg, 'info');
    }

    public warning(msg: string) {
        swal.fire(this._i18n.transform('warning'), msg, 'warning');
    }
}
