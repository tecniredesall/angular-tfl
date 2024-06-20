import { TIProducerModel, TProducerModel } from 'src/app/shared/models/sil-producer';

export interface IProducerFederatedModel {
    federatedId: string;
    apps: TIProducerModel[];
}

export class ProducerFederatedModel implements  IProducerFederatedModel{
    public federatedId: string;
    public apps: TIProducerModel[] = [];

    constructor(item: any) {
        if(item) {
            this.federatedId = item.federated_id ?? item.federatedId;
            this.apps = item.apps ? item.apps.map(app => new TProducerModel(app)) : this.apps;
        }
    }
}