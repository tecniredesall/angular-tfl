import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { accurateDecimalSubtraction } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { convertQQtoLb, convertLbtoQQ } from '../../../shared/utils/functions/convert-qq-to-lb';
export interface ISubtankModel {
    amount: number;
    amountQQ: number;
    capacity: number;
    capacityQQ: number;
    highLimit: number;
    lowLimit: number;
    name: string;
    productionTankId: string;
    tankId: number;
    transformationTypeId: string;
    transformationTypeName: string;
    percentageStock?: number;
    stock?: number;
    stockLb: number;
    maxCapacity?: number;
}

export interface ISubtankRequestModel {
    name: string;
    tank_id: number;
    capacity: number;
    low_limit: number;
    hight_limit: number;
    production_tank_id: string;
    transformations_type_id: string;
    base_measurement_unit_id: string;
    conversion_measurement_unit_id: string;
}

export class SubtankModel implements ISubtankModel {
    public amount: number;
    public amountQQ: number;
    public highLimit: number;
    public lowLimit: number;
    public name: string;
    public productionTankId: string;
    public tankId: number;
    public transformationTypeId: string;
    public transformationTypeName: string;
    public capacity: number;
    public capacityQQ: number;
    public percentageStock?: number;
    public stock?: number;
    public stockLb: number;
    public maxCapacity?: number;

    constructor(item?: any, isFromApi = true) {
        if (item) {
            this.amount = isFromApi ? parseFloat(item.amount) : item.amount;
            this.amountQQ = isFromApi ? convertLbtoQQ(item.amount) : item.amount;
            this.highLimit = isFromApi ? parseInt(item.hight_limit) : item.highLimit;
            this.lowLimit = isFromApi ? parseInt(item.low_limit) : item.lowLimit;
            this.name = item.name;
            this.productionTankId = isFromApi ? item.production_tank_id : item.productionTankId;
            this.tankId = isFromApi ? item.tank_id : item.tankId;
            this.transformationTypeId = isFromApi ? item.transformations_type_id : item.transformationTypeId;
            this.transformationTypeName = isFromApi ? item.typeName : item.transformationTypeName;
            this.capacity = isFromApi ? parseFloat(item.capacity) : item.capacity;
            this.capacityQQ = isFromApi ? convertLbtoQQ(item.capacity) : item.capacityQQ;
            this.percentageStock = isFromApi ? item.percentage_stock : item.percentageStock;
            this.stock = item.stock;
            this.stockLb = isFromApi ? parseFloat(item.stock_lb) : item?.stockLb;
            this.maxCapacity = accurateDecimalSubtraction(
                [parseFloat(item.capacity), parseFloat(item.stock)],
                CONSTANTS.DEFAULT_SYSTEM_SETTINGS.GENERAL_DECIMALS
            );
        }
    }

    public request(data: any): ISubtankRequestModel {
        let request: ISubtankRequestModel = {
            name: this.name,
            tank_id: data.tankId,
            capacity: convertQQtoLb(this.capacityQQ, data.config.conversion_measurement_unit_factor),
            low_limit: this.lowLimit,
            hight_limit: this.highLimit,
            production_tank_id: data.subTankId,
            transformations_type_id: this.transformationTypeId,
            base_measurement_unit_id: data.measurementUnitId,
            conversion_measurement_unit_id: data.conversionMeasurementUnitId,
        }
        return request
    }
}
