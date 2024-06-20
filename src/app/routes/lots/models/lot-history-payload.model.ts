export interface ILotHistoryPayloadModel {
    id: string;
    processName: string;
}

export class LotHistoryPayloadModel implements ILotHistoryPayloadModel {
    public id: string = '';
    public processName: string = '';

    constructor(item?: any) {
        if(item) {
            this.id = item.id;
            this.processName = item.process_name;
        }
    }
}