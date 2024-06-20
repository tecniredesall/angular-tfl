import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Event, NavigationEnd, NavigationError, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { availableApps } from '../../config/site-config';
import { I18nService } from '../../i18n/i18n.service';
import { LoginService } from '../../services/login/login.service';
import { CONSTANTS } from '../../utils/constants/constants';
import { AplicationsModel } from '../../utils/models/instance.model';
import { LayoutService } from '../services/layout.service';
import { menuData } from './menu-data';

declare let swal: any;

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    @ViewChild('sidebar', { static: true }) sidebarRef: ElementRef;
    @Input() menuVisualization: number = 1;
    public currentApp: AplicationsModel = localStorage.getItem('apps')
        ? JSON.parse(localStorage.getItem('apps')).current
        : { name: availableApps.Silosys };
    public availableApp = availableApps;
    public menuData = menuData;
    public lang: string;
    public currentMenu = [];
    public userName: string;
    public initials: string;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public menuOptionsMain = []
    public menuOptions = {}
    private _PERMISSIONS_MODULE = CONSTANTS.PERMISSIONS;

    constructor(
        private router: Router,
        public layoutSvc: LayoutService,
        private _i18n: I18nService,
        public loginService: LoginService
    ) {
        this.layoutSvc.application.subscribe((result) => {
            this.currentMenu = this.menuData.apps[result].administration;
            this.menuOptionsMain = this.menuData.apps[result];

            this.currentApp.name = result;
            this.goDashboard(this.currentApp.name);
        });
        this.layoutSvc.applicationModule.subscribe((result) => {
            this.currentMenu = this.menuData.apps[result.app][result.module];
            if (result.redirect) {
                this.goDashboard(result);
            }
        });
    }

    private goDashboard(app) {
        switch (app.app) {
            case availableApps.Silosys: {
                this.router.navigateByUrl('/routes/dashboard');
                break;
            }
            case availableApps.Transformaciones: {
                this.router.navigateByUrl(this._getInitialView())
                break;
            }
            default: {
                this.router.navigateByUrl('/login');
                window.location.reload();
            }
        }
    }

    private _getInitialView() {
        let permissions = JSON.parse(localStorage.getItem('token-data')).permissions;

        let allowAll = permissions.find((p) => p.tag == CONSTANTS.PERMISSIONS.ALL);
        if (allowAll) {
            return this.currentMenu.filter(p => p.tag == this._PERMISSIONS_MODULE.WEIGHT_NOTE || p.tag == this._PERMISSIONS_MODULE.DRIVERS)[0].link;
        }

        let permission = this.currentMenu.filter((x: any) => permissions.find(p => p.tag == x.tag && p.permission[this.PERMISSION_TYPES.SHOWMENU]))

        if (permission.length > 1) {
            let link = permission.filter(p => p.tag == this._PERMISSIONS_MODULE.WEIGHT_NOTE || p.tag == this._PERMISSIONS_MODULE.DRIVERS)
            return (link.length > 0 ? link[0].link : permission[0].link)
        } else {
            return permission[0].link
        }
    }

    ngOnInit() {
        this.userName = JSON.parse(localStorage.getItem('token-data')).userName;
        const tempInitials = this.userName.match(/\b\w/g) || [];
        this.initials = (
            (tempInitials.shift() || '') + (tempInitials.pop() || '')
        ).toUpperCase();
        const currentModule = Object.getOwnPropertyNames(
            menuData.apps[this.currentApp.name]
        );
        this.currentMenu =
            menuData.apps[this.currentApp.name][currentModule[0]];
        Object.getOwnPropertyNames(
            menuData.apps[this.currentApp.name]
        );
        this.menuOptionsMain = Object.getOwnPropertyNames(this.menuData.apps.Transformaciones);
        this.menuOptions = this.menuData.apps.Transformaciones;
    }
    /**
     * Set class
     * @param elements element for set class
     */
    public setClass(elements: NodeListOf<HTMLElement>): void {
        elements.forEach((item) => {
            item.classList.remove('icondash');
            item.classList.add('icondashAct');
            if (item.classList.contains('icon-img')) {
                item.classList.add('active-icon');
            }
        });
    }

    public setActiveMain(mainSections: string) {
        this.menuOptions[mainSections]['active'] = this.menuOptions[mainSections]['active'] == true ? false : true;
    }

    public setSubMenuActive(mainSections: string, index: number) {
        this.menuOptionsMain.forEach(item => {
            this.menuOptions[item].forEach((item2) => {
                item2['active'] = false;
            })
        });



        this.menuOptions[mainSections][index]['active'] = true
    }

    directiveClicked($event) {
        if (this.sidebarRef.nativeElement.contains($event.target)) {
            this.router.events.subscribe((event: Event) => {
                if (
                    event instanceof NavigationEnd ||
                    event instanceof NavigationError
                ) {
                    if (this.layoutSvc.isMobile) {
                        this.layoutSvc.showDescMenu = false;
                        this.layoutSvc.showIconMenu = false;
                    }
                }
            });
        } else {
            if (this.layoutSvc.isMobile) {
                this.layoutSvc.showDescMenu = false;
                this.layoutSvc.showIconMenu = false;
            }
        }
    }
    /**
     * go out application
     */
    public logOut(): void {
        swal(this._i18n.getTranslation('closing-session!'), {
            button: false,
            icon: 'info',
        });
        this.layoutSvc.logout().subscribe(
            (result) => {
                if (result.status) {
                    this.lang = localStorage.getItem('lang');
                    const theme = localStorage.getItem('theme');
                    localStorage.clear();
                    localStorage.setItem('lang', this.lang);
                    localStorage.setItem('theme', theme ? theme : '');
                    this.loginService.session = null;
                }
            },
            () => {
                localStorage.removeItem('token-data');
                localStorage.removeItem('uri-owner');
                localStorage.clear();
            },
            () => {
                setTimeout(() => {
                    this.router.navigateByUrl('/login');
                    swal.close();
                }, 2000);
            }
        );
    }

    /**
     * change new menu
     * @param app app for set menu
     */
    public setApp() {
        const apps = localStorage.getItem('apps')
            ? JSON.parse(localStorage.getItem('apps'))
            : null;
        if (apps !== null && apps.availables.length > 1) {
            this.currentApp = apps.availables.filter(
                (x) => x.name !== apps.current.name
            )[0];
            apps.current = this.currentApp;
            localStorage.setItem('apps', JSON.stringify(apps));
            this.layoutSvc.application.next(this.currentApp.name);
        }
    }
}
