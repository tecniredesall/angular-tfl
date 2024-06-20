import { IUserModel, UserModel } from 'src/app/shared/models/user.model';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { ITDriverModel, TDriverModel } from '../../drivers/models/driver.model';
import { IOriginPointModel, OriginPointModel } from './origin-point.model';
import { IProductionTankModel, ProductionTankModel } from './production-tank.model';
import { ITankModel, TankModel } from './tank.model';
import { ITotalsModel, TotalsModel } from './totals.model';
import { ITransformationModel, TransformationModel } from './transformation.model';
import { ITransportModel, TransportModel } from './transport.model';
import { IWarehouseMovementNoteModel, WarehouseMovementNoteModel } from './warehouse-transfer-movement.model';
import { IWarehouseMovementPenaltyNoteModel, WarehouseMovementPenaltyNoteModel } from './warehouse-transfer-penalty-notes.model';

export interface IWarehouseTransferModel {
    id: string;
    transactionID: number;
    status: string;
    lotID: string;
    notes: string;
    commodityTransformationID: string;
    movementReason: string;
    tankSourceID: number;
    tankDestinyID: number;
    originPoint: IOriginPointModel;
    destinyPoint: IOriginPointModel;
    measurementID: string;
    user: IUserModel;
    extra: string;
    operationType: string;
    truckID: string;
    driverID: string;
    deletedBy: string;
    deletedReason: string;
    createdAt: string;
    dateAt: string;
    updatedAt: string;
    deletedAt: string;
    reasonTitle: string;
    warehouseMovementNotes: IWarehouseMovementNoteModel[];
    warehouseMovementPenaltyNotes: IWarehouseMovementPenaltyNoteModel[];
    productionTank: IProductionTankModel;
    tank: ITankModel;
    driver: ITDriverModel;
    transport: ITransportModel;
    transformation: ITransformationModel;
    netWeight: number;
    totalNetWeightOut: number;
    completed: boolean;
}

export class WarehouseTransferModel implements IWarehouseTransferModel {
    public id: string = null;
    public transactionID: number = null;
    public status: string = null;
    public lotID: string = null;
    public notes: string = null;
    public commodityTransformationID: string = null;
    public movementReason: string = null;
    public reasonTitle: string = null;
    public tankSourceID: number = null;
    public tankDestinyID: number = null;
    public originPoint: IOriginPointModel = new OriginPointModel();
    public destinyPoint: IOriginPointModel = new OriginPointModel();
    public measurementID: string = null;
    public user: IUserModel = new UserModel();
    public extra: string = null;
    public operationType: string = null;
    public truckID: string = null;
    public driverID: string = null;
    public deletedBy: string = null;
    public deletedReason: string = null;
    public createdAt: string = null;
    public dateAt: string = null;
    public updatedAt: string = null;
    public deletedAt: string = null;
    public warehouseMovementNotes: IWarehouseMovementNoteModel[] = [];
    public warehouseMovementPenaltyNotes: IWarehouseMovementPenaltyNoteModel[] = [];
    public productionTank: IProductionTankModel = new ProductionTankModel();
    public tank: ITankModel = new TankModel();
    public driver: ITDriverModel = new TDriverModel();
    public transport: ITransportModel = new TransportModel();
    public transformation: ITransformationModel = new TransformationModel();
    public totals: ITotalsModel = new TotalsModel();
    public netWeight: number = null;
    public totalNetWeightOut: number = null;
    public completed: boolean = false;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.transactionID = item.transaction_id ?? item.transactionID ?? this.transactionID;
            this.status = item.status ?? this.status;
            this.lotID = item.lot_id ?? item.lotID ?? this.lotID;
            this.notes = item.notes ?? this.notes;
            this.commodityTransformationID = item.commodity_transformation_id ?? item.commodityTransformationID ?? this.commodityTransformationID;
            this.movementReason = item.movement_reason ?? item.movementReason ?? this.movementReason;
            this.reasonTitle = item.reason_title ?? item.reasonTitle ?? this.reasonTitle
            this.tankSourceID = item.tank_source_id ?? item.tankSourceID ?? this.tankSourceID;
            this.tankDestinyID = item.tank_destiny_id ?? item.tankDestinyID ?? this.tankDestinyID;
            this.originPoint = item?.originPoint ? new OriginPointModel(item.originPoint) : item?.origin_point ? new OriginPointModel(item.origin_point) : this.originPoint;
            this.destinyPoint = item?.destinyPoint ? new OriginPointModel(item.destinyPoint) : item?.destiny_point ? new OriginPointModel(item.destiny_point) : this.destinyPoint;
            this.measurementID = item.measurement_id ?? item.measurementID ?? this.measurementID;
            this.user = item.user ? new UserModel(item.user) : this.user;
            this.extra = item.extra ?? this.extra;
            this.operationType = item.operation_type ?? item.operationType ?? this.operationType;
            this.truckID = item.truck_id ?? item.truckID ?? this.truckID;
            this.driverID = item.driver_id ?? item.driverID ?? this.driverID;
            this.deletedBy = item.deleted_by ?? item.deletedBy ?? this.deletedBy;
            this.deletedReason = item.deletion_reason ?? item.deleted_reason ?? item.deletionReason ?? this.deletedReason;
            this.createdAt = item.created_at ?? item.createdAt ?? this.createdAt;
            this.dateAt = item.date_at ?? item.dateAt ?? this.dateAt;
            this.updatedAt = item.updated_at ?? item.updatedAt ?? this.updatedAt;
            this.deletedAt = item.deleted_at ?? item.deletedAt ?? this.deletedAt;
            this.warehouseMovementNotes = item?.warehouse_movement_notes ? item.warehouse_movement_notes.map(data => new WarehouseMovementNoteModel(data)) : item.warehouseMovementNotes ?? this.warehouseMovementNotes;
            this.warehouseMovementPenaltyNotes = item?.warehouse_movement_penalty_notes ? item.warehouse_movement_penalty_notes.map(data => new WarehouseMovementPenaltyNoteModel(data)) : item.warehouseMovementPenaltyNotes ?? this.warehouseMovementPenaltyNotes;
            this.productionTank = item?.production_tank ? new ProductionTankModel(item.production_tank) : item?.productionTank ? new ProductionTankModel(item.productionTank) : this.productionTank;
            this.tank = item?.tank ? new TankModel(item.tank) : this.tank;
            this.driver = item?.driver ? new TDriverModel(item.driver, true) : this.driver;
            this.transport = item?.transport ? new TransportModel(item.transport) : this.transport;
            this.transformation = item?.transformation ? new TransformationModel(item.transformation) : this.transformation;
            this.totals = item?.totals ? new TotalsModel(item.totals) : this.totals;
            this.netWeight =  item.total_netweight ? parseFloat(item.total_netweight) : this.netWeight;
            this.totalNetWeightOut = convertLbtoQQ(this.netWeight);
            this.completed = item.completed ?? this.completed;
        } else {
            Object.assign(this, {});
        }
    }
}
