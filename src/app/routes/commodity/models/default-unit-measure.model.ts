export interface IDefaultUnitMeasure{

        locationId: number;
        receivingDefaultCommodityId: number;
        receivingDefaultCommodityTransformationId: string;
        receivingDefaultProductionTankId: string;
        defaultMeasurementUnitId: string;
        systemDecimals: number;
        systemDecimalsForTotals: number;
        tareFactor: number;
        displayExternalId: 1;
        measurementUnitHeight: number;
        userId: number;
        storageDate: string;
        measurementUnitId: string;
        name: string;
        abbreviation: string;
        measurementTypeId: number;
        isEnabled: boolean;

}

export class DefaultUnitMeasure implements IDefaultUnitMeasure{

  public locationId: number =0 ;
  public receivingDefaultCommodityId: number =0 ;
  public receivingDefaultCommodityTransformationId: string = '' ;
  public receivingDefaultProductionTankId: string = '' ;
  public defaultMeasurementUnitId: string = '' ;
  public systemDecimals: number =0 ;
  public systemDecimalsForTotals: number =0 ;
  public tareFactor: number =0 ;
  public displayExternalId: 1;
  public measurementUnitHeight: number =0 ;
  public userId: number =0 ;
  public storageDate: string = '' ;
  public measurementUnitId: string = '' ;
  public name: string = '' ;
  public abbreviation: string = '' ;
  public measurementTypeId: number =0 ;
  public isEnabled: boolean;

  constructor(item:any){

  }

}
