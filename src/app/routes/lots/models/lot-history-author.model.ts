export interface ILotHistoryAuthorModel {
    id: string;
    email: string;
    fullName: string;
}

export class LotHistoryAuthorModel implements ILotHistoryAuthorModel {
    public id: string = '';
    public email: string = '';
    public fullName: string = '';

    constructor(item?: any) {
        if(item) {
            this.id = item.id;
            this.email = item.email;
            this.fullName = item.full_name;
        }
    }
}