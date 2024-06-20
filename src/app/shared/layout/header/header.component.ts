import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { Location } from '@angular/common';
import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { ThemeService } from '../../../../theme/theme.service';
import { BlockUiComponent } from '../../block/block.component';
import { availableApps } from '../../config/site-config';
import { I18nService } from '../../i18n/i18n.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';

import { AplicationsModel } from '../../utils/models/instance.model';
import { menuData } from '../menu/menu-data';
import { CompanyInfoModel } from '../models/company-info.model';
import { LayoutService } from '../services/layout.service';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { CONSTANTS } from '../../utils/constants/constants';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { TRConfiguration } from '../../utils/models/configuration.model';
import { IWCompanyInfoModel, WCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() hideMenu = new EventEmitter();
    @Output() success = new EventEmitter();
    @Output() showInfo = new EventEmitter();
    @BlockUI('company') blockUI: NgBlockUI;
    public blockTemplate: BlockUiComponent = BlockUiComponent;
    public years: Array<number> = [];
    public lang: string;
    public company: string;
    public currentSeason;
    public userName: string;
    public companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    public companyLanguage: string = '';
    public updatingInfo = false;
    public updateCompany = false;
    public currentCompany = new CompanyInfoModel();
    public pending = null;
    public hasRequestPending: boolean;
    isDark: boolean;
    public user_type: any;
    public currentApp: AplicationsModel = localStorage.getItem('apps')
        ? JSON.parse(localStorage.getItem('apps')).current
        : { name: availableApps.Transformaciones };
    public Apps: AplicationsModel[] = localStorage.getItem('apps')
        ? JSON.parse(localStorage.getItem('apps')).availables
        : [];
    public availableApp = availableApps;
    public currentModules = [];
    public moduleSelected: any;
    private _destroy$: Subject<boolean> = new Subject();
    private PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    constructor(
        public _layoutService: LayoutService,
        private _i18n: I18nService,
        private _router: Router,
        private themeService: ThemeService,
        private location: Location,
        private _purchaseOrderService: PurchaseOrdersService,
    ) {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._destroy$)
            )
            .subscribe((event: NavigationEnd) => this.setCurrentModule());
        this._layoutService.company
            .pipe(takeUntil(this._destroy$))
            .subscribe((result) => {
                if (result) {
                    this.getCompanyInfoData(this._purchaseOrderService);
                }
            });
        this._layoutService.application
            .pipe(takeUntil(this._destroy$))
            .subscribe((result) => {
                switch (result) {
                    case availableApps.Transformaciones: {
                        this._router.navigateByUrl('/routes/weight-note');
                        break;
                    }
                    default: {
                        this._router.navigateByUrl('/routes/login');
                        window.location.reload();
                    }
                }
                this.currentApp.name = result;
                this.currentModules = Object.getOwnPropertyNames(
                    menuData.apps[this.currentApp.name]
                );
                this.moduleSelected = this.currentModules[0];
                this.setCurrentModule();
            });
    }
    ngOnInit() {
        const userLang =
            localStorage.getItem('companyLanguage') === null
                ? navigator.language.split('-')
                : localStorage.getItem('companyLanguage').split('_');

        this.lang = this._i18n.isValidLanguage(userLang[0])
            ? userLang[0]
            : 'en';

        this.user_type = localStorage.getItem('user_type')
            ? localStorage.getItem('user_type')
            : environment.USER_TYPE;
        this.user_type = Number(this.user_type);
        // set lang in session storage
        this.getPreviusDates(20);
        this.currentSeason = localStorage.getItem('season')
            ? localStorage.getItem('season')
            : new Date().getFullYear();
        localStorage.setItem('season', this.currentSeason || 2020);
        this.getCompanyInfoData(this._purchaseOrderService);
        const theme = localStorage.getItem('theme')
            ? localStorage.getItem('theme')
            : '';
        if (theme !== '') {
            this.isDark = true;
        }

        this._loadModules();
        this._getConfig();

    }

    public _getConfig() {
        this.blockUI.start();
        this._purchaseOrderService.getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response: TRConfiguration) => {
                    localStorage.setItem('config', JSON.stringify(response));
                }
            );
    }

    private setCurrentModule() {
        const url: string = this.location.path();
        for (const menu in menuData.apps[this.currentApp.name]) {
            if (menu) {
                const modules = menuData.apps[this.currentApp.name][menu];
                const isHereMenu = modules.find((module: any) =>
                    url.includes(module.link)
                );
                if (isHereMenu) {
                    this.setModule(menu, false);
                    break;
                }
            }
        }
    }
    /**
     * get previous years
     * @param previousYears years to go back
     */
    private getPreviusDates(previousYears: number): void {
        let currentYear = new Date().getFullYear();
        for (let i = 0; i <= previousYears; i++) {
            this.years.push(currentYear);
            currentYear -= 1;
        }
    }
    /**
     * show and hide menu
     */
    public collapseMenu(): void {
        this.hideMenu.emit();
    }
    /**
     * change season
     */
    public setSeason(season): void {
        this._layoutService
            .setSeasson(season)
            .pipe(takeUntil(this._destroy$))
            .subscribe((result: any) => {
                this.currentSeason = season;
                localStorage.setItem('season', season);
                this._layoutService.season.next(result.status);
            });
    }
    /**
     * set new lang
     * @param lang lang to set
     */
    public setLanguage(language: string): void {
        this.lang = language;
        let company = null;

        if (this.companyInfo.language.length > 0) {
            company = this.companyInfo.language.find(
                (lang) => {return lang.defaultFile === language}
            ).file || null;
        }

        this.companyLanguage = this._i18n.fetchLanguage(language, company);
    }

    /**
     * Set item
     * @param value system selected
     */
    public setSystem(value): void {
        this.currentCompany.metric_system_id = value.id;
    }
    /**
     * Get company info
     */
    public getCompanyInfo(): void {
        this.showInfo.emit();
    }
    /**
     * Get company info
     */
    public getCompanyInfoData(
        __purchaseOrderservice: PurchaseOrdersService
    ): void {
        __purchaseOrderservice
            .getCompanyInfo()
            .pipe(takeUntil(this._destroy$))
            .subscribe(
                (result) => {
                    this.companyInfo = new WCompanyInfoModel(result.data);
                    const decimals = {
                        money: result.data.decimals_for_money || 0,
                        general: result.data.decimals_in_general || 0,
                        tickets: result.data.decimals_in_tickets || 0,
                        characteristics:
                            result.data.decimal_for_characteristics || 0,
                    };
                    localStorage.setItem('decimals', JSON.stringify(decimals));
                    this.setLanguage(this.lang)
                },
                (error) => {}
            );
    }
    public hasPending(): boolean {
        if (this.pending !== null) {
            return this.pending.error_code === 0;
        } else {
            return false;
        }
    }
    public changeTheme() {
        const body = document.getElementsByTagName('body');
        if (body[0].classList.contains('dark')) {
            body[0].classList.remove('dark');
            localStorage.removeItem('theme');
            this.themeService.setTheme(null);
            this.isDark = false;
        } else {
            localStorage.setItem('theme', 'dark');
            this.themeService.setTheme('dark');
            body[0].classList.add('dark');
            this.isDark = true;
        }
    }
    /**
     * change new menu
     * @param app app for set menu
     */
    public setApp(app) {
        const apps = localStorage.getItem('apps')
            ? JSON.parse(localStorage.getItem('apps'))
            : null;
        if (apps !== null) {
            this.currentApp = apps.availables.find((x) => x.name === app);
            apps.current = this.currentApp;
            localStorage.setItem('apps', JSON.stringify(apps));
            this.currentModules = Object.getOwnPropertyNames(
                menuData.apps[this.currentApp.name]
            );
            this.moduleSelected = this.currentModules[0];
            this._layoutService.application.next(app);
        }
    }
    public setModule(mod, redirect = true) {
        const menuApp = {
            app: this.currentApp.name,
            module: mod,
            redirect,
        };
        this._layoutService.applicationModule.next(menuApp);
        this.moduleSelected = mod;
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    private _loadModules() {
        let permissions = JSON.parse(
            localStorage.getItem('token-data')
        ).permissions;
        let allowAll = permissions.find(
            (p) => p.tag == CONSTANTS.PERMISSIONS.ALL
        );
        if (allowAll) {
            this.currentModules = Object.getOwnPropertyNames(
                menuData.apps[this.currentApp.name]
            );
            this.moduleSelected = this.currentModules[0];
            this.setCurrentModule();
            return;
        }
        let permission = permissions.filter(
            (p) => p.permission[this.PERMISSION_TYPES.SHOWMENU]
        );
        for (const menu in menuData.apps[this.currentApp.name]) {
            if (menu) {
                const modules = menuData.apps[this.currentApp.name][menu];
                const isVisibleModule = modules.filter((module: any) =>
                    permission.find((p) => p.tag == module.tag)
                );
                if (isVisibleModule.length > 0) {
                    this.currentModules.push(menu);
                }
            }
        }
        this.moduleSelected = this.currentModules[0];
        this.setCurrentModule();
    }
}
