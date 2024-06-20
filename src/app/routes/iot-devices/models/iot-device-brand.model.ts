import { IotDeviceModel } from './iot-device-model.model';

export class IotDeviceBrand {
    id: string;
    brand: string;
    active: boolean;
    models: IotDeviceModel[] = [];

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.brand = item.brand ?? this.brand;
            this.active = item.active ?? this.active;
            this.models = item.models
                ? item.models.map((i) => new IotDeviceModel(i))
                : this.models;
        }
    }
}
