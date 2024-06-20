export interface ISuperiorProcessModel {
    id: string;
}

export interface ISuperiorProcessRequestModel {
    superior_process_id: string;
}

export class SuperiorProcessModel implements ISuperiorProcessModel {
    public id: string;

    constructor(item: any, isFromApi = false) {
        this.id = isFromApi ? (item.id ?? item.dataKey) : item.superior_process_id
    }

    public getRequet() {
        let request: ISuperiorProcessRequestModel = {
            superior_process_id: this.id
        }
        return request
    }
}