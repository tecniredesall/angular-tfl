import { skip } from 'rxjs/operators';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';

/**
 * @param num The number to round
 * @param precision The number of decimal places to preserve
 */
export const roundUp = (num: number, decimal: number): number => {
  num = strip(num);
  let precision = Math.pow(10, decimal);
  let integer = strip(num * precision);
  let round = Math.ceil(integer);
  let result = strip(round / precision);
  return truncateDecimals(result, precision);
}

/**
 * @param num The number to fix float error
 */
export const strip = (num: number) => parseFloat(num.toPrecision(12));