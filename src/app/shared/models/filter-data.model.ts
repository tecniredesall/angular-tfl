import { filter } from 'rxjs/operators';
import * as moment from "moment";
import { ITRSealImage } from "../utils/models/seal-image.model";
import { IProducerModel } from 'src/app/shared/models/producer.model';
import { IUserModel, UserModel } from "./user.model";
import { IWNCharacteristicModel, WNCharacteristicModel } from "src/app/routes/weight-note/models/wn-characteristic.model";
// Date range
export interface ITRFilterDate {
    start: moment.Moment;
    end: moment.Moment;
}

export class TRFilterDate implements ITRFilterDate {
    public start: moment.Moment = null;
    public end: moment.Moment = null;

    constructor(item?: ITRFilterDate) {
        if (item) {
            this.start = item.start ? moment(item.start) : this.start;
            this.end = item.end ? moment(item.end) : this.end;
        }
        else {
            Object.assign(this, {});
        }
    }
}

// Seals
export interface ITRFilterSeals {
    selected: Array<string>;
    lookups: Array<ITRSealImage>;
}

export class TRFilterSeals implements ITRFilterSeals {
    public selected: Array<string> = [];
    public lookups: Array<ITRSealImage> = [];

    constructor(item?: ITRFilterSeals) {
        if (item) {
            this.selected = item.selected ? [...item.selected] : this.selected;
            this.lookups = item.lookups ? [...item.lookups] : this.lookups;
        }
        else {
            Object.assign(this, {});
        }
    }
}


export interface FilterButtonCssModel{
    icon?:string
    cssButton?:string
    label?:string
}
export interface FilterObjectStatus {
    name?:string
    status?:number
    order?: number
    selected :boolean
    cssButton? : FilterButtonCssModel
}

export class ITRFilterStatusModel implements FilterObjectStatus {

    order?: number;
    status?: any;
    cssButton? : FilterButtonCssModel
    constructor(item) {
            this.status = item.status ?? this.status
            this.order = item.order
            this.cssButton = item.cssButton
    }
    name?: string;
    selected: boolean;
}

export class FilterSectionModel{
    sectionName:string
    filters?:Array<ITRFilterStatusModel> = []
    constructor(item){
        this.sectionName = item.sectionName ?? this.sectionName
    this.filters = item.filters ?? this.filters
    }

    hasFilterSelect(){
        return this.filters?.some((item) => item.selected)
    }

    get idFilters(){
        return this.filters?.map((item) => item.selected)
    }
}





//Retention-order-Status
export interface ITRFilterRetentionOrderStatus {

    lookups: { [key: string]: number , order?:number };
    order?: number;
    status?: any;
}
export class TRFilterRetentionOrderStatus implements ITRFilterRetentionOrderStatus {

    public lookups: { [key: string ]: number } = {};
    public order: number = 0;
    public status: [ { name?:string , status?:number , order?: number , selected :boolean, cssClass?: { icon?:string , cssButton?:string, label?:string}}];

    constructor(item?: ITRFilterRetentionOrderStatus) {
        if (item) {
            if (item.lookups) {
                Object.assign(this.lookups,item.lookups);
            }
            this.status = item.status ?? this.status
            this.order = item.order
        }
        else {
            Object.assign(this, {});
        }
    }
}


//Production-Status
export interface ITRFilterProductionStatus {
    selected: number[];
    lookups: { [key: string]: number; };
}
export class TRFilterProductionStatus implements ITRFilterProductionStatus {
    public selected: number[] = [];
    public lookups: { [key: string]: number } = {};

    constructor(item?: ITRFilterProductionStatus) {
        if (item) {
            this.selected = item.selected ? [...item.selected] : this.selected;
            if (item.lookups) {
                Object.assign(this.lookups, item.lookups);
            }
        }
        else {
            Object.assign(this, {});
        }
    }
}

// Status
export interface ITRFilterStatus {
    selected: number[];
    lookups: { [key: string]: number; };
}

export class TRFilterStatus implements ITRFilterStatus {
    public selected: number[] = [];
    public lookups: { [key: string]: number } = {};

    constructor(item?: ITRFilterStatus) {
        if (item) {
            this.selected = item.selected ? [...item.selected] : this.selected;
            if (item.lookups) {
                Object.assign(item.lookups, this.lookups);
            }
        }
        else {
            Object.assign(this, {});
        }
    }
}

// Producers
export interface ITRFilterProducers {
    selected: IProducerModel;
    lookups: Array<IProducerModel>;
}

export class TRFilterProducers implements ITRFilterProducers {
    public selected: IProducerModel = null;
    public lookups: Array<IProducerModel> = [];

    constructor(item?: ITRFilterProducers) {
        if (item) {
            this.selected = item.selected ?? this.selected;
            this.lookups = item.lookups ? [...item.lookups] : this.lookups;
        }
        else {
            Object.assign(this, {});
        }
    }
}

export interface TRFilterUser {
    users?: IUserModel[];
    label?:string;
    required?: boolean;
}

export class TRFilterUserModel implements TRFilterUser {
    public users?: IUserModel[] = null;
    public label?: string;
    public required?: boolean = false;

    constructor(item?: TRFilterUser) {
        if (item) {
            this.users = item.users ? item.users.map((u) => new UserModel(u)) : this.users;
            this.label = item.label ?? this.label ?? 'user-wn-author'
            this.required = item.required ?? this.required
        }
        else {
            Object.assign(this, {});
        }
    }
}


// Filter object
export interface ITRFilter {
    date: ITRFilterDate;
    seals: ITRFilterSeals;
    status: ITRFilterStatus;
    producers?: ITRFilterProducers;
    sealsRequired?: boolean;
    producersRequired?: boolean;
    productionStatus?: ITRFilterProductionStatus;
    usersRequired?: boolean;
    paymentStatus?: ITRFilterProductionStatus;
    users?: TRFilterUser;
    characteristics?: IWNCharacteristicModel[];
    receivingNoteStatus?: ITRFilterStatus;
    weightNoteStatus?: ITRFilterStatus;
    retentionOrderStatus?: ITRFilterRetentionOrderStatus
    isFirstTime?:boolean;
    purchaseOrderStatusWN?: ITRFilterProductionStatus;
    shippingTicketStatus?: FilterSectionModel
}

export class TRFilter implements ITRFilter {
    public date: ITRFilterDate = new TRFilterDate();
    public seals: ITRFilterSeals = new TRFilterSeals();
    public status: ITRFilterStatus = null;
    public producers?: ITRFilterProducers = new TRFilterProducers();
    public sealsRequired?: boolean = true;
    public producersRequired?: boolean = false;
    public productionStatus:ITRFilterProductionStatus = null;
    public usersRequired?: boolean = false;
    public characteristics: IWNCharacteristicModel[];
    public paymentStatus:ITRFilterProductionStatus = null
    public receivingNoteStatus: ITRFilterStatus = null;
    public weightNoteStatus: ITRFilterStatus = null;
    public users: TRFilterUser;
    public retentionOrderStatus: ITRFilterRetentionOrderStatus = null;
    public isFirstTime:boolean = true
    public purchaseOrderStatusWN: ITRFilterProductionStatus = null;
    public shippingTicketStatus?: FilterSectionModel
    constructor(item?: ITRFilter, producersRequired: boolean = false, usersRequired: boolean = false) {
        this.producersRequired = producersRequired;
        this.usersRequired = usersRequired;
        if (item) {
            this.date = item.date ? new TRFilterDate(item.date) : this.date;
            this.seals = item.seals ? new TRFilterSeals(item.seals) : this.seals;
            this.status = item.status ? new TRFilterStatus(item.status) : this.status;
            this.producers = item.producers ? new TRFilterProducers(item.producers) : this.producers;
            this.productionStatus = item.productionStatus ? new TRFilterStatus(item.productionStatus) : this.productionStatus;
            this.characteristics = item.characteristics
                ? item.characteristics.map(data => new WNCharacteristicModel(data))
                : this.characteristics;
            this.paymentStatus = item.paymentStatus ? new TRFilterStatus(item.paymentStatus) : this.paymentStatus;
            this.receivingNoteStatus = item.receivingNoteStatus ? new TRFilterStatus(item.receivingNoteStatus) : this.receivingNoteStatus;
            this.weightNoteStatus = item.weightNoteStatus ? new TRFilterStatus(item.weightNoteStatus) : this.weightNoteStatus;
            this.retentionOrderStatus = item.retentionOrderStatus ? new TRFilterRetentionOrderStatus(item.retentionOrderStatus) : this.retentionOrderStatus;
            this.paymentStatus = item.paymentStatus ? new TRFilterStatus(item.paymentStatus) : this.paymentStatus;
            this.users = item.users ? new TRFilterUserModel(item.users ) : this.users;
            this.characteristics = item.characteristics
                ? item.characteristics.map(data => new WNCharacteristicModel(data))
                : this.characteristics;
            this.isFirstTime = item.isFirstTime ?? true
            this.receivingNoteStatus = item.receivingNoteStatus ? new TRFilterStatus(item.receivingNoteStatus) : this.receivingNoteStatus;
            this.weightNoteStatus = item.weightNoteStatus ? new TRFilterStatus(item.weightNoteStatus) : this.weightNoteStatus;
            this.purchaseOrderStatusWN = item.purchaseOrderStatusWN ? new TRFilterProductionStatus(item.purchaseOrderStatusWN) : this.weightNoteStatus;
            this.shippingTicketStatus = item.shippingTicketStatus ? new FilterSectionModel(item.shippingTicketStatus) : this.shippingTicketStatus;
        }
    }


    public countSelectedFilters(){
        let countFilter = 0;
        if (this.date.start || this.date.end) {
            countFilter = countFilter + 1;
        }
        if (this.seals.selected.length > 0) {
            countFilter = countFilter + 1;
        }
        if (this.producers.selected) {
            countFilter = countFilter + 1;
        }
        if (this.users?.users?.length > 0) {
            countFilter = countFilter + 1;
        }
        if (this.characteristics?.length > 0) {
            countFilter = countFilter + 1;
        }
        if (this.purchaseOrderStatusWN?.selected.length > 0) {
            countFilter = countFilter + 1;
        }
        if (this.retentionOrderStatus?.status?.some(x => x.selected == true)) {
            countFilter = countFilter + 1;
        }
        return countFilter
    }


}
