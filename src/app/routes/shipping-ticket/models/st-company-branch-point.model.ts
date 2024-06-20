import { ISTCompanyBranchModel, STCompanyBranchModel } from './st-company-branch.model';
import { ICountryModel, CountryModel } from '../../../shared/models/adddress/country.model';
import { IStateModel, StateModel } from '../../../shared/models/adddress/state.model';
import { ICityModel, CityModel } from '../../../shared/models/adddress/city.model';
import { ITownModel, TownModel } from '../../../shared/models/adddress/town.model';

export interface ISTCompanyBranchPointModel {
    id: number;
    address: string;
    buyer?: ISTCompanyBranchModel;
    company?: ISTCompanyBranchModel;
    country: ICountryModel;
    state: IStateModel;
    city: ICityModel;
    town: ITownModel;
    completeAddress: string;
}

export class STCompanyBranchPointModel implements ISTCompanyBranchPointModel {
    public id: number;
    public address: string;
    public buyer?: ISTCompanyBranchModel = new STCompanyBranchModel();
    public company?: ISTCompanyBranchModel = new STCompanyBranchModel();
    public country: ICountryModel = new CountryModel();
    public state: IStateModel = new StateModel();
    public city: ICityModel = new CityModel();
    public town: ITownModel = new TownModel();
    public completeAddress: string = null;
    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.address = item.address ?? this.address;
            this.buyer = item.buyer ? new STCompanyBranchModel(item.buyer) : this.buyer;
            this.company = item.company ? new STCompanyBranchModel(item.company) : this.buyer;
            this.country = item.country ? new CountryModel(item.country) : this.country;
            this.state = item.state ? new StateModel(item.state) : this.state;
            this.city = item.city ? new CityModel(item.city) : this.city;
            this.town = item.town ? new TownModel(item.town) : this.town;
            this.completeAddress = `${this.address}, ${this.town.name ? this.town.name + ',' : ''} ${this.city.name}, ${this.state.name}, ${this.country.name}`
        } else {
            Object.assign(this, {});
        }
    }


}
