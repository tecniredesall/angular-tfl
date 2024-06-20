import { CompanyModel, ICompanyModel } from "src/app/shared/models/company.model";

export interface ITDriverModel {
    id: string;
    name: string;
    paternalLast: string;
    maternalLast: string;
    license: string;
    fullName: string;
    identity: string;
    typeId: number;
    transportCompanyId: number;
    transportCompany?: ICompanyModel;
}

export class TDriverModel implements ITDriverModel {
    public id: string = null;
    public name: string = '';
    public paternalLast: string = '';
    public maternalLast: string = '';
    public license: string = '';
    public fullName: string = '';
    public identity: string = '';
    public typeId: number = null;
    public transportCompanyId: number = null;
    public transportCompany?: ICompanyModel = null;

    constructor(item: any = {}, isAPIData: boolean = false) {
        if (item) {
            this.id = isAPIData ? item.driver_id : item.id ? item.id : this.id;
            this.name =
                isAPIData && null != item.first_name
                    ? item.first_name
                    : item.name ?? this.name;

            this.paternalLast =
                isAPIData && null != item.father_last_name
                    ? item.father_last_name
                    : item.paternalLast ?? this.paternalLast;

            this.maternalLast =
                isAPIData && null != item.mother_last_name
                    ? item.mother_last_name
                    : item.maternalLast ?? this.maternalLast;

            this.license =
                item.license && null != item.license
                    ? item.license
                    : this.license;

            this.identity = item.identity ?? this.identity;

            this.fullName = this.name;

            if (this.paternalLast.length > 0) {
                this.fullName += ` ${this.paternalLast}`;
            }

            if (this.maternalLast.length > 0) {
                this.fullName += ` ${this.maternalLast}`;
            }

            this.typeId = item.driver_type ?? item.typeId ?? this.typeId;
            this.transportCompanyId = item.transport_company_id ?? item.transportCompanyId ?? this.transportCompanyId;
            this.transportCompany = item.transport_company ? new CompanyModel(item.transport_company) : item.transportCompany ?? this.transportCompany;
        } else {
            Object.assign(this, {});
        }
    }
}
