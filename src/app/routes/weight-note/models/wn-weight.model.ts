import { isEmpty } from 'rxjs/operators';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';

export interface IWNWeightModel {
  sacksNumber: number;
  grossWeight: number;
  tare: number;
  featuredWeight: number;
  netWeightQQ: number;
  index: number;
  isWarningSacks: boolean;
  tareAditional: number;
  lotId?: string
}

export class WNWeightModel implements IWNWeightModel {
  public sacksNumber: number = null;
  public grossWeight: number = null;
  public tare: number = null;
  public featuredWeight: number = null;
  public netWeightQQ: number = null;
  public index: number = 0;
  public isWarningSacks: boolean = false;
  public tareAditional: number = null;
  public lotId: string = null

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.sacksNumber = convertStringToNumber(isAPIData ? (item.weight_sacks_number ?? this.sacksNumber) : (item.sacksNumber ?? this.sacksNumber), true);
      this.grossWeight = convertStringToNumber(isAPIData ? (item.weight ?? item.gross_weight ?? this.grossWeight) : (item.grossWeight ?? this.grossWeight), true);
      this.tare = convertStringToNumber(item.tare ?? this.tare, true)
      this.featuredWeight = convertStringToNumber(isAPIData ? this.featuredWeight : (item.featuredWeight ?? this.featuredWeight), true);
      this.netWeightQQ = convertStringToNumber(isAPIData ? this.netWeightQQ : (item.netWeightQQ ?? this.netWeightQQ), true);
      this.index = convertStringToNumber(isAPIData ? (item.weight_index ?? this.index) : (item.index ?? this.index));
      this.isWarningSacks = isAPIData ? this.isWarningSacks : (item.isWarningSacks ?? this.isWarningSacks);
      this.tareAditional = convertStringToNumber(item.tare_aditional ?? item.tareAditional ?? this.tareAditional, true)
      this.lotId = isAPIData ? this.lotId : (item.lot_id ?? this.lotId);
    }
    else {
      Object.assign(this, {});
    }
  }
}
