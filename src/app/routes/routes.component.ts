/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/04/30
 * Description: App component, first component to launch
 * Updated:
 * Comments:
 * Version: 2019.04.30.4000
 * Owner: Grain Chain
 */
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from '../shared/block/block-modal.component';

import { I18nPipe } from '../shared/i18n/i18n.pipe';
import { I18nService } from '../shared/i18n/i18n.service';
import { LayoutService } from '../shared/layout/services/layout.service';
import { NotifyService } from '../shared/notifier/notify.service';
import { FeatureFlagsService } from '../shared/services/feature-flags/feature-flags.service';
import { LoginService } from '../shared/services/login/login.service';
import { CONSTANTS } from '../shared/utils/constants/constants';
import { NotificationService } from '../shared/utils/notifications/services/notification.service';
import { WindowEventsService } from '../shared/window-events/window-events.service';

declare const $: any;

@Component({
    selector: 'app-main',
    templateUrl: './routes.component.html',
    styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit {
    @BlockUI('loader-main') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public showDescMenu = true;
    public showIconMenu = true;
    public innerWidth: any;
    paddingLft = '15em';
    mainWidth = '89%';
    public showCompanyInfo: boolean;
    public headerHide = true;
    public whiteBg: boolean;
    session: string;
    isMobile: boolean;
    loading: boolean;
    public menuCount = 1;

    // tslint:disable-next-line: variable-name
    constructor(
        private _i18n: I18nService,
        private _i18nPipe: I18nPipe,
        private _noty: NotificationService,
        public notifyService: NotifyService,
        public loginService: LoginService,
        public _layoutService: LayoutService,
        private _windowEvents: WindowEventsService,
        private _featureFlagsService: FeatureFlagsService,
        private router: Router
    ) {
        this.loginService.session = localStorage.getItem('token-data');
        this.innerWidth = window.innerWidth;
        if (this.innerWidth < 1287 && this.innerWidth > 540) {
            this._layoutService.showDescMenu = false;
            this.paddingLft = '4.9em';
        } else if (this.innerWidth < 540) {
            this._layoutService.showDescMenu = false;
            this.paddingLft = '0%';
            this.mainWidth = '100%';
            this._layoutService.showIconMenu = false;
        } else {
        }
        // behivor sobjects
        this._layoutService.header.subscribe((result) => {
            this.whiteBg = result;
        });
        this._layoutService.hideLayout.subscribe((result) => {
            const main = document.querySelector('#maincontainer');
            if (result) {
                this._layoutService.showDescMenu = false;
                this._layoutService.showIconMenu = false;
                this.paddingLft = '0';
                this.headerHide = false;
            } else {
                this._layoutService.showDescMenu = true;
                this._layoutService.showIconMenu = true;
                this.paddingLft = '15em';
                this.headerHide = true;
            }
        });

        // Listener from detect when modal open
        $(document).on('show.bs.modal', function (e) {
            document
                .getElementById('maincontainer')
                .classList.remove('main-container-transform');
        });

        // Listener from detect when modal close
        $(document).on('hidden.bs.modal', function (e) {
            document
                .getElementById('maincontainer')
                .classList.add('main-container-transform');
        });

        this.router.events.subscribe((event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.blockUI.start();
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.blockUI.stop();
                    break;
                }
                default: {
                    this.blockUI.stop();
                    break;
                }
            }

        });

    }
    ngOnInit(): void {
        if (window.innerWidth < 540) {
            this._layoutService.isMobile = true;
        }
        const theme = localStorage.getItem('theme')
            ? localStorage.getItem('theme')
            : '';
        const body = document.getElementsByTagName('body');
        if (theme !== '') {
            body[0].classList.add(theme);
        }
        localStorage.getItem('menu-visualization') && (this.menuCount = parseInt(localStorage.getItem('menu-visualization')))

    }

    hideMenu() {
        this.menuCount++;
        this.menuCount > CONSTANTS.MENU_BAR_STEPS.POSITION_THREE && (this.menuCount = CONSTANTS.MENU_BAR_STEPS.POSITION_ONE);
        localStorage.setItem('menu-visualization', `${this.menuCount}`);
        if (
            this._layoutService.showDescMenu &&
            this._layoutService.showIconMenu
        ) {
            this._layoutService.showDescMenu = false;
            this.paddingLft = '4.9em';
            this.mainWidth = '97%';
        } else if (
            this._layoutService.showIconMenu &&
            !this._layoutService.showDescMenu
        ) {
            this._layoutService.showIconMenu = false;
            this.paddingLft = '0%';
            this.mainWidth = '100%';
        } else if (
            !this._layoutService.showDescMenu &&
            !this._layoutService.showIconMenu
        ) {
            if (this._layoutService.isMobile) {
                this._layoutService.showIconMenu = true;
                this._layoutService.showDescMenu = true;
            } else {
                this._layoutService.showIconMenu = true;
                this._layoutService.showDescMenu = true;
                this.paddingLft = '15em';
                this.mainWidth = '89%';
            }
        }

        this._windowEvents.emitMenuStatusChangeEvent();
    }
    /**
     * check resize windows
     * @param event rezice event
     */
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (this.headerHide) {
            this.innerWidth = window.innerWidth;
            if (this.innerWidth < 1287 && this.innerWidth > 540) {
                this._layoutService.showDescMenu = false;
                this._layoutService.showIconMenu = true;
                this.paddingLft = '4.9em';
                this._layoutService.isMobile = false;
            } else if (this.innerWidth < 540) {
                this._layoutService.showDescMenu = false;
                this.paddingLft = '0em';
                this._layoutService.showIconMenu = false;
                this.mainWidth = '100%';
                this._layoutService.isMobile = true;
            } else {
                this._layoutService.showDescMenu = true;
                this._layoutService.showIconMenu = true;
                this.paddingLft = '15em';
                this.mainWidth = '89%';
                this._layoutService.isMobile = false;
            }
        }

        this._windowEvents.emitResizeEvent(event);
    }
    /**
     * show noty info
     */
    showNoty() {
        const msg = `${this._i18nPipe.transform(
            'edit-request-sent'
        )}, ${this._i18nPipe.transform('silosys-verification')}`;
        this._noty.create('info', 10000, msg);
        this.showCompanyInfo = false;
    }
    /**
     * open modal company info
     */
    openModalCompanyInfo() {
        this.showCompanyInfo = false;
        setTimeout(() => {
            this.showCompanyInfo = true;
        }, 10);
    }
    /**
     * close modal
     */
    closeModalCompanyInfo() {
        this.showCompanyInfo = false;
        this.showNoty();
        $('.modal').click();
    }
}
