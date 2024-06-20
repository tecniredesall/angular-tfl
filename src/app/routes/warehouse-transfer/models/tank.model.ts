export interface ITankModel {
    id: number;
    name: string;
    description: string;
    capacity: string;
    commodity: number;
    stock: string;
    stockLb: string;
    stockLbd: string;
    warnMin: string;
    warnMax: string;
    inRevertProcess: number;
    status: number;
    externalId: string;
    sourceId: string;
    branchId: string;
    tankTypeId: number;
}

export class TankModel implements ITankModel {
    public id: number = 0;
    public name: string = '';
    public description: string = '';
    public capacity: string = '';
    public commodity: number = 0;
    public stock: string = '';
    public stockLb: string = '';
    public stockLbd: string = '';
    public warnMin: string = '';
    public warnMax: string = '';
    public inRevertProcess: number = 0;
    public status: number = 0;
    public externalId: string = '';
    public sourceId: string = '';
    public branchId: string = '';
    public tankTypeId: number = 0;

    constructor(item?: any) {
        if (item) {
            this.id = item.id ?? this.id
            this.name = item.name ?? this.name
            this.description = item.description ?? this.description
            this.capacity = item.capacity ?? this.capacity
            this.commodity = item.commodity ?? this.commodity
            this.stock = item.stock ?? this.stock
            this.stockLb = item.stock_lb ?? item.stockLb ?? this.stockLb
            this.stockLbd = item.stock_lbd ?? item.stockLbd ?? this.stockLbd
            this.warnMin = item.warn_min ?? item.warnMin ?? this.warnMin
            this.warnMax = item.warn_max ?? item.warnMax ?? this.warnMax
            this.inRevertProcess = item.in_revert_process ?? item.inRevertProcess ?? this.inRevertProcess
            this.status = item.status ?? this.status
            this.externalId = item.external_id ?? item.externalId ?? this.externalId
            this.sourceId = item.source_id ?? item.sourceId ?? this.sourceId
            this.branchId = item.branch_id ?? item.branchId ?? this.branchId
            this.tankTypeId = item.tank_type_id ?? item.tankTypeId ?? this.tankTypeId
        } else {
            Object.assign(this, {});
        }
    }
}
