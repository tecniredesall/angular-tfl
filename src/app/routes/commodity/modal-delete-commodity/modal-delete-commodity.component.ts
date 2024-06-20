import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ICommodityModel } from '../models/commodity.model';
import { CommodityService } from '../services/commodity.service';

@Component({
  selector: 'app-modal-delete-commodity',
  templateUrl: './modal-delete-commodity.component.html',
  styleUrls: ['./modal-delete-commodity.component.css']
})
export class ModalDeleteCommodityComponent implements OnDestroy {
  @BlockUI('block-delete') blockUI: NgBlockUI;
  public isSubmitButtonDisabled: boolean = false;
  public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;
  private _subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<ModalDeleteCommodityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICommodityModel,
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
      this._commodityService.deleteCommodity(this.data.id).subscribe(
        (response: any) => {
          this.isSubmitButtonDisabled = false;
          this._notifierService.notify('success', this._i18nPipe.transform('success-delete-commodity'));
          this.blockUI.stop();
          this.dialogRef.close({ refresh: true });
        },
        (error: HttpErrorResponse) => {
          this.onClose();
          if (
            error.error.hasOwnProperty('data') &&
            error.error.data.hasOwnProperty('not_delete')
          ) {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('msg-commodity-hasinventory'));
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
