import { truncateDecimals } from "./truncate-decimals";

export function accurateDecimalSum(values: number[], digits: number): number {
  let result: number = 0;
  digits = Math.abs(digits);
  let multiplier: number = Math.pow(10, digits + 1);
  values = values.map((v: number) => truncateDecimals(v, digits));
  values.forEach((value: number) => {
    result = (result * multiplier + value * multiplier) / multiplier;
  });
  return truncateDecimals(result, digits);
}

export function accurateDecimalSubtraction(values: number[], digits: number): number {
  let result: number = values.length > 0 ? values[0] : 0;
  digits = Math.abs(digits);
  values = values.map((v: number) => truncateDecimals(v, digits));
  if (values.length > 1) {
    let multiplier: number = Math.pow(10, digits + 1);
    for (let index = 1; index < values.length; index++) {
      result = (result * multiplier - values[index] * multiplier) / multiplier;
    }
  }
  return truncateDecimals(result, digits);
}

export function accurateDecimalMultiplication(values: number[], digits: number): number {
  let result: number = values.length > 0 ? values[0] : 0;
  digits = Math.abs(digits);
  values = values.map((v: number) => truncateDecimals(v, digits));
  if (values.length > 1) {
    let multiplier: number = Math.pow(10, digits + 1);
    for (let index = 1; index < values.length; index++) {
      result = (result * values[index] * multiplier) / multiplier;
    }
  }
  return truncateDecimals(result, digits);
}

export function accurateRoundDecimalMultiplication(values: number[], digits: number): number {
    let result: number = values.length > 0 ? values[0] : 0;
    digits = Math.abs(digits);
    values = values.map((v: number) => truncateDecimals(v, digits));
    if (values.length > 1) {
      let multiplier: number = Math.pow(10, digits + 1);
      for (let index = 1; index < values.length; index++) {
        result = (result * values[index] * multiplier) / multiplier;
      }
    }
    return roundDecimal(result, digits);
  }

export function accurateDecimalDivision(dividend: number, divisor: number, digits: number): number {
  digits = Math.abs(digits);
  let multiplier: number = Math.pow(10, digits + 1);
  dividend = truncateDecimals(dividend, digits);
  divisor = truncateDecimals(divisor, digits);
  let result: number = (dividend * multiplier) / (divisor * multiplier);
  return truncateDecimals(result, digits);
}

export function roundDecimal(value: number, decimalPlaces: number): number {
    return Number(Math.round(Number(value+'e'+decimalPlaces))+'e-'+decimalPlaces)
}
