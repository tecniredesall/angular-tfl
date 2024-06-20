export interface ISTBuyerModel{
    id: number;
    fullName: string;
    companyName: string;
}

export class STBuyerModel implements ISTBuyerModel{
    public id: number;
    public fullName: string;
    public companyName: string

    constructor(item: any){
        this.id = item.id ?? this.id;
        this.fullName = item.legal_fullname ?? this.fullName;
        this.companyName = item.company_name ?? this.companyName;
    }
}