import { Pipe, PipeTransform } from '@angular/core';
import { removeAccents } from 'src/app/shared/utils/functions/remove-accents';
import { ICommodityModel } from './models/commodity.model';

@Pipe({
  name: 'search'
})
export class CommoditySearchPipe implements PipeTransform {
  transform(commodities: Array<ICommodityModel>, search: string): Array<ICommodityModel> {
    if (!commodities || !search) {
      return commodities;
    }
    let searchText: string = removeAccents(search.toLowerCase());
    let result: Array<ICommodityModel> = commodities.filter(
      (x: ICommodityModel) =>
        removeAccents(x.name.toLowerCase()).includes(searchText) ||
        removeAccents(x.generalCommodity.name.toLowerCase()).includes(searchText)
    );
    return result.length > 0 ? result : null
  }
}
