export interface IIotDevicesModel {
    isActive: boolean;
    associatedUsers: Array<any>;
    createdDate: string;
    creatorUser: any;
    description: string;
    id: string;
    ipAddress: string;
    location: string;
    model: string;
    users: number;
    port: number;
    serie: string;
    brand: string;
    deviceType: string;
    iotBrandId: string;
    iotModelId: string;
    measurementUnitId: string;
    metricUnit: string;
}

export class IotDevicesModel implements IIotDevicesModel {
    public isActive: boolean = false;
    public associatedUsers: Array<any> = [];
    public createdDate: string = null;
    public creatorUser: any = null;
    public description: string = '';
    public id: string = null;
    public ipAddress: string = '';
    public location: string = '';
    public model: string = null;
    public users: number = 0;
    public port: number = null;
    public serie: string = null;
    public brand: string = null;
    public deviceType: string = null;
    public iotBrandId: string = null;
    public iotModelId: string = null;
    public measurementUnitId: string = null;
    public metricUnit: string = null;

    constructor(item?: any, isFromApi: boolean = true) {
        if (item) {
            this.isActive = isFromApi ? item.active !== 0 : this.isActive;
            this.associatedUsers = item.associatedUsers;
            this.createdDate = isFromApi ? item.created_at : item.createdDate;
            this.creatorUser = isFromApi ? item.creator?.name : item.creator;
            this.description = item.description;
            this.id = item.id;
            this.ipAddress = isFromApi ? item.ip_address : item.ipAddress;
            this.location = item.location;
            this.model = item.model;
            this.deviceType = item.device_type;
            this.brand = item.brand;
            this.users = isFromApi ? item.nUsers : item.users;
            this.port = item.port;
            this.serie = item.serie;
            this.iotBrandId = item.iot_brand_id ?? this.iotBrandId;
            this.iotModelId = item.iot_model_id ?? this.iotModelId;
            this.measurementUnitId = item.measurement_unit_id ?? this.measurementUnitId;
            this.metricUnit = item.metric_unit ?? this.metricUnit;
        }
    }

    public serializeIotDevicesToSave() {
        return {
            id: this.id,
            iot_model_id: this.model,
            device_type: this.deviceType,
            active: this.isActive ? 1 : 0,
            location: this.location,
            description: this.description,
            ip_address: this.ipAddress,
            associatedUsers: this.associatedUsers,
            port: this.port,
        };
    }
}
