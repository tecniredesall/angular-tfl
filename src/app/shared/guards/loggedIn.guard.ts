import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { availableApps } from '../config/site-config';

@Injectable({
    providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
    constructor(private route: Router, private _router: Router) {}
    /**
     * Can activate
     * @param next next state
     * @param state current state
     */
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const userData = localStorage.getItem('token-data');
        const userApps = localStorage.getItem('apps')
            ? JSON.parse(localStorage.getItem('apps'))
            : null;
        if (userData !== null && userData !== undefined) {
            const token = JSON.parse(userData);
            if (token.hasOwnProperty('token')) {
                switch (userApps.current.name) {
                    case availableApps.Silosys: {
                        this._router.navigateByUrl('/routes/dashboard');
                        break;
                    }
                    case availableApps.Transformaciones: {
                        this._router.navigateByUrl('/routes/weight-note');
                        break;
                    }
                    default: {
                        this._router.navigateByUrl('/routes/weight-note');
                    }
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
}
