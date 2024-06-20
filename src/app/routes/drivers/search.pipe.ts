import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(drivers: any[], search: string): any[] {
    if (!drivers || !search) {
      return  drivers;
    }
    const response = drivers.filter((driver) => JSON.stringify(driver).toLowerCase().indexOf(search.toLowerCase()) !== -1);

    if (response.length === 0) {
      return [-1];
    }
    return response;
  }

}
