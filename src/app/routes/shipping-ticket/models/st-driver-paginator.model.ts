import { IPaginator, Paginator } from '../../../shared/models/paginator.model';
import { ITDriverModel, TDriverModel } from '../../drivers/models/driver.model';

export interface ISTDriverPaginatorModel {
    items: ITDriverModel[];
    isLoading: boolean;
    paginator: IPaginator;
    searchTerm: string;
    initialItems: ITDriverModel[];
}

export class STDriverPaginatorModel implements ISTDriverPaginatorModel {
    public items: ITDriverModel[] = [];
    public isLoading: boolean = true;
    public paginator: IPaginator = new Paginator();
    public searchTerm: string = null;
    public initialItems: ITDriverModel[] = [];


    constructor(item?: any) {
        if (item) {
            this.items = item.hasOwnProperty('data') &&  Array.isArray(item.data) ? item.data.map((d: any) => new TDriverModel(d, true)) : item.data.data.map((d: any) => new TDriverModel(d, true)) ?? this.items;
            this.paginator = item ? new Paginator(item, true) : this.paginator;
        }
    }

}
