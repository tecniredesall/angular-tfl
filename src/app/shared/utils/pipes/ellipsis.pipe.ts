import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (value) {
            return args === undefined ? value : value.length > args ? value.substring(0, args) + '...' : value;
        } else {
            return '';
        }
    }
}
