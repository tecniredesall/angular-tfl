import { convertStringToNumber } from './../utils/functions/string-to-number';

export interface IWNWeightRequestModel {
    weight_sacks_number: number;
    gross_weight: number;
    tare: number;
    featured_weight: number;
    net_weight_qq: number;
    weight_index: number;
    is_warning_sacks: boolean;
    weight_tare_aditional: number;
  }

  export class WNWeightRequestModel implements IWNWeightRequestModel {
    public weight_sacks_number: number = null;
    public gross_weight: number = null;
    public tare: number = null;
    public featured_weight: number = null;
    public net_weight_qq: number = null;
    public weight_index: number = 0;
    public is_warning_sacks: boolean = false;
    public weight_tare_aditional: number = 0;

    constructor(item?:any) {
      if (item) {
        this.weight_sacks_number =  convertStringToNumber(item.sacksNumber,true);
        this.gross_weight = convertStringToNumber(item.grossWeight,true);
        this.tare = convertStringToNumber(item.tare,true) ;
        this.featured_weight = convertStringToNumber(item.featuredWeight,true);
        this.net_weight_qq =  convertStringToNumber(item.netWeightQQ,true);
        this.weight_index = convertStringToNumber(item.index,true);
        this.is_warning_sacks = this.is_warning_sacks;
        this.weight_tare_aditional = convertStringToNumber(item.tareAditional,true);
      }
    }

  }


