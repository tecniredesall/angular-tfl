import { IotDeviceBrand } from './iot-device-brand.model';

export class IotDeviceModel {
    id: string;
    iotBrandId: string;
    model: string;
    active: boolean;
    brand: IotDeviceBrand

    constructor(item?: any) {
        if (item) {            
            this.id = item.id ?? this.id;
            this.iotBrandId = item.iot_brand_id ?? this.iotBrandId;
            this.model = item.model ?? this.model;
            this.active = item.active === 1 ? true : false;
            this.brand = item.brand ?? this.brand;
        }
    }
}