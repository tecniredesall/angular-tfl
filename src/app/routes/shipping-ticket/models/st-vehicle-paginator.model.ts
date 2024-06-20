import { IPaginator, Paginator } from '../../../shared/models/paginator.model';
import { ITrucksModel, TrucksModel } from '../../trucks/models/trucks.model';

export interface ISTVehiclePaginatorModel{
    items: ITrucksModel[];
    isLoading: boolean;
    paginator: IPaginator;
    searchTerm: string;
    initialItems: ITrucksModel[];
}

export class STVehiclePaginatorModel implements ISTVehiclePaginatorModel{
    public items: ITrucksModel[] = [];
    public isLoading: boolean = true;
    public paginator: IPaginator = new Paginator();
    public searchTerm: string = null;
    public initialItems: ITrucksModel[] = [];


    constructor(item?: any) {
        if(item)
        {
            this.items =  item.hasOwnProperty('data') &&  Array.isArray(item.data) ? item.data.map((d: any) => new TrucksModel(d)) : item.data?.hasOwnProperty('data') ? item.data.data.map((d: any) => new TrucksModel(d)) : this.items;
            this.paginator = item ? new Paginator(item, true) : this.paginator;
        }
    }

}
