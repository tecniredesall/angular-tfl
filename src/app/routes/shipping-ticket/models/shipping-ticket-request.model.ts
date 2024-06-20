import * as moment from 'moment-timezone';
import { ISTWeightNoteRequestModel, STWeightNoteRequestModel } from './st-weight-note-request.model';
import { IShippingTicketModel } from './shipping-ticket.model';

export interface IShippingTicketRequestModel {
    ticket_date: moment.Moment,
    reason_transfer_id: number,
    company_branch_id: number,
    company_branch_point_id: number,
    buyer_id: number,
    buyer_location_id: number,
    truck_id: string,
    driver_id: string,
    label_number: string,
    ticket_description: string,
    close_note: boolean,
    weight_notes: ISTWeightNoteRequestModel[],
    commodity_id: number,
    transport_company_id: string,
}

export class ShippingTicketRequestModel implements IShippingTicketRequestModel {
    public ticket_date: moment.Moment;
    public reason_transfer_id: number;
    public company_branch_id: number;
    public company_branch_point_id: number;
    public buyer_id: number;
    public buyer_location_id: number;
    public truck_id: string = '';
    public driver_id: string = '';
    public label_number: string = '';
    public ticket_description: string = '';
    public close_note: boolean;
    public weight_notes: ISTWeightNoteRequestModel[] | any;
    public commodity_id: number;
    public transport_company_id: string = '';

    constructor(shippingTicket: IShippingTicketModel) {


        this.ticket_date = shippingTicket.generalInformation.ticketDate;
        this.reason_transfer_id = shippingTicket.generalInformation.reasonTransferId;
        this.company_branch_id = shippingTicket.generalInformation.companyBranchId;
        this.company_branch_point_id = shippingTicket.generalInformation.companyBranchPointId;
        this.buyer_id = shippingTicket.generalInformation.buyerId;
        this.buyer_location_id = shippingTicket.generalInformation.buyerLocationId;
        this.truck_id = shippingTicket.driverInformation.vehicleId ?? this.truck_id;
        this.driver_id = shippingTicket.driverInformation.driverId ?? this.driver_id;
        this.label_number = shippingTicket.driverInformation.labelNumber ?? this.label_number;
        this.transport_company_id = shippingTicket.driverInformation.transportCompanyId ?? this.transport_company_id;
        this.close_note = shippingTicket.generalInformation.close;
        this.weight_notes = shippingTicket.weightCapture.map((wn) => {
            return new STWeightNoteRequestModel(wn)
        });

        this.commodity_id = shippingTicket.weightCapture.length > 0 ? shippingTicket.weightCapture[0].commodityId : 0;
    }
}
