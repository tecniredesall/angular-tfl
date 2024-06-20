import { Pipe, PipeTransform } from '@angular/core';
import { removeAccents } from '../../utils/functions/remove-accents';
import { trimSpaces } from '../../utils/functions/trim-spaces';

@Pipe({
  name: 'searchByProperty',
  pure: false
})
export class SearchByPropertyPipe implements PipeTransform {
  public transform(items: any[], search: string, prop: string[]): any[] {
    let matchFound: boolean = false;
    if (!items || !search || 0 == search?.length) {
      return items;
    }
    search = removeAccents(trimSpaces(search).toLowerCase());
    if (0 == search.length) {
      return items;
    }
    return items.filter((item: any) => {
      matchFound = false;
      for (let p = 0; p < prop.length; p++) {
        if (item[prop[p]]) {
          matchFound = removeAccents(trimSpaces(item[prop[p]]).toLowerCase()).includes(search);
          if (matchFound) {
            break;
          }
        }
      }
      return matchFound;
    });
  }
}
