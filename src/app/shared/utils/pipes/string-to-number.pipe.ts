import { Pipe, PipeTransform } from '@angular/core';
import { convertStringToNumber } from '../functions/string-to-number';

@Pipe({
  name: 'stringToNumber', 
  pure: false
})
export class StringToNumberPipe implements PipeTransform {

  transform(value: string | number): number {
    return convertStringToNumber(value?.toString());
  }

}
