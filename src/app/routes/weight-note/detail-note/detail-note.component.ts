import { I18nService } from './../../../shared/i18n/i18n.service';
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
    accurateDecimalSubtraction
} from 'src/app/shared/utils/functions/accurate-decimal-operation';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { IWCompanyInfoModel, WCompanyInfoModel } from '../models/company-info.model';
import { IReceivingNoteModel, ReceivingNoteModel } from '../models/receiving-note.model';
import { IWNCertificationModel } from '../models/wn-certification.model';
import { IWNDescriptionModel } from '../models/wn-description.model';
import { IWNWeightModel } from '../models/wn-weight.model';
import { WeightService } from '../services/weight.service';
import { take, takeUntil } from 'rxjs/operators';
import { TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrdersService } from '../../purchase-orders/services/purchase-orders.service';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { IWNCharacteristicModel } from '../models/wn-characteristic.model';

@Component({
    selector: 'app-detail-note',
    templateUrl: './detail-note.component.html',
    styleUrls: ['./detail-note.component.scss'],
})
export class DetailNoteComponent implements OnInit, OnDestroy {
    @BlockUI('notes-detail') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public id: string;
    public note: IReceivingNoteModel = new ReceivingNoteModel();
    public file: any;
    public config: TRConfiguration = new TRConfiguration();
    public CONSTANTS = CONSTANTS;
    public companyInfo: IWCompanyInfoModel = new WCompanyInfoModel();
    private _subscription = new Subscription();
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public isDisabledPrint = false;
    public hasPermissionReprint = false;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly CHARACTERISTICS_DECIMAL: number = JSON.parse(localStorage.getItem('decimals')).characteristics;
    readonly WEIGHT_NOTE_STATUS: any = CONSTANTS.WEIGHT_NOTE_STATUS;
    readonly DEDUCTIONS_ALLOW_ACTIONS = CONSTANTS.DEDUCTIONS_ALLOW_ACTIONS;
    private isFromProduction = false;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private currentLanguage: string = localStorage.getItem('lang');

    constructor(
        private route: Router,
        private _alert: AlertService,
        private _i18nPipe: I18nPipe,
        private _sanitization: DomSanitizer,
        private _weightService: WeightService,
        private _activatedRoute: ActivatedRoute,
        private _permissionsService: PermissionsService,
        private _errorHandler: ResponseErrorHandlerService,
        private _purchaseOrderService: PurchaseOrdersService,
        private _i18nService : I18nService
    ) {
        let params = this._activatedRoute.snapshot.params;
        let queryParams: Params = this._activatedRoute.snapshot.queryParams;
        this.id = params['id'];
        this.isFromProduction = queryParams.production ?? false;
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

    public getWeightNote() {
        this.blockUI.start();
        this._subscription.add(
            this._weightService.getWeightNoteById(this.id).subscribe(
                (result: any) => {
                    this.note = new ReceivingNoteModel(result.data, true, this.config);
                    this.note.description.forEach((d: IWNDescriptionModel) => {
                        d.certifications.forEach((c: IWNCertificationModel) => {
                            c.image = this._sanitization.bypassSecurityTrustUrl(
                                c.image
                            );
                        });
                        d.weights.forEach((w: IWNWeightModel) => {
                            w.featuredWeight = accurateDecimalSubtraction(
                                [w.grossWeight, w.tare, w.tareAditional],
                                this.DECIMAL_DIGITS
                            );
                            d.totalSacks += w.sacksNumber;
                            d.totalCharacteristics = accurateDecimalSubtraction(
                                [d.totalAddition, d.totalDiscount],
                                this.DECIMAL_DIGITS
                            );
                            w.netWeightQQ = convertLbtoQQ(w.featuredWeight, this.config.conversionMeasurementUnitFactor);
                        });
                    });
                    this.checkAvailabilityPrint();
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
        this.blockUI.start();
        this._purchaseOrderService.getConfiguration()
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.config =  response;
                    this.getWeightNote();
                    this.blockUI.stop();
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


    public async actionPDF(format: string, action?: string) {
        if (!this.isDisabledPrint) {
            this.blockUI.start();
            try {
                if (format == 'pdf') {
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
                    if (action == 'download') {
                        const fileName = `${this.note.information.producer.fullName} ${this._i18nPipe.transform('weight-note-number')}${this.note.information.folio}.pdf`;
                        FileSaver.saveAs(url, fileName);
                    } else {
                        printJS({
                            printable: this.file,
                            type: 'pdf',
                            base64: true
                        });
                    }
                } else {
                    await this.getReportReceptionNote(format);
                }
                this.note.information.print++;
                this.checkAvailabilityPrint();
                this.blockUI.stop();
            } catch (e) {
                this.blockUI.stop();
            }
        }
    }

    public async getReportReceptionNote(format: string) {
        try {
            let result = await this._weightService.reportReceptionNote(
                this.id,
                format,
                this.currentLanguage
            );
            this.file = format == 'pdf' ? result.data : null;
        } catch (e) {
            let message: string = this._errorHandler.handleError(e, 'note');
            this._alert.errorTitle(
                this._i18nPipe.transform('error-msg'),
                message
            );
            throw e;
        }
    }

    public checkAvailabilityPrint() {
        this.isDisabledPrint =
            !this.hasPermissionReprint && this.note.information.print > 0;
    }

    public back() {
        this.route.navigate(['/routes/weight-note'] ,{queryParams: { production: this.isFromProduction }});
    }

    public getDeductionsAllowAction(characteristic: IWNCharacteristicModel): string {
        return characteristic.deduction.allowedActions ? Object.values(characteristic.deduction.allowedActions)[0][0] : '';
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
