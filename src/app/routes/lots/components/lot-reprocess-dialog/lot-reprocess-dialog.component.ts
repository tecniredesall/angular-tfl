import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { IWorkflowModel } from 'src/app/shared/models/workflow.models';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { LotsService } from '../../services/lots.service';

@Component({
  selector: 'tr-lot-reprocess-dialog',
  templateUrl: './lot-reprocess-dialog.component.html',
  styleUrls: ['./lot-reprocess-dialog.component.scss']
})
export class LotReprocessDialogComponent implements OnInit, OnDestroy {

  @BlockUI('block-reprocess') blockUI: NgBlockUI;

  readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;

  public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;
  public isSubmitButtonDisabled: boolean = false;
  public isLoadingWorkflows: boolean = true;
  public workflows: IWorkflowModel[] = [];
  public selectedWorkflow: IWorkflowModel = null;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dialogRef: MatDialogRef<LotReprocessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public lotData: { id: string, folio: string },
    private _alertService: AlertService,
    private _lotsService: LotsService,
    private _errorHandlerService: ResponseErrorHandlerService,
    private _notifierService: NotifierService,
    private _i18nPipe: I18nPipe
  ) { }


  /**
   * Callback method that is invoked immediately after the default change detector has checked the component's data-bound properties for the first time
   */
  ngOnInit() {
    this.getWorkflows();
  }

  /**
   * Method called on destroy component
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Method invoked on select workflow card
   * @param flow selected
   */
  public selectWorklow(flow: IWorkflowModel): void {
    if (flow.totalProcess > 0) {
      this.selectedWorkflow = Object.assign({}, flow);
    }
  }

  /**
   * Method called on cancel action
   */
  public cancel(): void {
    this.dialogRef.close({ refresh: false });
  }

  /**
   * Method called on submit
   */
  public sumbit(): void {
    this.isSubmitButtonDisabled = true;
    this.blockUI.start();
    this._lotsService
      .lotReprocess(this.lotData.id, this.selectedWorkflow.id)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response: any) => {
          this.isSubmitButtonDisabled = false;
          this.blockUI.stop();
          this._notifierService.notify(
            'success',
            this._i18nPipe.transform('lot-reprocess-successfully')?.replace('[value]', this.lotData.folio)
          );
          this.dialogRef.close({
            refresh: true,
            workflowId: this.selectedWorkflow.id
          });
        },
        (error: HttpErrorResponse) => {
          this._alertService.errorTitle(
            this._i18nPipe.transform('error-msg'),
            this._errorHandlerService.handleError(error, 'lots')
          );
          this.isSubmitButtonDisabled = false;
          this.blockUI.stop();
        }
      );
  }

  /**
   * Method invoked for get workflows data
   */
  private getWorkflows(): void {
    this.blockUI.start();
    this._lotsService
      .getWorkflowsToReprocessLot(this.lotData.id)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response: IWorkflowModel[]) => {
          this.workflows = response;
          this.isLoadingWorkflows = false;
          this.blockUI.stop();
        },
        (error: HttpErrorResponse) => {
          this._alertService.errorTitle(
            this._i18nPipe.transform('error-msg'),
            this._errorHandlerService.handleError(error, 'lots')
          );
          this.isLoadingWorkflows = false;
          this.blockUI.stop();
        }
      );
  }

}
