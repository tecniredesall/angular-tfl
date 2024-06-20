export interface ISTBuyerLocationModel{
    id: number;
    address: string;
}

export class STBuyerLocationModel implements ISTBuyerLocationModel{
    public id: number;
    public address: string;

    constructor(item: any){
        this.id = item.id ?? this.id;
        this.address = item.address ?? this.address;
    }
}