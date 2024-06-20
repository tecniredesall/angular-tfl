import { Pipe, PipeTransform } from '@angular/core';
import {WarehouseModel} from './models/warehouse.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(tanks: WarehouseModel[], search: any): any[] {
    if (!tanks || !search) {
      return tanks;
    }
    return tanks.filter((t) => t.name.toLowerCase().indexOf(search.toLowerCase()) !== -1);
  }
}
