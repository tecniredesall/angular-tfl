import * as moment from "moment";
import { CONSTANTS } from "src/app/shared/utils/constants/constants";
import { WNGeneralInformationModel } from "../../weight-note/models/wn-general-information-model.model";
import { WNWeightModel } from "../../weight-note/models/wn-weight.model";

export interface RetentionOrderWeightNotes {
    createdDate: moment.Moment;
    folio: string;
    id: string;
    transformationType: string;
    sacks: string;
    purcharseOrderId: string;
    netWeightOut: number;
    goldNetWeightOut: number;
    price: number;
    status: number;
    createdBy: string;
    selected: boolean;
}

export class RetentionOrderWeightNotesModel implements RetentionOrderWeightNotes {
    private cssClass: any = {
        [CONSTANTS.PURCHASE_ORDER_STATUS.CREATED]: { css: 'orders-status__status--unsettled', icon: 'icon-unsettled', label: 'unsettled' },
        [CONSTANTS.PURCHASE_ORDER_STATUS.LIQUIDATE]: { css: 'orders-status__status--settled', icon: 'icon-note-open', label: 'purchase-order-liquidated' },
    }

    createdDate: moment.Moment;
    id: string;
    transformationType: string;
    sacks: string;
    purcharseOrderId: string;
    netWeightOut: number;
    goldNetWeightOut: number;
    price: number;
    status: number;
    createdBy: string;
    styles: any
    selected: boolean = false;
    folio: string;
    constructor(item) {
        if (item) {
            this.createdDate = item.created_at ? moment(item.created_at, 'YYYY-MM-DD HH:mm:ss') : this.createdDate
            this.id = item.id ?? this.id
            this.folio = item.folio ?? this.folio
            this.transformationType = item.transformation_type ?? this.transformationType
            this.sacks = item.sacks ?? this.sacks
            this.purcharseOrderId = item.purchase_order_folio ?? this.purcharseOrderId
            this.netWeightOut = item.net_weight_out ?? this.netWeightOut
            this.goldNetWeightOut = item.gold_weight_out ?? this.goldNetWeightOut
            this.price = item.price ?? this.price
            this.status = item.payment_status ?? this.status
            this.styles = this.status ? this.creatClassStatus() : undefined
            this.selected = item?.selected
            this.createdBy = item?.created_by ?? this.createdBy
        }
    }


    creatClassStatus() {
        return this.cssClass[this.status]
    }

    createFullName(user) {
        return `${user.name ?? ''}  ${user.lastname ?? ''}`

    }

    get PurchaseOrder() {
        return this.purcharseOrderId && this.purcharseOrderId.length > 0 ? this.purcharseOrderId : '---';
    }

    get existPurchaseOrder() {
        return this.purcharseOrderId && this.purcharseOrderId.length > 0;

    }


}
