import { CompanyBranchModel, ICompanyBranchModel } from "./company-branch.model";

export interface IOriginPointModel {
    id: number;
    companyBranchId: number;
    countryId: string;
    stateId: string;
    cityId: string;
    villageId: string;
    address: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    company: ICompanyBranchModel;
}

export class OriginPointModel implements IOriginPointModel{
    id: number = null;
    companyBranchId: number = 0;
    countryId: string = null;
    stateId: string = null;
    cityId: string = null;
    villageId: string = null;
    address: string = null;
    createdBy: string = null;
    createdAt: string = null;
    updatedAt: string = null;
    deletedAt: string = null;
    company: ICompanyBranchModel = new CompanyBranchModel();

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.companyBranchId = item.company_branch_id ?? item.companyBranchId ?? this.companyBranchId;
            this.countryId = item.country_id ?? item.countryId ?? this.countryId;
            this.stateId = item.state_id ?? item.stateId ?? this.stateId;
            this.cityId = item.city_id ?? item.cityId ?? this.cityId;
            this.villageId = item.village_id ?? item.villageId ?? this.villageId;
            this.address = item.address ?? this.address;
            this.createdBy = item.created_by ?? item.createdBy ?? this.createdBy;
            this.createdAt = item.created_at ?? item.createdAt ?? this.createdAt;
            this.updatedAt = item.updated_at ?? item.updatedAt ?? this.updatedAt;
            this.deletedAt = item.deleted_at ?? item.deletedAt ?? this.deletedAt;
            this.company = item.company ? new CompanyBranchModel(item.company) : this.company;

        } else {
            Object.assign(this, {});
        }
    }
}
