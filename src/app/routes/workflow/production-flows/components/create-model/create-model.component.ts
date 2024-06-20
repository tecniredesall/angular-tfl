import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { IWorkflowModel, IWorkflowRequestModel, WorkflowModel } from 'src/app/shared/models/workflow.models';
import { WorkflowService } from '../../../services/workflow.service';
import { take, takeUntil } from 'rxjs/operators';
import { IProductionTypeModel } from 'src/app/shared/models/production-type.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ICommodityTypeModel } from '../../../models/commodity-type.model';
import { ICommodityModel } from '../../../models/commodity.model';
import { MatDialog } from '@angular/material/dialog';
import { WorkflowConfirmDialogComponent } from '../../../confirm-dialog/workflow-confirm-dialog.component';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.scss'],
})
export class CreateModelComponent implements OnInit, OnDestroy {
  @BlockUI('create-workflow') blockUI: NgBlockUI;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public isEdit = false;
  public workflow: IWorkflowModel;
  public formWorkflow = new UntypedFormGroup({
    commodityId: new UntypedFormControl('', Validators.required),
    originCommodityTypeId: new UntypedFormControl(null, Validators.required),
    name: new UntypedFormControl('', Validators.required),
    productionTypeId: new UntypedFormControl(null, Validators.required),
    description: new UntypedFormControl(
      '',
      Validators.maxLength(CONSTANTS.MAX_LENGTH_DESCRIPTION_WORKFLOW)
    ),
  });
  public commodityTypes: ICommodityTypeModel[] = [];
  public productionTypes: IProductionTypeModel[] = [];
  public CONSTANTS = CONSTANTS;
  public dataWasMadeModified = false;
  public selectedCommodity: ICommodityModel;
  private destroy$: Subject<boolean> = new Subject();
  private _isFromNewLot = false;
  private _jsonFromLot = JSON.parse(localStorage.getItem('new-lot-filter-status'));
  constructor(
    private _i18n: I18nPipe,
    private _router: Router,
    private _dialog: MatDialog,
    private _alertService: AlertService,
    private _handlerError: ResponseErrorHandlerService,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _workflowService: WorkflowService,
  ) {
    this.workflow = JSON.parse(localStorage.getItem('selected-workflow'));
    let queryParams = this._activatedRoute.snapshot.queryParams;
    this._isFromNewLot = queryParams ? queryParams.isFromNewLot : false;
    let params = this._activatedRoute.snapshot.params;
    this.selectedCommodity = params.commodityId ? { id: params.commodityId, name: queryParams.commodityName }
      : JSON.parse(localStorage.getItem('selected-commodity'));
    this.isEdit = this.workflow ? true : false;
  }

  ngOnInit() {
    this.getCommodityTypes();
    this.getProductionTypes();
    this.getWorkflowData();
  }

  private getProductionTypes() {
    if (!this.blockUI.isActive) this.blockUI.start();
    this._workflowService.getProductionTypes()
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response: IProductionTypeModel[]) => {
          this.productionTypes = response;
          this.blockUI.stop()
        },
        (error: HttpErrorResponse) => {
          let message = this._handlerError.handleError(error, 'workflow');
          this._alertService.errorTitle( this._i18n.transform('error-msg'), this._i18n.transform(message));
          this.blockUI.stop();
        }
      )
  }

  private getCommodityTypes() {
    if(!this.blockUI.isActive) this.blockUI.start();
    this._workflowService.getCommodityTypes(this.selectedCommodity.id)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response: ICommodityTypeModel[]) => {
          this.commodityTypes = response;
          this.blockUI.stop();
        },
        (error: HttpErrorResponse) => {
          let message = this._handlerError.handleError(error, 'workflow');
          this._alertService.errorTitle( this._i18n.transform('error-msg'), this._i18n.transform(message));
          this.blockUI.stop();
        }
      )
  }

  private getWorkflowData() {
    if (this.isEdit) {
      this.formWorkflow.patchValue({
        name: this.workflow.name,
        originCommodityTypeId: this.workflow.originCommodityTypeId,
        commodityId: this.workflow.commodityId,
        productionTypeId: this.workflow.productionTypeId,
        description: this.workflow.description,
        userId: this.workflow.userId,
      });
      this.formWorkflow.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          let workflow = {
            commodityId: this.workflow.commodityId,
            originCommodityTypeId: this.workflow
              .originCommodityTypeId,
            name: this.workflow.name,
            productionTypeId: this.workflow.productionTypeId,
            description: this.workflow.description,
          };
          this.dataWasMadeModified =
            JSON.stringify(workflow) != JSON.stringify(data);
        })
    } else if (this._isFromNewLot && this._jsonFromLot) {
      this.formWorkflow.patchValue({
        commodityId: this._jsonFromLot.commodity.id,
        originCommodityTypeId: this._jsonFromLot.commodityType.id,
      });
    } else {
      this.formWorkflow.patchValue({
        commodityId: this.selectedCommodity.id,
      });
    }
  }

  public cancel() {
    if (this._isFromNewLot) {
      this._router.navigate(['routes', 'weight-note', 'lots', 'create'], {
        queryParams: { isFromWorkflow: true },
      });
    } else {
      this._router.navigate(['routes', 'workflow'], { queryParams: { commodityId: this.selectedCommodity.id } });
    }
  }

  public createProductionFlow() {
    this.blockUI.start();
    let workflowRequest: IWorkflowRequestModel = new WorkflowModel(
      this.formWorkflow.value,
      false
    ).getRequets();
    this._workflowService.postWorkflow(workflowRequest)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response: any) => {
          this._notifierService.notify(
            'success',
            this._i18n.transform('success-production-flow-create')
          );
          this.blockUI.stop();
          if (this._isFromNewLot) {
            this._jsonFromLot.productionFlow = {
              id: response.data.workflow_id,
              name: response.data.workflow_name,
              productionTypeId: response.data.production_type_id,
              productionTypeName:
                response.data.production_type_name,
            };
            localStorage.setItem( 'new-lot-filter-status', JSON.stringify(this._jsonFromLot)
            );
            this._router.navigate(
              ['routes', 'weight-note', 'lots', 'create'],
              { queryParams: { isFromWorkflow: true, commodityId: this.selectedCommodity.id } }
            );
          } else {
            this._router.navigate(['routes', 'workflow']);
          }
        },
        (error) => {
          let message = this._handlerError.handleError(
            error,
            'workflow'
          );
          this._alertService.errorTitle(
            this._i18n.transform('error-msg'),
            message
          );
          this.blockUI.stop();
        }
      )
  }

  public editProductionFlow() {
    this.blockUI.start();
    this.formWorkflow.addControl('id', new UntypedFormControl(this.workflow.id));
    let workflowRequest: IWorkflowRequestModel = new WorkflowModel(
      this.formWorkflow.value,
      false
    ).getRequets();
    this._workflowService.putWorkflow(workflowRequest)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (res) => {
          this._notifierService.notify( 'success', this._i18n.transform('success-production-flow-edit'));
          this.blockUI.stop();
          this._router.navigate(['routes', 'workflow'], {queryParams: {commodityId: this.selectedCommodity.id}});
        },
        (error) => {
          let message = this._handlerError.handleError( error, 'workflow');
          this._alertService.errorTitle( this._i18n.transform('error-msg'), this._i18n.transform(message));
          this.blockUI.stop();
        }
      )
  }

  public deleteProductionFlow() {
    const dialogRef = this._dialog.open(WorkflowConfirmDialogComponent, {
      width: '450px',
      data: {
        confirmationTitle:
          this.workflow.lots < 1
            ? this._i18n.transform(
              'confirm-production-flow-deletion'
            )
            : this._i18n.transform(
              'cant-production-flow-delete-title'
            ),
        name: this.workflow.name,
        canDelete: this.workflow.lots < 1,
      },
    });
    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe((response) => {
        if(response){
          this.blockUI.start();
          this._workflowService.deleteWorkflow(this.workflow.id)
            .pipe(
              takeUntil(this.destroy$),
              take(1)
            )
            .subscribe(
              (res) => {
                this.blockUI.stop();
                this._notifierService.notify( 'success', this._i18n.transform('success-production-flow-delete'));
                this._router.navigate(['routes', 'workflow'], {queryParams: {commodityId: this.selectedCommodity.id}});
              },
              (error) => {
                let message = this._handlerError.handleError( error, 'workflow');
                this._alertService.errorTitle( this._i18n.transform('error-msg'), this._i18n.transform(message));
                this.blockUI.stop();
              }
            )
        }
      })
  }

  public onActionFooterSelected(action: number): void {
    switch (action) {
      case CONSTANTS.CRUD_ACTION.CREATE:
        this.createProductionFlow();
        break;
      case CONSTANTS.CRUD_ACTION.UPDATE:
        this.editProductionFlow();
        break;
      case CONSTANTS.CRUD_ACTION.DELETE:
        this.deleteProductionFlow();
        break;
      case CONSTANTS.CRUD_ACTION.CANCEL:
        this.cancel();
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete()
  }
}
