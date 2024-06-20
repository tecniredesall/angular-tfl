import { CompanyModel, ICompanyModel } from "src/app/shared/models/company.model";
import { CONSTANTS } from "src/app/shared/utils/constants/constants";
export interface ITrucksModel {
    truckId: string;
    name: string;
    license: string;
    isEnabled: boolean;
    vehicleType: string;
    vehicleTypeId: number;
    serviceTypeId: number;
    transportCompanyId: number;
    transportCompany?: ICompanyModel;
}
export class TrucksModel implements ITrucksModel {
    public truckId: string = null;
    public name: string = null;
    public license: string = null;
    public isEnabled: boolean = false;
    public vehicleType: string = null;
    public vehicleTypeId: number = null;
    public serviceTypeId: number = null;
    public transportCompanyId: number = null;
    public transportCompany?: ICompanyModel = null;

    constructor(item?: any) {
        if (item) {
            this.truckId = item.truck_id ?? this.truckId;
            this.name = item.name ?? this.name;
            this.license = item.license ?? item.license_plate ?? this.license;
            this.isEnabled = item.hasOwnProperty('is_enabled') ? item.is_enabled : this.isEnabled;
            this.vehicleType = item.vehicle_type ?? this.vehicleType;
            this.vehicleTypeId = item.vehicle_type_id ?? this.vehicleTypeId;
            this.serviceTypeId = item.service_type ?? this.serviceTypeId;
            this.transportCompanyId = item.transport_company_id ?? this.transportCompanyId;
            this.transportCompany = item.transport_company ? new CompanyModel(item.transport_company) : item.transportCompany ?? this.transportCompany;
        } else {
            Object.assign(this, {});
        }
    }
}
export class TruksRequestModel {
    readonly TRUCK_SERVICE_TYPE = CONSTANTS.TRUCK_SERVICE_TYPE;
    public truck_id: string = null;
    public name: string = null;
    public license: string = null;
    public vehicle_type_id: number = null;
    public service_type: number = null;
    public transport_company_id: number = null;


    constructor(item: ITrucksModel, truckId?: string) {
        if (item) {
            this.truck_id = truckId ?? this.truck_id;
            this.name = item.name ?? this.name;
            this.license = item.license ?? this.license;
            this.vehicle_type_id = item.vehicleTypeId ?? this.vehicle_type_id;
            this.service_type = this.parseServiceTypeId(item.serviceTypeId);
            this.transport_company_id = item.transportCompanyId ?? this.transport_company_id;
        } else {
            Object.assign(this, {});
        }
    }

    private parseServiceTypeId(serviceTypeId: any): number {
        if (typeof serviceTypeId === 'number' && Object.values(this.TRUCK_SERVICE_TYPE).some(value => value === serviceTypeId)) {
            return serviceTypeId;
        }
        
        if (typeof serviceTypeId === 'string') {
            const serviceTypeEnumValue = this.TRUCK_SERVICE_TYPE[serviceTypeId.toUpperCase()];
            if (typeof serviceTypeEnumValue === 'number') {
                return serviceTypeEnumValue;
            }
        }
        
        return this.TRUCK_SERVICE_TYPE.PROPIO;
    }    
}

