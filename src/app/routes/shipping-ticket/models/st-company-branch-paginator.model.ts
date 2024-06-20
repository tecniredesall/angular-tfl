import {ISTCompanyBranchModel, STCompanyBranchModel} from '../models/st-company-branch.model';
import { IPaginator, Paginator } from '../../../shared/models/paginator.model';

export interface ISTCompanyBranchPaginatorModel{
    items: ISTCompanyBranchModel[];
    isLoading: boolean;
    paginator: IPaginator;
    searchTerm: string;
    initialItems: ISTCompanyBranchModel[];
}

export class STCompanyBranchPaginatorModel implements ISTCompanyBranchPaginatorModel{
    public items: ISTCompanyBranchModel[] = [];
    public isLoading: boolean = true;
    public paginator: IPaginator = new Paginator();
    public searchTerm: string = null;
    public initialItems: ISTCompanyBranchModel[] = [];

    constructor(item?: any) {
        this.items = item ? item.data.data.map((d: any) => new STCompanyBranchModel(d)) : this.items;
        this.paginator = item ? new Paginator(item, true) : this.paginator;
    }

}