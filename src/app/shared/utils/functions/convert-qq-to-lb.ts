/**
 * QQ to Lb
 * @param numQQ number in qq
 * @param covertionFactor convertion factor
 * @returns
 */
export const convertQQtoLb = (
    numQQ: number,
    covertionFactor?: number
): number => {
    const result = +(numQQ * (covertionFactor ? covertionFactor : getConversionUnitFactor()));
    return result;
};

export const convertLbtoQQ = (
    numLb: number,
    covertionFactor?: number
): number => {
    const result = +(numLb / (covertionFactor ? covertionFactor : getConversionUnitFactor()));
    return result;
};

function getConversionUnitFactor(): number {
    const factor = localStorage.getItem('config')
        ? JSON.parse(localStorage.getItem('config'))
              .conversionMeasurementUnitFactor
        : 100;
    return parseFloat(factor);
}
