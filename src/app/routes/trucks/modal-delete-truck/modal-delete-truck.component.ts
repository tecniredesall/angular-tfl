import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ModalDeleteDriverComponent } from '../../drivers/modal-delete-driver/modal-delete-driver.component';
import { ITrucksModel } from '../models/trucks.model';
import { TrucksService } from '../services/trucks.service';

@Component({
  selector: 'app-modal-delete-truck',
  templateUrl: './modal-delete-truck.component.html',
  styleUrls: ['./modal-delete-truck.component.scss']
})
export class ModalDeleteTruckComponent{

  @BlockUI('delete-truck') blockUIDelete: NgBlockUI;
  public templateBlockModalUiDelete: BlockModalUiComponent = BlockModalUiComponent;

  constructor(
    private _i18nPipe: I18nPipe,
    private _alertService: AlertService,
    private _trucksService: TrucksService,
    private _notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public truck: ITrucksModel,
    public dialogRef: MatDialogRef<ModalDeleteDriverComponent>,
    private _errorHandlerService: ResponseErrorHandlerService,
  ) { }

  public onClose() {
    this.dialogRef.close({ refresh: false });
  }

  public deleteTruck(): void {
    this.blockUIDelete.start();
    this._trucksService.deleteTrucks(this.truck.truckId)
      .pipe(take(1))
      .subscribe(
        (result: any) => {
          this.blockUIDelete.stop();
          this._notifierService.notify('success', this._i18nPipe.transform('success-delete-truck'));
          this.dialogRef.close({ refresh: true });
        },
        error => {
          this.blockUIDelete.stop();
          let message = this._errorHandlerService.handleError(error, 'trucks')
          this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message)
          this.dialogRef.close({ refresh: false });
        }
      );
  }

}
