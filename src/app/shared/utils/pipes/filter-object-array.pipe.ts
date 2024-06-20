import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterObjectArray',
  pure: false
})
export class FilterObjectArrayPipe implements PipeTransform {

  transform(value: any[], terms: any): any[] {
    let isCoincidence: boolean = true;
    return value.filter((v: any) => {
      isCoincidence = true;
      for (const key in terms) {
        if (
          Object.prototype.hasOwnProperty.call(terms, key) &&
          v[key] != terms[key]
        ) {
          isCoincidence = false;
          break; 
        }
      }
      return isCoincidence;
    });
  }

}
