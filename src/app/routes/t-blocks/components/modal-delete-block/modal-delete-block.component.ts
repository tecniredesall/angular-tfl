import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TIBlockModel } from '../../models/block.model';
import { TBlockService } from '../../services/block.service';

@Component({
  selector: 'app-modal-delete-block',
  templateUrl: './modal-delete-block.component.html',
  styleUrls: ['./modal-delete-block.component.scss']
})
export class ModalDeleteBlockComponent implements OnDestroy {

  @BlockUI('block-delete') blockUI: NgBlockUI;

  public isSubmitButtonDisabled: boolean = false;

  public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;


  private _subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<ModalDeleteBlockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TIBlockModel,
    private _alertService: AlertService,
    private _blockService: TBlockService,
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
      this._blockService.deleteBlock(this.data.id).subscribe(
        (response: any) => {

          this.isSubmitButtonDisabled = false;

          this._notifierService.notify('success', this._i18nPipe.transform('t-blocks-delete-success'));

          this.blockUI.stop();

          this.dialogRef.close({ refresh: true }); 

        },
        (error: HttpErrorResponse) => {
          let message: string = this._responseErrorHandlerService.handleError(error, 't-blocks')
          this._alertService.error(message);
          this.isSubmitButtonDisabled = false;
          this.blockUI.stop();
        }
      )
    );

  }

}
