export interface ISTReasonTransferModel {
    id: number;
    name: string;
}

export class STReasonTransferModel implements ISTReasonTransferModel {
    public id: number;
    public name: string;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id;
            this.name = item.name ?? this.name;
        }else{
            Object.assign(this, {});
        }
    }
}
