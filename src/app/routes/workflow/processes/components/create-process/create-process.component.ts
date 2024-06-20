import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take, takeUntil, tap } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { WorkflowConfirmDialogComponent } from '../../../confirm-dialog/workflow-confirm-dialog.component';
import { IProcessModel, IProcessRequestModel, ProcessModel } from '../../../models/process.model';
import { IShapeModel, ShapeModel } from '../../../models/shape.model';
import { ITransformationTypeModel } from '../../../models/transformation_types.model';
import { WorkflowService } from '../../../services/workflow.service';

@Component({
  selector: 'app-create-process',
  templateUrl: './create-process.component.html',
  styleUrls: ['./create-process.component.scss']
})
export class CreateProcessComponent implements OnDestroy {

  @BlockUI('create-process') blockUI: NgBlockUI;
  public isEdit: boolean = false;
  public process: IProcessModel;
  public processId: string;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public colors = [
    '#7e57c2', '#5c6bc0', '#42a5f5', '#29b6f6', '#66bb6a', '#ffee58',
    '#5e35b1', '#3949ab', '#1e88e5', '#039be5', '#43a047', '#ffd600',
    '#311b92', '#1a237e', '#0d47a1', '#01579b', '#1b5e20', '#f9a825',
    '#651fff', '#3d5afe', '#2979ff', '#00b0ff', '#00e676', '#ffea00'
  ];
  public selectedColor: string = '#039be5 ';
  public processForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required, Validators.maxLength(CONSTANTS.MAX_LENGTH_TEXT_NOTE), Validators.pattern(CONSTANTS.ALPHANUMERIC_REGEXP)]),
    color: new UntypedFormControl('')
  });
  public dataWasMadeModified = false;
  public transformationTypes: ITransformationTypeModel[] = [];
  public isLoadingTransformationTypes: boolean = false;
  private destroy$: Subject<boolean> = new Subject();
  private isFromWorkflow: boolean = false;
  private queryParams: any;
  constructor(
    private _i18n: I18nPipe,
    private _router: Router,
    private _dialog: MatDialog,
    private _alertService: AlertService,
    private _handlerError: ResponseErrorHandlerService,
    private _activatedRoute: ActivatedRoute,
    private _workflowService: WorkflowService,
    private _notifierService: NotifierService
  ) {
    this.queryParams = this._activatedRoute.snapshot.queryParams;
    this.processId = this.queryParams.processId;
    this.isEdit = (this.processId)? true : false;
    this.isFromWorkflow = this.queryParams.isFromWorkflow == 'true';
    if(this.isEdit) {
      this._getProcess()
    }
  }

  private _getProcess() {
    this.blockUI.start();
    this._workflowService.getProcess(this.processId)
      .pipe(
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response: IProcessModel) => {
          this.process = response;
          this._handleEditProcess();
          this.blockUI.stop();
        },
        (error: HttpErrorResponse) => {
          let message = this._handlerError.handleError( error, 'process');
          this._alertService.errorTitle( this._i18n.transform('error-msg'), this._i18n.transform(message));
          this.blockUI.stop();
        }
      )
  }

  private _handleEditProcess() {
    this.selectedColor = this.process.color;
    this.processForm.addControl('id', new UntypedFormControl(this.process.id));
    this.processForm.patchValue({
      name: this.process.name,
      color: this.process.color
    });
    this.processForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.dataWasMadeModified = (JSON.stringify(this.process) != JSON.stringify(data));
      })
  }

  public deleteShapeToDiagram() {
    const dialogRef = this._dialog.open(WorkflowConfirmDialogComponent, {
      width: '450px',
      data: {
        confirmationTitle: this._i18n.transform('process-delete-title'),
        name: this.process.name,
        canDelete: true
      }
    });
    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        result => {
          if (result) {
            this.deleteProcess();
          }
        }
      )
  }

  public deleteProcess() {
    this._workflowService.deleteProcess(this.processId)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response) => {
          this.blockUI.stop();
          this._notifierService.notify( 'success', this._i18n.transform('success-process-delete'));
          this._back();
        },
        (error) => {
          let message = this._handlerError.handleError( error, 'process');
          this._alertService.errorTitle( this._i18n.transform('error-msg'), this._i18n.transform(message));
          this.blockUI.stop();
        }
      )
  }

  public submit() {
    this.processForm.patchValue({ color: this.selectedColor ?? '#1e88e5' });
    let process: IProcessRequestModel = new ProcessModel(this.processForm.value, false).getRequest();
    if(!this.isEdit){
      this.createProcess(process)
    } else {
      this.editProcess(process)
    }
  }

  public createProcess(process: IProcessRequestModel) {
    this._workflowService.postProcess(process)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response) => {
          this.blockUI.stop();
          this._notifierService.notify( 'success', this._i18n.transform('process-created-success'));
          this._back();
        },
        (error) => {
          let message = this._handlerError.handleError( error, 'process');
          this._alertService.errorTitle( this._i18n.transform('error-msg'), this._i18n.transform(message));
          this.blockUI.stop();
        }
      )
  }

  public editProcess(process: IProcessRequestModel) {
    this._workflowService.putProcess(process)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response) => {
          this.blockUI.stop();
          this._notifierService.notify( 'success', this._i18n.transform('success-process-edit'));
          this._back();
        },
        (error) => {
          let message = this._handlerError.handleError( error, 'process');
          this._alertService.errorTitle( this._i18n.transform('error-msg'), this._i18n.transform(message));
          this.blockUI.stop();
        }
      )
  }

  public selectColor(color: string) {
    this.selectedColor = color;
    this.processForm.patchValue({color: this.selectedColor});
  }

  public cancel() {
    this._back();
  }

  private _back() {
    if(this.isFromWorkflow) {
      this._router.navigate(['routes', 'workflow', 'create-workflow'], 
        { 
          queryParams: {
            commodityId: this.queryParams.commodityId,
            workflowId: this.queryParams.workflowId
          }
        }
      );
    } else {
      this._router.navigate(['routes', 'workflow'], { queryParams: { tabIndex: 1 } })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
