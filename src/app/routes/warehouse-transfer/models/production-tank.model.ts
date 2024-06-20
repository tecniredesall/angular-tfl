export interface IProductionTankModel {
    productionTankId: string;
    tankId: number;
    transformationsTypeId: string;
    externalId: string;
    baseMeasurementUnitId: string;
    conversionMeasurementUnitId: string;
    name: string;
    capacity: string;
    stock: string;
    stockLb: string;
    stockLbd: string;
    lowLimit: string;
    hightLimit: string;
    isEnabled: number;
    userId: number;
    storageDate: string;
    locationId: number;
    federatedId: string;
    percentageStock: number;
}

export class ProductionTankModel implements IProductionTankModel {
    public productionTankId: string = null;
    public tankId: number = null;
    public transformationsTypeId: string = null;
    public externalId: string = null;
    public baseMeasurementUnitId: string = null;
    public conversionMeasurementUnitId: string = null;
    public name: string = null;
    public capacity: string = null;
    public stock: string = null;
    public stockLb: string = null;
    public stockLbd: string = null;
    public lowLimit: string = null;
    public hightLimit: string = null;
    public isEnabled: number = null;
    public userId: number = null;
    public storageDate: string = null;
    public locationId: number = null;
    public federatedId: string = null;
    public percentageStock: number = null;

    constructor(item?: any) {
        if (item) {
            this.productionTankId = item.production_tank_id ?? item.productionTankId ?? this.productionTankId
            this.tankId = item.tank_id ?? item.tankId ?? this.tankId
            this.transformationsTypeId = item.transformations_type_id ?? item.transformationsTypeId ?? this.transformationsTypeId
            this.externalId = item.external_id ?? item.externalId ?? this.externalId
            this.baseMeasurementUnitId = item.base_measurement_unit_id ?? item.baseMeasurementUnitId ?? this.baseMeasurementUnitId
            this.conversionMeasurementUnitId = item.conversion_measurement_unit_id ?? item.conversionMeasurementUnitId ?? this.conversionMeasurementUnitId
            this.name = item.name ?? this.name
            this.capacity = item.capacity ?? this.capacity
            this.stock = item.stock ?? this.stock
            this.stockLb = item.stock_lb ?? item.stockLb ?? this.stockLb
            this.stockLbd = item.stock_lbd ?? item.stockLbd ?? this.stockLbd
            this.lowLimit = item.low_limit ?? item.lowLimit ?? this.lowLimit
            this.hightLimit = item.hight_limit ?? item.hightLimit ?? this.hightLimit
            this.isEnabled = item.is_enabled ?? item.isEnabled ?? this.isEnabled
            this.userId = item.user_id ?? item.userId ?? this.userId
            this.storageDate = item.storage_date ?? item.storageDate ?? this.storageDate
            this.locationId = item.location_id ?? item.locationId ?? this.locationId
            this.federatedId = item.federated_id ?? item.federatedId ?? this.federatedId
            this.percentageStock = item.percentage_stock ?? item.percentageStock ?? this.percentageStock
        }else {
            Object.assign(this, {});
        }
    }

}