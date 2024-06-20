import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ITDriverModel } from '../models/driver.model';
import { DriversService } from '../services/drivers.service';

@Component({
  selector: 'app-modal-delete-driver',
  templateUrl: './modal-delete-driver.component.html',
  styleUrls: ['./modal-delete-driver.component.css']
})
export class ModalDeleteDriverComponent implements OnDestroy {

  @BlockUI('block-delete') blockUI: NgBlockUI;

  public isSubmitButtonDisabled: boolean = false;

  public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;


  private _subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<ModalDeleteDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITDriverModel,
    private _alertService: AlertService,
    private _driversService: DriversService,
    private _errorHandlerService: ResponseErrorHandlerService,
    private _notifierService: NotifierService,
    private _i18nPipe: I18nPipe
  ) { }


  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public onClose() {
    this.dialogRef.close({ refresh: false });
  }

  public onSumbitDelete() {

    this.blockUI.start();

    this.isSubmitButtonDisabled = true;

    this._subscription.add(
      this._driversService.deleteDrivers(this.data.id).subscribe(
        (response: any) => {

          this.isSubmitButtonDisabled = false;

          this._notifierService.notify('success', this._i18nPipe.transform('success-delete-driver'));

          this.blockUI.stop();

          this.dialogRef.close({ refresh: true });

        },
        (error: HttpErrorResponse) => {
          this.onClose();
          let message: string = this._errorHandlerService.handleError(error, 't-drivers');
          this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
          this.isSubmitButtonDisabled = false;
          this.blockUI.stop();
        }
      )
    );

  }

}
