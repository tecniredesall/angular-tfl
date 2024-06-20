import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(trucks: any[], search: string): any[] {
    if (!trucks || !search) {
      return trucks;
    }
    const result =
    trucks.filter((t) => JSON.stringify( t).toLowerCase().indexOf(search.toLowerCase()) !== -1);
    if (result.length === 0) {
      return [-1];
    }
    return  result;
  }
}
