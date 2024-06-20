import { convertStringToNumber } from "./string-to-number";

export function truncateDecimals(value: number, digits: number): number {
    if (value) {
        let stringNumber: string = value.toString(),
        decimalPosition: number = stringNumber.indexOf('.'),
        substrLength: number = decimalPosition == -1 ? stringNumber.length : 1 + decimalPosition + Math.abs(digits),
        trimmedResult: number = convertStringToNumber(stringNumber.substr(0, substrLength));
        return isNaN(trimmedResult) ? 0 : trimmedResult;
    }else {
        return 0;
    }
}
