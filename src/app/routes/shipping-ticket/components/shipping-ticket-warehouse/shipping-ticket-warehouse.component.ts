import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { take } from 'rxjs/operators';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';
import { ISubtankModel, SubtankModel } from 'src/app/routes/warehouse/models/subtank.model';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ShippingTicketService } from '../../services/shipping-ticket.service';

@Component({
  selector: 'app-shipping-ticket-warehouse',
  templateUrl: './shipping-ticket-warehouse.component.html',
  styleUrls: ['./shipping-ticket-warehouse.component.scss']
})
export class ShippingTicketWarehouseComponent implements OnChanges {

  @Input() warehouseId: string;
  @Input() configuration: ITRConfiguration = new TRConfiguration();
  @Output() warehouseEvent: EventEmitter<ISubtankModel> = new EventEmitter();
  public warehouse: ISubtankModel = new SubtankModel();
  public level: string;
  public colorLevel: string;
  public progressBarClass: string;
  public PERMISSIONS = CONSTANTS.PERMISSIONS
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES

  constructor(
    private _i18nPipe: I18nPipe,
    private _alertService: AlertService,
    private _shippingTicketService: ShippingTicketService,
    private _errorHandlerService: ResponseErrorHandlerService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.warehouseId?.currentValue) {
      this.getWarehouse();
    } else {
      this.warehouse = new SubtankModel();
    }
  }

  private getWarehouse() {
    this._shippingTicketService.getWarehouseById(this.warehouseId)
      .pipe(take(1))
      .subscribe(
        (response: ISubtankModel) => {
          this.warehouse = response;
          this.warehouseEvent.emit(this.warehouse)
          this.reviewPercent();
        },
        (error: HttpErrorResponse) => {
          let message = this._errorHandlerService.handleError(error, 'shipping-ticket');
          this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
        }
      )
  }

  private reviewPercent() {
    if (this.warehouse.percentageStock <= this.warehouse.lowLimit) {
      this.progressBarClass = CONSTANTS.SUBTANKS_LEVELS.LOW.CLASS;
      this.level = CONSTANTS.SUBTANKS_LEVELS.LOW.LABEL;
      this.colorLevel = CONSTANTS.SUBTANKS_LEVELS.LOW.COLOR;
    } else if (this.warehouse.percentageStock > this.warehouse.lowLimit && this.warehouse.percentageStock < this.warehouse.highLimit) {
      this.progressBarClass = CONSTANTS.SUBTANKS_LEVELS.NORMAL.CLASS;
      this.level = CONSTANTS.SUBTANKS_LEVELS.NORMAL.LABEL;
      this.colorLevel = CONSTANTS.SUBTANKS_LEVELS.NORMAL.COLOR;
    } else if (this.warehouse.percentageStock >= this.warehouse.highLimit) {
      this.progressBarClass = CONSTANTS.SUBTANKS_LEVELS.HIGH.CLASS;
      this.level = CONSTANTS.SUBTANKS_LEVELS.HIGH.LABEL;
      this.colorLevel = CONSTANTS.SUBTANKS_LEVELS.HIGH.COLOR;
    }
  }

}
