import { ShippingTicketGenerateReports } from './../shared/shipping-ticket-generate-reports';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { IWCompanyInfoModel, WCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { IShippingTicketModel, ShippingTicketModel } from '../../models/shipping-ticket.model';
import { ShippingTicketService } from '../../services/shipping-ticket.service';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { IWNCharacteristicModel } from 'src/app/routes/weight-note/models/wn-characteristic.model';
import { NotifierService } from 'angular-notifier';
import { ITRDialogSettings } from 'src/app/shared/models/tr-dialog-settings';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-shipping-ticket-detail',
    templateUrl: './shipping-ticket-detail.component.html',
    styleUrls: ['./shipping-ticket-detail.component.scss']
})
export class ShippingTicketDetailComponent implements OnInit {
    @BlockUI('shipping-ticket-detail') blockUI: NgBlockUI;
    public id: string;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public config: ITRConfiguration = new TRConfiguration();
    public shippingTicket: IShippingTicketModel = new ShippingTicketModel();
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public PERMISSION_TAG = CONSTANTS.PERMISSIONS.SHIPPING_TICKET;
    public CONSTANTS = CONSTANTS;
    public hasPermissionReprint = false;
    public companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    public isDisabledPrint = false;
    readonly PARAM_WEIGHING_TABLE = CONSTANTS.PARAM_WEIGHING_TABLE;
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(
        localStorage.getItem('decimals')
    ).general : CONSTANTS.DEFAULT_SYSTEM_SETTINGS.GENERAL_DECIMALS;
    readonly CHARACTERISTICS_DECIMAL: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).characteristics : CONSTANTS.DEFAULT_SYSTEM_SETTINGS.GENERAL_DECIMALS;
    readonly DEDUCTIONS_ALLOW_ACTIONS = CONSTANTS.DEDUCTIONS_ALLOW_ACTIONS;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private currentLang: string;
    private generateReportsHelpClass: any;
    constructor(private _activatedRoute: ActivatedRoute,
        private _alert: AlertService,
        private _i18nPipe: I18nPipe,
        private _i18n: I18nService,
        private _permissionsService: PermissionsService,
        private _errorHandler: ResponseErrorHandlerService,
        private _shippingService: ShippingTicketService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _route: Router,
        private _notifierService: NotifierService,
        private _dialog: MatDialog,
        ) {
        const params = this._activatedRoute.snapshot.params;
        this.id = params['id'];
        this.hasPermissionReprint = this._permissionsService.checkValidity(
            this.PERMISSIONS.SHIPPING_TICKET,
            this.PERMISSION_TYPES.REPRINT
        );
        this._i18n.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((lang) => (this.currentLang = lang));
    }

    ngOnInit() {
        this.getConfig();
        this.getCompanyInfo();
        this.getShippingNoteDetail();
        this.generateReportsHelpClass = new ShippingTicketGenerateReports(this._shippingService, this._alert, this._i18nPipe, this._errorHandler, this._route);

    }

    public formWeightCaptureReady(event, i: number) {

    }
    public getConfig() {
        this.blockUI.start();
        this._purchaseOrderService.getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.config = response;
                },
                (error) => {
                    this.blockUI.stop();
                    const message: string = this._errorHandler.handleError(
                        error,
                        'config'
                    );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            );
    }
    public getCompanyInfo() {
        this.blockUI.start();
        this._shippingService.getCompanyInfo().subscribe(
            (response) =>
                (this.companyInfo = new WCompanyInfoModel(response.data)),
            (error) => {
                this.blockUI.stop();
                const message: string = this._errorHandler.handleError(
                    error,
                    'config'
                );
                this._alert.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );
            }
        );

    }
    public getShippingNoteDetail() {
        this._shippingService.getShippingTicketDetail(this.id)
            .pipe(take(1))
            .subscribe(
                (result: IShippingTicketModel) => {
                    this.blockUI.stop();
                    this.shippingTicket = result;

                }, error => {
                    this.blockUI.stop();
                    const message: string = this._errorHandler.handleError(
                        error,
                        'shipping-ticket'
                    );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            );
    }

    public onVoid(shippingTicket: IShippingTicketModel) : void {
        try {
            const settingsDialogComponent: ITRDialogSettings = {
                title: this._i18nPipe.transform('shipping-ticket-void-question').replace('[value]',shippingTicket.generalInformation.folio ),
                onlyMessage: this._i18nPipe.transform('shipping-ticket-void-question-message'),
                okButton: { label:'void' , class:'tr__button__delete' },
                withReason: true
            }
            this.blockUI.start();
            this._dialog.open(ConfirmationDialogComponent, {
                autoFocus: false,
                disableClose: true,
                data: settingsDialogComponent,
            }).afterClosed().pipe(takeUntil(this.destroy$))
             .subscribe(
                (result) => {
                    this.blockUI.stop()
                    result.action == CONSTANTS.CRUD_ACTION.ACCEPT ? this._sendShippingTicketToVoid(shippingTicket,  result.reason) : null
                }, null, () => {
                    this.blockUI.stop();
                });
        } catch (error) { }
    }

    private _sendShippingTicketToVoid(shippingTicket: IShippingTicketModel, reason:string) : void {
        this.blockUI.start()
        this._shippingService.voidShippingTicket(shippingTicket.generalInformation.id, reason).pipe(take(1)).subscribe((response:IShippingTicketModel) =>{
            this._notifierService.notify('success', this._i18nPipe.transform('shipping-ticket-void-success').replace('[value]', shippingTicket.generalInformation.folio));
            this.ngOnInit();
            this.blockUI.stop();
        },err=> {
            this.blockUI.stop();
            const message: string = this._errorHandler.handleError(
                err,
                'shipping-ticket'
            );
            this._alert.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
        })

    }
    /**
     * generate report or download
     */
    public onGenerateTicketPdf(action: number) {
        this.generateReportsHelpClass.onGenerateReportPdf(this.blockUI, this.currentLang, this.shippingTicket.generalInformation, action);
    }

    public getDeductionsAllowAction(characteristic: IWNCharacteristicModel): string {
        return characteristic.deduction.allowedActions ? Object.values(characteristic.deduction.allowedActions)[0][0] : '';
    }

}
