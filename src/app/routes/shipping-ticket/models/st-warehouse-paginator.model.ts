import { IPaginator, Paginator } from '../../../shared/models/paginator.model';
import { IWNContainerModel, WNContainerModel } from '../../weight-note/models/wn-container.model';

export interface ISTWarehousePaginatorModel{
    items: IWNContainerModel[];
    isLoading: boolean;
    paginator: IPaginator;
    searchTerm: string;
    initialItems: IWNContainerModel[];
}

export class STWarehousePaginatorModel implements ISTWarehousePaginatorModel{
    public items: IWNContainerModel[] = [];
    public isLoading: boolean = false;
    public paginator: IPaginator = new Paginator();
    public searchTerm: string = null;
    public initialItems: IWNContainerModel[] = [];

    constructor(item?: any) {
        this.items = item ? item.data.data.map((d: any) => new WNContainerModel(d)) : this.items;
        this.paginator = item ? new Paginator(item, true) : this.paginator;
    }

}