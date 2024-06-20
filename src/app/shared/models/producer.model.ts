export class IProducerModel {
    id: number;
    name: string;
    paternalLast: string;
    maternalLast: string;
    fullName: string;
}

export class ProducerModel implements IProducerModel{
    public id: number = null;
    public name: string = '';
    public paternalLast: string = '';
    public maternalLast: string = '';
    public fullName: string = null;

    constructor(item?: any) {
        this.id = item.id ?? this.id;
        this.name = item.name ?? this.name;
        this.paternalLast = item.paternal_last ?? this.paternalLast;
        this.maternalLast = item.maternal_last ?? this.maternalLast;
        this.fullName = `${this.name} ${this.paternalLast} ${this.maternalLast}`
    }
}
