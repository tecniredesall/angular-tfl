import { CONSTANTS } from "src/app/shared/utils/constants/constants";
import { IWCompanyInfoCurrencyModel, WCompanyInfoCurrencyModel } from "./company-info-currency.model";
import { IWCompanyInfoLanguageModel, WCompanyInfoLanguageModel } from "./company-info-language.model";

export interface IWCompanyInfoModel {
    rtn: string;
    name: string;
    phone: string;
    floId: string;
    email: string;
    purchaseOrderMaxAmount?: number;
    language: IWCompanyInfoLanguageModel[];
    currency: IWCompanyInfoCurrencyModel;
}

export class WCompanyInfoModel implements IWCompanyInfoModel {
    public rtn: string = '';
    public name: string = '';
    public phone: string = '';
    public floId: string = '';
    public email: string = '';
    public purchaseOrderMaxAmount?: number;
    public language: IWCompanyInfoLanguageModel[] = [];

    public currency: IWCompanyInfoCurrencyModel = CONSTANTS.DEFAULT_CURRENCY;
    constructor(item?: any) {
        let rtn: string;
        let name: string;
        let phone: string;
        let floId: string;
        let email: string;
        let purchaseOrderMaxAmount: number;
        let language: WCompanyInfoLanguageModel[];
        let currency: WCompanyInfoCurrencyModel;
        const config = item?.hasOwnProperty('config') ? item.config : item

        if (item && config?.length > 0) {
            for (let c of config) {
                switch (c.name) {
                    case 'rtn':
                        rtn = c.value;
                        break;
                    case 'name':
                        name = c.value;
                        break;
                    case 'phone':
                        phone = c.value;
                        break;
                    case 'flo_id':
                        floId = c.value;
                        break;
                    case 'email':
                        email = c.value;
                        break;
                    case 'purchase_order_max_amount':
                        purchaseOrderMaxAmount = parseInt(c.value);
                        break;
                    case 'language':
                        language = c.value.languages.map((lang) => {
                             return new WCompanyInfoLanguageModel(lang);
                        });
                        break;
                    case 'currency':
                        currency = new WCompanyInfoCurrencyModel(c.value);
                        break;
                }
            }
        }
        this.rtn = rtn ?? this.rtn;
        this.name = name ?? this.name;
        this.phone = phone ?? this.phone;
        this.floId = floId ?? this.floId;
        this.email = email ?? this.email;
        this.purchaseOrderMaxAmount =
            purchaseOrderMaxAmount ?? this.purchaseOrderMaxAmount;
        this.language = language ?? this.language;
        this.currency = currency ?? this.currency;
    }
}
