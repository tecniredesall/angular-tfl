import { titleCaseWord } from "../utils/functions/titlecase";

export interface ICompanyModel {
    id: number;
    name: string;
    legalName: string;
    legalLastname: string;
    legalIdentity: string;
}

export interface ICompanyRequestModel {
    name: string;
    legal_name: string;
    legal_lastname: string;
    legal_identity: string;
}

export class CompanyModel {
    public id: number = null;
    public name: string = '';
    public legalName: string = '';
    public legalLastname: string = '';
    public legalIdentity: string = '';

    constructor(item?: any) {
        if(item){
            this.id = item?.id ?? this.id;
            this.name = item?.name ?? this.name;
            this.legalName = item?.legal_name ?? item?.legalName ?? this.legalName;
            this.legalLastname = item?.legal_lastname ?? item.legalLastname ?? this.legalLastname;
            this.legalIdentity = item?.legal_identity ?? item.legalIdentity ?? this.legalIdentity;
        }
    }

    public getRequest(): ICompanyRequestModel {
        let request = {
            name: titleCaseWord(this.name),
            legal_name: titleCaseWord(this.legalName),
            legal_lastname: titleCaseWord(this.legalLastname),
            legal_identity: this.legalIdentity.replace(/\s/g, '')
        }
        return request;
    }
}