import { IPaginator, Paginator } from '../../../shared/models/paginator.model';
import { ISTBuyerModel, STBuyerModel } from './st-buyer.model';

export interface ISTBuyerPaginatorModel{
    items: ISTBuyerModel[];
    isLoading: boolean;
    paginator: IPaginator;
    searchTerm: string;
    initialItems: ISTBuyerModel[];
}

export class STBuyerPaginatorModel implements ISTBuyerPaginatorModel{
    public items: ISTBuyerModel[] = [];
    public isLoading: boolean = true;
    public paginator: IPaginator = new Paginator();
    public searchTerm: string = null;
    public initialItems: ISTBuyerModel[] = [];


    constructor(item?: any) {
        this.items = item ? item.data.data.map((d: any) => new STBuyerModel(d)) : this.items;
        this.paginator = item ? new Paginator(item, true) : this.paginator;
    }

}