import * as moment from "moment";
import { AppUser, IAppUser } from "src/app/shared/models/app-user.model";
import { CONSTANTS } from "src/app/shared/utils/constants/constants";
import { convertLbtoQQ } from "src/app/shared/utils/functions/convert-qq-to-lb";
import { convertStringToNumber } from "src/app/shared/utils/functions/string-to-number";
import { truncateDecimals } from "src/app/shared/utils/functions/truncate-decimals";
import { UserModel } from "../../users/models/user.model";
import { CreateModelComponent } from "../../workflow/production-flows/components/create-model/create-model.component";
import { ISTBuyerModel, STBuyerModel } from "./st-buyer.model";

export interface ISTGeneralInformationModel {
    id: string;
    creationDate: moment.Moment;
    ticketDate: moment.Moment;
    updatedDate: moment.Moment;
    folio: string;
    buyerId: number;
    buyerLocationId: number;
    companyBranchId: number;
    reasonTransferId: number;
    companyBranchPointId: number;
    companyDestination: string;
    companyOrigin: string;
    ticketPrint: boolean
    ticketStatus: number;
    createdBy: string;
    close: boolean;
    netWeightQQ: number;
    createdNameUser: string;
    shippingNote: string;
    labelNumber: string;
    updatedNameUser: string;
    buyer: ISTBuyerModel;
    options?: {[key: string]: boolean};
    isVoided:boolean;
    voidReason?:string
    status:number;
}

export class STGeneralInformationModel implements ISTGeneralInformationModel {
    private cssClass: any = {
        [CONSTANTS.SHIPPING_TICKET_STATUS.OPEN]: { css: 'note-open', icon: 'icon-note-open', label: 'open' },
        [CONSTANTS.SHIPPING_TICKET_STATUS.VOIDED]: { css: 'note-void', icon: 'icon-note-canceled', label: 'retention-order-status-voided' },
        [CONSTANTS.SHIPPING_TICKET_STATUS.CLOSED]: { css: 'note-close', icon: 'icon-note-close', label: 'closed' },
    }

    public id: string = null;
    public creationDate: moment.Moment = null;
    public ticketDate: moment.Moment = null;
    public updatedDate: moment.Moment = null;
    public folio: string = '---';
    public buyerId: number;
    public buyerLocationId: number
    public companyBranchId: number;
    public reasonTransferId: number;
    public companyBranchPointId: number;
    public companyDestination: string = null;
    public companyOrigin: string = null;
    public ticketPrint: boolean = null;
    public ticketStatus: number = null;
    public createdBy: string = null;
    public close: boolean = false;
    public netWeightQQ: number;
    public createdNameUser: string = null;
    public shippingNote: string = null;
    public labelNumber: string = null;
    public updatedNameUser: string = null;
    public buyer: ISTBuyerModel = null;
    public isVoided:boolean = false;
    public options?: {[key: string]: boolean};
    public voidReason: string = ''
    public status: number;
    readonly DECIMALS_IN_GENERAL = JSON.parse(localStorage.getItem('decimals') ).general;


    constructor(item?: any, isAPIData: boolean = false, isFromDetail: boolean = false) {
        if (item) {
            this.id = isAPIData ? item.reception_id : item.id ?? this.id;
            this.buyerId = item.buyer_id ?? this.buyerId;
            this.buyerLocationId = item.buyer_location_id ?? this.buyerLocationId;
            this.companyBranchId = item.company_branch_id ?? this.companyBranchId;
            this.companyBranchPointId = item.company_branch_point_id ?? this.companyBranchPointId;
            this.companyDestination = item.company_name_destination ?? this.companyDestination;
            this.companyOrigin = item.company_name_origin ?? this.companyOrigin;
            this.creationDate = item.created_at ? moment(item.created_at, 'YYYY-MM-DD HH:mm:ss') : this.creationDate;
            this.ticketDate = item.ticket_date ? moment(item.ticket_date, 'YYYY-MM-DD HH:mm:ss') : this.ticketDate;
            this.updatedDate = item.updated_at ? moment(item.updated_at, 'YYYY-MM-DD HH:mm:ss') : this.updatedDate;
            this.reasonTransferId = item.reason_transfer_id ?? this.reasonTransferId;
            this.id = item.shipping_ticket_id ?? this.id;
            this.folio = item.ticket_number ? String(item.ticket_number).padStart(5, '0') : this.folio;
            this.ticketPrint = item.ticket_print ?? this.ticketPrint;
            this.ticketStatus = item.ticket_status ?? this.ticketStatus;
            this.createdBy = item.created_by ?? this.createdBy;
            this.netWeightQQ = item.net_weight_qq ? truncateDecimals(convertLbtoQQ(item.net_weight), this.DECIMALS_IN_GENERAL) : this.netWeightQQ;
            this.createdNameUser = isAPIData ?
                isFromDetail ? item.created_user ? new AppUser(item.created_user).getFullName() : this.updatedNameUser :
                    item.created_name ? item.created_name : this.createdNameUser :
                item.createdNameUser ?? this.createdNameUser;
            this.shippingNote = item.ticket_description ?? this.shippingNote;
            this.labelNumber = item.label_number ?? this.labelNumber;
            this.close = item.ticket_status === CONSTANTS.SHIPPING_TICKET_STATUS.CLOSED;
            this.updatedNameUser = isAPIData ?
                item.updated_user ? new AppUser(item.updated_user).getFullName() : this.updatedNameUser : item.updatedNameUser ?? this.updatedNameUser;
            this.buyer = item.destination?.buyer ? new STBuyerModel(item.destination.buyer) : this.buyer;
            this.options = item.options ?? this.options;
            this.voidReason = item.void_reason ?? this.voidReason
            this.status = item.ticket_status ?? this.status
            this.isVoided = this.isVoid();
        } else {
            Object.assign({}, this);
        }
    }

    get classStatus() {
        return this.cssClass[this.status]
    }

    isVoid(){
        return this.status == CONSTANTS.SHIPPING_TICKET_STATUS.VOIDED;
    }
}
