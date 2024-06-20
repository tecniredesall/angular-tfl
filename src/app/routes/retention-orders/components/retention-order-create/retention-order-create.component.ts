import { RetentionOrdersService } from './../../services/retention-orders.service';

import { RetentionOrderModel } from './../../models/retention-orders-model';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LotComponentsFlowCreateModel, LotFlowCreateLotEnum } from 'src/app/routes/lots/models/lot-components-flow-create.model';
import { ILotWeignotesModel } from 'src/app/routes/lots/models/lot-weignotes.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';

import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { take, takeUntil } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { ITRDialogSettings } from 'src/app/shared/models/tr-dialog-settings';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Subject } from 'rxjs';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { proccessReportPdf } from 'src/app/shared/utils/files/process-pdf-report';

@Component({
    selector: 'sst-retention-order-create',
    templateUrl: './retention-order-create.component.html',
    styleUrls: ['./retention-order-create.component.scss']
})
export class RetentionOrderCreateComponent {
    @BlockUI('lot-create-wrapper') blockUIWrapper: NgBlockUI;

    public currentLanguage: string = localStorage.getItem('lang');
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public selectedTabIndex: number = 0;
    public isEnabledNotesSelectionTab: boolean = false;
    public urlBackToList: string = '/weight-note';
    public filterStatus: ILotWeignotesModel;
    public createNew: boolean = false;
    public weighNotes: ILotWeignotesModel;
    public isNext: boolean = true;
    public isComplete: boolean = false;
    public isEdit: boolean = false;
    public retentionOrderId: string;
    public queryParams: any = {}
    public formControls: FormGroup = new FormGroup({})
    readonly RETENTION_ORDER_STATUS = CONSTANTS.RETENTION_ORDER_STATUS;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public currentComponet: LotComponentsFlowCreateModel = {
        component: LotFlowCreateLotEnum.filtersComponent,
        nextComponent: LotFlowCreateLotEnum.flowProductionComponent,
        prevComponent: LotFlowCreateLotEnum.initialComponent,
        haveNextStep: true,
        haveBackButton: false
    }
    constructor(
        private _router: Router,
        private _dialog: MatDialog,
        private _retentionOrdersService: RetentionOrdersService,
        private _notifier: NotifierService,
        private _i18n: I18nPipe,
        private _i18nService: I18nService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _alert: AlertService,
        private _activatedRoute: ActivatedRoute
    ) {
        let params: Params = this._activatedRoute.snapshot?.queryParams;
        this.isEdit = params.isEdit;

        const { id } = this._activatedRoute.snapshot?.params;
        this.retentionOrderId = id;

        this.urlBackToList = '/routes/retention-orders'
        this._listenerChangesLanguages()
    }

    private _listenerChangesLanguages() {
        this._i18nService.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((l) => (this.currentLanguage = l));
    }

    /**
     * Navigate to before list view
     */
    public onBackToList(): void {
        this._router.navigateByUrl(this.urlBackToList);
    }

    /**
     * On change validation status of the results filter component
     * @param isValid status
     */
    public onEventFormFilterStatusChange(currentForm: FormGroup): void {
        this.formControls = currentForm
        this.isComplete = this.formControls.valid;
    }

    public onEventBackTab(): void {
        this.selectedTabIndex = 0;
    }

    public onEventCreateNewLot(weighNotes: ILotWeignotesModel): void {
        this.weighNotes = weighNotes;
        this.isComplete = true;
    }

    public onEventbackToList() {
        this.createNew = false;
    }

    saveAndExit(retentionOrderStatus: number) {
        this.blockUIWrapper.start()
        try {
            const postData = new RetentionOrderModel({ id: this.retentionOrderId, ...this.formControls.getRawValue(), status: retentionOrderStatus }).requestCreationOrder(this.formControls.controls.selectedNotesIds.value)

            if (this.isEdit) {
                this.updateRetentionOrder(postData, retentionOrderStatus);
            } else {
                this.createRetentionOrder(retentionOrderStatus, postData);
            }

        } catch (error) {
            this.blockUIWrapper.stop()
        }
    }

    private createRetentionOrder(retentionOrderStatus: number, postData) {

        this._retentionOrdersService.createRetentionOrder(postData).pipe(take(1)).subscribe((order) => {
            const message = this._i18n.transform('retention-order-add-success');
            this._notifier.notify('success', message);

            if (retentionOrderStatus == this.RETENTION_ORDER_STATUS.CLOSED) {
                this._processReportPDF(order)
            } else {
                this.blockUIWrapper.stop()
                this.onBackToList()
            }
        }, err => {
            this.blockUIWrapper.stop()
            let message: string = this._errorHandlerService.handleError(err, 'rentention-orders');
            this._alert.errorTitle(
                this._i18n.transform('error-msg'),
                message
            );
        })

    }

    private updateRetentionOrder(postData, retentionOrderStatus) {

        this._retentionOrdersService.updateRetentionOrder(postData, this.retentionOrderId).pipe(take(1)).subscribe((order) => {

            let message: string = this._i18n.transform('retention-order-add-success');
            if (retentionOrderStatus === this.RETENTION_ORDER_STATUS.OPEN) {
                message = this._i18n.transform('retention-order-edit-success').replace('[value]', order.folio);
            } else {
                message = this._i18n.transform('retention-order-close-success');
            }

            this._notifier.notify('success', message);
            if (retentionOrderStatus == this.RETENTION_ORDER_STATUS.CLOSED) {
                this._processReportPDF(order)
            } else {
                this.blockUIWrapper.stop()
                this.onBackToList()
            }
        }, err => {
            this.blockUIWrapper.stop()
            let message: string = this._errorHandlerService.handleError(err, 'retention-orders');
            this._alert.errorTitle(
                this._i18n.transform('error-msg'),
                message
            );
        })

    }

    private async _processReportPDF(order) {
        const file = await this.reportRetentionOrder('pdf', order.id);
        const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG;
        proccessReportPdf(this._alert, this._errorHandlerService, this._i18n, this._router, this.blockUIWrapper, file, order.folio, CONSTANTS.CRUD_ACTION.PRINT, this.urlBackToList)
    }

    public async reportRetentionOrder(format: string, id: string) {
        try {
            let result = await this._retentionOrdersService.reportRetentionOrder(id, format, this.currentLanguage);
            const file = format == 'pdf' ? result.data : null;
            return file
        } catch (e) {
            this.blockUIWrapper.stop()
            let message: string = this._errorHandlerService.handleError(e, 'note');
            this._alert.errorTitle(this._i18n.transform('error-msg'), message);
            throw e;
        }
    }

    onCancel() {
        const notes = this.formControls.controls.selectedNotesIds?.value
        if (notes && notes.length > 0) {
            const settingsDialogComponent: ITRDialogSettings = {
                title: this._i18n.transform('retention-cancel-question'),
                message: this._i18n.transform('retention-cancel-question-message')
            }
            this.blockUIWrapper.start();
            this._dialog.open(ConfirmationDialogComponent, {
                autoFocus: false,
                disableClose: true,
                data: settingsDialogComponent,
            }).afterClosed().pipe(takeUntil(this.destroy$))
                .subscribe(
                    (action: number) => {
                        action == CONSTANTS.CRUD_ACTION.ACCEPT ? this.onBackToList() : null
                    }, null, () => {
                        this.blockUIWrapper.stop();
                    });
        } else {
            this.onBackToList()
        }
    }
}
