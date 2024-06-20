import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ICommodityTypeModel } from '../models/commodity-type.model';
import { CommodityService } from '../services/commodity.service';

@Component({
  selector: 'app-modal-delete-commodity-type',
  templateUrl: './modal-delete-commodity-type.component.html',
  styleUrls: ['./modal-delete-commodity-type.component.css']
})
export class ModalDeleteCommodityTypeComponent implements OnDestroy {
  @BlockUI('block-delete') blockUI: NgBlockUI;
  public isSubmitButtonDisabled: boolean = false;
  public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;
  private _subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<ModalDeleteCommodityTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICommodityTypeModel,
    private _alertService: AlertService,
    private _commodityService: CommodityService,
    private _notifierService: NotifierService,
    private _i18nPipe: I18nPipe
  ) { }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public onClose(): void {
    this.dialogRef.close({ refresh: false });
  }

  public onSumbitDelete(): void {
    this.blockUI.start();
    this.isSubmitButtonDisabled = true;
    this._subscription.add(
      this._commodityService.deleteCommodityType(this.data.id).subscribe(
        (response: any) => {
          this.isSubmitButtonDisabled = false;
          this._notifierService.notify('success', this._i18nPipe.transform('success-delete-commodity-type'));
          this.blockUI.stop();
          this.dialogRef.close({ refresh: true });
        },
        (error: HttpErrorResponse) => {
          this.onClose();
          if (
            error.error.hasOwnProperty('data') &&
            'related_weight_note'==error.error.data
          ) {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('commodity-type-related-weight-note'));
          }
          else {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          }
          this.isSubmitButtonDisabled = false;
          this.blockUI.stop();
        }
      )
    );
  }

}
