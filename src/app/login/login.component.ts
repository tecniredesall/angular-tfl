import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { BlockModalUiComponent } from '../shared/block/block-modal.component';
import { I18nPipe } from '../shared/i18n/i18n.pipe';
import { LayoutService } from '../shared/layout/services/layout.service';
import { FeatureFlagsService } from '../shared/services/feature-flags/feature-flags.service';
import { LoginService } from '../shared/services/login/login.service';
import { AlertService } from '../shared/utils/alerts/alert.service';
import { CONSTANTS } from '../shared/utils/constants/constants';
import { InstanceModel } from '../shared/utils/models/instance.model';
import { LoginInstanceModel } from '../shared/utils/models/login-intance.model';
import { LoginModel } from '../shared/utils/models/login.model';
import * as moment from 'moment-timezone';
import { menuData } from '../shared/layout/menu/menu-data';
import { IdleService } from '../shared/services/idle/idle.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
    @BlockUI('login-container') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public hasInstaces = false;
    public instances: InstanceModel[] = [
        {
            id: 5,
            name: CONSTANTS.COMPANY_NAME,
            apps: [
                {
                    application_id: '07223b01-0157-45ae-b9d1-a00d82a9f9ec',
                    name: 'Transformaciones',
                },
            ],
        },
    ];
    public loginData: LoginModel = new LoginModel();
    public emailControl = new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(CONSTANTS.EMAIL_REGEXP),
    ]);
    public passwordControl = new UntypedFormControl('', Validators.required);
    private subscription = new Subscription();
    private PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    constructor(
        private loginService: LoginService,
        private alert: AlertService,
        private router: Router,
        private _i18n: I18nPipe,
        private _featureFlagsService: FeatureFlagsService,
        private _layoutService: LayoutService,
        private _idleService: IdleService
    ) {}

    ngOnInit() {
        this.loginData.uri_owner = environment.LOCAL_API;
    }

    /**
     * get instances
     */
    public getInstance(): void {
        if (this.instances.length === 0) {
            const data: LoginInstanceModel = new LoginInstanceModel(
                this.emailControl.value,
                'users'
            );
            this.subscription.add(
                this.loginService.getInstanceService(data).subscribe(
                    (result) => {
                        if (result) {
                            this.instances = [...result.instances];
                            this.loginData.hash = result.hash;
                            this.hasInstaces = true;
                            // Set this data because is the instance selected by default
                            this.loginData.instance = this.instances[0].id;
                            this.loginData.uri_owner = this.instances[0].uri_owner;
                            this.instances[0].apps.sort((a, b) =>
                                a.name > b.name ? 1 : -1
                            );
                            const apps = {
                                current: this.instances[0].apps[0],
                                availables: this.instances[0].apps,
                            };
                            localStorage.setItem('apps', JSON.stringify(apps));
                        }
                    },
                    (err) => {
                        if (err.status === 404) {
                            this.alert.error(
                                this._i18n.transform('email-not-found')
                            );
                        } else {
                            this.alert.showAlert(
                                err.status || 103,
                                err.error.message || ''
                            );
                        }
                    }
                )
            );
        } else {
            this.hasInstaces = true;
            const apps = {
                current: this.instances[0].apps[0],
                availables: this.instances[0].apps,
            };
            localStorage.setItem('apps', JSON.stringify(apps));
        }
    }

    /**
     * set intance
     * @param value instance selected
     */
    public setInstance(value: number): void {
        const currentInstance = this.instances.find(
            (inst) => inst.id === value
        );
        currentInstance.apps.sort((a, b) => (a.name > b.name ? 1 : -1));
        const apps = {
            current: currentInstance.apps[0],
            availables: currentInstance.apps,
        };
        localStorage.setItem('apps', JSON.stringify(apps));
        const uriOwner = this.instances.find((inst) => inst.id === value)
            .uri_owner;
        this.loginData.instance = value;
        this.loginData.uri_owner = uriOwner;
    }

    /**
     * set user in session
     */
    public login(): void {
        this.blockUI.start();
        this.loginData.email = this.emailControl.value;
        this.loginData.password = this.passwordControl.value;
        this.loginData.who = 'users';
        this.subscription.add(
            this.loginService.login(this.loginData).subscribe(
                (result) => {
                    const data = {
                        token: result.token,
                        tokenType: result.token_type,
                        userName: `${result.data.name} ${result.data.lastname}`,
                        session: result.data.id,
                        permissions: result.data.permissions,
                    };
                    // set token in session storage
                    localStorage.setItem('token-data', JSON.stringify(data));
                    localStorage.setItem(
                        'season',
                        result.season || new Date().getFullYear()
                    );
                    localStorage.setItem('uri-owner', this.loginData.uri_owner);
                    localStorage.setItem('metric', result.metric);
                    localStorage.setItem('user_type', result.data.user_type);
                    // Set scales settings to local storage
                    localStorage.setItem('scales', JSON.stringify({
                        hasLinked: result.data.has_scales ?? false
                    }));
                    // Init idle service
                    this._idleService.onResetIdle();
                    // Get company info data
                    this.subscription.add(
                        this._layoutService.getCompanyInfo().subscribe(
                            (companyInfo: any) => {
                                const decimals = {
                                    money:
                                        companyInfo.data.decimals_for_money ||
                                        2,
                                    general:
                                        companyInfo.data.decimals_in_general ||
                                        2,
                                    tickets:
                                        companyInfo.data.decimals_in_tickets ||
                                        2,
                                };
                                localStorage.setItem(
                                    'decimals',
                                    JSON.stringify(decimals)
                                );
                                // Set timezone configuration
                                const timeZone: string = companyInfo.data.time_zone ?? null;
                                if (timeZone) {
                                    localStorage.setItem('timeZone', timeZone);
                                    moment.tz.setDefault(timeZone);
                                }

                                this.subscription.add(
                                    this._featureFlagsService.onGetFlagsEvent.subscribe(
                                        () => {
                                            this.loginService.session = JSON.stringify(
                                                data
                                            );
                                            this.blockUI.stop();
                                            this.router.navigateByUrl(this._loadHomeView())
                                        }
                                    )
                                );
                                this._featureFlagsService.getFlags();
                            },
                            (err) => {
                                this.blockUI.stop();
                                this.alert.error(
                                    this._i18n.transform(
                                        err.error.message || 'unknow-error'
                                    )
                                );
                            }
                        )
                    );
                },
                (err) => {
                    this.blockUI.stop();
                    this.alert.error(
                        this._i18n.transform(
                            err.error.message || 'unknow-error'
                        )
                    );
                }
            )
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private _loadHomeView(){
        let permissions = JSON.parse(localStorage.getItem('token-data')).permissions;
        let allowAll = permissions.find((p) => p.tag == CONSTANTS.PERMISSIONS.ALL );
        if (allowAll) {
            return 'routes/weight-note';
        }

        let permission =  permissions.filter(p=>  p.permission[this.PERMISSION_TYPES.SHOWMENU])
        let links = []
        for (const menu in menuData.apps[this.instances[0].apps[0].name]) {
            if (menu) {
                const modules = menuData.apps[this.instances[0].apps[0].name][menu];
                links = links.concat(modules.filter((module: any) => permission.find(p=> p.tag == module.tag)));
            }
        }
       return ( links.length > 0 ?  links[0].link : this._logOut())
    }

    private _logOut(){
        this._layoutService.logout().subscribe(
            (result) => {

                if (result.status) {
                    const lang = localStorage.getItem('lang');
                    const theme = localStorage.getItem('theme');
                    localStorage.clear();
                    localStorage.setItem('lang', lang ?? 'es');
                    localStorage.setItem('theme', theme ?? '');
                    this.loginService.session = null;
                    this.router.navigateByUrl('/login');
                }
            },
            () => {
                localStorage.removeItem('token-data');
                localStorage.removeItem('uri-owner');
                localStorage.clear();
                this.router.navigateByUrl('/login');
            }
        );
    }
}
