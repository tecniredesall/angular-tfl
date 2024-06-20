export interface IUserModel {
    address: string;
    branchId: number;
    city: string;
    email: string;
    id: number;
    lastName: string;
    fullName: string;
    mstatus: number;
    name: string;
    phone: string;
    sourceID: string;
    state: string;
    status: number;
}

export class UserModel implements IUserModel {
    public address: string = '';
    public branchId: number = 0;
    public city: string = '';
    public email: string = '';
    public id: number = 0;
    public lastName: string = '';
    public fullName: string = '';
    public mstatus: number = 0;
    public name: string = '';
    public phone: string = '';
    public sourceID: string = '';
    public state: string = '';
    public status: number = 0;

    constructor(item?) {
        if (item) {
            this.address = item.address ?? this.address;
            this.branchId = item.branch_id ?? item.branchId ?? this.branchId;
            this.city = item.city ?? this.city;
            this.email = item.email ?? this.email;
            this.id = item.id ?? this.id;
            this.lastName = item.lastname ?? this.lastName;
            this.mstatus = item.mstatus ?? this.mstatus;
            this.name = item.name ?? this.name;
            this.phone = item.phone ?? this.phone;
            this.sourceID = item.source_id ?? item.sourceID ?? this.sourceID;
            this.state = item.state ?? this.state;
            this.status = item.status ?? this.status;
            this.fullName = `${this.name} ${this.lastName}`;
        } else {
            Object.assign(this, {});
        }
    }
}
