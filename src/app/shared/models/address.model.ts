export interface IAddressModel {
    address: string;
    country?: string;
    state?: string;
    city?: string;
    village?: string;
    zip_code?: string;
    countryName?: string;
    stateName?: string;
    cityName?: string;
    villageName?: string;
}

export class AddressModel implements IAddressModel{
    public address: string = null;
    public country?: string = null;
    public state?: string = null;
    public city?: string = null;
    public village?: string = null;
    public zip_code?: string = null;
    public countryName?: string = null;
    public stateName?: string = null;
    public cityName?: string = null;
    public villageName?: string = null;
}
