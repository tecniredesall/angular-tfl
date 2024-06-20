import * as FileSaver from 'file-saver';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as printJS from 'print-js';
import { Subject, Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { take, takeUntil } from 'rxjs/operators';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { IWCompanyInfoModel, WCompanyInfoModel } from 'src/app/routes/weight-note/models/company-info.model';
import { WeightService } from 'src/app/routes/weight-note/services/weight.service';
import { warehouseTransferService } from '../../services/warehouse-transfer.service';
import { IWarehouseTransferModel, WarehouseTransferModel } from '../../models/warehouse-transfer-list.model';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-detail-movement',
    templateUrl: './detail-movement.component.html',
    styleUrls: ['./detail-movement.component.scss'],
})
export class DetailMovementComponent implements OnInit, OnDestroy {
    @BlockUI('movement-detail') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public id: string;
    public movement: IWarehouseTransferModel = new WarehouseTransferModel();
    public file: any;
    public config: any;
    public CONSTANTS = CONSTANTS;
    public companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    private _subscription = new Subscription();
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    readonly PROCESS_FLOW: any = CONSTANTS.PROCESS_FLOW;
    readonly FILE_REPORT_ACTIONS: any = CONSTANTS.FILE_REPORT_ACTIONS;
    public isDisabledPrint = false;
    public hasPermissionReprint = false;
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).general : 0;
    readonly CHARACTERISTICS_DECIMAL: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).characteristics : 0;
    readonly WAREHOUSE_TRANSFER_STATUS_DESCRIPTION: any = CONSTANTS.WAREHOUSE_TRANSFER_STATUS_DESCRIPTION;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private currentLanguage: string = localStorage.getItem('lang');
    public isLoadingMovement: boolean = true;
    public isError: boolean = false;
    public warehouseTransfer: string = "warehouse-transfer";
    public warehouseTransferDetail: string = "warehouse-transfer";

    constructor(
        private route: Router,
        private _alert: AlertService,
        private _i18nPipe: I18nPipe,
        private _sanitization: DomSanitizer,
        private _purchaseOrderService: PurchaseOrdersService,
        private _weightService: WeightService,
        private _warehouseTransferService: warehouseTransferService,
        private _activatedRoute: ActivatedRoute,
        private _permissionsService: PermissionsService,
        private _errorHandler: ResponseErrorHandlerService,
        private _i18nService: I18nService,
        private _notifierService: NotifierService
    ) {
        let params = this._activatedRoute.snapshot.params;
        let queryParams: Params = this._activatedRoute.snapshot.queryParams;
        this.id = params['id'];
        this.hasPermissionReprint = this._permissionsService.checkValidity(
            this.PERMISSIONS.WEIGHT_NOTE,
            this.PERMISSION_TYPES.REPRINT
        );
        this._i18nService.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((l) => (this.currentLanguage = l));

    }
    ngOnInit() {
        this.getConfig();
        this.getCompanyInfo();
    }

    deleteAlert(folio: number) {
        this._activatedRoute.queryParams
            .subscribe(params => {
                const deleted = params.deleted;
                if (deleted) {
                    this._notifierService.notify('success', this._i18nPipe.transform('warehouse-transfer-success-delete').replace('[value]', folio));
                }

            }
            );
    }

    public getWarehouseTransferDetail(_warehouseTransferService: warehouseTransferService) {
        this.blockUI.start();
        this._subscription.add(
            _warehouseTransferService.getWarehouseTransferenceByID(this.id)
            .pipe(take(1)).subscribe(
                (result: any) => {
                    this.movement = result;                    
                    this.deleteAlert(this.movement.transactionID);
                    this.warehouseTransfer = `warehouse-transfer-${this.movement.operationType}put`;
                    this.warehouseTransferDetail = `warehouse-transfer-${this.movement.operationType}put-detail`;
                    this.isLoadingMovement = false;
                    this.blockUI.stop();
                },
                (error) => {
                    this.isLoadingMovement = false;
                    this.isError = true;
                    let message: string = this._errorHandler.handleError(
                        error,
                        'note'
                    );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUI.stop();
                }
            )
        );
    }

    public getCompanyInfo() {
        this.blockUI.start();
        this._subscription.add(
            this._weightService.getCompanyInfo().subscribe(
                (response) => (this.companyInfo = response),
                (error) => {
                    let message: string = this._errorHandler.handleError(
                        error,
                        'note'
                    );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUI.stop();
                }
            )
        );
    }

    public getConfig() {
        this._subscription.add(
            this._purchaseOrderService.getConfiguration().subscribe(
                (response) => {
                    this.config = response;
                    this.getWarehouseTransferDetail(this._warehouseTransferService);
                    this.blockUI.stop();
                },
                (error) => {
                    let message: string = this._errorHandler.handleError(
                        error,
                        'note'
                    );
                    this._alert.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                    this.blockUI.stop();
                }
            )
        );
    }

    public async actionPDF(format: string, action?: string) {
        if (this.checkAvailabilityPrint()) {
            this.blockUI.start();
            try {
                if (format == this.FILE_REPORT_ACTIONS.FORMAT.PDF) {
                    await this.getReportReceptionNote(format);
                    const byteArray = new Uint8Array(
                        atob(this.file)
                            .split('')
                            .map((char) => char.charCodeAt(0))
                    );
                    let blob = new Blob([byteArray], {
                        type: 'application/pdf',
                    });
                    const url = window.URL.createObjectURL(blob);
                    if (action == this.FILE_REPORT_ACTIONS.DOWNLOAD) {
                        const fileName = `${this._i18nPipe.transform('warehouse-transfer')}-${this.movement.id}.pdf`;
                        FileSaver.saveAs(url, fileName);
                    } else {
                        printJS({
                            printable: this.file,
                            type: this.FILE_REPORT_ACTIONS.FORMAT.PDF,
                            base64: true
                        });
                    }
                } else {
                    await this.getReportReceptionNote(format);
                }
                this.blockUI.stop();
            } catch (e) {
                this.blockUI.stop();
            }
        }
    }

    public async getReportReceptionNote(format: string) {
        try {
            let result = await this._warehouseTransferService.reportReceptionNote(
                this.id,
                format,
                this.currentLanguage
            );
            this.file = format == this.FILE_REPORT_ACTIONS.FORMAT.PDF ? result.data : null;
        } catch (e) {
            let message: string = this._errorHandler.handleError(e, 'note');
            this._alert.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
            throw e;
        }
    }

    public checkAvailabilityPrint(): boolean{
        return this.movement.status === this.WAREHOUSE_TRANSFER_STATUS_DESCRIPTION.CLOSE || this.movement.status === this.WAREHOUSE_TRANSFER_STATUS_DESCRIPTION.CANCELED;
    }

    public back() {
        this.route.navigate(['/routes/warehouse-transfer'], {queryParams: { in: this.movement.operationType == this.PROCESS_FLOW.OUT ? "false" : "true" }});
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
