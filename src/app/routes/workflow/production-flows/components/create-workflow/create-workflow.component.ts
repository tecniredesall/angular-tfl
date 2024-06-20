import { NotifierService } from 'angular-notifier';
import { DxDiagramComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { leftDirection, rightDirection } from 'src/app/shared/utils/animations/directions.animation';
import { rotateIcon } from 'src/app/shared/utils/animations/rotate.animation';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { IWorkflowProcessModel, IWorkflowProcessRequestModel, WorkflowProcessModel } from '../../../models/workflow-process.model'
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WorkflowConfirmDialogComponent } from '../../../confirm-dialog/workflow-confirm-dialog.component';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ConnectorModel, IConnectorModel } from '../../../models/connector.model';
import { IWorkflowModel, WorkflowModel } from 'src/app/shared/models/workflow.models';
import { IProcessModel, ProcessModel } from '../../../models/process.model';
import { IShapeModel, ShapeModel } from '../../../models/shape.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { take, takeUntil } from 'rxjs/operators';
import { WorkflowService } from '../../../services/workflow.service';
import DataSource from "devextreme/data/data_source";
import { IPaginator } from 'src/app/shared/models/paginator.model';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-create-workflow',
  templateUrl: './create-workflow.component.html',
  styleUrls: ['./create-workflow.component.scss'],
  animations: [leftDirection, rightDirection, rotateIcon],
})
export class CreateWorkflowComponent implements OnInit, OnDestroy {
  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;
  @BlockUI('diagram-workflow') blockUI: NgBlockUI;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public selectedWorkflow: IWorkflowModel;
  public workflows: IWorkflowModel[];
  public isEditShape = false;
  public processes: IProcessModel[] = [];
  public globalProcesses: IProcessModel[] = [];
  public paginatorProcesses: IPaginator;
  public isGlobalProcessesLoading: boolean = false;
  public workflowProcesses: IWorkflowProcessModel[] = [];
  public isEdit = false;
  public shapes: IShapeModel[] = [];
  public menuOpen: boolean;
  public showProcess = window.innerWidth > 1024;
  public disabledButtonProcess = window.innerWidth < 768;
  public shapeToEdit: IShapeModel;
  public connectors: IConnectorModel[] = [];
  public dataSourceShapes = new DataSource({
    store: new ArrayStore({
      key: 'id',
      data: [],
    }),
    reshapeOnPush: true
  });
  public dataSourceConnectors = new DataSource({
    store: new ArrayStore({
      key: 'id',
      data: [],
    }),
    reshapeOnPush: true
  });
  public positionCount = 0;
  public PERMISSIONS = CONSTANTS.PERMISSIONS;
  public diagramReadOnly = false;
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
  public shapesWithConnector: IShapeModel[] = [];
  public stackShapesWithConnector: IShapeModel[] = [];
  public searchTextProcess: string = '';
  public processControl = new UntypedFormControl('');
  private destroy$: Subject<boolean> = new Subject();
  private cancelRequestProcess$: Subject<boolean> = new Subject();
  private _timeout: any;
  private _workflowId: string;
  private _commodityId: number;
  private _isFromNewLot = false;
  private _permissionWorkflow: any;
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
    let queryParams = this._activatedRoute.snapshot.queryParams;
    this._workflowId = queryParams.workflowId;
    this._commodityId = queryParams.commodityId;
    this._isFromNewLot = queryParams ? queryParams.isFromNewLot : false;
    let permissions = JSON.parse(localStorage.getItem('token-data')).permissions;;
    this._permissionWorkflow = permissions.find((p: any) => (p.tag == this.PERMISSIONS.WORKFLOW || p.tag == this.PERMISSIONS.ALL));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showProcess = window.innerWidth > 1024;
    this.disabledButtonProcess = window.innerWidth < 768;
  }

  ngOnInit() {
    this._getWorkflows();
  }
  
  private _getWorkflows() {
    if(!this.blockUI.isActive) this.blockUI.start();
    this._workflowService.getWorkflows(this._commodityId)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response: WorkflowModel[]) => {
          this.workflows = response;
          this.selectedWorkflow = this.workflows.find(w => w.id == this._workflowId);
          this.diagramReadOnly = (this.selectedWorkflow.lots > 0 ||
            (this._permissionWorkflow && !this._permissionWorkflow.permission.hasOwnProperty(this.PERMISSION_TYPES.UPDATE)));
          if(this.diagramReadOnly) {
            this.processControl.disable();
          }
          this._getProcesses();
          this._getWorkflowProcesses();
        },
        (error: HttpErrorResponse) => {
          let message = this._handlerError.handleError(error,'workflow');
          this._alertService.errorTitle(this._i18n.transform('error-msg'),message);
          this.blockUI.stop();
        }
      )
  }

  private _getProcesses(url: string = null, queryParams = {}) {
    this.isGlobalProcessesLoading = true;
    this._workflowService.getProcesses(url, queryParams)
      .pipe(
        takeUntil(this.cancelRequestProcess$),
        take(1)
      )
      .subscribe(
        (response: {data: IProcessModel[], pagination: IPaginator}) => {
          if(response.pagination.currentPage == 1) {
            this.globalProcesses = [];
          }
          this.globalProcesses = this.globalProcesses.concat(response.data);
          this.processes.forEach(process => this.toggleGlobalProcess(process, true))
          this.paginatorProcesses = response.pagination;
          this.isGlobalProcessesLoading = false;
        },
        (error: HttpErrorResponse) => {
          let message = this._handlerError.handleError(error,'workflow');
          this._alertService.errorTitle(this._i18n.transform('error-msg'), message);
          this.isGlobalProcessesLoading = false;
        }
      )
  }

  public itemTypeExpr(shape: any) {
    return "shape" + shape.id;
  }

  private _clearDiagram() {
    this.shapes = [];
    this.connectors = [];
    this.shapesWithConnector = [];
    this.stackShapesWithConnector = [];
    this.dataSourceShapes = new DataSource({
      store: new ArrayStore({
        key: 'id',
        data: [],
      }),
      reshapeOnPush: true
    });
    this.dataSourceConnectors = new DataSource({
      store: new ArrayStore({
        key: 'id',
        data: [],
      }),
      reshapeOnPush: true
    });
  }

  private _getWorkflowProcesses() {
    if(!this.blockUI.isActive) this.blockUI.start();
    this._workflowService
      .getWorkflowProcesses(this.selectedWorkflow.id)
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(
        (response: WorkflowProcessModel[]) => {
          this.workflowProcesses = response;
          if (this.workflowProcesses.length > 0) {
            this._drawDiagram();
          } else {
            this._createProcessPending();
          }
          this.blockUI.stop();
        },
        (error: HttpErrorResponse) => {
          let message = this._handlerError.handleError( error, 'workflow');
          this._alertService.errorTitle(this._i18n.transform('error-msg'), message);
          this.blockUI.stop();
        }
      )
  }

  private _drawDiagram() {
    this.isEdit = true;
    for (let i = 0; i < this.workflowProcesses.length; i++) {
      let process: IProcessModel = new ProcessModel(this.workflowProcesses[i], false);
      this.toggleGlobalProcess(process, true);
      this.processes.push(process)
      let shape: IShapeModel = new ShapeModel({...this.workflowProcesses[i]});
      let findShape = this.shapes.find(s => s.id == shape.id)
      if(!findShape){
        this.shapes.push(shape);
        this.addShapeToArray(shape, this.shapesWithConnector)
        let shapeForStore: IShapeModel = new ShapeModel({...this.workflowProcesses[i]});
        this.dataSourceShapes.store().push([ { type: 'insert', data: shapeForStore, index: -1 } ]);
      }
    }
    this.dataSourceShapes.store().load().then(() => {
      this._createConnectors()
    });
  }

  private _createProcessPending(){
    let pendingProcess: IProcessModel = new ProcessModel({
      id: 'pending_process',
      name: 'kanban-dashboard-process-pending',
      color: '#70889E',
      transformationTypes: {
          in: [this.selectedWorkflow.transformationType],
          out: [this.selectedWorkflow.transformationType]
      }
    }, false)
    this.processes.push(pendingProcess);
    this.createShape(pendingProcess);
  }

  private _createConnectors() {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const fatherShapes = this.shapes.filter(s => s.level == (shape.level - 1));
      for (let j = 0; j < fatherShapes.length; j++) {
        const fatherShape = fatherShapes[j];
        const connector = new ConnectorModel({
          id: i + '0' + j,
          toKey: shape.id,
          fromKey: fatherShape.id,
        });
        this.addConnector(connector)
      }
    }
  }

  public onProcessesScroll() {
    this.cancelRequestProcess$.next(true);
    if(this.paginatorProcesses.nextPageUrl && !this.isGlobalProcessesLoading) {
      this._getProcesses(this.paginatorProcesses.nextPageUrl, {q: this.searchTextProcess})
    }
  }

  public onSearchProcess(searchText: any) {
    this.isGlobalProcessesLoading = true;
    this.cancelRequestProcess$.next(true);
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
        const search: string = searchText;
        this.searchTextProcess = search;
        this._getProcesses(null, {q: this.searchTextProcess})
    }, 600);
  }

  public selectProcess(process: IProcessModel) {
    this.toggleGlobalProcess(process, true);
    let findProcess = this.processes.find(p => p.id == process.id);
    if(!findProcess) {
      this.processes.push(process);
      this.createShape(process);
      this.clearSearchProcess();
    }
  }

  public toggleGlobalProcess(process: IProcessModel, disabled: boolean) {
    let indexGlobalProcess = this.globalProcesses.findIndex(g => g.id == process.id)
    if(indexGlobalProcess > -1) {
      this.globalProcesses[indexGlobalProcess].isDisabled = disabled;
    }
  }

  public createNewProcess() {
    this._router.navigate(['routes', 'workflow', 'create-process'], 
      { 
        queryParams: {
          isFromWorkflow: true,
          commodityId: this.selectedWorkflow.commodityId,
          workflowId: this.selectedWorkflow.id
        }
      }
    )
  }

  public clearSearchProcess() {
    this.processControl.reset();
    this.searchTextProcess = '';
    this.cancelRequestProcess$.next(true);
    this._getProcesses(null, {q: this.searchTextProcess})
  }

  public selectWorkflow(workflow: IWorkflowModel) {
    this.menuOpen = false;
    this.selectedWorkflow = workflow;
    this.diagramReadOnly = (this.selectedWorkflow.lots > 0 ||
      (this._permissionWorkflow && !this._permissionWorkflow.permission.hasOwnProperty(this.PERMISSION_TYPES.UPDATE)));
    if(this.diagramReadOnly) {
      this.processControl.disable();
    } else {
      this.processControl.enable();
    }
    this.processes = [];
    this._clearDiagram();
    this._getProcesses();
    this._getWorkflowProcesses();
  }

  public toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  public updateShape(shape: IShapeModel) {
    this.isEditShape = false;
    this.updateShapeInArray(shape, this.shapes);
    this.updateShapeInArray(shape, this.shapesWithConnector);
    this.updateShapeInArray(shape, this.stackShapesWithConnector);
    this.dataSourceShapes.store().push([
      {
        type: 'update',
        data: this.shapes.find((s) => s.id == shape.id),
        key: shape.id,
      },
    ]);
    this.updateConexions(shape);
  }

  private updateConexions(shapeUpdated: IShapeModel){
    let copyConnectors = Array.from(this.connectors);
    for (let i = 0; i < copyConnectors.length; i++) {
      const connector = copyConnectors[i];
      if(connector.fromKey == shapeUpdated.id){
        let childShape = this.shapes.find(s => s.id == connector.toKey);
        if(!this.validateTransformationTypes(shapeUpdated, childShape)) {
          this._notifierService.notify('error', this._i18n.transform('worfklow-error-validation-states'));
          this.deleteConnectorDiagram(connector);
        }
      } else if (connector.toKey == shapeUpdated.id) {
        let fatherShape = this.shapes.find(s => s.id == connector.fromKey);
        if(!this.validateTransformationTypes(fatherShape, shapeUpdated)) {
          this._notifierService.notify('error', this._i18n.transform('worfklow-error-validation-states'));
          this.deleteConnectorDiagram(connector);
        }
      }
    }
  }

  public deleteProcess(process: IProcessModel) {
    const dialogRef = this._dialog.open(
      WorkflowConfirmDialogComponent,
      {
        width: '450px',
        data: {
          confirmationTitle: this._i18n.transform('confirm-process-delete-title'),
          name: process.name,
          canDelete: true,
        },
      }
    );
    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe((result) => {
        if (result) {
          let shape = this.shapes.find(s => s.id == process.id)
          this.deleteProcessFromDiagram(shape)
        }
      }
    )
  }

  public deleteProcessFromDiagram(shape: IShapeModel) {
    this.isEditShape = false;
    this.deleteShapeFromArray(shape, this.shapes);
    this.deleteShapeFromArray(shape, this.shapesWithConnector);
    this.deleteShapeFromArray(shape, this.stackShapesWithConnector);
    let findIndexProcess = this.processes.findIndex(p => p.id == shape.id);
    this.toggleGlobalProcess(this.processes[findIndexProcess], false)
    this.processes.splice(findIndexProcess, 1);
    this.dataSourceShapes.store().push([{ type: 'remove', key: shape.id }]);
    this.dataSourceConnectors.load().then(() => this.deleteShapeFromDiagram(shape))
    this._notifierService.notify('success', this._i18n.transform('success-process-delete'));
  }

  public createShape(process: IProcessModel): void {
    if (!this.diagramReadOnly) {
      const findShape = this.shapes.find((shape) => shape.id == process.id);
      if (!this.diagramReadOnly && !findShape) {
        this.positionCount += this.shapes.length > 0 ? 1.8 : 0;
        let shape: IShapeModel = new ShapeModel(process, this.positionCount);
        if (this.shapes.length == 0) {
          shape.level = 0;
          this.shapesWithConnector.push(shape);
        }
        this.shapes.push(shape);
        this.dataSourceShapes.store().push([ { type: 'insert', data: shape, index: -1 } ]);
        this.editShape({ item: { itemType: 'shape', dataItem: shape } })
      }
    }
  }

  public saveData() {
    if (this.validateConnectors()) {
      let workflowProcesses: IWorkflowProcessRequestModel[] = this.requestProcess();
      if(!this.blockUI.isActive) this.blockUI.start();
      if (this.isEdit) {
        this._workflowService.putWorkflowProcesses(this.selectedWorkflow.id, workflowProcesses)
          .pipe(
            takeUntil(this.destroy$),
            take(1)
          )
          .subscribe(
            () => {
              this._notifierService.notify('success', this._i18n.transform('success-work-flow-edit'));
              this.blockUI.stop();
              this.back();
            },
            (error: HttpErrorResponse) => {
              let message = this._handlerError.handleError(error,'workflow');
              this._alertService.errorTitle(this._i18n.transform('error-msg'), message);
              this.blockUI.stop();
            }
          )
      } else {
        this._workflowService.postWorkflowProcesses(workflowProcesses)
          .pipe(
            takeUntil(this.destroy$),
            take(1)
          )
          .subscribe(
            (response) => {
              this._notifierService.notify('success', this._i18n.transform('success-work-flow-create'));
              this.blockUI.stop();
              if (this._isFromNewLot) {
                this._router.navigate(
                  [
                    'routes',
                    'weight-note',
                    'lots',
                    'create',
                  ],
                  {
                    queryParams: { isFromWorkflow: true },
                  }
                );
              } else {
                this.back();
              }
            },
            (error) => {
              let message = this._handlerError.handleError(error,'workflow');
              this._alertService.errorTitle(this._i18n.transform('error-msg'), message);
              this.blockUI.stop();
            }
          )
      }
    }
  }

  private requestProcess(): IWorkflowProcessRequestModel[] {
    let workflowProcesses: IWorkflowProcessModel[] = [];
    this.shapesWithConnector.forEach((shapeWithConnector) => {
      let findShape = this.shapes.find(
        (shape) => shape.id == shapeWithConnector.id
      );
      let workflowProcess: IWorkflowProcessModel = {
        style: findShape.color,
        level: shapeWithConnector.level,
        xPosition: findShape.xPosition,
        yPosition: findShape.yPosition,
        processName: findShape.name,
        processId: findShape.id,
        workflowId: this.selectedWorkflow.id,
        transformationTypes: findShape.transformationTypes
      };
      if (this.isEdit) {
        let findWorkflowProcess = this.workflowProcesses.find(
          (w) => w.processId == shapeWithConnector.id
        );
        if (findWorkflowProcess) {
          workflowProcess.workflowsProcessId =
            findWorkflowProcess.workflowsProcessId;
        }
      }
      workflowProcesses.push(workflowProcess);
    });
    return workflowProcesses.map((process) =>
      new WorkflowProcessModel(process).getRequets()
    );
  }

  private validateConnectors(): boolean {
    if (this.shapes.length != this.shapesWithConnector.length) {
      this._alertService.error(
        this._i18n.transform('error-connectors-diagram')
      );
      return false;
    }
    return true;
  }

  public back() {
    this._router.navigate(['routes', 'workflow'], {queryParams: {commodityId: this._commodityId}});
  }

  public editShape(event: any) {
    if (
      event.item &&
      event.item.itemType == 'shape' &&
      !this.diagramReadOnly &&
      event.item.dataItem.id != 'pending_process'
    ) {
      if (!this.diagramReadOnly) {
        let shape: IShapeModel = this.shapes.find(s => s.id == event.item.dataItem.id);
        this.shapeToEdit = shape;
        this.isEditShape = true;
        this.showProcess = window.innerWidth > 1024;
      }
    }
  }

  public requestEditOperationHandler(e) {
    if (e.operation === 'addShape') {
      e.allowed = false;
    } else if (e.operation == 'deleteShape') {
      e.allowed = false;
    } else if (e.operation == 'beforeChangeShapeText'){
      e.allowed = false;
    } else if (e.operation == 'beforeChangeConnectorText'){
      e.allowed = false;
    }else if (e.operation == 'deleteConnector') {
      this.deleteConnectorDiagram(new ConnectorModel(e.args.connector.dataItem));
    } else if (
      e.operation == 'changeConnection' &&
      e.args.connector &&
      e.reason == 'modelModification'
    ) {
      if (e.args.connector.fromKey && e.args.connector.toKey) {
        const startShape: IShapeModel = this.shapes.find(s => s.id == e.args.connector.fromKey);
        const endShape: IShapeModel = this.shapes.find(s => s.id == e.args.connector.toKey);
        if(this.validateTransformationTypes(startShape, endShape)){
          const startShapeWithConnector = this.shapesWithConnector.find(s => s.id == startShape.id);
          const endShapeWithConnector = this.shapesWithConnector.find(s => s.id == endShape.id);
          if (startShapeWithConnector) {
            if (!endShapeWithConnector) {
              endShape.level = startShapeWithConnector.level + 1;
              this.addShapeToArray( endShape, this.shapesWithConnector);
              const connector = new ConnectorModel(e);
              this.handlerConnector(connector, endShape);
            } else {
              if (startShapeWithConnector.level < endShapeWithConnector.level) {
                const connector = new ConnectorModel(e);
                const existsConnector = this.connectors.find(
                  (c) => c.fromKey == connector.fromKey && c.toKey == connector.toKey);
                if (!existsConnector) {
                  this.addConnector(connector);
                  const indexEndShape = this.shapesWithConnector.findIndex(s => s.id == endShapeWithConnector.id);
                  this.shapesWithConnector[indexEndShape].level = startShapeWithConnector.level + 1;
                  this.handlerAssociatedShapes(startShapeWithConnector, endShapeWithConnector);
                }
              } else {
                e.allowed = false;
              }
            }
            this.deleteShapesWithoutConnectors();
          } else {
            let connector = new ConnectorModel(e);
            if(endShapeWithConnector) {
              startShape.level = endShapeWithConnector.level - 1;
              this.addConnector(connector);
              this.addShapeToArray( startShape, this.shapesWithConnector);
            } else {
              this.sendToStack(connector, startShape, endShape, e);
            }
          }
        } else {
          e.allowed = false;
        }
      } else {
        e.allowed = false;
      }
    }
  }

  private validateTransformationTypes(startShape: IShapeModel, endShape: IShapeModel): boolean {
    let transformationTypeExists: boolean = false;
    let transformationTypesIn = endShape.transformationTypes.in;
    let transformationTypesOut = startShape.transformationTypes.out;
    if(transformationTypesIn.length == 0 || transformationTypesOut.length == 0){
      transformationTypeExists = true;
    } else {
      for (let i = 0; i < endShape.transformationTypes.in.length; i++) {
        const transformationTypeIn = endShape.transformationTypes.in[i];
        for (let j = 0; j < startShape.transformationTypes.out.length; j++) {
          const transformationTypeOut =  startShape.transformationTypes.out[j];
          if(transformationTypeIn.id == transformationTypeOut.id){
            transformationTypeExists = true;
            break;
          }
        }
      }
    }
    return transformationTypeExists;
  }

  private handlerConnector(connector: IConnectorModel, endShape: IShapeModel){
    this.addConnector(connector);
    let connectorsChildShape = this.connectors.filter(c => c.fromKey == endShape.id)
    for (let i = 0; i < connectorsChildShape.length; i++) {
      const connectorShape = connectorsChildShape[i];
      let childShape = this.shapes.find(s => s.id == connectorShape.toKey)
      childShape.level = endShape.level + 1;
      this.addShapeToArray(childShape, this.shapesWithConnector);
      this.deleteShapeFromArray(childShape, this.stackShapesWithConnector);
      this.recursivityToAddShapes(childShape);
    }
  }

  private handlerAssociatedShapes(startShapeWithConnector: IShapeModel, endShapeWithConnector: IShapeModel){
    let copyConnectors = Array.from(this.connectors);
    for (let i = 0; i < copyConnectors.length; i++) {
      const connector = copyConnectors[i];
      if(connector.fromKey == endShapeWithConnector.id){
        let childShape = this.shapes.find(s => s.id == connector.toKey);
        childShape.level = endShapeWithConnector.level + 1;
        this.recursivityToChangeLevelChild(childShape);
      } else if (connector.toKey == endShapeWithConnector.id) {
        let fatherShape = this.shapes.find(s => s.id == connector.fromKey);
        if(fatherShape.id != startShapeWithConnector.id){
          fatherShape.level = endShapeWithConnector.level - 1;
          this.recursivityToChangeLevelFather(fatherShape);
        }
      }
    }
  }

  private deleteShapesWithoutConnectors() {
    let shapes = Array.from(this.shapesWithConnector);
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      let hasConnector = false;
      for (let j = 0; j < this.connectors.length; j++) {
        const connector = this.connectors[j];
        if ( connector.fromKey == shape.id || connector.toKey == shape.id) {
          hasConnector = true;
          break;
        }
      }
      if (!hasConnector) {
        this.deleteShapeFromArray(shape, this.shapesWithConnector);
      }
    }
  }

  private sendToStack(connector: IConnectorModel, startShape: IShapeModel, endShape: IShapeModel, event: any) {
    const startStackShape = this.stackShapesWithConnector.find(s => s.id == startShape.id);
    const endStackShape = this.stackShapesWithConnector.find(s => s.id == endShape.id);
    if (startStackShape) {
      if (!endStackShape) {
        endShape.level = startStackShape.level + 1;
        this.addConnector(connector);
        this.addShapeToArray(endShape, this.stackShapesWithConnector);
      } else {
        if (startStackShape.level < endStackShape.level) {
          endStackShape.level = startStackShape.level + 1;
          this.addConnector(connector);
          this.recursivityToChangeLevelChild(endStackShape);
        } else {
          event.allowed = false;
        }
      }
    } else {
      startShape.level = 0;
      endShape.level = startShape.level + 1;
      this.addConnector(connector);
      this.addShapeToArray(startShape, this.stackShapesWithConnector)
      if(!endStackShape) {
        this.addShapeToArray(endShape, this.stackShapesWithConnector)
      } else {
        this.recursivityToChangeLevelChild(endShape);
      }
    }
  }

  private deleteConnectorDiagram(connector: IConnectorModel) {
    const indexConnector = this.connectors.findIndex(c=> c.id == connector.id);
    if (indexConnector > -1) {
      this.connectors.splice(indexConnector, 1);
      this.dataSourceConnectors.store().push([
        { type: 'remove', key: connector.id },
      ]);
      const shapeTo = this.shapes.find(s => s.id == connector.toKey);
      let fatherConnectorsShapeTo = this.connectors.filter(c => c.toKey == shapeTo.id);
      if(fatherConnectorsShapeTo.length == 0) {
        this.deleteShapeFromArray(shapeTo, this.shapesWithConnector);
        let childConnectorsShapeTo = this.connectors.filter(c => c.fromKey == shapeTo.id)
        for (let i = 0; i < childConnectorsShapeTo.length; i++) {
          let shapeChildTo = this.shapesWithConnector.find(s => s.id == childConnectorsShapeTo[i].toKey);
          if(shapeChildTo){
            shapeChildTo.level = 0;
            this.deleteShapeFromArray(shapeChildTo, this.shapesWithConnector);
            this.addShapeToArray(shapeChildTo, this.stackShapesWithConnector);
            this.recursivityToAddShapesStack(shapeChildTo)
          }
        }
      }
    }
  }

  private deleteShapeFromDiagram(shapeToDelete: IShapeModel) {
    const fatherConnectors = this.connectors.filter(c => c.toKey == shapeToDelete.id);
    for (let i = 0; i < fatherConnectors.length; i++) {
      const fatherConnector: IConnectorModel = fatherConnectors[i];
      let findIndex = this.connectors.findIndex(c => c.id == fatherConnector.id);
      this.dataSourceConnectors.store().push([
        { type: 'remove', key: this.connectors[findIndex].id },
      ]);
      this.connectors.splice(findIndex, 1);
    }
    const childrenConnectors = this.connectors.filter(c => c.fromKey == shapeToDelete.id);
    for (let i = 0; i < childrenConnectors.length; i++) {
      const childrenConnector: IConnectorModel = childrenConnectors[i];
      let findIndex = this.connectors.findIndex(c => c.id == childrenConnector.id);
      this.connectors.splice(findIndex, 1)
      this.dataSourceConnectors.store().push([
        { type: 'remove', key: childrenConnector.id },
      ]);
      const childShape = this.shapesWithConnector.find(s => s.id == childrenConnector.toKey);
      if(childShape){
        const fatherConnectorsChild = this.connectors.filter(c => c.toKey == childShape.id);
        if (fatherConnectorsChild.length == 0) {
          childShape.level = 0;
          this.recursivityToAddShapesStackShapeDeleted(childShape);
        }
      }
    }
  }

  private recursivityToAddShapes(shapeToAdd: IShapeModel) {
    let childrenConnectors = this.connectors.filter(c => c.fromKey == shapeToAdd.id);
    for (let i = 0; i < childrenConnectors.length; i++) {
      const childConnector = childrenConnectors[i];
      const childShape = this.stackShapesWithConnector.find(s => s.id == childConnector.toKey);
      if (childShape) {
        childShape.level = shapeToAdd.level + 1;
        this.addShapeToArray(childShape, this.shapesWithConnector);
        this.deleteShapeFromArray(childShape, this.stackShapesWithConnector);
        this.recursivityToAddShapes(childShape);
      }
    }
  }

  private recursivityToAddShapesStackShapeDeleted(shapeToDelete: IShapeModel) {
    this.deleteShapeFromArray(shapeToDelete, this.shapesWithConnector);
    this.addShapeToArray(shapeToDelete, this.stackShapesWithConnector);
    const childrenConnectors = this.connectors.filter(c => c.fromKey == shapeToDelete.id);
    for (let i = 0; i < childrenConnectors.length; i++) {
      const childConnector = childrenConnectors[i];
      const childShape = this.shapes.find(s => s.id == childConnector.toKey);
      childShape.level = shapeToDelete.level + 1;
      this.recursivityToAddShapesStackShapeDeleted(childShape);
    }
  }

  private recursivityToChangeLevelChild(shape: IShapeModel) {
    this.updateShapeInArray(shape, this.shapesWithConnector);
    this.updateShapeInArray(shape, this.stackShapesWithConnector);
    let connectors = this.connectors.filter(c => c.fromKey == shape.id);
    for (let i = 0; i < connectors.length; i++) {
      const connector = connectors[i];
      let childShape = this.shapes.find(s => s.id == connector.toKey);
      childShape.level = shape.level + 1;
      this.recursivityToChangeLevelChild(childShape);
    }
  }

  private recursivityToChangeLevelFather(shape: IShapeModel) {
    this.updateShapeInArray(shape, this.shapesWithConnector);
    let connectors = this.connectors.filter(c => c.toKey == shape.id)
    for (let i = 0; i < connectors.length; i++) {
      const connector = connectors[i];
      let fatherShape = this.shapes.find(s => s.id == connector.fromKey);
      fatherShape.level = shape.level - 1;
      this.recursivityToChangeLevelFather(fatherShape);
    }
  }

  private recursivityToAddShapesStack(shapeAdded: IShapeModel) {
    let childrenConnectors = this.connectors.filter(c => c.fromKey == shapeAdded.id);
    for (let i = 0; i < childrenConnectors.length; i++) {
      const childConnector = childrenConnectors[i];
      const childShape = this.shapes.find(s => s.id == childConnector.toKey);
      childShape.level = shapeAdded.level + 1;
      this.deleteShapeFromArray(childShape, this.shapesWithConnector);
      this.addShapeToArray(childShape, this.stackShapesWithConnector);
      this.recursivityToAddShapesStack(childShape);
    }
  }

  private deleteShapeFromArray(shapeToDelete: IShapeModel, arrayShapes: IShapeModel[]) {
    const indexShape = arrayShapes.findIndex(s => s.id == shapeToDelete.id);
    if (indexShape > -1) {
      arrayShapes.splice(indexShape, 1);
    }
  }

  private addConnector(connector: IConnectorModel) {
    const indexConnector = this.connectors.findIndex(
      (c) => c.fromKey == connector.fromKey && c.toKey == connector.toKey
    );
    if (indexConnector < 0) {
      this.connectors.push(connector);
      this.dataSourceConnectors.store().push([
        { type: 'insert', data: connector, index: -1 },
      ]);
    }
  }

  private addShapeToArray(shapeToAdd: IShapeModel, arrayShapes: IShapeModel[]) {
    const indexStackShape = arrayShapes.findIndex(s => s.id == shapeToAdd.id);
    if (indexStackShape > -1) {
      arrayShapes[indexStackShape].level = shapeToAdd.level;
    } else {
      arrayShapes.push(new ShapeModel(shapeToAdd));
    }
  }

  private updateShapeInArray(shapeToUpdate: IShapeModel, arrayShapes: IShapeModel[]) {
    const indexStackShape = arrayShapes.findIndex(s => s.id == shapeToUpdate.id);
    if (indexStackShape > -1) {
      arrayShapes[indexStackShape].level = shapeToUpdate.level;
      arrayShapes[indexStackShape].color = shapeToUpdate.color;
      arrayShapes[indexStackShape].transformationTypes = shapeToUpdate.transformationTypes;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.cancelRequestProcess$.next(true);
    this.cancelRequestProcess$.complete();
  }
}
