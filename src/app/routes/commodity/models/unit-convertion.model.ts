

export class IUnitConvertion {
    conversionMeasurementUnitName : string ;
    baseMeasurementUnitId: string;
    baseMeasurementUnit: string;
    branchId: number;
    conversionMeasurementUnitId: string;
    conversionMeasurementUnit: string;
    factor: string;
    mstatus: string;
    sourceId: number;
    storageDate: string;
    unitConverterId: string;
    userId: number;
}

export class UnitConvertion implements IUnitConvertion {
   public conversionMeasurementUnitName: string = '';
   public baseMeasurementUnitId: string = '';
   public baseMeasurementUnit: string = '';
   public branchId: number = 0;
   public conversionMeasurementUnitId: string = '';
   public conversionMeasurementUnit: string = '';
   public factor: string = '';
   public mstatus: string = '';
   public sourceId: number = 0
   public storageDate: string = '';
   public unitConverterId: string = '';
   public userId: number = 0

   constructor(item:any){
       if(item){
           this.baseMeasurementUnitId = item.base_measurement_unit_id ?? this.baseMeasurementUnitId;
           this.baseMeasurementUnit = item.base_measurement_unit ?? this.baseMeasurementUnit
           this.branchId = item.branch_id ?? this.branchId;
           this.conversionMeasurementUnitId = item.conversion_measurement_unit_id ?? this.conversionMeasurementUnitId;
           this.conversionMeasurementUnit = item.conversion_measurement_unit ?? this.conversionMeasurementUnit;
           this.factor = item.factor ?? this.factor;
           this.mstatus = item.mstatus ?? this.mstatus;
           this.sourceId = item.source_id ?? this.sourceId;
           this.storageDate = item.storage_date ?? this.storageDate;
           this.unitConverterId = item.unit_converter_id ?? this.unitConverterId;
           this.userId = item.user_id ?? this.userId;
           this.conversionMeasurementUnitName = item.conversion_measurement_unit_name ?? this.conversionMeasurementUnitName;
       }
   }
}
