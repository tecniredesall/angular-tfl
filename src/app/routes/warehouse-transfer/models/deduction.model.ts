export interface IDeductionModel {
    id: string;
    name: string;
    commoditiesFeaturesId: number;
    type: string;
    subType: string;
    min: number;
    max: number;
    steps: string;
    isDefault: number;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    federatedId: string;
}

export class DeductionModel implements IDeductionModel {
    public id: string = null;
    public name: string = null;
    public commoditiesFeaturesId: number = null;
    public type: string = null;
    public subType: string = null;
    public min: number = null;
    public max: number = null;
    public steps: string = null;
    public isDefault: number = null;
    public createdBy: number = null;
    public createdAt: string = null;
    public updatedAt: string = null;
    public deletedAt: string = null;
    public federatedId: string = null;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? item.id ?? this.id;
            this.name = item.name ?? item.name ?? this.name;
            this.commoditiesFeaturesId = item.commodities_features_id ?? item.commoditiesFeaturesId ?? this.commoditiesFeaturesId;
            this.type = item.type ?? this.type;
            this.subType = item.sub_type ?? item.subType ?? this.subType;
            this.min = item.min ?? this.min;
            this.max = item.max ?? this.max;
            this.steps = item.steps ?? this.steps;
            this.isDefault = item.is_default ?? item.isDefault ?? this.isDefault;
            this.createdBy = item.created_by ?? item.createdBy ?? this.createdBy;
            this.createdAt = item.created_at ?? item.createdAt ?? this.createdAt;
            this.updatedAt = item.updated_at ?? item.updatedAt ?? this.updatedAt;
            this.deletedAt = item.deleted_at ?? item.deletedAt ?? this.deletedAt;
            this.federatedId = item.federated_id ?? item.federatedId ?? this.federatedId;
        } else {
            Object.assign(this, {});
        }
    }
}
