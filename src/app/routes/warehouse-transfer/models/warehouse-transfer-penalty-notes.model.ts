import { DeductionModel, IDeductionModel } from "./deduction.model";

export interface IWarehouseMovementPenaltyNoteModel {
    id: number;
    transactionID: number;
    warehouseMovementID: string;
    warehouseMovementPenaltyIndex: number;
    commodityFeatureID: string;
    value: string;
    coefficient: number;
    total: number;
    criteriaID: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    deduction: IDeductionModel;
}

export class WarehouseMovementPenaltyNoteModel implements IWarehouseMovementPenaltyNoteModel {
    public id: number = null;
    public transactionID: number = null;
    public warehouseMovementID: string = null;
    public warehouseMovementPenaltyIndex: number = null;
    public commodityFeatureID: string = null;
    public value: string = null;
    public total: number = 0;
    public coefficient: number = 0;
    public criteriaID: number = null;
    public createdAt: string = null;
    public updatedAt: string = null;
    public deletedAt: string = null;
    public deduction: IDeductionModel = new DeductionModel();


    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id
            this.transactionID = item.transaction_id ?? item.transactionID ?? this.transactionID
            this.warehouseMovementID = item.warehouse_movement_id ?? item.warehouseMovementID ?? this.warehouseMovementID
            this.warehouseMovementPenaltyIndex = item.warehouse_movement_penalty_index ?? item.warehouseMovementPenaltyIndex ?? this.warehouseMovementPenaltyIndex
            this.commodityFeatureID = item.commodity_feature_id ?? item.commodityFeatureID ?? this.commodityFeatureID
            this.value = item.value ?? this.value
            this.coefficient = item.coefficient ?? this.coefficient
            this.total = this.getTotalNegative(parseFloat(item.total)) ?? this.total
            this.criteriaID = item.criteria_id ?? item.criteriaID ?? this.criteriaID
            this.createdAt = item.created_at ?? item.createdAt ?? this.createdAt
            this.updatedAt = item.updated_at ?? item.updatedAt ?? this.updatedAt
            this.deletedAt = item.deleted_at ?? item.deletedAt ?? this.deletedAt
            this.deduction = item?.deduction ? new DeductionModel(item.deduction) : this.deduction;
        }
        else {
          Object.assign(this, {});
        }
    }

    private getTotalNegative(num: number){
        return num > 0 ? -1 * num : 0;
    }
}