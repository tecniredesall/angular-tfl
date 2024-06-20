import { CompanyModel, ICompanyModel } from '../../../shared/models/company.model';
import { ITDriverModel, TDriverModel } from "../../drivers/models/driver.model";
import { ITrucksModel, TrucksModel } from "../../trucks/models/trucks.model";

export interface ISTDriverInformationModel {
    driverId: string;
    driverIdentity: string;
    vehicleId: string;
    vehicleType: string;
    vehicleLicense: string;
    labelNumber: string;
    driverName: string;
    driver: ITDriverModel;
    vehicle: ITrucksModel;
    transportCompanyId: string;
}

export class STDriverInformationModel implements ISTDriverInformationModel {
    public driverId: string = null;
    public driverIdentity: string = null;
    public vehicleId: string = null;
    public vehicleType: string = null;
    public vehicleLicense: string = null;
    public labelNumber: string = null;
    public driverName: string = null;
    public driver: ITDriverModel = null;
    public vehicle: ITrucksModel = null;
    public transportCompanyId: string = null;

    constructor(item?: any, isAPIData: boolean = false) {
        if (item) {
            this.driverId = isAPIData ? item.driver.driver_id ?? this.driverId : item.driverId ?? this.driverId;
            this.transportCompanyId = isAPIData ? item.truck?.transport_company_id ?? this.transportCompanyId : item.transportCompanyId ?? this.transportCompanyId;
            this.driverIdentity = isAPIData ? item.driver.identity ?? this.driverIdentity : item.driverId ?? this.driverIdentity;
            this.driverName = isAPIData ?
                `${item.driver.first_name || ''} ${item.driver.father_last_name || ''} ${item.driver.mother_last_name || ''}`
                ?? this.driverName
                : item.driverName ?? this.driverName;
            this.vehicleId = isAPIData ? item.truck?.truck_id ?? this.vehicleId : item.vehicleId ?? this.vehicleId;
            this.vehicleLicense = isAPIData ? item.truck?.license_plate ?? this.vehicleLicense : item.vehicleLicense ?? this.vehicleLicense;
            this.vehicleType = isAPIData ? item.truck?.type.id ?? this.vehicleType : item.vehicleType ?? this.vehicleType;
            this.labelNumber = isAPIData ? item.label_number ?? this.labelNumber : item.labelNumber ?? this.labelNumber;
            this.driver = item.driver ? new TDriverModel(item.driver, true) : this.driver;
            this.vehicle = item.truck ? new TrucksModel(item.truck) : this.vehicle;
        }
    }
}
