export interface ISTCompanyBranchModel {
    id: number;
    name: string;
}

export class STCompanyBranchModel implements ISTCompanyBranchModel {
    public id: number = null;
    public name: string = null;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.name = item.company_name ?? this.name;
        } else {
            Object.assign(this, {});
        }

    }
}
