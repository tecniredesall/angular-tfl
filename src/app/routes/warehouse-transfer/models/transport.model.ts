import { CompanyModel, ICompanyModel } from "src/app/shared/models/company.model";
import { ITransportTypeModel, TransportTypeModel } from "./transport-type.model";

export interface ITransportModel {
    truckId: string;
    name: string;
    licensePlate: string;
    isEnabled: boolean;
    vehicleType: string;
    vehicleTypeId: number;
    serviceTypeId: number;
    transportCompanyId: number;
    transportCompany: ICompanyModel;
    type: ITransportTypeModel;
}
export class TransportModel implements ITransportModel {
    public truckId: string = null;
    public name: string = null;
    public licensePlate: string = null;
    public isEnabled: boolean = false;
    public vehicleType: string = null;
    public vehicleTypeId: number = null;
    public serviceTypeId: number = null;
    public transportCompanyId: number = null;
    public transportCompany: ICompanyModel = new CompanyModel();
    public type: ITransportTypeModel = new TransportTypeModel();

    constructor(item?: any) {
        if (item) {
            this.truckId = item.truck_id ?? this.truckId;
            this.name = item.name ?? this.name;
            this.licensePlate = item.license_plate ?? item.licensePlate ?? this.licensePlate;
            this.isEnabled = item.hasOwnProperty('is_enabled') ? item.is_enabled : this.isEnabled;
            this.vehicleType = item.vehicle_type ?? this.vehicleType;
            this.vehicleTypeId = item.vehicle_type_id ?? this.vehicleTypeId;
            this.serviceTypeId = item.service_type ?? this.serviceTypeId;
            this.transportCompanyId = item.transport_company_id ??  item.transportCompanyId ?? this.transportCompanyId;
            this.transportCompany = item?.transport_company ? new CompanyModel(item.transport_company) : this.transportCompany;
            this.type = item?.type ? new TransportTypeModel(item.type) : this.type;
        } else {
            Object.assign(this, {});
        }
    }
}