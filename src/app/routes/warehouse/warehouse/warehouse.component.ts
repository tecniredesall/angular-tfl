import { convertLbtoQQ, convertQQtoLb } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WarehouseService } from '../warehouse.service';
import { IWarehouseModel, WarehouseModel, IWarehouseDataDeleteModel } from '../models/warehouse.model';
import { ISubtankModel } from '../models/subtank.model'
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { collapse, sonCollapse } from 'src/app/shared/utils/animations/collapse.animation';
import { rotate } from 'src/app/shared/utils/animations/rotate.animation';
import { I18nPipe } from '../../../shared/i18n/i18n.pipe';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { NotifierService } from 'angular-notifier';
import { IDataCreateWarehouseModel } from '../models/create-warehouse.model';
import { Subscription } from 'rxjs';
import { Paginator } from 'src/app/shared/utils/models/paginator.model';
import { PageEvent } from '@angular/material/paginator';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { PurchaseOrdersService } from '../../purchase-orders/services/purchase-orders.service';
import { take } from 'rxjs/operators';
import { ResizedEvent } from 'angular-resize-event';

declare const $: any;
// tslint:disable:radixl
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
  animations: [collapse, sonCollapse, rotate]
})
export class WarehouseComponent implements OnInit, OnDestroy {

  @BlockUI('warehouse-delete') blockDeleteUI: NgBlockUI;
  @BlockUI('warehouse-subtanks') blockWarehouseSubtanksUI: NgBlockUI;

  @BlockUI('list-layout') blockUILayout: NgBlockUI;

  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public blockTemplateModal: BlockModalUiComponent;
  public searchText: string;
  public warehouses: IWarehouseModel[];
  public isDisabledDeleteWarehouse: boolean;
  public warehouseDataDelete: IWarehouseDataDeleteModel;
  public createWarehouseData: IDataCreateWarehouseModel;
  public optionView: number;
  public paginator: Paginator;
  public _timeout: any;
  public CONSTANTS = CONSTANTS
  public config : ITRConfiguration = new TRConfiguration();
  public PERMISSIONS = CONSTANTS.PERMISSIONS
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES
  public measurementUnitSelected = CONSTANTS.MEASUREMENT_UNIT.CONVERSION;
  public warehouseContainerResponsiveClass: string;
  public warehouseCardContainerResponsiveClass: string;
  readonly MEASUREMENT_UNIT = CONSTANTS.MEASUREMENT_UNIT;

  private subscription = new Subscription()

  constructor(
    private warehouseService: WarehouseService,
    private alertService: AlertService,
    private i18nPipe: I18nPipe,
    private notifierService: NotifierService,
    private _handlerError: ResponseErrorHandlerService,
    private _purchaseOrderService: PurchaseOrdersService,
  ) {
    this.blockTemplateModal = BlockModalUiComponent;
    this.searchText = '';
    this.warehouses = [];
    this.isDisabledDeleteWarehouse = false;
    this.warehouseDataDelete = null;
    this.optionView = CONSTANTS.VIEW_MODE.LIST;
    this.createWarehouseData = null;
  }

  ngOnInit() {
    this.getWarehouses();
    this.getConfig();
  }


  public getConfig() {
    this._purchaseOrderService.getConfiguration()
        .pipe(take(1))
        .subscribe(
            (response) => {
                this.config = response;
            },
            (error) => {
              this.blockUILayout.stop();
              this.alertService.showAlert(error.status, error.message);
            }
        );
}

  public getWarehouses() {
    this.blockUILayout.start();
    this.subscription.add(this.warehouseService.getTanks(this.paginator?.currentPageUrl, this.searchText).subscribe(
      (response: any) => {
        this.warehouses = response.data;
        this.warehouses.map(warehouse => warehouse.color = this.returnProgressBarColor(warehouse))
        this.paginator = new Paginator(response)
        this.blockUILayout.stop();
      },
      (error) => {
        this.blockUILayout.stop();
        this.alertService.showAlert(error.status, error.message);
      })
    );
  }

  public eventPaginator(event: PageEvent): void {
    if (this.paginator.currentPage != event.pageIndex + 1) {
      if (this.paginator.currentPage + 1 == event.pageIndex + 1) {
        this.paginator.currentPageUrl = this.paginator.nextPageUrl + '&';
      }
      else if (this.paginator.currentPage - 1 == event.pageIndex + 1) {
        this.paginator.currentPageUrl = this.paginator.previousPageUrl + '&';
      }
      else if (event.pageIndex == 0) {
        this.paginator.currentPageUrl = this.paginator.firstPageUrl + '&';
      }
      else if (this.paginator.lastPage == event.pageIndex + 1) {
        this.paginator.currentPageUrl = this.paginator.lastPageUrl + '&';
      }
      this.getWarehouses();
    }
  }

  public eventSearch(text: string): void {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      const search: string = text ?? '';
      search.toLocaleLowerCase();
      this.searchText = search;
      this.getWarehouses()
    }, 600);
  }

  public newWarehouse(): void {
    this.createWarehouseData = {
      actionType: CONSTANTS.ACTION_MODE_WAREHOUSE.CREATE_TANK,
      config: this.config
    };
    this.optionView = CONSTANTS.VIEW_MODE.ACTION;
  }

  public newSubtank(warehouse: WarehouseModel): void {
    this.createWarehouseData = {
      actionType: CONSTANTS.ACTION_MODE_WAREHOUSE.CREATE_SUBTANK,
      tankId: warehouse.id,
      tankName: warehouse.name,
      config: this.config
    };
    this.optionView = CONSTANTS.VIEW_MODE.ACTION;
  }

  public returnProgressBarColor(warehouse: IWarehouseModel): string {
    if (warehouse.totalStorage) {
      if (warehouse.totalStorage < warehouse.storageMin) {
        return CONSTANTS.SUBTANKS_LEVELS.LOW.COLOR;
      } else if (warehouse.totalStorage >= warehouse.storageMin && warehouse.totalStorage < warehouse.storageMax) {
        return CONSTANTS.SUBTANKS_LEVELS.NORMAL.COLOR;
      } else if (warehouse.totalStorage >= warehouse.storageMax) {
        return CONSTANTS.SUBTANKS_LEVELS.HIGH.COLOR;
      }
    }
  }

  public openCollapse(item: WarehouseModel) {
    if (item.totalVirtualTanks > 0) {
      item.collapsed = !item.collapsed
      if (!item.collapsed) {
        this.warehouses.map((w: WarehouseModel) => w.collapsed = w.id != item.id);
        item.isLoadingSubtanks = true;
        this.blockWarehouseSubtanksUI.start();
        this.subscription.add(this.warehouseService.getSubtanks(item.id).subscribe(
          (response: ISubtankModel[]) => {
            item.subtanks = response;
            if (item.subtanks.length == 0) {
              item.collapsed = true;
              item.totalVirtualTanks = 0;
              this.alertService.warning(this.i18nPipe.transform('no-subwarehouses'));
            }
            item.isLoadingSubtanks = false;
            this.blockWarehouseSubtanksUI.stop();
          },
          (error) => {
            item.collapsed = true;
            item.isLoadingSubtanks = false;
            this.blockWarehouseSubtanksUI.stop();
            this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'))
          }
        ));
      }
    }
  }

  public editTank(warehouse: IWarehouseModel) {
    this.createWarehouseData = {
      actionType: CONSTANTS.ACTION_MODE_WAREHOUSE.EDIT_TANK,
      tankId: warehouse.id,
      tankName: warehouse.name,
      totalVirtualTanks: warehouse.totalVirtualTanks,
      totalStorage: warehouse.totalStorage,
      config: this.config
    };
    this.optionView = CONSTANTS.VIEW_MODE.ACTION;
  }

  public editSubtank(data: IDataCreateWarehouseModel): void {
    this.createWarehouseData = { ...data, config: this.config };
    this.optionView = CONSTANTS.VIEW_MODE.ACTION;
  }

  public deleteTank(warehouse: WarehouseModel): void {
    let dataDelete: IWarehouseDataDeleteModel = {
      fromEditView: false,
      isTank: true,
      tankName: warehouse.name,
      tankId: warehouse.id,
      totalVirtualTanks: warehouse.totalVirtualTanks,
      totalStorage: warehouse.totalStorage
    };
    this.deleteWarehouse(dataDelete);
  }

  /**
   * open modal to delete warehouse
   * @param data to delete
   */
  public deleteWarehouse(data: IWarehouseDataDeleteModel): void {
    if ((data.isTank && data.totalVirtualTanks == 0 && data.totalStorage == 0) || (!data.isTank && data.amount == 0)) {
      this.warehouseDataDelete = data;
      $("#deleteWarehouseModal").modal('show');
    } else {
      let msg = data.isTank && data.totalVirtualTanks > 0 ? 'empty-warehouse-first' : 'warehouse-cant-delete-has-storage'
      this.alertService.warning(this.i18nPipe.transform(msg));
    }
  }

  /**
   * close modal to delete warehouse
   */
  public closeDeleteWarehouseModal(): void {
    $("#deleteWarehouseModal").modal('hide');
    this.warehouseDataDelete = null;
    this.isDisabledDeleteWarehouse = false;
  }

  /**
   * submit delete warehouse
   */
  public submitDeleteWarehouse(): void {
    if (this.warehouseDataDelete.isTank) {
      this.submitDeleteTank();
    }
    else {
      this.submitDeleteSubtank();
    }
  }

  /**
   * submit delete tank
   */
  private submitDeleteTank(): void {
    this.blockDeleteUI.start();
    this.isDisabledDeleteWarehouse = true;
    this.subscription.add(this.warehouseService.deleteTank(this.warehouseDataDelete.tankId.toString()).subscribe(
      (response: any) => {
        if (response.status) {
          this.searchText = '';
          this.warehouses = this.warehouses.filter((w: WarehouseModel) => w.id != this.warehouseDataDelete.tankId);
          if (this.warehouseDataDelete.fromEditView) {
            this.cancelEventCreate();
          }
          this.blockDeleteUI.stop();
          this.closeDeleteWarehouseModal();
          this.notifierService.notify('success', this.i18nPipe.transform('warehouse-delete-success'));
          this.getWarehouses();
        }
        else {
          this.blockDeleteUI.stop();
          this.closeDeleteWarehouseModal();
          if (406 == response.errorCode) {
            let msg = this.i18nPipe.transform('empty-warehouse-first');
            this.alertService.warning(msg);
          }
          else {
            this.alertService.error(this.i18nPipe.transform('error-msg'));
          }
        }
      },
      error => {
        this.blockDeleteUI.stop();
        this.closeDeleteWarehouseModal();
        const message: string = this._handlerError.handleError(error, 'warehouse');
        this.alertService.error(message)
      }
    ));
  }

  /**
   * submit delete subtank
   */
  private submitDeleteSubtank(): void {
    this.blockDeleteUI.start();
    this.isDisabledDeleteWarehouse = true;
    this.subscription.add(this.warehouseService.deleteSubTank(this.warehouseDataDelete.subtankId).subscribe(
      (response: any) => {
        if (response.status) {
          this.searchText = '';
          let idxTank: number = this.warehouses.findIndex(t => t.id == this.warehouseDataDelete.tankId);
          if (idxTank > -1) {
            this.warehouses[idxTank].subtanks = this.warehouses[idxTank].subtanks.filter((s: ISubtankModel) => s.productionTankId != this.warehouseDataDelete.subtankId);
          }
          if (this.warehouseDataDelete.fromEditView) {
            this.cancelEventCreate();
          }
          this.blockDeleteUI.stop();
          this.closeDeleteWarehouseModal();
          this.notifierService.notify('success', this.i18nPipe.transform('warehouse-delete-success'));
          this.getWarehouses();
        }
        else {
          this.blockDeleteUI.stop();
          this.closeDeleteWarehouseModal();
          this.alertService.error('Error!');
        }
      },
      error => {
        this.blockDeleteUI.stop();
        this.closeDeleteWarehouseModal();
        const message: string = this._handlerError.handleError(error, 'warehouse');
        this.alertService.error(message)
      }
    ));
  }

  public cancelEventCreate(): void {
    this.optionView = CONSTANTS.VIEW_MODE.LIST;
    this.createWarehouseData = null;
  }

  public onChangeUnit(event: any, warehouse: WarehouseModel) {
    const quintales: string = 'qq'
    warehouse.totalStockIn = event.value === quintales ? convertLbtoQQ(warehouse.totalStockIn) : convertQQtoLb(warehouse.totalStockIn)
  }

  public refreshEventCreate(): void {
    this.searchText = '';
    this.optionView = CONSTANTS.VIEW_MODE.LIST;
    this.createWarehouseData = null;
    this.getWarehouses();
  }

  public onResizePrincipalContainer(event: ResizedEvent): void {
    if(event.newWidth <= 610) {
      this.warehouseContainerResponsiveClass = 'warehouse-grid--small'
    } else if(event.newWidth > 610) {
      this.warehouseContainerResponsiveClass = 'warehouse-grid--medium'
    }
  }

  public onResizeContainerCard(event: ResizedEvent): void {
    if(event.newWidth <= 800) {
      this.warehouseCardContainerResponsiveClass = 'container-subtank-card--small'
    } else if(event.newWidth > 800 && event.newWidth < 1200) {
      this.warehouseCardContainerResponsiveClass = 'container-subtank-card--medium'
    } else {
      this.warehouseCardContainerResponsiveClass = 'container-subtank-card--large'
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
