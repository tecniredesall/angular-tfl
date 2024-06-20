import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CommodityService } from './services/commodity.service';
import { AlertService } from '../../shared/utils/alerts/alert.service';
import { I18nPipe } from '../../shared/i18n/i18n.pipe';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { CommodityModel, ICommodityModel } from './models/commodity.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalDeleteCommodityComponent } from './modal-delete-commodity/modal-delete-commodity.component';
import { CommodityTypeModel, ICommodityTypeModel } from "./models/commodity-type.model";
import { ModalDeleteCommodityTypeComponent } from './modal-delete-commodity-type/modal-delete-commodity-type.component';

@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss']
})
export class CommodityComponent implements OnInit, OnDestroy {
  @BlockUI('commodity-container') blockUIContainer: NgBlockUI;
  @BlockUI('commodity-detail') blockUIDetail: NgBlockUI;
  readonly CONSTANTS: any = CONSTANTS;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public blockTemplateModalUiDetail: BlockModalUiComponent = BlockModalUiComponent;
  public action: {
    isType: boolean,
    isEdit: boolean,
    data: any
  } = {
      isType: false,
      isEdit: false,
      data: {}
    };
  public selectedView: number = this.CONSTANTS.VIEW_MODE.LIST;
  public searchText = '';
  public isLoadingCommodityTypes = false;
  public idxSelected: number = null;
  public commodities: Array<ICommodityModel> = [];
  public PERMISSIONS = CONSTANTS.PERMISSIONS
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES
  private dialogRefCommodity: MatDialogRef<ModalDeleteCommodityComponent, any> = null;
  private dialogRefCommodityType: MatDialogRef<ModalDeleteCommodityTypeComponent, any> = null;
  private _subscription: Subscription = new Subscription();
  private _subscriptionTypes: Subscription = new Subscription();

  constructor(
    private _commodityService: CommodityService,
    private _alertService: AlertService,
    private _i18nPipe: I18nPipe,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getCommodity();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._subscriptionTypes.unsubscribe();
  }

  /**
   * get list of commodity
   */
  private getCommodity(): void {
    this.blockUIContainer.start();
    this._subscription.add(
      this._commodityService.getCommodity().subscribe(
        (response: Array<ICommodityModel>) => {
          if (response) {
            this.commodities = response;
          }
          else {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          }
          this.blockUIContainer.stop();
        },
        (error: HttpErrorResponse) => {
          this.blockUIContainer.stop();
          if(error.status != 403) {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          }
        }
      )
    );
  }

  public togglePanel(commodity: ICommodityModel): void {
    if (commodity.totalCommodityTypes > 0) {
      let index: number = this.commodities.findIndex((c: ICommodityModel) => c.id == commodity.id);
      let newValue: number = -1 == index || this.idxSelected == index ? null : index;
      if (this.blockUIDetail.isActive) {
        this._subscriptionTypes.unsubscribe();
        this.blockUIDetail.stop();
        this._subscriptionTypes = new Subscription();
      }
      if (null == newValue) {
        let oldIdxSelected: number = this.idxSelected;
        this.idxSelected = newValue;
        if (null != oldIdxSelected) {
          this.commodities[oldIdxSelected].types = [];
        }
      }
      else {
        if (null != this.idxSelected) {
          this.commodities[this.idxSelected].types = [];
        }
        this.isLoadingCommodityTypes = true;
        this.idxSelected = newValue;
        this.getTypeData(this.commodities[this.idxSelected].id);
      }
    }
  }

  /**
   * Get data
   * @param id commodity
   */
  private getTypeData(id) {
    this.blockUIDetail.start();
    this._subscriptionTypes.add(
      this._commodityService.getCommodityTypes(id).subscribe(
        (response: Array<ICommodityTypeModel>) => {
          if (response) {
            this.commodities[this.idxSelected].types = response;
            this.commodities[this.idxSelected].totalCommodityTypes = response.length;
            this.blockUIDetail.stop();
          }
          else {
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
            this.blockUIDetail.stop();
            this.idxSelected = null;
          }
          this.isLoadingCommodityTypes = false;
        },
        error => {
          this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), this._i18nPipe.transform('unidentified-problem'));
          this.blockUIDetail.stop();
          this.idxSelected = null;
          this.isLoadingCommodityTypes = false;
        }
      )
    );
  }

  /**
   * Search commodity
   * @param text search text
   */
  public searchCommodity(text: string): void {
    this.searchText = text;
  }

  /**
   * new commadity
   */
  public newCommodity(): void {
    this.action = {
      isType: false,
      isEdit: false,
      data: new CommodityModel()
    };
    this.selectedView = this.CONSTANTS.VIEW_MODE.ACTION;
  }

  /**
   * Edit commodity
   * @param commodity commodity to edit
   */
  public editCommodity(commodity: ICommodityModel): void {
    this.action = {
      isType: false,
      isEdit: true,
      data: commodity
    };
    this.selectedView = this.CONSTANTS.VIEW_MODE.ACTION;
  }

  /**
   * new type
   */
  public newType(commodity: ICommodityModel): void {
    let commodityType: ICommodityTypeModel = new CommodityTypeModel();
    commodityType.commodityId = commodity.id;
    commodityType.commodityName = commodity.name;
    this.action = {
      isType: true,
      isEdit: false,
      data: commodityType
    };
    this.selectedView = this.CONSTANTS.VIEW_MODE.ACTION;
  }

  /**
   * Edit Type
   * @param commoditytype commodity type to edit
   */
  public editType(commoditytype): void {
    this.action = {
      isType: true,
      isEdit: true,
      data: new CommodityTypeModel(commoditytype)
    };
    this.selectedView = this.CONSTANTS.VIEW_MODE.ACTION;
  }

  /**
   * delete commodity
   */
  public deleteCommodity(commodity: ICommodityModel): void {
    this.dialogRefCommodity = this._dialog.open(ModalDeleteCommodityComponent, {
      autoFocus: false,
      disableClose: true,
      data: new CommodityModel(commodity)
    });
    this._subscription.add(
      this.dialogRefCommodity.afterClosed().subscribe(
        (response) => {
          this.dialogRefCommodity = null;
          if (response.refresh) {
            this.searchText = '';
            this.idxSelected = null;
            this.getCommodity();
          }
        }
      )
    );
  }

  /**
   * delete ctype
   */
  public deleteTypeCommodity(commodityType: ICommodityTypeModel) {
    this.dialogRefCommodityType = this._dialog.open(ModalDeleteCommodityTypeComponent, {
      autoFocus: false,
      disableClose: true,
      data: new CommodityTypeModel(commodityType)
    });
    this._subscription.add(
      this.dialogRefCommodityType.afterClosed().subscribe(
        (response: any) => {
          this.dialogRefCommodityType = null;
          if (response.refresh) {
            this.isLoadingCommodityTypes = true;
            this.getTypeData(this.commodities[this.idxSelected].id);
          }
        }
      )
    );
  }

  /**
   * on event action selected
   * @param action selected
   */
  public onEventActionSelected(action: number): void {
    this.selectedView = this.CONSTANTS.VIEW_MODE.LIST;
    this.action = {
      isType: false,
      isEdit: false,
      data: {}
    };
    this.searchText = '';
    this.idxSelected = null;
    switch (action) {
      case CONSTANTS.CRUD_ACTION.CREATE:
      case CONSTANTS.CRUD_ACTION.UPDATE:
      case CONSTANTS.CRUD_ACTION.DELETE:
        this.getCommodity();
        break;
      default:
        break;
    }
  }
}

