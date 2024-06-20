import { accurateDecimalSubtraction } from "src/app/shared/utils/functions/accurate-decimal-operation";
import { convertLbtoQQ } from "src/app/shared/utils/functions/convert-qq-to-lb";

export interface IWarehouseMovementNoteModel {
    id: number;
    lotFolio: string;
    transactionID: number;
    warehouseMovementID: string;
    status: string;
    lotID: string;
    tankSourceID: number;
    tankDestinyID: number;
    commodityTransformationID: string;
    measurementID: string;
    userID: number;
    deletedBy: string;
    deletionReason: string;
    netWeight: number;
    totalNetWeightOut: number;
    groosWeight: number;
    weightSacksNumber: number;
    tareWeight: number;
    weightTareAditional: number;
    operationType: string;
    comments: string;
    extra: string;
    featuredWeight: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export class WarehouseMovementNoteModel implements IWarehouseMovementNoteModel {
    public id: number = null;
    public lotFolio: string = null;
    public transactionID: number = null;
    public warehouseMovementID: string = null;
    public status: string = null;
    public lotID: string = null;
    public tankSourceID: number = null;
    public tankDestinyID: number = null;
    public commodityTransformationID: string = null;
    public measurementID: string = null;
    public userID: number = null;
    public deletedBy: string = null;
    public deletionReason: string = null;
    public netWeight: number = null;
    public totalNetWeightOut: number = null;
    public featuredWeight: number = null;
    public featuredWeightOut: number = null;
    public groosWeight: number = null;
    public weightSacksNumber: number = null;
    public tareWeight: number = null;
    public weightTareAditional: number = null;
    public operationType: string = null;
    public comments: string = null;
    public extra: string = null;
    public createdAt: string = null;
    public updatedAt: string = null;
    public deletedAt: string = null;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.lotFolio = item.lot_folio ?? item.lotFolio ?? this.lotFolio;
            this.transactionID = item.transaction_id ?? item.transactionID ?? this.transactionID;
            this.warehouseMovementID = item.warehouse_movement_id ?? item.warehouseMovementID ?? this.warehouseMovementID;
            this.status = item.status ?? this.status;
            this.lotID = item.lot_id ?? item.lotID ?? this.lotID;
            this.tankSourceID = item.tank_source_id ?? item.tankSourceID ?? this.tankSourceID;
            this.tankDestinyID = item.tank_destiny_id ?? item.tankDestinyID ?? this.tankDestinyID;
            this.commodityTransformationID = item.commodity_transformation_id ?? item.commodityTransformationID ?? this.commodityTransformationID;
            this.measurementID = item.measurement_id ?? item.measurementID ?? this.measurementID;
            this.userID = item.user_id ?? item.userID ?? this.userID;
            this.deletedBy = item.deleted_by ?? item.deletedBy ?? this.deletedBy;
            this.deletionReason = item.deletion_reason ?? item.deletionReason ?? this.deletionReason;
            this.netWeight = item.net_weight ?? parseFloat(item.netweight) ?? this.deletionReason;
            this.totalNetWeightOut = convertLbtoQQ(this.netWeight);
            this.groosWeight = item.groos_weight ?? item.groosWeight ?? this.deletionReason;
            this.weightSacksNumber = parseFloat(item.weight_sacks_number) ?? parseFloat(item.weightSacksNumber) ?? this.weightSacksNumber;
            this.tareWeight = parseFloat(item.tare_weight) ?? parseFloat(item.tareWeight) ?? this.tareWeight;
            this.weightTareAditional = parseFloat(item.weight_tare_aditional) ?? parseFloat(item.weightTareAditional) ?? this.weightTareAditional;
            this.operationType = item.operation_type ?? item.operationType ?? this.operationType;
            this.comments = item.comments ?? this.comments;
            this.extra = item.extra ?? this.extra;
            this.createdAt = item.created_at ?? item.createdAt ?? this.createdAt;
            this.updatedAt = item.updated_at ?? item.updatedAt ?? this.updatedAt;
            this.deletedAt = item.deleted_at ?? item.deletedAt ?? this.deletedAt;
            this.featuredWeight = accurateDecimalSubtraction(
                    [ this.groosWeight, this.tareWeight, this.weightTareAditional],
                    this.DECIMAL_DIGITS
                );
            this.featuredWeightOut = convertLbtoQQ(this.featuredWeight);
        }else {
            Object.assign(this, {});
        }
    }
}
