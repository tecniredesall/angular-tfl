import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { IProductionTypeModel, ProductionTypeModel } from 'src/app/shared/models/production-type.model';
import { IWorkflowModel, WorkflowModel } from 'src/app/shared/models/workflow.models';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { reverseSortByKey } from 'src/app/shared/utils/functions/sortFunction';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ICommodityTypeModel, CommodityTypeModel } from '../../kanban/models/commodity-type.model';
import { WorkflowConfirmDialogComponent } from '../confirm-dialog/workflow-confirm-dialog.component';
import { ICommodityModel, CommodityModel } from '../models/commodity.model';
import { WorkflowService } from '../services/workflow.service';
import { removeAccents } from 'src/app/shared/utils/functions/remove-accents';

@Component({
  selector: 'tr-production-flows',
  templateUrl: './production-flows.component.html',
  styleUrls: ['./production-flows.component.scss']
})
export class ProductionFlowsComponent implements OnInit, OnDestroy {
  @BlockUI('production-flows') blockUI: NgBlockUI;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public searchText = '';
  public commodities: ICommodityModel[] = [];
  public productionFlows: IWorkflowModel[] = [];
  public originalProductionFlows: IWorkflowModel[] = [];
  public productionTypes: IProductionTypeModel[] = [];
  public selectedCommodity: ICommodityModel;
  public PERMISSIONS = CONSTANTS.PERMISSIONS;
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
  public tabs: IProductionTypeModel[] = [
    new ProductionTypeModel({ name: 'All', id: '0' }),
  ];
  public isInputSearchFocused = false;
  public selectedIndexTab = 0;
  private destroy$: Subject<boolean> = new Subject();
  private _jsonFromLot = JSON.parse(localStorage.getItem('new-lot-filter-status'));
  private _isFromNewLot = false;
  private _queryParams: any;

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private _i18nPipe: I18nPipe,
    private _alertService: AlertService,
    private _handlerError: ResponseErrorHandlerService,
    private _activatedRoute: ActivatedRoute,
    private _workflowService: WorkflowService,
    private _notifierService: NotifierService
  ) {
    this._queryParams = this._activatedRoute.snapshot.queryParams;
    this._isFromNewLot = this._queryParams ? this._queryParams.isFromNewLot : false;
  }

  ngOnInit() {
    this._getProductionTypes();
    this._getCommodities();
  }

  private _getCommodities() {
    this.blockUI.start();
    this._workflowService.getCommodities()
    .pipe(
      takeUntil(this.destroy$),
      take(1)
    )
    .subscribe((response: any) => {
      this.commodities = response.data.map((d: any) => new CommodityModel(d));
      if (this.commodities.length > 0) {
        let commodity: ICommodityModel;
        if (this._isFromNewLot) {
          commodity = this.commodities.find(c => c.id == this._jsonFromLot.commodity.idc);
        } else {
          commodity = this.commodities.find(c => c.id == this._queryParams?.commodityId);
        }
        this.selectCommodity(commodity ?? this.commodities[0]);
      } else {
        this.blockUI.stop();
      }
    },
    (e) => {
      let message = this._handlerError.handleError(e, 'workflow');
      this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
      this.blockUI.stop();
    });
  }

  private _getProductionTypes() {
    this.blockUI.start();
    this._workflowService.getProductionTypes()
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response: IProductionTypeModel[]) => {
          this.productionTypes = response;
          this.tabs = this.tabs.concat(this.productionTypes);
          this.blockUI.stop();
        },
        (error: any) => {
          let message = this._handlerError.handleError( error, 'workflow' );
          this._alertService.errorTitle(
            this._i18nPipe.transform('error-msg'),
            message
          );
          this.blockUI.stop();
        }
      )
  }

  public selectCommodity(commodity: ICommodityModel) {
    this.selectedCommodity = commodity;
    this.selectedIndexTab = 0;
    this._getWorkflows();
    this.clearSearch();
    if (this._isFromNewLot) {
      this.createProductionFlow();
    }
  }

  private _getWorkflows() {
    this.blockUI.start();
      this._workflowService.getWorkflows(this.selectedCommodity.id)
        .pipe(
          takeUntil(this.destroy$),
          take(1)
        )
        .subscribe(
          (response: WorkflowModel[]) => {
            this.productionFlows = reverseSortByKey(response, 'createdDate');
            this.originalProductionFlows = Array.from(this.productionFlows);
            this.blockUI.stop();
          },
          (e) => {
            let message = this._handlerError.handleError(e,'workflow');
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
            this.blockUI.stop();
          }
        )
  }

  public eventSearch(): void {
    let productionFlows: IWorkflowModel[] = [];
    if (this.selectedIndexTab == 0) {
      productionFlows = Array.from(this.originalProductionFlows);
    } else {
      productionFlows = this.originalProductionFlows.filter(
        (workflow) =>
          workflow.productionTypeId ==
          this.tabs[this.selectedIndexTab].id
      );
    }
    if (this.searchText.trim() !== '') {
      this.productionFlows = productionFlows.filter((w) =>
        removeAccents(w.name).toLowerCase().includes(removeAccents(this.searchText.toLowerCase()))
      );
    } else {
      this.productionFlows = Array.from(productionFlows);
    }
  }

  public clearSearch() {
    this.searchText = '';
    let productionFlows: IWorkflowModel[] = [];
    if (this.selectedIndexTab == 0) {
      productionFlows = Array.from(this.originalProductionFlows);
    } else {
      productionFlows = this.originalProductionFlows.filter(
        (workflow) =>
          workflow.productionTypeId ==
          this.tabs[this.selectedIndexTab].id
      );
    }
    this.productionFlows = productionFlows
  }

  public createProductionFlow() {
    localStorage.removeItem('selected-workflow')
    this._router.navigate(['routes', 'workflow', 'create-production-flow', this.selectedCommodity.id], {queryParams: {commodityName: this.selectedCommodity.name}})
  }

  public editProductionFlow(productionFlow: IWorkflowModel) {
    localStorage.setItem('selected-workflow', JSON.stringify(productionFlow));
    this._router.navigate(['routes', 'workflow', 'create-production-flow', this.selectedCommodity.id],
      {queryParams: {commodityName: this.selectedCommodity.name, workflowId: productionFlow.id}})
  }

  public deleteProductionFlow(productionFlow: IWorkflowModel) {
    const dialogRef = this._dialog.open(WorkflowConfirmDialogComponent, {
      width: '450px',
      data: {
        confirmationTitle:
          productionFlow.lots < 1
            ? this._i18nPipe.transform(
              'confirm-production-flow-deletion'
            )
            : this._i18nPipe.transform(
              'cant-production-flow-delete-title'
            ),
        name: productionFlow.name,
        canDelete: productionFlow.lots < 1,
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
          this._workflowService.deleteWorkflow(productionFlow.id)
            .pipe(
              takeUntil(this.destroy$),
              take(1)
            )
            .subscribe(
              (response: any) => {
                this._notifierService.notify('success', this._i18nPipe.transform( 'success-production-flow-delete'));
                this.blockUI.stop();
                this.commodities.map((commodity) => {
                  if (commodity.id == productionFlow.commodityId) {
                    --commodity.totalModels;
                  }
                });
                let productionFlowIndex = this.originalProductionFlows.findIndex(p => p.id == productionFlow.id);
                this.originalProductionFlows.splice(productionFlowIndex, 1);
                this.productionFlows = this.originalProductionFlows;
              },
              (error: any) => {
                let message = this._handlerError.handleError(error,'workflow');
                this._alertService.errorTitle( this._i18nPipe.transform('error-msg'), message);
                this.blockUI.stop();
              }
            )
        }
      })
  }

  public goToWorkflow(workflow: IWorkflowModel) {
    this._router.navigate(['routes', 'workflow', 'create-workflow'],
      {
        queryParams: {
          commodityId: this.selectedCommodity.id,
          workflowId: workflow.id
        }
      }
    );
  }

  public filterWorkflows(index: number) {
    this.selectedIndexTab = index;
    if (this.tabs[index].id == '0') {
      this.productionFlows = this.originalProductionFlows;
    } else {
      this.productionFlows = this.originalProductionFlows.filter(
        (workflow) => workflow.productionTypeId == this.tabs[index].id
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}

