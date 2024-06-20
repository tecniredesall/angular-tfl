import {ISTCompanyBranchPointModel, STCompanyBranchPointModel} from '../models/st-company-branch-point.model';
import { IPaginator, Paginator } from '../../../shared/models/paginator.model';

export interface ISTCompanyBranchPointPaginatorModel{
    items: ISTCompanyBranchPointModel[];
    isLoading: boolean;
    paginator: IPaginator;
    searchTerm: string;
    initialItems: ISTCompanyBranchPointModel[];
}

export class STCompanyBranchPointPaginatorModel implements ISTCompanyBranchPointPaginatorModel{
    public items: ISTCompanyBranchPointModel[] = [];
    public isLoading: boolean = false;
    public paginator: IPaginator = new Paginator();
    public searchTerm: string = null;
    public initialItems: ISTCompanyBranchPointModel[] = [];

    constructor(item?: any) {
        this.items = item ? item.data.data.map((d: any) => new STCompanyBranchPointModel(d)) : this.items;
        this.paginator = item ? new Paginator(item, true) : this.paginator;
    }

}