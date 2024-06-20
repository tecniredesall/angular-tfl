import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(workflows: any[], searchText: string): any[] {
    if (!workflows || !searchText) {
      return  workflows;
    }
    return workflows.filter(w => w.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }

}
