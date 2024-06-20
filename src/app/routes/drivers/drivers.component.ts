import { ResizedEvent } from 'angular-resize-event';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { I18nPipe } from '../../shared/i18n/i18n.pipe';
import { AlertService } from '../../shared/utils/alerts/alert.service';
import { ModalDeleteDriverComponent } from './modal-delete-driver/modal-delete-driver.component';
import {
    ITDriverActionInputModel, TDriverActionInputModel
} from './models/driver-action-input.model';
import { IDriverListResponseModel } from './models/driver-list-response';
import {
    DriverListViewPaginatorModel, IDriverListViewPaginatorModel
} from './models/driver-list-view-paginator.model';
import { ITDriverModel, TDriverModel } from './models/driver.model';
import { DriversService } from './services/drivers.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit, OnDestroy {
  @BlockUI('data-grid-container') blockUIDataGrid: NgBlockUI;
  @ViewChild('paginator') paginator: MatPaginator;
  public CONSTANTS: any = CONSTANTS;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public templateBlockModalUiDataGrid: BlockModalUiComponent = BlockModalUiComponent;
  public driverPaginator: IDriverListViewPaginatorModel = new DriverListViewPaginatorModel();
  public selectedView: number = CONSTANTS.VIEW_MODE.LIST;
  public searchText: string = '';
  public isGettingDriversList: boolean = true;
  public isRunningSearch: boolean = false;
  public actionDriver: ITDriverActionInputModel = null;
  public orderStatusAsc: any = {
    name: true,
    license: true,
    identity: true
  };
  public orderParams: any = {
    order: 'first_name',
    sort: 'asc',
  };
  public responsiveClass: string = 't-drivers-view-lg';
  public PERMISSIONS = CONSTANTS.PERMISSIONS
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES
  private refTimeoutSearch: any = null;
  private dialogRef: MatDialogRef<ModalDeleteDriverComponent, any> = null;
  private _searchSubscription: Subscription = new Subscription();
  private _subscription: Subscription = new Subscription();
  readonly DRIVER_TYPE = CONSTANTS.DRIVER_TYPE;

  constructor(private _driversService: DriversService,
    private _alertService: AlertService,
    private _i18nPipe: I18nPipe,
    private _errorHandlerService: ResponseErrorHandlerService,
    private _dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getDrivers(null, false, false);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._searchSubscription.unsubscribe();
  }

  /**
   * get list of drivers
   */
  private getDrivers(uri: string, isSearch: boolean, onPageChange: boolean): void {
    this.blockUIDataGrid.start();
    this.isGettingDriversList = true;
    this._subscription.add(
      this._driversService.getDrivers(uri, this.orderParams).subscribe(
        (response: IDriverListResponseModel) => {
          if (response) {
            this.setDriversPaginatorConfig(response);
            if (null == uri) {
              this.paginator.pageIndex = 0;
              if (!isSearch && !onPageChange) {
                this.searchText = '';
              }
            }
          }
          else {
            if (onPageChange) {
              this.paginator.pageIndex = this.driverPaginator.currentPage;
            }
            this._alertService.error(this._i18nPipe.transform('error-msg'));
          }
          this.isGettingDriversList = false;
          this.blockUIDataGrid.stop();
        },
        (error: HttpErrorResponse) => {
          this.blockUIDataGrid.stop();
          if(error.status != 403) {
            let message: string = this._errorHandlerService.handleError(error, 't-drivers');
            if (onPageChange) {
              this.paginator.pageIndex = this.driverPaginator.currentPage;
            }
            this.isGettingDriversList = false;
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
          }

        }
      )
    );

  }

  /**
   * event on change drivers paginator
   */
  public eventPaginator(event: PageEvent): void {
    if (this.driverPaginator.currentPage != event.pageIndex) {
      let uri: string = null;
      if (this.driverPaginator.currentPage + 1 == event.pageIndex) {
        uri = this.driverPaginator.nextPageUrl;
      }
      else if (this.driverPaginator.currentPage - 1 == event.pageIndex) {
        uri = this.driverPaginator.prevPageUrl;
      }
      else if (0 == event.pageIndex) {
        uri = this.driverPaginator.firstPageUrl;
      }
      else if (this.driverPaginator.totalPages - 1 == event.pageIndex) {
        uri = this.driverPaginator.lastPageUrl;
      }
      this.getDrivers(uri, this.searchText.length > 0, true);
    }
  }

  /**
   * Search driver
   * @param text search text
   */
  public searchDrivers(text: string): void {
    let queryParams: any = { q: text };
    if (!this.blockUIDataGrid.isActive) {
      this.blockUIDataGrid.start();
    }
    if (null != this.refTimeoutSearch) {
      clearTimeout(this.refTimeoutSearch);
    }
    this._searchSubscription.unsubscribe();
    this._searchSubscription = new Subscription();
    this.searchText = text;
    this.isRunningSearch = true;
    this.driverPaginator = new DriverListViewPaginatorModel();
    if (this.searchText.length > 0) {
      Object.assign(queryParams, this.orderParams);
      this.refTimeoutSearch = setTimeout(() => {
        this._searchSubscription.add(
          this._driversService.getDrivers(null, queryParams).subscribe(
            (response: IDriverListResponseModel) => {
              if (response) {
                this.paginator.pageIndex = 0;
                this.setDriversPaginatorConfig(response);
                this.isRunningSearch = false;
                this.blockUIDataGrid.stop();
              }
              else {
                this.isRunningSearch = false;
                this._alertService.error(this._i18nPipe.transform('error-msg'));
                this.blockUIDataGrid.stop();
              }
            },
            (error) => {
              let message: string = this._errorHandlerService.handleError(error, 't-drivers');
              this.isRunningSearch = false;
              this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
              this.blockUIDataGrid.stop();
            }
          )
        );
      }, 600);
    }
    else {
      this.paginator.pageIndex = 0;
      this.isRunningSearch = false;
      this.blockUIDataGrid.stop();
      this.getDrivers(null, false, false);
    }
  }

  /**
   * New driver
   */
  public newDriver(): void {
    this.actionDriver = new TDriverActionInputModel({
      action: CONSTANTS.ACTIONS_MODE.NEW,
      driver: new TDriverModel(),
      isFromExternalModule: false
    });
    this.selectedView = CONSTANTS.VIEW_MODE.ACTION;
    this.cancelPendingRequest();
  }

  /**
   * Edit drivers modal
   * @param drivers drivers to edit
   */
  public editDrivers(data: ITDriverModel): void {
    this.actionDriver = new TDriverActionInputModel({
      action: CONSTANTS.ACTIONS_MODE.EDIT,
      driver: new TDriverModel(data),
      isFromExternalModule: false
    });
    this.selectedView = CONSTANTS.VIEW_MODE.ACTION;
    this.cancelPendingRequest();
  }

  /**
   * open modal to delete driver
   * @param driver to delete
   */
  public deleteDriver(driver: ITDriverModel): void {
    this.dialogRef = this._dialog.open(ModalDeleteDriverComponent, {
      autoFocus: false,
      disableClose: true,
      data: driver
    });
    this._subscription.add(
      this.dialogRef.afterClosed().subscribe(
        (response) => {
          this.dialogRef = null;
          if (response.refresh) {
            this.getDrivers(null, false, false);
          }
        }
      )
    );
  }

  /**
   * Process response on action selected
   * @param event
   */
  public onEventActionSelected(event: any): void {
    setTimeout(() => {
      this.selectedView = CONSTANTS.VIEW_MODE.LIST;
      this.actionDriver = null;
      this.paginator.pageIndex = this.driverPaginator.currentPage;
      switch (event.action) {
        case CONSTANTS.CRUD_ACTION.CANCEL:
          if (0 == this.driverPaginator.drivers.length) {
            this.getDrivers(null, false, false);
          }
          break;
        case CONSTANTS.CRUD_ACTION.CREATE:
        case CONSTANTS.CRUD_ACTION.DELETE:
        case CONSTANTS.CRUD_ACTION.UPDATE:
          this.getDrivers(null, false, false);
          break;
        default:
          break;
      }
    }, 0);
  }

  private cancelPendingRequest(): void {
    if (null != this.refTimeoutSearch) {
      clearTimeout(this.refTimeoutSearch);
    }
    this._subscription.unsubscribe();
    this._searchSubscription.unsubscribe();
    this._subscription = new Subscription();
    this._searchSubscription = new Subscription();
  }

  private setDriversPaginatorConfig(response: IDriverListResponseModel): void {
    this.driverPaginator = new DriverListViewPaginatorModel({
      drivers: response.drivers,
      totalItems: response.total,
      itemsPerPage: response.perPage,
      itemsPerPageOptions: [response.perPage],
      totalPages: response.lastPage,
      firstPageUrl: response.firstPageUrl,
      lastPageUrl: response.lastPageUrl,
      nextPageUrl: response.nextPageUrl,
      prevPageUrl: response.prevPageUrl,
      currentPage: response.currentPage - 1
    });
  }

  /**
   * sort data
   * @param property column for sort
   */
  public sortData(property: string) {
    for (const key in this.orderStatusAsc) {
      if (Object.prototype.hasOwnProperty.call(this.orderStatusAsc, key)) {
        if (property != key) {
          this.orderStatusAsc[key] = true;
        }
      }
    }
    this.orderStatusAsc[property] = !this.orderStatusAsc[property];
    this.orderParams['sort'] = this.orderStatusAsc[property] ? 'asc' : 'desc';
    this.orderParams['order'] = 'name' == property ? 'first_name' : property;
    if (this.searchText.length > 0) {
      this.searchDrivers(this.searchText);
    }
    else {
      this.getDrivers(null, false, false);
    }
  }

  public onEventViewResized(event: ResizedEvent): void {
    if (event.newWidth < 576) {
      this.responsiveClass = 't-drivers-view-xs';
    }
    else if (event.newWidth < 768) {
      this.responsiveClass = 't-drivers-view-sm';
    }
    else if (event.newWidth < 992) {
      this.responsiveClass = 't-drivers-view-md';
    }
    else if (event.newWidth < 1200) {
      this.responsiveClass = 't-drivers-view-lg';
    }
    else {
      this.responsiveClass = 't-drivers-view-xl';
    }
  }

}
