import { RetentionOrderModel } from './../../models/retention-orders-model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take, takeUntil } from 'rxjs/operators';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { IWCompanyInfoModel, WCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { SubscriptionManagerDirective } from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { proccessReportPdf } from 'src/app/shared/utils/files/process-pdf-report';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { RetentionOrdersService } from '../../services/retention-orders.service';
import { NotifierService } from 'angular-notifier';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ITRDialogSettings } from 'src/app/shared/models/tr-dialog-settings';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CompanyInfoService } from 'src/app/shared/services/company-info/company-info.service';

@Component({
    selector: 'sst-retention-order-view',
    templateUrl: './retention-order-view.component.html',
    styleUrls: ['./retention-order-view.component.scss']
})
export class RetentionOrderViewComponent extends SubscriptionManagerDirective implements OnInit {
    public currentLanguage: string = localStorage.getItem('lang');
    public companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    public configuration: ITRConfiguration = new TRConfiguration();
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public currentRetentionOrder : RetentionOrderModel = new RetentionOrderModel({})
    private _retentionOrderId: string;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals'))?.general ?? CONSTANTS.DEFAULT_SYSTEM_SETTINGS.GENERAL_DECIMALS;
    readonly RETENTION_ORDER_STATUS = CONSTANTS.RETENTION_ORDER_STATUS
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;

    @BlockUI('container-view') blockUI: NgBlockUI;
    constructor(
        private _purchaseOrderService: PurchaseOrdersService,
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _router: Router,
        private _dialog: MatDialog,
        private _retentionOrdersService: RetentionOrdersService,
        private _notifier: NotifierService,
        private _activatedRoute: ActivatedRoute,
        private _companyInfoService: CompanyInfoService
    ) {
        super()
        this._retentionOrderId = this._activatedRoute.snapshot.params?.id;
    }

    ngOnInit(): void {
        this._getConfiguration();
        this._getDetailRetentionOrder(this._retentionOrderId);
        this._getCompanyInfoValues();
    }

    public backTolist(): void{
        const urlBackToList: string = '/routes/retention-orders'
        this._router.navigateByUrl(urlBackToList);
    }

    public onDownload(): void {
        this._processReportPDF(this.currentRetentionOrder, CONSTANTS.CRUD_ACTION.DOWNLOAD)
    }

    public onPrint(): void {
        this._processReportPDF(this.currentRetentionOrder, CONSTANTS.CRUD_ACTION.PRINT)
    }

    public onVoided(order: RetentionOrderModel): void {
        try {
            const settingsDialogComponent: ITRDialogSettings = {
                title: this._i18nPipe.transform('retention-void-question').replace('[value]',order.folio ),
                onlyMessage: this._i18nPipe.transform('retention-void-question-message'),
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
                    result.action == CONSTANTS.CRUD_ACTION.ACCEPT ? this._sendOrderToVoid(order,  result.reason) : null
                }, null, () => {
                    this.blockUI.stop();
                });
        } catch (error) { }
    }

    private _sendOrderToVoid(order: RetentionOrderModel, reason:string) : void {
        this.blockUI.start();
        this._retentionOrdersService.voidRetentionOrder(order.id, reason).subscribe((data: any) => {
            this._notifier.notify('success', this._i18nPipe.transform('retention-order-void-success').replace('[value]', order.folio));
            this.blockUI.stop();
            this.ngOnInit()
        }, err => {
            this.blockUI.stop()
            let message: string = this._errorHandlerService.handleError(err, 'rentention-orders');
            this._alertService.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
        })
    }

    private async _processReportPDF(order : RetentionOrderModel, crudAction: number) {
        this.blockUI.start()
        const file = await this.reportRetentionOrder('pdf', order.id)
        proccessReportPdf(this._alertService, this._errorHandlerService, this._i18nPipe, this._router, this.blockUI, file, order.folio, crudAction, undefined)
    }

    public async reportRetentionOrder(format: string, id: string) {
        try {
            let result = await this._retentionOrdersService.reportRetentionOrder(id, format, this.currentLanguage);
            const file = format == 'pdf' ? result.data : null;
            return file
        } catch (e) {
            this.blockUI.stop()
            let message: string = this._errorHandlerService.handleError(e, 'note');
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
            throw e;
        }
    }

    private _getConfiguration(): void {
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._purchaseOrderService.getConfiguration()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (configuration) => {
                    this.configuration = configuration;
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    let message = this._errorHandlerService.handleError(
                        error,
                        'weight-note'
                    );
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                }
            )
    }

    private _getDetailRetentionOrder(id): void {
        this._retentionOrdersService.getDetailRetentionOrders(id).pipe(take(1)).subscribe((data:RetentionOrderModel)=> {
                this.currentRetentionOrder = data
        })
    }

    private _getCompanyInfoValues() {
        this._companyInfoService.getCompanyInfo().pipe(take(1)).subscribe((response) => {
            this.companyInfo = new WCompanyInfoModel(response);
        })
    }

}
