export interface IRequestRelatedModel {
    producer_id: number;
    linked_producer_id: number;
}

export class RequestRelatedModel implements IRequestRelatedModel {
    public producer_id: number;
    public linked_producer_id: number;

    constructor(producerId: number, id: number) {
        this.producer_id = producerId;
        this.linked_producer_id = id;
    }
}
