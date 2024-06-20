import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/04/30
 * Description:  http class interceptor
 * Updated:
 * Comments:
 * Version: 2019.04.30.4000
 * Owner: Grain Chain
 */
import { Router } from '@angular/router';

import { I18nPipe } from '../i18n/i18n.pipe';
import { LoginService } from '../services/login/login.service';
import { AlertService } from './alerts/alert.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(
        private _router: Router,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _loginService: LoginService
    ) {}
    /**Intercept http request
     * <and response
     * @param req request
     * @param next nest state
     */
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const tokenData = JSON.parse(localStorage.getItem('token-data'));
        req = req.clone({
            setHeaders: {
                Authorization: `${tokenData.tokenType} ${tokenData.token}`,
                'Content-Type': 'application/json',
            },
        });
        return next.handle(req).pipe(
            catchError(
                (error: any): ObservableInput<any> => {
                    if (error.status === 401) {
                        localStorage.clear();
                        this._loginService.session = null;
                        this._router.navigateByUrl('login');
                    }
                    return throwError(error);
                }
            )
        );
    }
}
