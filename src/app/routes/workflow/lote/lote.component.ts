import {Component, Input, OnInit} from '@angular/core';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { IProductionTypeModel } from '../../../shared/models/production-type.model';

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.css']
})
export class LoteComponent implements OnInit {

  @Input() lote: string;
  @Input() definitions: IProductionTypeModel[];
  productionType: IProductionTypeModel;
  name: string;
  bgColor: string;
  color: string;
  constructor() { }

  ngOnInit() {
    this.productionType = this.filterProductionType(this.lote, this.definitions);
    switch (this.productionType.name) {
      case CONSTANTS.LOT_TYPES.MACRO_LOTE:
        this.bgColor = '#33caba33';
        this.color = '#10a98e';
        this.name = this.productionType.name;
        break;
      case CONSTANTS.LOT_TYPES.MICRO_LOTE:
        this.bgColor = '#7a40f233';
        this.color = '#7a40f2';
        this.name = this.productionType.name;
        break;
      case CONSTANTS.LOT_TYPES.NANO_LOTE:
        this.bgColor = '#7a40f233';
        this.color = '#7a40f2';
        this.name = this.productionType.name;
        break;
      default:
        return;
    }
  }

  public filterProductionType(id: string, defs: any[]) {
    const filtered = defs.find(def => def.id === id);
    return filtered;
  }

}
