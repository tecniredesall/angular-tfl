import { ISTWeightModel, STWeightModel } from './st-weight.model';
import { CommodityTypeModel, ICommodityTypeModel } from 'src/app/routes/kanban/models/commodity-type.model';
import { CONSTANTS } from "src/app/shared/utils/constants/constants";
import { IWNCharacteristicModel } from "../../weight-note/models/wn-characteristic.model";
import { IWNPenaltyModel, WNPenaltyModel } from "../../weight-note/models/wn-penalty.model";
import { ISubtankModel, SubtankModel } from '../../warehouse/models/subtank.model';
import { convertStringToNumber } from '../../../shared/utils/functions/string-to-number';
import { accurateDecimalSubtraction, accurateDecimalSum } from '../../../shared/utils/functions/accurate-decimal-operation';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { roundUp } from 'src/app/shared/utils/functions/round-up';

export interface ISTWeightCaptureModel {
    shippingNoteId: string;
    commodityId: number;
    commodityTypeId: string;
    commodityTransformationId: string;
    commodityTransformationName: string;
    warehouseId: string;
    weights: Array<ISTWeightModel>;
    penalties: Array<IWNPenaltyModel>;
    totalCharacteristics: number;
    totalCharacteristicsPercent: number;
    totalSacks: number;
    totalNet: number;
    totalNetQQ: number;
    totalNetQQRow: number;
    totalTare: number;
    totalTareAditional: number;
    totalTareQQ: number;
    totalGross: number;
    totalGrossQQ: number;
    totalDiscount: number;
    featuredWeight: number;
    featuredWeightQQ: number;
    totalDiscountQQ: number;
    totalAddition: number;
    totalAdditionQQ: number;
    totalNetDryWt: number;
    status: number;
    isDataLoadedOnEdit: boolean;
    isLoadingCharacteristics: boolean;
    characteristicsWasLoaded: boolean;
    characteristics: Array<IWNCharacteristicModel>;
    isWarningContainer: boolean;
    textNote: string;
    commodityTransformation: ICommodityTypeModel;
    warehouse: ISubtankModel;
    close: boolean;
    noteDescription: string;
    noteFolio: number,
    wareHouseType?: number,
    totalNetDryWtOut?: number
}

export class STWeightCaptureModel implements ISTWeightCaptureModel {
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(
        localStorage.getItem('decimals')
    ).general : 2;
    public shippingNoteId: string;
    public commodityId: number;
    public commodityTypeId: string;
    public commodityTransformationId: string;
    public commodityTransformation: ICommodityTypeModel = new CommodityTypeModel();
    public commodityTransformationName: string;
    public warehouseId: string;
    public warehouse: ISubtankModel = new SubtankModel();
    public weights: Array<ISTWeightModel> = [new STWeightModel()];
    public penalties: Array<IWNPenaltyModel> = [new WNPenaltyModel()];
    public totalCharacteristics: number = 0;
    public totalCharacteristicsPercent: number = 0;
    public totalSacks: number = 0;
    public totalNet: number = 0;
    public totalNetQQ: number = 0;
    public totalNetQQRow: number = 0;
    public totalTare: number = 0;
    public totalTareAditional: number = 0;
    public totalTares: number = 0;
    public totalTareQQ: number = 0;
    public totalGross: number = 0;
    public totalGrossQQ: number = 0;
    public totalDiscount: number = 0;
    public featuredWeight: number = 0;
    public featuredWeightQQ: number = 0;
    public totalDiscountQQ: number = 0;
    public totalAddition: number = 0;
    public totalAdditionQQ: number = 0;
    public totalNetDryWt: number = 0;
    public status: number = CONSTANTS.SHIPPING_TICKET_STATUS.OPEN;
    public isDataLoadedOnEdit: boolean = false;
    public isLoadingCharacteristics: boolean = false;
    public characteristicsWasLoaded: boolean = false;
    public characteristics: Array<IWNCharacteristicModel> = [];
    public isWarningContainer: boolean = false;
    public textNote: string;
    public close: boolean = false;
    public noteDescription: string;
    public noteFolio: number;
    public wareHouseType: number;
    public totalNetDryWtOut: number;
    constructor(item?: any, isApiData: boolean = false, decimals?: number) {
        if (item) {
            this.noteFolio = isApiData ? item.note_folio ?? this.noteFolio : item.note_folio ?? this.noteFolio;
            this.close = isApiData ? item.close ?? this.close : item.close ?? this.close;
            this.noteDescription = isApiData ? item.note_description ?? this.noteDescription : item.note_description ?? this.noteDescription;
            this.shippingNoteId = isApiData ? item.shipping_note_id ?? this.shippingNoteId : item.shippingNoteId ?? this.shippingNoteId;
            this.commodityId = isApiData ? item.commodity_id ?? this.commodityId : item.commodityId ?? this.commodityId;
            this.commodityTypeId = isApiData ? item.commodity_transformation_id ?? this.commodityTypeId : item.commodityTypeId ?? this.commodityTypeId;
            this.commodityTransformationId = isApiData ? item.transformation_type_id ?? this.commodityTransformationId : item.commodityTransformationId ?? this.commodityTransformationId;
            this.commodityTransformation = isApiData ?
                item.commodity_transformation ? new CommodityTypeModel(item.commodity_transformation) : this.commodityTransformation :
                item.commodityTransformation ?? this.commodityTransformation;
            this.commodityTransformationName = isApiData ? this.commodityTransformation.name ?? this.commodityTransformationName : item.commodityTransformationName ?? this.commodityTransformationName;
            this.warehouseId = isApiData ? item.production_tank_id ?? this.warehouseId : item.warehouseId ?? this.warehouseId;
            this.warehouse = isApiData ?
                item.production_tank ? new SubtankModel(item.production_tank, isApiData) : this.warehouse :
                item.warehouse ?? this.warehouse;
            this.weights = isApiData ?
                item.weights ? (item.weights as Array<any>).map((w) => new STWeightModel(w, isApiData)) : this.weights :
                item.weights ?? this.weights;
            let totalTareAditional = 0;
            this.weights.forEach(weight => {
                totalTareAditional = accurateDecimalSum([totalTareAditional, weight.tareAditional], decimals);
            });
            this.totalTareAditional = totalTareAditional;
            this.penalties = isApiData ?
                item.penalties ? (item.penalties as Array<any>).map((p) => new WNPenaltyModel(p, isApiData)) : this.penalties :
                item.penalties ?? this.penalties;
            this.totalSacks = isApiData ? item.note_sacks_number ?? this.totalSacks : item.totalSacks ?? this.totalSacks;
            this.totalNet = isApiData ? item.note_weight_net ?? this.totalNet : item.totalNet ?? this.totalNet;
            this.totalNetQQ = isApiData ? truncateDecimals(convertLbtoQQ(item.note_weight_net), this.DECIMAL_DIGITS) ?? this.totalNetQQ : item.totalNetQQ ?? this.totalNetQQ;
            this.totalTare = convertStringToNumber(isApiData ? item.note_tare_weight ?? this.totalTare : item.totalTare ?? this.totalTare);
            this.totalTares = accurateDecimalSum([this.totalTare, this.totalTareAditional], decimals);
            this.totalTareQQ = isApiData ? roundUp(convertLbtoQQ(item.note_tare_weight), this.DECIMAL_DIGITS) ?? this.totalTareQQ : item.totalTareQQ ?? this.totalTareQQ;
            this.totalGross = convertStringToNumber(isApiData ? item.note_gross_weight ?? this.totalGross : item.totalGross ?? this.totalGross);
            this.totalGrossQQ = isApiData ? truncateDecimals(convertLbtoQQ(item.note_gross_weight), this.DECIMAL_DIGITS) ?? this.totalGrossQQ : item.totalGrossQQ ?? this.totalGrossQQ;
            this.totalDiscount = isApiData ? item.note_penalties ?? this.totalDiscount : item.totalDiscount ?? this.totalDiscount;
            this.totalDiscountQQ = isApiData ? roundUp(convertLbtoQQ(item.note_penalties), this.DECIMAL_DIGITS) ?? this.totalDiscountQQ : item.totalDiscountQQ ?? this.totalDiscountQQ;
            this.status = isApiData ? item.note_status ?? this.status : item.status ?? this.status;
            this.featuredWeight = accurateDecimalSubtraction([this.totalGross, (this.totalTare + this.totalTareAditional)], this.DECIMAL_DIGITS);
            this.totalNetQQ = convertLbtoQQ(this.featuredWeight);
            this.featuredWeightQQ = accurateDecimalSubtraction([this.totalGrossQQ, this.totalTareQQ], this.DECIMAL_DIGITS);
            const totalNetDryWt = accurateDecimalSubtraction([this.featuredWeight, this.totalDiscount], this.DECIMAL_DIGITS);
            this.totalNetDryWtOut = convertLbtoQQ(totalNetDryWt);

            this.wareHouseType = item.wareHouseType
        } else {
            Object.assign(this, {});
        }

    }
}
