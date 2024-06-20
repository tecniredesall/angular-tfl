export interface ILotProcessModel {
    id: string;
    name: string;
    color: string;
    level: number;
}

export class LotProcessModel implements ILotProcessModel {
    public id: string = null;
    public name: string = '';
    public color: string = '';
    public level: number = null;

    constructor(item?: any, isAPIData: boolean = false) {
        if (item) {
            this.id = isAPIData ? (item.process_id ?? this.id) : (item.processId ?? this.id);
            this.name = isAPIData ? (item.process_name ?? this.name) : (item.processName ?? this.name);
            this.color = isAPIData ? (item.style.replace('stroke: ', '') ?? this.color) : (item.style ?? this.color);
            this.level = item.level ?? this.level;
        }
        else {
            Object.assign(this, {});
        }
    }
}
