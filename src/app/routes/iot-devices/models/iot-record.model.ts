export interface IIoTRecord {
  id: string;
  model: string;
  description: string;
  isDefault: boolean;
  ipAddress: string;
  port: number;
  isActive: boolean;
  isConnected: boolean;
  measurementUnitId: string;
  metricUnit: string;
  location:string;
  brand:string;
  loader:boolean
}

export class IoTRecord implements IIoTRecord {
  public id: string = null;
  public model: string = '';
  public description: string = '';
  public isDefault: boolean = false;
  public ipAddress: string = null;
  public port: number = null;
  public isActive: boolean = false;
  public isConnected: boolean = false;
  public measurementUnitId: string = null;
  public metricUnit: string = null;
  public location: string ='';
  public brand: string ='';
  public loader: boolean ;

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = item.id ?? this.id;
      this.model = item.model ?? this.model;
      this.description = item.description ?? this.description;
      this.isDefault = isAPIData
        ? item.hasOwnProperty('defaultScale') ? !!item.defaultScale : this.isDefault
        : item.hasOwnProperty('isDefault') ? item.isDefault : this.isDefault;
      this.ipAddress = isAPIData ? item.ip_address ?? this.ipAddress : item.ipAddress ?? this.ipAddress;
      this.port = item.port ?? this.port;
      this.isActive = isAPIData
        ? (item.hasOwnProperty('active') ? !!item.active : this.isActive)
        : (item.hasOwnProperty('isActive') ? item.isActive : this.isActive);
      this.measurementUnitId = item.measurement_unit_id ?? this.measurementUnitId;
      this.metricUnit = item.metric_unit ?? this.metricUnit;
      this.location = item.location ?? this.location;
      this.brand = item.brand ?? this.brand;
      this.loader = true
    }
    else {
      Object.assign(this, {});
    }
  }

}
