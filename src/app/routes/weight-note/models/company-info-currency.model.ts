export interface IWCompanyInfoCurrencyModel {
    symbol: string
    name: string;
    isoCode: string;
    description: string;
}

export class WCompanyInfoCurrencyModel implements IWCompanyInfoCurrencyModel {
    public symbol: string = '';
    public name: string = '';
    public isoCode: string = '';
    public description: string = "";

    constructor(item?: any) {
        let symbol: string;
        let name: string;
        let isoCode: string;
        let description: string;

        this.symbol = item?.symbol ?? this.symbol;
        this.name = item?.name ?? this.name;
        this.isoCode = item?.iso_code ?? this.isoCode;
        this.description = item?.description ?? this.description;
    }

}