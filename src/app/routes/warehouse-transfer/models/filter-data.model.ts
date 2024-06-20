import * as moment from 'moment';
import { UserModel } from 'src/app/shared/models/user.model';
import { STBuyerModel } from '../../shipping-ticket/models/st-buyer.model';
import { STCompanyBranchModel } from '../../shipping-ticket/models/st-company-branch.model';
import { WNContainerModel } from '../../weight-note/models/wn-container.model';

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
        } else {
            Object.assign(this, {});
        }
    }
}

// Status
export interface ITRFilterStatus {
    selected: number[];
    lookups: { [key: string]: number };
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
        } else {
            Object.assign(this, {});
        }
    }
}

// Filter object
export interface ITRFilter {
    date: ITRFilterDate;
    status: ITRFilterStatus;
    origin: STCompanyBranchModel[];
    destination: STCompanyBranchModel[];
    users: UserModel[];
    warehouses: WNContainerModel[];
}

export class TRFilter implements ITRFilter {
    public date: ITRFilterDate = new TRFilterDate();
    public status: ITRFilterStatus = null;
    public origin: STCompanyBranchModel[];
    public destination: STCompanyBranchModel[];
    public users: UserModel[];
    public warehouses: WNContainerModel[];

    constructor(item?: ITRFilter, producersRequired: boolean = false) {
        if (item) {
            this.date = item.date ? new TRFilterDate(item.date) : this.date;
            this.status = item.status
                ? new TRFilterStatus(item.status)
                : this.status;
            this.origin = item.origin
                ? item.origin.map(data => new STCompanyBranchModel(data))
                : this.origin;
            this.destination = item.destination
                ? item.destination.map(data => new STCompanyBranchModel(data))
                : this.destination;
            this.users = item.users
                ? item.users.map(data => new UserModel(data))
                : this.users;
            this.warehouses = item.warehouses
                ? item.warehouses.map(data => new WNContainerModel(data))
                : this.warehouses;
        } else {
            Object.assign(this, {});
        }
    }
}
