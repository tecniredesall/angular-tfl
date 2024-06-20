import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LayoutService } from './shared/layout/services/layout.service';
import { IdleService } from './shared/services/idle/idle.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

    public destroy$ = new Subject();

    constructor(
        private _idleService: IdleService,
        private _cd: ChangeDetectorRef,
        private _layoutService: LayoutService,
        private _router: Router
    ) {
        // Set timezone configuration
        const timeZone: string = localStorage.getItem('timeZone');
        if (timeZone) {
            moment.tz.setDefault(timeZone);
        }
        // Customize months short for spanish language
        moment.updateLocale('es', {
            monthsShort : moment.localeData('es').monthsShort().map((m: string)=>m.replace('.',''))
        });
    }

    ngOnInit(): void {
        // Init idle service
        if(localStorage.getItem('token-data')){
            this._idleService.onResetIdle();
        }
        this._idleService.onIdleEnd()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this._cd.detectChanges();
            })
        this._idleService.onTimeout()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this._layoutService.logout()
                    .pipe(take(1))
                    .subscribe( response => {
                        localStorage.clear();
                        this._router.navigate(['/login']);
                    });
            })
    }

    ngOnDestroy(): void {
        this._idleService.onDestroyIdle();
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
