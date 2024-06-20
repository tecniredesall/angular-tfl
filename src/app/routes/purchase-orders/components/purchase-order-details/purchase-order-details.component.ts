import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrderModel } from 'src/app/routes/purchase-orders/models/purchase-order.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take, takeUntil } from 'rxjs/operators';
import { IWCompanyInfoModel, WCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { IPurchaseOrderDetailModel, PurchaseOrderDetailModel } from '../../models/purchase-order-detail.model';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import { Subject } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as printJS from 'print-js';

@Component({
    selector: 'app-purchase-order-details',
    templateUrl: './purchase-order-details.component.html',
    styleUrls: ['./purchase-order-details.component.scss']
})
export class PurchaseOrderDetailsComponent implements OnInit {
    @BlockUI('purchase-order-detail') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public id: string;
    public CONSTANTS = CONSTANTS;
    public config: ITRConfiguration = new TRConfiguration();
    public purchaseOrder: IPurchaseOrderDetailModel = new PurchaseOrderDetailModel();
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    readonly PURCHASE_STATUS: any = CONSTANTS.PURCHASE_ORDER_STATUS;
    readonly PURCHASER_SETLED: any = CONSTANTS.PURCHASE_ORDER_SETTLED_STATUS;
    public hasPermissionReprint = false;
    public companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    public isDisabledPrint = false;
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(
        localStorage.getItem('decimals')
    ).general : 2;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private currentLang: string;
    private fromLiquidate : boolean = false;
    constructor(private _activatedRoute: ActivatedRoute,
                private _alert: AlertService,
                private _i18nPipe: I18nPipe,
                private _i18n: I18nService,
                private _permissionsService: PermissionsService,
                private _errorHandler: ResponseErrorHandlerService,
                private _purchaseOrderService: PurchaseOrdersService,
                private _route: Router) {
        const params = this._activatedRoute.snapshot.params;
        let queryParams: Params = this._activatedRoute.snapshot.queryParams;
        this.id = params['id'];
        this.fromLiquidate = queryParams?.fromLiquidate;
        this.hasPermissionReprint = this._permissionsService.checkValidity(
            this.PERMISSIONS.PURCHASE_ORDER,
            this.PERMISSION_TYPES.REPRINT
        );
        this._i18n.lang
        .pipe(takeUntil(this.destroy$))
        .subscribe((lang) => (this.currentLang = lang));
    }

    ngOnInit() {
        this.getConfig();
        this.getCompanyInfo();
    }

    public getConfig() {
        this.blockUI.start();
        this._purchaseOrderService.getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response: ITRConfiguration) => {
                    this.config = response;
                    this.getPurchaseOrderDetail();
                },
                (error) => {
                    this.blockUI.stop();
                    const message: string = this._errorHandler.handleError(
                        error,
                        'note'
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
        this._purchaseOrderService.getCompanyInfo().pipe(take(1)).subscribe(
            (response) =>
                (this.companyInfo = new WCompanyInfoModel(response.data)),
            (error) => {
                const message: string = this._errorHandler.handleError(
                    error,
                    'note'
                );
                this._alert.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );
                this.blockUI.stop();
            }
        );

    }
    private getPurchaseOrderDetail() {
        this._purchaseOrderService.getPurchaseOrderDetail(this.id)
            .pipe(take(1))
            .subscribe(
                (result: IPurchaseOrderDetailModel) => {
                    this.blockUI.stop();
                    this.purchaseOrder = result;
                },
                error => {
                    this.blockUI.stop();
                    const message: string = this._errorHandler.handleError(
                        error,
                        'purchase-order'
                    );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            );
    }

    public back() {
        this._route.navigate(['/routes/purchase-orders'] , { queryParams: {fromDetail:true , fromLiquidate :this.fromLiquidate }});
    }
    public onDownloadOrderPdf() {
        this.blockUI.start();
        this._purchaseOrderService
            .getPurchaseOrderPDF(this.purchaseOrder.id, this.currentLang)
            .pipe(take(1))
            .subscribe(
                (file: any) => {
                    const byteArray = new Uint8Array(
                        atob(file.data)
                            .split('')
                            .map((char) => char.charCodeAt(0))
                    );
                    const blob = new Blob([byteArray], {
                        type: 'application/pdf',
                    });
                    const url = window.URL.createObjectURL(blob);
                    FileSaver.saveAs(url, `${this.purchaseOrder.folio}-report.pdf`);
                    this.blockUI.stop();
                },
                () => {
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
            );
    }

    public onPrintdOrderPdf() {
        this.blockUI.start();
        this._purchaseOrderService
            .getPurchaseOrderPDF(this.purchaseOrder.id, this.currentLang)
            .pipe(take(1))
            .subscribe(
                (file: any) => {
                    printJS({
                        printable: file.data,
                        type: 'pdf',
                        base64: true,
                        onError: (error) => {
                            const message: string =
                                this._errorHandler.handleError(
                                    error,
                                    'print'
                                );
                            this.blockUI.stop();
                            this._alert.errorTitle(
                                this._i18nPipe.transform('error-msg'),
                                message
                            );
                        },
                    });
                    this.blockUI.stop();
                },
                () => {
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('unidentified-problem')
                    );
                }
            );
    }
}
