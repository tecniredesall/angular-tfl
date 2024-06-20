import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';

export interface IWNConfigurationModel {
  measurementUnitId: string;
  measurementUnitName: string;
  measurementUnitAbbreviation: string;
  conversionMeasurementUnitAbbreviation: string;
  baseMeasurementUnitFactor: number;
  conversionMeasurementUnitFactor: number;
  tareFactor: number;
  receivingDefaultCommodityId: number;
}

export class WNConfigurationModel implements IWNConfigurationModel {
  public measurementUnitId: string = null;
  public measurementUnitName: string = '';
  public measurementUnitAbbreviation: string = '';
  public conversionMeasurementUnitAbbreviation: string = '';
  public baseMeasurementUnitFactor: number = 1;
  public conversionMeasurementUnitFactor: number = 1;
  public tareFactor: number = 1;
  public receivingDefaultCommodityId: number = 1;

  constructor(item?: any) {
    if (item) {
      this.measurementUnitId = item.base_measurement_unit_id ?? item.measurementUnitId ?? this.measurementUnitId;
      this.measurementUnitName = item.base_measurement_unit_name ?? item.measurementUnitName ?? this.measurementUnitName;
      this.measurementUnitAbbreviation = item.base_measurement_unit_abbreviation ?? item.measurementUnitAbbreviation ?? this.measurementUnitAbbreviation;
      this.conversionMeasurementUnitAbbreviation = item.conversion_measurement_unit_abbreviation ?? item.conversionMeasurementUnitAbbreviation ?? this.conversionMeasurementUnitAbbreviation;
      this.baseMeasurementUnitFactor = item.base_measurement_unit_factor ?? item.baseMeasurementUnitFactor ?? this.baseMeasurementUnitFactor;
      this.conversionMeasurementUnitFactor = item.conversion_measurement_unit_factor ?? item.conversionMeasurementUnitFactor ?? this.conversionMeasurementUnitFactor;
      this.tareFactor = convertStringToNumber(item.tare_factor ?? item.tareFactor ?? this.tareFactor.toString());
      this.receivingDefaultCommodityId = item.receiving_default_commodity_id ?? item.receivingDefaultCommodityId ?? this.receivingDefaultCommodityId;
    }
    else {
      Object.assign(this, {});
    }
  }
}

