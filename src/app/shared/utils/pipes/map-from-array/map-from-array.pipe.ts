import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mapFromArray',
})
export class MapFromArrayPipe implements PipeTransform {
    /**
     * Maps a value to a property of and object in an array Ex. obj.id to obj.name
     * @param value value to transform
     * @param array the lookup array to search
     * @param bindValue the property name to which value is binded Ex. obj.id provide 'id'
     * @param bindProperty the property name to return from the object that value mapped to
     */
    transform(
        value: any,
        array: any[],
        bindValue: string,
        bindProperty: string
    ): any {
        if (!value) return null
        if (!array || array.length === 0 || !bindValue || !bindProperty) return value
        const item = array.find((v) => value === v[bindValue]);
        const name = item
            ? array.find((v) => value === v[bindValue])[bindProperty]
            : value;
        return name;
    }
}
