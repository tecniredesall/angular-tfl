import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IWarehouseDataDeleteModel } from '../models/warehouse.model';
import { IDataCreateWarehouseModel } from '../models/create-warehouse.model';
import { ISubtankModel } from '../models/subtank.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { getGeneralDecimalPlaces } from 'src/app/shared/utils/functions/decimals-configuration';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Component({
  selector: 'app-sub-tank-card',
  templateUrl: './sub-tank-card.component.html',
  styleUrls: ['./sub-tank-card.component.scss']
})
export class SubTankCardComponent implements OnInit {

  @Input() tankId: number;
  @Input() tankName: string;
  @Input() subtank: ISubtankModel;
  @Input() configuration: ITRConfiguration = new TRConfiguration();
  @Output() deleteSubtankEvent: EventEmitter<IWarehouseDataDeleteModel> = new EventEmitter();
  @Output() editSubtankEvent: EventEmitter<IDataCreateWarehouseModel> = new EventEmitter();
  public level: string;
  public colorLevel: string;
  public progressBarClass: string;
  public PERMISSIONS = CONSTANTS.PERMISSIONS;
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
  public measurementUnitSelected;
  public cardResponsiveClass: string;
  readonly MEASUREMENT_UNIT =  this.configuration.conversionMeasurementUnitAbbreviation;
  readonly DECIMAL_PLACES = getGeneralDecimalPlaces();
  constructor() { }

  ngOnInit() {
    this.reviewPercent(this.subtank);
    this.measurementUnitSelected = this.configuration.measurementUnitAbbreviation;
  }

  public editSubTank(subtank: ISubtankModel) {
    let createWarehouseData: IDataCreateWarehouseModel = {
      actionType: CONSTANTS.ACTION_MODE_WAREHOUSE.EDIT_SUBTANK,
      tankName: this.tankName,
      subTankId: subtank.productionTankId,
      tankId: this.tankId
    };
    this.editSubtankEvent.emit(createWarehouseData);
  }

  private reviewPercent(subtank: ISubtankModel) {
    if (subtank.percentageStock <= subtank.lowLimit) {
      this.progressBarClass = CONSTANTS.SUBTANKS_LEVELS.LOW.CLASS;
      this.level = CONSTANTS.SUBTANKS_LEVELS.LOW.LABEL;
      this.colorLevel = CONSTANTS.SUBTANKS_LEVELS.LOW.COLOR;
    } else if (subtank.percentageStock > subtank.lowLimit && subtank.percentageStock < subtank.highLimit) {
      this.progressBarClass = CONSTANTS.SUBTANKS_LEVELS.NORMAL.CLASS;
      this.level = CONSTANTS.SUBTANKS_LEVELS.NORMAL.LABEL;
      this.colorLevel = CONSTANTS.SUBTANKS_LEVELS.NORMAL.COLOR;
    } else if (subtank.percentageStock >= subtank.highLimit) {
      this.progressBarClass = CONSTANTS.SUBTANKS_LEVELS.HIGH.CLASS;
      this.level = CONSTANTS.SUBTANKS_LEVELS.HIGH.LABEL;
      this.colorLevel = CONSTANTS.SUBTANKS_LEVELS.HIGH.COLOR;
    }
  }

  public deleteElement(data: ISubtankModel) {
    this.deleteSubtankEvent.emit({
      fromEditView: false,
      isTank: false,
      tankName: this.tankName,
      tankId: this.tankId,
      subtankId: data.productionTankId,
      subtankName: data.name,
      amount: data.amount
    });
  }

  public onChangeUnit(event: any) {
    this.measurementUnitSelected = event.value;
  }

  public onResizedCard(event: any) {
    console.log(this.subtank.name, event.newWidth)
    if(event.newWidth <= 370) {
      this.cardResponsiveClass = 'subtank__card--small'
    } else {
      this.cardResponsiveClass = 'subtank__card'
    }
  }

}
