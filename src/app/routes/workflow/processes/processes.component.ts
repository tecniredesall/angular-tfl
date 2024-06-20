import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil, tap } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { WorkflowConfirmDialogComponent } from '../confirm-dialog/workflow-confirm-dialog.component';
import { IProcessModel } from '../models/process.model';
import { WorkflowService } from '../services/workflow.service';

@Component({
  selector: 'tr-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.scss']
})
export class ProcessesComponent implements OnInit, OnDestroy {
  @BlockUI('process-list-layout') blockUI: NgBlockUI;

  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public processes: IProcessModel[] = [];
  public searchText: string = '';
  public isFocusOnInputSearch: boolean = false;
  public isInputSearchDisabled: boolean = false;
  public columnOrder: string = 'storage_date';
  public PERMISSIONS = CONSTANTS.PERMISSIONS;
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
  public columnAscState: any = {
    storage_date: false,
    name: true
  }
  public isLoadingProcesses: boolean = true;
  public pagination: IPaginator = new Paginator()
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private cancelProcessesRequest$: Subject<boolean> = new Subject<boolean>();
  private searchTerm$: Subject<string> = new Subject<string>();

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _i18nPipe: I18nPipe,
    private _alertService: AlertService,
    private _workflowService: WorkflowService,
    private _notifierService: NotifierService,
    private _errorHandlerService: ResponseErrorHandlerService,
  ) { }

  ngOnInit() {
    this.searchTerm$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap((e) => {
          this.isLoadingProcesses = true;
          this.cancelProcessesRequest$.next(true);
          if (!this.blockUI.isActive) {
            this.blockUI.start();
          }
        }),
        debounceTime(500)
      )
      .subscribe(
        (term: string) => {
          this.getProcesses(null, this.getParamsRequest());
        },
        (error: HttpErrorResponse) => {
          this._alertService.errorTitle(
            this._i18nPipe.transform('error-msg'),
            this._errorHandlerService.handleError(error, 'process')
          );
          this.blockUI.stop();
          this.isLoadingProcesses = false;
        }
      );
    this.getProcesses(null, this.getParamsRequest());
  }

  ngOnDestroy() {
    this.cancelProcessesRequest$.next(true);
    this.cancelProcessesRequest$.complete();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public sortData(column: string): void {
    for (const key in this.columnAscState) {
      if (
        Object.prototype.hasOwnProperty.call(
          this.columnAscState,
          key
        ) &&
        column !== key
      ) {
        this.columnAscState[key] = true;
      }
    }
    this.columnOrder = column;
    this.columnAscState[column] = !this.columnAscState[column];
    this.getProcesses(null, this.getParamsRequest());
  }

  public openDeleteDialog(process: IProcessModel): void {
    this._dialog.open(WorkflowConfirmDialogComponent, {
        data: {
          name: process.name,
          canDelete: process.id != 'pending-process',
          confirmationTitle: this._i18nPipe.transform('process-delete-title'),
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((response: any) => {
        if (response) {
          this._workflowService.deleteProcess(process.id)
            .pipe(take(1))
            .subscribe(
              response => {
                this.getProcesses(null, this.getParamsRequest())
                this._notifierService.notify('success', this._i18nPipe.transform('success-process-delete'));
              },
              (error: HttpErrorResponse) => {
                let message = this._errorHandlerService.handleError(error, 'process');
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform(message));
                this.blockUI.stop();
                this.isLoadingProcesses = false;
              }
            )
        }
      });
  }

  public clearSearchInput(): void {
    this.searchText = '';
    this.searchTerm$.next(this.searchText);
  }

  public onTypeSearchInput(event: any): void {
    this.searchTerm$.next(trimSpaces(this.searchText));
  }

  public eventPaginator(event: PageEvent): void {
    let selectedPage: number = event.pageIndex + 1;
    if (this.pagination.currentPage != selectedPage) {
      let uri: string = null;
      if (this.pagination.currentPage + 1 == selectedPage) {
        uri = this.pagination.nextPageUrl;
      } else if (this.pagination.currentPage - 1 == selectedPage) {
        uri = this.pagination.previousPageUrl;
      } else if (1 == selectedPage) {
        uri = this.pagination.firstPageUrl;
      } else if (this.pagination.totalPages == selectedPage) {
        uri = this.pagination.lastPageUrl;
      }
      this.getProcesses(uri, this.getParamsRequest());
    }
  }

  private getProcesses(uri: string = null, params: any = {}): void {
    this.isLoadingProcesses = true;
    if (!this.blockUI.isActive) this.blockUI.start();
    this._workflowService.getProcesses(uri, params)
      .pipe(takeUntil(this.cancelProcessesRequest$), take(1))
      .subscribe(
        (response: { data: IProcessModel[], pagination: IPaginator }) => {
          this.processes = response.data;
          this.pagination = response.pagination;
          this.blockUI.stop();
          this.isLoadingProcesses = false;
        },
        (error: HttpErrorResponse) => {
          this._alertService.errorTitle(
            this._i18nPipe.transform('error-msg'),
            this._errorHandlerService.handleError(error, 'process')
          );
          this.blockUI.stop();
          this.isLoadingProcesses = false;
        }
      );
  }

  private getParamsRequest(): any {
    let params: any = {};
    if (this.searchText?.length > 0) {
      params.q = trimSpaces(this.searchText);
    }
    if (this.columnOrder) {
      params.order = this.columnOrder;
      params.sort = this.columnAscState[this.columnOrder]
        ? 'asc'
        : 'desc';
    }
    return params;
  }

  public goToEdit(process: IProcessModel) {
    this._router.navigate(['routes', 'workflow', 'create-process'], { queryParams: { processId: process.id }})
  }

}
