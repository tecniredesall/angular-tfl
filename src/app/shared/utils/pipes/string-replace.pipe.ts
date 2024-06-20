import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringReplace', 
  pure: false
})
export class StringReplacePipe implements PipeTransform {

  transform(value: string, searchValue: string, replaceValue: string): string {
    return value.replace(searchValue, replaceValue);
  }

}
