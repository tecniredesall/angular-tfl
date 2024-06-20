import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { warehouseTransferService } from '../../services/warehouse-transfer.service';

@Component({
  selector: 'app-delete-warehouse-transfer',
  templateUrl: './delete-warehouse-transfer.component.html',
  styleUrls: ['./delete-warehouse-transfer.component.scss']
})
export class DeleteWarehouseTransferComponent {
  @BlockUI('block-delete') blockUI: NgBlockUI;
  public reasonDelete = new UntypedFormControl('', Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      shippingTicketId: string,
      folio: string
    },
    private _dialogRef: MatDialogRef<DeleteWarehouseTransferComponent>,
    private _alertService: AlertService,
    private _warehouseTransferService: warehouseTransferService,
    private _errorHandlerService: ResponseErrorHandlerService,
    private _i18nPipe: I18nPipe,
    private router: Router,
  ) { }

  public cancel() {
    this._dialogRef.close();
  }

  public deleteWeightNote() {
    this.blockUI.start();
    this._warehouseTransferService.deleteWarehouseTransferMovement(this.data.shippingTicketId, this.reasonDelete.value).pipe(
      take(1)
    ).subscribe(
      (response: any) => {
        this.blockUI.stop();
        this._dialogRef.close();
        this.router.navigateByUrl(`/routes/warehouse-transfer/detail-movement/${this.data.shippingTicketId}?deleted=true`);
      },
      (error: HttpErrorResponse) => {
        this.cancel();
        this._alertService.errorTitle(
          this._i18nPipe.transform('error-msg'),
          this._errorHandlerService.handleError(error, 'warehouse-transfer')
        );
        this.blockUI.stop();
      }
    );
  }
}
