import { IPaginator, Paginator } from '../../../shared/models/paginator.model';
import { ISTBuyerLocationModel, STBuyerLocationModel } from './st-buyer-location.model';

export interface ISTBuyerLocationPaginatorModel{
    items: ISTBuyerLocationModel[];
    isLoading: boolean;
    paginator: IPaginator;
    searchTerm: string;
    initialItems: ISTBuyerLocationModel[];
}

export class STBuyerLocationPaginatorModel implements ISTBuyerLocationPaginatorModel{
    public items: ISTBuyerLocationModel[] = [];
    public isLoading: boolean = false;
    public paginator: IPaginator = new Paginator();
    public searchTerm: string = null;
    public initialItems: ISTBuyerLocationModel[] = [];

    constructor(item?: any) {
        this.items = item ? item.data.data.map((d: any) => new STBuyerLocationModel(d)) : this.items;
        this.paginator = item ? new Paginator(item, true) : this.paginator;
    }

}