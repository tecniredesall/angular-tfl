import { convertStringToNumber } from '../../utils/functions/string-to-number';

export interface ITRConfiguration {
  measurementUnitId: string;
  measurementUnitName: string;
  measurementUnitAbbreviation: string;
  conversionMeasurementUnitAbbreviation: string;
  baseMeasurementUnitFactor: number;
  conversionMeasurementUnitFactor: number;
  tareFactor: number;
  receivingDefaultCommodityId: number;
  baseMeasurementUnitFactorKgs: number;
  conversionMeasurementUnitId: string;
  conversionMeasurementUnitName: string;
}

export class TRConfiguration implements ITRConfiguration {
  public measurementUnitId: string = null;
  public measurementUnitName: string = '';
  public measurementUnitAbbreviation: string = '';
  public conversionMeasurementUnitAbbreviation: string = '';
  public baseMeasurementUnitFactor: number = 1;
  public conversionMeasurementUnitFactor: number = 1;
  public tareFactor: number = 1;
  public receivingDefaultCommodityId: number = null;
  public baseMeasurementUnitFactorKgs: number = 1;
  public conversionMeasurementUnitId: string = '';
  public conversionMeasurementUnitName: string = '';

  constructor(item?: any) {
    if (item) {
      this.measurementUnitId = item.base_measurement_unit_id ?? item.measurementUnitId ?? this.measurementUnitId;
      this.measurementUnitName = item.base_measurement_unit_name ?? item.measurementUnitName ?? this.measurementUnitName;
      this.measurementUnitAbbreviation = item.base_measurement_unit_abbreviation ?? item.measurementUnitAbbreviation ?? this.measurementUnitAbbreviation;
      this.conversionMeasurementUnitAbbreviation = item.conversion_measurement_unit_abbreviation ??item.conversionMeasurementUnitAbbreviation ?? this.conversionMeasurementUnitAbbreviation;
      this.baseMeasurementUnitFactor = item.base_measurement_unit_factor ? convertStringToNumber(item.base_measurement_unit_factor) : item.baseMeasurementUnitFactor ?? this.baseMeasurementUnitFactor;
      this.conversionMeasurementUnitFactor = item.conversion_measurement_unit_factor ?? item.conversionMeasurementUnitFactor ?? this.conversionMeasurementUnitFactor;
      this.tareFactor = item.tare_factor ? convertStringToNumber(item.tare_factor) : item.tareFactor ?? this.tareFactor;
      this.receivingDefaultCommodityId = item.receiving_default_commodity_id ?? item.receivingDefaultCommodityId ?? this.receivingDefaultCommodityId;
      this.baseMeasurementUnitFactorKgs = item.base_measurement_unit_factor_kgs ?? item.baseMeasurementUnitFactorKgs ?? this.baseMeasurementUnitFactorKgs;
      this.conversionMeasurementUnitId = item.conversion_measurement_unit_id ?? item.conversionMeasurementUnitId ?? this.conversionMeasurementUnitId;
      this.conversionMeasurementUnitName = item.conversion_measurement_unit_name ?? item.conversionMeasurementUnitName ?? this.conversionMeasurementUnitName
    }
    else {
      Object.assign(this, {});
    }
  }
}

