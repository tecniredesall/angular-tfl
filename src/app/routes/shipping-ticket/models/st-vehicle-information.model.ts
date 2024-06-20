import { ITrucksModel, TrucksModel } from '../../trucks/models/trucks.model';
import { IVehicleTypeModel, VehicleTypeModel } from '../../trucks/models/vehicle-type.model';
export interface ISTVehicleInformationModel {
    truck: ITrucksModel;
    vehicleType: IVehicleTypeModel;
}

export class STVehicleInformationModel implements ISTVehicleInformationModel {
    public truck: ITrucksModel = new TrucksModel();
    public vehicleType: IVehicleTypeModel = new VehicleTypeModel();
    constructor(item?: any) {
        if (item) {
            this.truck = item ? new TrucksModel(item) : this.truck;
            this.vehicleType = item && item.type ? new VehicleTypeModel(item.type) : this.vehicleType;
            this.truck.license = item.license_plate ?? this.truck.license;
        } else {
            Object.assign(this, {});
        }
    }
}
