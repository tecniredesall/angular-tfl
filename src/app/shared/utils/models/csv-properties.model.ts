export interface ICSVProperty {
    property: string;
    column: string;
}

export class CSVProperty implements ICSVProperty {
    public property = '';
    public column = '';

    constructor(item: Partial<ICSVProperty> = {}) {
        Object.assign(this, item);
    }
}
