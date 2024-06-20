import { ITRGenericModel } from "../tr-generic.model";
import { CONSTANTS } from '../../utils/constants/constants';

export interface ICountryModel extends ITRGenericModel{}

export class CountryModel implements ICountryModel {
    public id: number = null;
    public name: string = '';

    constructor(item?: any, lang: string = CONSTANTS.DEFAULT_SYSTEM_SETTINGS.LANG) {
        if (item) {
            this.id = item.id ?? this.id;
            this.name = item['name_' + lang] ?? this.name;

        } else {
            Object.assign(this, {});
        }
    }
}
