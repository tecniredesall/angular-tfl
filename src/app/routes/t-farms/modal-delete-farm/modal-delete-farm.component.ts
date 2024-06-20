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
import { TIFarmModel } from '../models/farm.model';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-modal-delete-farm',
  templateUrl: './modal-delete-farm.component.html',
  styleUrls: ['./modal-delete-farm.component.css']
})
export class ModalDeleteFarmComponent implements OnDestroy {

  @BlockUI('farm-delete') blockUI: NgBlockUI;

  public isSubmitButtonDisabled: boolean = false;

  public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;


  private _subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<ModalDeleteFarmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TIFarmModel,
    private _alertService: AlertService,
    private _farmService: FarmService,
    private _responseErrorHandlerService: ResponseErrorHandlerService,
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
      this._farmService.deleteFarm(this.data.id).subscribe(
        (response: any) => {
          this.isSubmitButtonDisabled = false;
          this._notifierService.notify('success', this._i18nPipe.transform('t-farms-notify-delete-farm'));
          this.blockUI.stop();
          this.dialogRef.close({ refresh: true }); 
        },
        (error: HttpErrorResponse) => {
          let message: string = this._responseErrorHandlerService.handleError(error, 't-farms')
          this._alertService.error(message);
          this.isSubmitButtonDisabled = false;
          this.blockUI.stop();
      })
    );
  }

}
