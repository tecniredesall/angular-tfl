import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';

export const sortBykey = (array: any[], key: string) => {
    return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
    });
};

export const reverseSortByKey = (array: any[], key: string) => {
    return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
    });
};

export const sortFormArrayBykey = (
    array: UntypedFormArray,
    key: string
): UntypedFormArray => {
    let formArray: UntypedFormArray = new UntypedFormArray([]);
    let formGroups: Array<AbstractControl> = array.controls.sort(
        (a: UntypedFormGroup, b: UntypedFormGroup) => {
            const x = a.get(key).value;
            const y = b.get(key).value;
            return x < y ? -1 : x > y ? 1 : 0;
        }
    );
    formGroups.forEach((g: AbstractControl) => {
        formArray.push(g);
    });
    return formArray;
};

export const sortByStringValue = (
    array: any[],
    key: string,
    asc: boolean = true
) => {
    let order: number = asc ? -1 : 1;
    return array.sort((a: any, b: any) => {
        const x = a[key] ? a[key].toLowerCase() : a[key];
        const y = b[key] ? b[key].toLowerCase() : b[key];
        return x < y ? 1 * order : x > y ? -1 * order : 0;
    });
};

export const sortByStringWithoutKey = (array: string[], asc: boolean = true) => {
    let order: number = asc ? -1 : 1;
    return array.sort((a: string, b: string) => {
        const x = a ? a.toLowerCase() : a;
        const y = b ? b.toLowerCase() : b;
        return ((x < y) ? 1 * order : ((x > y) ? -1 * order : 0));
    });
};

export const sortAlphanumerical = (a: string, b: string, asc: boolean) => {
    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;
    const aA = a.replace(reA, '');
    const bA = b.replace(reA, '');
    if (aA === bA) {
        const aN = parseInt(a.replace(reN, ''), 10);
        const bN = parseInt(b.replace(reN, ''), 10);
        if (asc) {
            return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
            return aN === bN ? 0 : aN > bN ? -1 : 1;
        }
    } else {
        if (asc) {
            return aA > bA ? 1 : -1;
        } else {
            return aA > bA ? -1 : 1;
        }
    }
};