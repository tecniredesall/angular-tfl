export interface IWCompanyInfoLanguageModel {
    nameCountryIso: string;
    codeCountryAlfa2: string;
    file: string;
    defaultFile: string;
}

export class WCompanyInfoLanguageModel implements IWCompanyInfoLanguageModel {
    public nameCountryIso: string = '';
    public codeCountryAlfa2: string = '';
    public file: string = '';
    public defaultFile: string = '';

    constructor(item?: any) {
        let nameCountryIso: string;
        let codeCountryAlfa2: string;
        let file: string;
        let defaultFile: string;

        this.nameCountryIso = item?.name_country_iso ?? this.nameCountryIso;
        this.codeCountryAlfa2 = item?.code_country_alfa2 ?? this.codeCountryAlfa2;
        this.file = item?.file ?? this.file;
        this.defaultFile = item?.default_file ?? this.defaultFile;
    }
}
