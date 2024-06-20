import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';

import { availableApps } from '../config/site-config';

@Injectable({
    providedIn: 'root',
})
export class ApplicationGuard implements CanLoad {
    constructor(private _router: Router) {}
    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        // get owner apps of the menu
        const ownerApp: any = route.data.appOwner;
        // get available apps and current app selected
        const userApps = localStorage.getItem('apps')
            ? JSON.parse(localStorage.getItem('apps'))
            : null;
        if (userApps !== null) {
            const isCurrent = ownerApp.find((x) => x === userApps.current.name);
            if (isCurrent) {
                return true;
            } else {
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
                        this._router.navigateByUrl('/login');
                        window.location.reload();
                    }
                }
                return false;
            }
        } else {
            localStorage.clear();
            this._router.navigateByUrl('/login');
            return false;
        }
    }
}
