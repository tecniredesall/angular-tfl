import { IFarmBlock } from './farm-block';

export interface IFarm {
    id: number;
    name: string;
    seller: number;
    address: string;
    status: number;
    extension: string;
    totalBlocksByFarm: number;
    blocks: IFarmBlock[];
}
