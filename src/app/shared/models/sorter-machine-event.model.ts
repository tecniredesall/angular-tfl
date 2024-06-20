export interface ISorterMachineEvent {
    eventType: string;
    data: ISorterMachineData | any;
  }
  
  export class SorterMachineEvent implements ISorterMachineEvent {
    public eventType: string = null;
    public data: any = null;
  
    constructor(item?: any) {
      if (item) {
        this.eventType = item.eventType ?? this.eventType;
        this.data = item.data ?? this.data;
      }
      else {
        Object.assign(this, {});
      }
    }
  }
  
  export interface ISorterMachineData {
    total: number;
    bad: number;
    ImpurityRatio: number;
    DefectiveRatio: number;
    device_type: string;
    ip_address: string;
  }