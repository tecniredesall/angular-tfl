import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { WorkflowService } from '../../../services/workflow.service';
import { WarehouseService } from '../../../../warehouse/warehouse.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { I18nPipe } from '../../../../../shared/i18n/i18n.pipe';
import { AlertService } from '../../../../../shared/utils/alerts/alert.service';
import { Subject} from 'rxjs';
import { WorkflowConfirmDialogComponent } from '../../../confirm-dialog/workflow-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { debounceTime, distinctUntilChanged, map, take, takeUntil, tap } from 'rxjs/operators';
import { ITransformationTypeModel } from '../../../models/transformation_types.model';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { HttpErrorResponse } from '@angular/common/http';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { IShapeModel, ShapeModel } from '../../../models/shape.model';

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss'],
  providers: [WarehouseService],
  encapsulation: ViewEncapsulation.None
})
export class ProcessFormComponent implements OnInit, OnChanges, OnDestroy {

  @BlockUI('workflow-process-form') blockUI: NgBlockUI;
  @Output() closeEmit = new EventEmitter();
  @Output() updateShape = new EventEmitter<any>();
  @Output() deletedShape = new EventEmitter<any>();
  @Input() shape: IShapeModel;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public colors = [
    '#7e57c2', '#5c6bc0', '#42a5f5', '#29b6f6', '#66bb6a', '#ffee58',
    '#5e35b1', '#3949ab', '#1e88e5', '#039be5', '#43a047', '#ffd600',
    '#311b92', '#1a237e', '#0d47a1', '#01579b', '#1b5e20', '#f9a825',
    '#651fff', '#3d5afe', '#2979ff', '#00b0ff', '#00e676', '#ffea00'
  ];
  public selectedColor: string;
  public shapeForm = new UntypedFormGroup({
    id: new UntypedFormControl(''),
    color: new UntypedFormControl(''),
    transformationTypesIn: new UntypedFormControl([]),
    transformationTypesOut: new UntypedFormControl([])
  });
  public dataWasMadeModified = false;
  public transformationTypes: ITransformationTypeModel[] = [];
  public isLoadingTransformationTypes: boolean = false;
  private destroy$: Subject<boolean> = new Subject();
  private paginator: IPaginator = new Paginator();
  private searchText: string;
  private cancelTransformationTypesRequest$: Subject<boolean> = new Subject();
  private searchTransformationTypeTerm$: Subject<string> = new Subject()
  constructor(
    private _i18n: I18nPipe,
    private _dialog: MatDialog,
    private _alertService: AlertService,
    private _handlerError: ResponseErrorHandlerService,
    private _workflowService: WorkflowService
  ) {}

  ngOnInit() {
    this.getTransformationTypes();
    this.searchTransformationTypeTerm$
      .pipe(
        takeUntil(this.destroy$),
        map((term: string) => trimSpaces(term)),
        distinctUntilChanged(),
        tap((term: string) => {
          this.isLoadingTransformationTypes = true;
          this.cancelTransformationTypesRequest$.next(true);
        }),
        debounceTime(500)
      )
      .subscribe((term: string) => {
        this.searchText = term;
        this.getTransformationTypes(null, this.getParams());
      });
  }

  ngOnChanges() {
    this.selectedColor = this.shape.color;
    this.shapeForm.patchValue({
      id: this.shape.id,
      name: this.shape.name,
      color: this.shape.color,
      transformationTypesIn: this.shape.transformationTypes?.in,
      transformationTypesOut: this.shape.transformationTypes?.out,
    });
    this.shapeForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.dataWasMadeModified = (JSON.stringify(this.shape) != JSON.stringify(data));
      })
  }

  public deleteShapeToDiagram() {
    const dialogRef = this._dialog.open(WorkflowConfirmDialogComponent, {
      width: '450px',
      data: {
        confirmationTitle: this._i18n.transform('process-delete-title'),
        name: this.shape.name,
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
            this.deletedShape.emit(this.shape);
          }
        }
      )
  }

  public submit() {
    this.shapeForm.patchValue({ color: this.selectedColor ?? '#1e88e5' });
    let shape: IShapeModel = new ShapeModel({...this.shapeForm.value});
    shape.level = this.shape.level;
    shape.name = this.shape.name;
    this.updateShape.emit(shape);
  }

  private getTransformationTypes(url: string = null, params: any = null) {
    this.isLoadingTransformationTypes = true;
    this._workflowService.getTransformationTypes(url, params)
      .pipe(
        takeUntil(this.cancelTransformationTypesRequest$),
        take(1)
      )
      .subscribe(
        (response: {data: ITransformationTypeModel[], pagination: IPaginator}) => {
          this.transformationTypes = response.data;
          this.paginator = response.pagination;
          this.isLoadingTransformationTypes = false;
        },
        (error: HttpErrorResponse) => {
          let message = this._handlerError.handleError(error, 'process');
          this._alertService.errorTitle(this._i18n.transform('error-msg'), message)
          this.isLoadingTransformationTypes = false;
        }
      )
  }

  public onTransformationTypesScrollToEnd() {
    this.getTransformationTypes(this.paginator.nextPageUrl, this.getParams())
  }

  private getParams(): any {
    let params: any = {}
    if(this.searchText){
      params.q = this.searchText
    }
    return params;
  }

  public selectColor(color: string) {
    this.selectedColor = color;
    this.shapeForm.patchValue({color: this.selectedColor});
  }

  public cancel() {
    this.closeEmit.emit(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.cancelTransformationTypesRequest$.next(true);
    this.cancelTransformationTypesRequest$.complete();
  }
}
