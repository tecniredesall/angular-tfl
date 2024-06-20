export interface ISortMachineListenerEvent {
    code?: string;
    total?: number;
    bad?: number;
    speed?: number;
    exitRatio?: number;
    impurityRatio?: number;
    defectiveRatio?: number;
    periodProduct?: Array<number>;
}

export class SortMachineListenerEvent implements ISortMachineListenerEvent {
    public code?: string;
    public total?: number;
    public bad?: number;
    public speed?: number;
    public exitRatio?: number;
    public impurityRatio?: number;
    public defectiveRatio?: number;
    public periodProduct?: Array<number>;

    constructor(item?: any) {
        if (item) {
            this.code = item.code ?? this.code;
            this.total = item.total ?? this.total;
            this.bad = item.bad ?? this.bad;
            this.speed = item.speed ?? this.speed;
            this.exitRatio = item.exitRatio ?? this.exitRatio;
            this.impurityRatio = item.ImpurityRatio ?? this.impurityRatio;
            this.defectiveRatio = item.DefectiveRatio ?? this.defectiveRatio;
            this.periodProduct = item.periodProduct ?? this.periodProduct;
        }
        else {
            Object.assign(this, {});
        }
    }
}