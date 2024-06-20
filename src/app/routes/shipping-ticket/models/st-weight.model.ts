import { IWNWeightModel } from '../../weight-note/models/wn-weight.model';
import { convertStringToNumber } from '../../../shared/utils/functions/string-to-number';
import { accurateDecimalSubtraction } from '../../../shared/utils/functions/accurate-decimal-operation';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';

export interface ISTWeightModel extends IWNWeightModel { }

export class STWeightModel implements ISTWeightModel {
    public sacksNumber: number = null;
    public grossWeight: number = null;
    public tare: number = null;
    public featuredWeight: number = null;
    public netWeightQQ: number = null;
    public index: number = null;
    public isWarningSacks: boolean = false;
    public tareAditional: number = null;
    public featuredWeightQQ: number = null;
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(
        localStorage.getItem('decimals')
    ).general : 2;
    public lotId?: string

    constructor(item?: any, isFromApi: boolean = false) {
        if (item) {
            this.sacksNumber = convertStringToNumber(isFromApi ? item.weight_sacks_number ?? this.sacksNumber : item.sacksNumber ?? this.sacksNumber);
            this.grossWeight = convertStringToNumber(isFromApi ? item.weight_gross ?? this.grossWeight : item.grossWeight ?? this.grossWeight);
            this.tare = convertStringToNumber(isFromApi ? item.weight_tare ?? this.tare : item.tare ?? this.tare);
            this.netWeightQQ = convertStringToNumber(isFromApi ? item.weight_net_qq ?? this.netWeightQQ : item.netWeightQQ ?? this.netWeightQQ);
            this.index = isFromApi ? item.weight_index + 1 ?? this.index : item.index ?? this.index;
            this.tareAditional = convertStringToNumber(isFromApi ? item.weight_tare_aditional ?? this.tareAditional : item.tareAditional ?? this.tareAditional);
            this.featuredWeight = accurateDecimalSubtraction([this.grossWeight, (this.tare + this.tareAditional)], this.DECIMAL_DIGITS);
            this.featuredWeightQQ = convertLbtoQQ(this.featuredWeight);
            this.lotId = isFromApi ? item.lot_id ?? this.lotId : item.lotId ?? this.lotId;
        } else {
            Object.assign(this, {});
        }
    }
}
