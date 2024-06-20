export interface IWorkerSyncRequest {
    action: string;
    request_payload: any;
}

export class WorkerSyncRequest implements IWorkerSyncRequest {
    public action: string = null;
    public request_payload: any = null;

    constructor(action: string) {
        this.action = action ?? this.action;
        this.request_payload = {};
    }
}