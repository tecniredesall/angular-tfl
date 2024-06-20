import { take } from 'rxjs/operators';
import { IPurchaseOrderModel } from './../../models/purchase-order.model';
import { PurchaseOrdersService } from './../../services/purchase-orders.service';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

@Component({
    selector: 'app-purchase-order-delete',
    templateUrl: './purchase-order-delete.component.html',
    styleUrls: ['./purchase-order-delete.component.scss']
})
export class PurchaseOrderDeleteComponent implements OnDestroy {
    @BlockUI('block-delete') blockUI: NgBlockUI;
    public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;
    public purchaseOrder: IPurchaseOrderModel;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(public dialogRef: MatDialogRef<PurchaseOrderDeleteComponent>,
                @Inject(MAT_DIALOG_DATA) public data: IPurchaseOrderModel,
                private _alertService: AlertService,
                private _errorHandlerService: ResponseErrorHandlerService,
                private _notifierService: NotifierService,
                private _i18nPipe: I18nPipe,
                private _purchaseService: PurchaseOrdersService) {
        this.purchaseOrder = data;
    }

    public onCloseModal() {
        this.dialogRef.close({ refresh: false });
    }
    public onDeletePurchase() {
        this.blockUI.start();
        this._purchaseService.deletePurchaseOrder(this.data.id)
            .pipe(take(1))
            .subscribe(
                () => {
                    this._notifierService.notify('success', this._i18nPipe.transform('purchase-success-delete'));
                    this.blockUI.stop();
                    this.dialogRef.close({ refresh: true });
                }, error => {
                    this.onCloseModal();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'lots')
                    );
                    this.blockUI.stop();
                }
            );
    }
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
