import { IVarietyCommodityModel, VarietyCommodityModel } from "../models/variety-commodity.model";
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { GeneralCommodityModel, IGeneralCommodityModel } from './general-commodity.model';
import { CommodityTypeModel, ICommodityTypeModel } from './commodity-type.model';

export interface ICommodityModel {
  id: number;
  generalCommodity: IGeneralCommodityModel;
  name: string;
  variety: Array<IVarietyCommodityModel>;
  totalCommodityTypes: number;
  totalVarieties: number;
  types: Array<ICommodityTypeModel>;
  measureUnitInId: string;
  measureUnitOutId: string;
  measurementAbbreviationIn: string;
  measurementAbbreviationOut: string;
  measurementNameIn: string;
  measurementNameOut: string;
}

export class CommodityModel implements ICommodityModel {
  public id: number = null;
  public generalCommodity: IGeneralCommodityModel = null;
  public name: string = '';
  public variety: Array<IVarietyCommodityModel> = [];
  public totalCommodityTypes: number = 0;
  public totalVarieties: number = 0;
  public types: Array<ICommodityTypeModel> = [];
  public measureUnitInId: string ='';
  public measureUnitOutId: string ='';
  public measurementAbbreviationIn: string ='';
  public measurementAbbreviationOut: string ='';
  public measurementNameIn: string ='';
  public measurementNameOut: string ='';

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = item.id ?? this.id;
      this.name = item.name ?? this.name;
      this.totalCommodityTypes = isAPIData ? (item.transformations ?? this.totalCommodityTypes) : (item.totalCommodityTypes ?? this.totalCommodityTypes);
      this.totalVarieties = isAPIData ? (item.total_variety ?? this.totalVarieties) : (item.totalVarieties ?? this.totalVarieties);
      this.measureUnitInId = item.measure_unit_in_id ?? this.measureUnitInId;
      this.measureUnitOutId = item.measure_unit_out_id ?? this.measureUnitOutId;
      this.measurementAbbreviationIn = item.measurement_abbreviation_in ?? this.measurementAbbreviationIn;
      this.measurementAbbreviationOut = item.measurement_abbreviation_out ?? this.measurementAbbreviationOut;
      this.measurementNameIn = item.measurement_name_in ?? this.measurementNameIn;
      this.measurementNameOut = item.measurement_name_out ?? this.measurementNameOut;
      if (isAPIData) {
        this.generalCommodity = new GeneralCommodityModel({
          id: item.commodity_general_id,
          name: item.commodity_general_name
        });
      }
      else {
        if (item.generalCommodity) {
          this.generalCommodity = new GeneralCommodityModel(item.generalCommodity);
        }
        if (item.variety) {
          item.variety.forEach((v: IVarietyCommodityModel) => {
            this.variety.push(new VarietyCommodityModel(v));
          });
          this.variety = sortByStringValue(this.variety, 'name');
        }
        if (item.types) {
          item.types.forEach((t: ICommodityTypeModel) => {
            this.types.push(new CommodityTypeModel(t));
          });
          this.types = sortByStringValue(this.types, 'name');
        }
      }
    }
    else {
      Object.assign(this, {});
    }
  }

}
