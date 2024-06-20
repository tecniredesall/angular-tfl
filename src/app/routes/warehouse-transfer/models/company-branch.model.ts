export interface ICompanyBranchModel {
    id:           number;
    companyName: string;
    createdBy:   string;
    createdAt:   string;
    updatedAt:   string;
    deletedAt:   string;
    federatedId: string;
}

export class CompanyBranchModel implements ICompanyBranchModel{
    id: number = null;
    companyName: string = null;
    createdBy: string = null;
    createdAt: string = null;
    updatedAt: string = null;
    deletedAt: string = null;
    federatedId: string = null;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.companyName = item.company_name ?? item.companyName ?? this.companyName;
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
