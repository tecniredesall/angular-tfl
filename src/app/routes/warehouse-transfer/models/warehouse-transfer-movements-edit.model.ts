import { ISTCompanyBranchPointModel, STCompanyBranchPointModel } from "../../shipping-ticket/models/st-company-branch-point.model";
import { ISTDriverInformationModel, STDriverInformationModel } from "../../shipping-ticket/models/st-driver-information.model";
import { ISTGeneralInformationModel, STGeneralInformationModel } from "../../shipping-ticket/models/st-general-information.model";
import { ISTReasonTransferModel, STReasonTransferModel } from "../../shipping-ticket/models/st-reason-transfer.model";
import { ISTVehicleInformationModel, STVehicleInformationModel } from "../../shipping-ticket/models/st-vehicle-information.model";
import { ISTWeightCaptureModel, STWeightCaptureModel } from "../../shipping-ticket/models/st-weight-capture.model";
import { WNCharacteristicModel } from "../../weight-note/models/wn-characteristic.model";


export interface IShippingTicketModel {
    generalInformation: ISTGeneralInformationModel;
    weightCapture: Array<ISTWeightCaptureModel> | any;
    driverInformation: ISTDriverInformationModel;
    vehicleInformation?: ISTVehicleInformationModel;
    destination?: ISTCompanyBranchPointModel;
    origin?: ISTCompanyBranchPointModel;
    reasonTransfer?: ISTReasonTransferModel;
    commodityId?: number
}
export class warehouseTransferMovementsEdit implements IShippingTicketModel {
    public generalInformation: ISTGeneralInformationModel = new STGeneralInformationModel();
    public weightCapture: Array<ISTWeightCaptureModel> = [];
    public driverInformation: ISTDriverInformationModel = new STDriverInformationModel();
    public destination?: ISTCompanyBranchPointModel = new STCompanyBranchPointModel(null);
    public origin?: ISTCompanyBranchPointModel = new STCompanyBranchPointModel(null);
    public reasonTransfer?: ISTReasonTransferModel = new STReasonTransferModel();
    public vehicleInformation?: ISTVehicleInformationModel = new STVehicleInformationModel();
    public commodityId?: number;
    public totalTareQQ: number = 0;
    public totalDiscountQQ: number = 0;
    public totalAdditionQQ: number = 0;
    public totalNetWeightQQ: number = 0;
    public totalGrossWeightQQ: number = 0;
    public totalNetDryWeightQQ: number = 0;
    public id: string

    constructor(item?: any, isAPIData: boolean = false, isFromDetailed: boolean = false, decimals?: number) {
        if (item) {

            this.id = item?.id;
            this.commodityId = item.commodity_transformation_id;
            item.truck = item.transport;
            if (item.truck) {
                item.truck.vehicle_type = item.transport?.vehicle_type_id;
                item.truck.license = item.truck?.license_plate;
                const type = {
                    id: item.truck?.type?.type
                }
                item.truck.type = type;
            }
            const generalInfo = {
                id: item.id,
                buyer_id: parseInt(item.destinyPoint.company_branch_id),
                buyer_location_id: item.destinyPoint.id,
                company_branch_id: item.originPoint.company.id,
                company_branch_point_id: item.originPoint.id,
                reason_transfer_id: parseInt(item.movement_reason),
                created_at: item.date_at,
                ticket_date: item.date_at,
                updated_at: item.date_at,
                ticket_number: item.transaction_id,
                companyBranchPointId: "",
                companyDestination: "",
                companyOrigin: "",
                ticketPrint: "",
                ticketStatus: "",
                createdBy: "",
                netWeightQQ: "",
                createdNameUser: "",
                shippingNote: "",
                labelNumber: "",
                close: "",
                updatedNameUser: "",
                buyer: ""
            };

            this.generalInformation = new STGeneralInformationModel(generalInfo, false, isFromDetailed);

            if (item.driver) {
                this.driverInformation = new STDriverInformationModel(item, true);
            }
            let weight = []
            item.warehouse_movement_notes.forEach(item => {
                weight.push(
                    {
                        weight_sacks_number: item.weight_sacks_number,
                        weight_gross: item.groos_weight,
                        weight_tare: item.tare_weight,
                        grossWeight: item.groos_weight,
                        weight_net_qq: '',
                        index: item.id,
                        weight_tare_aditional: item.weight_tare_aditional,
                        lot_id: item.lot_id
                    }
                )
            });

            let penalitiesModel = [];
            item.warehouse_movement_penalty_notes.forEach((penalty) => {
                penalitiesModel.push({
                    id: penalty.deduction_id,
                    penalty_index: penalty.warehouse_movement_penalty_index,
                    commodity_feature_id: penalty.deduction_id,
                    name: penalty.deduction.name,
                    "type": penalty.deduction.type,
                    characteristicsEnabled: null,
                    sign: "-",
                    value: penalty.value,
                    total: penalty.total
                });
            });

            const weightCap = [{
                note_folio: item.transaction_id,
                close: item.status,
                note_description: item.notes,
                shipping_note_id: item.transaction_id,
                commodity_id: item?.transformation?.commodity.id,
                commodity_transformation_id: item.commodity_transformation_id,
                transformation_type_id: item?.transformation?.transformation_type_id,
                production_tank_id: item.production_tank_id,
                production_tank: item.productionTank,
                weights: weight,
                penalties: penalitiesModel,
                note_sacks_number: item.totals.total_weight_sacks_number,
                note_weight_net: item.totals.total_netweight,
                note_tare_weight: item.totals.total_tare_weight,
                note_gross_weight: item.totals.total_groos_weight,
                note_penalties: item.totals.total_penalties,
                note_status: item.notes,
                warehouse_in_transfer: item?.tank?.id,
                wareHouseType: item.tank_id,
                commodity_transformation: {
                    id: item?.transformation?.type?.transformation_type_id,
                    name: item?.transformation?.type?.name,
                    transformationTypeId: item?.transformation?.type?.transformation_type_id,
                    transformationTypeName: item?.transformation?.type?.name
                }
            }]

            this.weightCapture = weightCap.map((wn: any) => {
                return new STWeightCaptureModel(wn, true)
            });

            this.origin = isAPIData ? new STCompanyBranchPointModel(item.originPoint) ?? this.origin : item.originPoint ?? this.origin;

        }
    }

}
