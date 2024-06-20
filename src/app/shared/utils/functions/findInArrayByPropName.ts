export function findInArrayByPropName(
    arr: Array<any>,
    prop: string,
    value: number | string
) {
    return arr
        ? arr.find((o) => typeCheck(o[prop]) === typeCheck(value))
        : null;
}

function typeCheck(value: any) {
    return typeof value === 'string' ? value.toLowerCase() : value;
}
