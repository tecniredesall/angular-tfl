import { ISTVehicleInformationModel, STVehicleInformationModel } from './st-vehicle-information.model';
import { ISTGeneralInformationModel, STGeneralInformationModel } from "./st-general-information.model";
import { ISTWeightCaptureModel, STWeightCaptureModel } from "./st-weight-capture.model";
import { ISTDriverInformationModel, STDriverInformationModel } from "./st-driver-information.model";
import { ISTCompanyBranchPointModel, STCompanyBranchPointModel } from './st-company-branch-point.model';
import { ISTReasonTransferModel, STReasonTransferModel } from "./st-reason-transfer.model";
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { accurateDecimalSubtraction, accurateDecimalSum } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

export interface IShippingTicketModel {
    generalInformation: ISTGeneralInformationModel;
    weightCapture: Array<ISTWeightCaptureModel> | any;
    driverInformation: ISTDriverInformationModel;
    vehicleInformation?: ISTVehicleInformationModel;
    destination?: ISTCompanyBranchPointModel;
    origin?: ISTCompanyBranchPointModel;
    reasonTransfer?: ISTReasonTransferModel;
    commodityId?: number;
    totalNotesPenalties?: number;
    totalNetWeightDetailsQQ?: number;
}

export class ShippingTicketModel implements IShippingTicketModel {
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
    public totalDiscountLB: number = 0;
    public totalAdditionQQ: number = 0;
    public totalAdditionLB: number = 0;
    public totalNetWeightQQ: number = 0;
    public totalNetWeightLB: number = 0;
    public totalGrossWeightQQ: number = 0;
    public totalNetDryWeightQQ: number = 0;
    public totalGrossWeightLB: number = 0;
    public totalTareLB: number = 0;
    public totalNotesPenalties: number = 0;
    public totalNetWeightDetails = 0;
    public totalNetWeightDetailsQQ = 0;

    constructor(item?: any, isAPIData: boolean = false, isFromDetailed: boolean = false, decimals?: number) {
        if (item) {
            this.totalNotesPenalties = isAPIData ? item.total_notes_penalties : this.totalNotesPenalties;
            this.commodityId = isAPIData ? item.commodity_id : this.commodityId;
            this.generalInformation = isAPIData ? new STGeneralInformationModel(item, isAPIData, isFromDetailed) : item.information ? new STGeneralInformationModel(item.information) : this.generalInformation;
            this.driverInformation = isAPIData ? new STDriverInformationModel(item, isAPIData) : item.driver ? new STDriverInformationModel(item.information) : this.driverInformation;
            this.weightCapture = isAPIData ? item.weight_notes.map((wn: any) => {
                return new STWeightCaptureModel(wn, isAPIData, decimals)
            }) : this.weightCapture.push(new STWeightCaptureModel());
            this.destination = isAPIData ? new STCompanyBranchPointModel(item.destination) ?? this.destination : item.destination ?? this.destination;
            this.origin = isAPIData ? new STCompanyBranchPointModel(item.origin) ?? this.origin : item.origin ?? this.origin;
            this.reasonTransfer = isAPIData ? new STReasonTransferModel(item.reason_transfer) ?? this.reasonTransfer : item.reasonTransfer ?? this.reasonTransfer;
            this.vehicleInformation = isAPIData ? new STVehicleInformationModel(item.truck) ?? this.vehicleInformation : item.vehicleInformation ?? this.vehicleInformation;


            if (isFromDetailed) {

                let totalTareQQ = 0;
                let totalTareLB = 0;
                let totalDiscountQQ = 0;
                let totalDiscountLB = 0;
                let totalAdditionQQ = 0;
                let totalAdditionLB = 0;
                let totalNetWeightQQ = 0;
                let totalNetWeightLB = 0;
                let totalGrossWeightQQ = 0;
                let totalNetDryWeightQQ = 0;
                let totalGrossWeightLB = 0;

                this.weightCapture.forEach(weightCapture => {
                    totalTareQQ = accurateDecimalSum([totalTareQQ, weightCapture.totalTareQQ], decimals);
                    totalTareLB = accurateDecimalSum([totalTareLB, weightCapture.totalTare, weightCapture.totalTareAditional], decimals);

                    totalDiscountQQ = accurateDecimalSum([totalDiscountQQ, weightCapture.totalDiscountQQ], decimals);
                    totalDiscountLB = accurateDecimalSum([totalDiscountLB, weightCapture.totalDiscount], decimals);

                    totalAdditionQQ = accurateDecimalSum([totalAdditionQQ, weightCapture.totalAdditionQQ], decimals);
                    totalAdditionLB = accurateDecimalSum([totalAdditionLB, weightCapture.totalAddition], decimals);

                    totalNetWeightQQ = accurateDecimalSum([totalNetWeightQQ, weightCapture.totalNetQQ], decimals);
                    totalNetWeightLB = accurateDecimalSum([totalNetWeightLB, weightCapture.featuredWeight], decimals);

                    totalGrossWeightQQ = accurateDecimalSum([totalGrossWeightQQ, weightCapture.totalGrossQQ], decimals);

                    totalGrossWeightLB = accurateDecimalSum([totalGrossWeightLB, weightCapture.totalGross], decimals);
                    totalNetDryWeightQQ = accurateDecimalSum([totalNetDryWeightQQ, weightCapture.totalNetDryWtOut], decimals);
                });

                this.totalTareLB = truncateDecimals(totalTareLB, decimals);
                this.totalGrossWeightLB = truncateDecimals(totalGrossWeightLB, decimals);
                this.totalTareQQ = truncateDecimals(totalTareQQ, decimals);
                this.totalDiscountQQ = truncateDecimals(totalDiscountQQ, decimals);
                this.totalDiscountLB = truncateDecimals(totalDiscountLB, decimals);
                this.totalAdditionQQ = truncateDecimals(totalAdditionQQ, decimals);
                this.totalNetWeightQQ = truncateDecimals(totalNetWeightQQ, decimals);
                this.totalNetWeightLB = truncateDecimals(totalNetWeightLB, decimals);
                this.totalGrossWeightQQ = truncateDecimals(totalGrossWeightQQ, decimals);
                this.totalNetDryWeightQQ = truncateDecimals(totalNetDryWeightQQ, decimals);
                this.totalNetWeightDetails = accurateDecimalSubtraction([totalNetWeightLB, this.totalNotesPenalties], decimals);
                this.totalNetWeightDetailsQQ = convertLbtoQQ(this.totalNetWeightDetails);
                this.setTotalsVoid()
            }
        } else {
            this.weightCapture.push(new STWeightCaptureModel());
        }
    }

    setTotalsVoid() {
        if (this.generalInformation.isVoided) {
            this.totalTareLB = 0;
            this.totalGrossWeightLB = 0;
            this.totalTareQQ = 0;
            this.totalDiscountQQ = 0;
            this.totalDiscountLB = 0;
            this.totalAdditionQQ = 0;
            this.totalNetWeightQQ = 0;
            this.totalNetWeightLB = 0;
            this.totalGrossWeightQQ = 0;
            this.totalNetDryWeightQQ = 0;
            this.totalNetWeightDetails = 0;
            this.totalNetWeightDetailsQQ = 0;
        }
    }
}
