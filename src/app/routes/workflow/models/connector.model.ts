import { v4 as uuidv4 } from 'uuid';

export interface IConnectorModel {
    id: string;
    toKey: string;
    fromKey: string;
}

export class ConnectorModel implements IConnectorModel {
    public id: string;
    public toKey: string;
    public fromKey: string;

    constructor(item: any) {
        this.id = item.id ?? item.args.connector.id;
        this.toKey = item.toKey ?? item.args.connector.toKey;
        this.fromKey = item.fromKey ?? item.args.connector.fromKey;
    }
}