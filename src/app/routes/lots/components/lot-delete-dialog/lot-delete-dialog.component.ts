import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ILotDelete } from '../../../../shared/models/lot-delete.model';
import { LotsService } from '../../services/lots.service';

@Component({
  selector: 'app-lot-delete-dialog',
  templateUrl: './lot-delete-dialog.component.html',
  styleUrls: ['./lot-delete-dialog.component.scss']
})
export class LotDeleteDialogComponent implements OnDestroy {

  @BlockUI('block-delete') blockUI: NgBlockUI;
  
  public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;
  public isSubmitButtonDisabled: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dialogRef: MatDialogRef<LotDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ILotDelete,
    private _alertService: AlertService,
    private _lotsService: LotsService,
    private _errorHandlerService: ResponseErrorHandlerService,
    private _notifierService: NotifierService,
    private _i18nPipe: I18nPipe
  ) { }

  /**
   * Method called on destroy component
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Method called on cancel action or error ocurred in request to API
   */
  public onClose(): void {
    this.dialogRef.close({ refresh: false });
  }

  /**
   * Method called on submit lote delete
   */
  public onSumbitDelete(): void {
    this.blockUI.start();
    this.isSubmitButtonDisabled = true;
    this._lotsService.lotDelete(this.data.id).pipe(
      takeUntil(this.destroy$),
      take(1)
    ).subscribe(
      (response: any) => {
        this._notifierService.notify('success', this._i18nPipe.transform('lot-success-delete'));
        this.isSubmitButtonDisabled = false;
        this.blockUI.stop();
        this.dialogRef.close({ refresh: true });
      },
      (error: HttpErrorResponse) => {
        this.onClose();
        this._alertService.errorTitle(
          this._i18nPipe.transform('error-msg'),
          this._errorHandlerService.handleError(error, 'lots')
        );
        this.isSubmitButtonDisabled = false;
        this.blockUI.stop();
      }
    );
  }

}
