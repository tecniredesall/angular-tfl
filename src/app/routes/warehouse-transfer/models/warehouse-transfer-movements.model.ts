import { debug } from "console";
import { CONSTANTS } from "src/app/shared/utils/constants/constants";
import { convertQQtoLb } from "src/app/shared/utils/functions/convert-qq-to-lb";
import { convertStringToNumber } from "src/app/shared/utils/functions/string-to-number";
import { TRConfiguration } from "src/app/shared/utils/models/configuration.model";
import { IShippingTicketModel } from "../../shipping-ticket/models/shipping-ticket.model";

export interface warehouseTransferMovementsModel {
    created_at: moment.Moment;
    date_at: moment.Moment;
    lot_id: string;
    status: string;
    commodity_transformation_id: string;
    movement_reason: string | number;
    production_tank_id: string;
    tank_id: string;
    origin_point: string | number;
    destiny_point: string | number;
    measurement_id: string;
    operation_type: string;
    notes: string;
    truck_id: string;
    driver_id: string;
    warehouse_movement_notes: WarehouseMovementNote[];
    warehouse_movement_penalty_notes: WarehouseMovementPenaltyNote[];
}

export interface WarehouseMovementNote {
    status: string | number;
    netweight: string | number;
    groos_weight: string | number;
    weight_sacks_number: string | number;
    tare_weight: string | number;
    weight_tare_aditional: string | number;
}

export interface WarehouseMovementPenaltyNote {
    warehouse_movement_penalty_index: number;
    id: string;
    value: string;
    criteria_id: number;
}

export class warehouseTransferMovements implements warehouseTransferMovementsModel {
    public lot_id: string;
    public created_at: moment.Moment;
    public date_at: moment.Moment;
    public status: string;
    public commodity_transformation_id: string;
    public movement_reason: string | number;
    public production_tank_id: string;
    public tank_id: string;
    public origin_point: string | number;
    public destiny_point: string | number;
    public measurement_id: string;
    public operation_type: string;
    public notes: string;
    public truck_id: string;
    public driver_id: string;
    public warehouse_movement_notes: WarehouseMovementNote[];
    public warehouse_movement_penalty_notes: WarehouseMovementPenaltyNote[];
    public id: string;
    public related_id: string;
    constructor(shippingTicket: IShippingTicketModel,
        configuration: TRConfiguration,
        operationType: string,
        penalities: boolean,
        typeOperation = CONSTANTS.WAREHOUSE_MOVEMENT_OPERATION.OPEN,
        isInEdit = false) {
        this.id = shippingTicket.generalInformation?.id;
        if (operationType === 'in' && !isInEdit) {
            this.id = null
            this.related_id = shippingTicket.generalInformation?.id
        }
        this.date_at = shippingTicket.generalInformation.ticketDate;
        this.status = typeOperation
        this.commodity_transformation_id = shippingTicket.weightCapture.at(0)?.commodityTypeId?.toString();
        this.movement_reason = shippingTicket.generalInformation.reasonTransferId?.toString();
        this.production_tank_id = shippingTicket.weightCapture.at(0)?.warehouseId;
        this.tank_id = shippingTicket.weightCapture.at(0).wareHouseType;
        this.origin_point = shippingTicket.generalInformation.companyBranchPointId?.toString();
        this.destiny_point = shippingTicket.generalInformation.buyerLocationId?.toString();
        this.measurement_id = configuration.measurementUnitAbbreviation ?? CONSTANTS.MEASUREMENT_UNIT.BASE;
        this.operation_type = operationType;
        this.notes = shippingTicket.weightCapture.at(0).noteDescription
        this.truck_id = shippingTicket.driverInformation.vehicleId
        this.driver_id = shippingTicket.driverInformation.driverId;
        this.warehouse_movement_notes = [];
        shippingTicket.weightCapture.at(0).weights?.forEach((item, index) => {
            const notesWeight = {
                "id": index,
                "status": "open",
                "netweight": convertQQtoLb(convertStringToNumber(item.netWeightQQ)),
                "groos_weight": convertStringToNumber(item.grossWeight),
                "weight_sacks_number": convertStringToNumber(item.sacksNumber),
                "tare_weight": convertStringToNumber(item.tare),
                "weight_tare_aditional": convertStringToNumber(item.tareAditional),
                "lot_id": item.lotId
            }
            this.warehouse_movement_notes.push(notesWeight)

        });

        this.warehouse_movement_penalty_notes = [];

        const [penalitiesList] = shippingTicket.weightCapture.at(0).penalties;

        if (penalitiesList && penalitiesList.value) {
            shippingTicket.weightCapture.at(0).penalties.forEach((item, index) => {
                const penalties = {
                    "id": item?.characteristic?.deduction?.id,
                    "warehouse_movement_penalty_index": index,
                    "value": this._clearValuePenalties(item?.value),
                    "total": item?.total,
                    "criteria_id": CONSTANTS.WAREHOUSE_MOVEMENT_CRITERIA_ID,
                    "coefficient": item.choiceDeduction ? this._clearValuePenalties((100 - item.choiceDeduction?.coefficient).toString()) : this._clearValuePenalties(item?.value)
                };
                this.warehouse_movement_penalty_notes.push(penalties);
            });

        }
    }

    private _clearValuePenalties(value: string) {
        const valueClear = value ?? ''
        return valueClear.toString().replace(/%/g, '').replace(' ', '')
    }
}
