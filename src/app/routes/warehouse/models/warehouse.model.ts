import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ISubtankModel } from './subtank.model'

export interface IWarehouseDataDeleteModel {
    fromEditView: boolean;
    isTank: boolean;
    tankName: string;
    tankId: number;
    totalVirtualTanks?: number;
    totalStorage?: number;
    subtankId?: string;
    subtankName?: string;
    amount?: number;
}

export interface IWarehouseModel {
    id: number;
    name: string;
    storageMin: number;
    storageMax: number;
    totalStorage: number;
    commodityName: string;
    totalVirtualTanks: number;
    collapsed?: boolean;
    subtanks?: ISubtankModel[];
    isLoadingSubtanks?: boolean;
    color?: string;
    externalId: number;
    idTypeTank: number;
    tankTypeId: number;
    commodityId: number;
    totalStockIn: number;
}

export interface IWarehouseRequestModel {
    name: string;
    tank_id: number;
    type_id: number;
    warehouse_id: number;
    commodity_id: number;
}

export class WarehouseModel implements IWarehouseModel {
    public id: number;
    public name: string;
    public storageMin: number;
    public storageMax: number;
    public totalStorage: number;
    public commodityName: string;
    public totalVirtualTanks: number;
    public collapsed: boolean;
    public subtanks: ISubtankModel[];
    public isLoadingSubtanks: boolean;
    public color?: string;
    public externalId: number;
    public idTypeTank: number;
    public tankTypeId: number;
    public commodityId: number;
    public totalStockIn: number;

    constructor(item?: any, isFromApi = true) {
        this.id = isFromApi ? item.tid : item.id;
        this.name = isFromApi ? item.tname : item.name;
        this.storageMin = isFromApi ? item.avgLow : item.storageMin;
        this.storageMax = isFromApi ? item.avgHight : item.storageMax;
        this.totalStorage = isFromApi ? (item && item.totalStorage ? item.totalStorage : 0) : item.totalStorage;
        this.commodityName = isFromApi ? item.cname : item.commodityName;
        this.totalVirtualTanks = item.totalVirtualTanks;
        this.collapsed = true;
        this.subtanks = [];
        this.isLoadingSubtanks = false;
        this.color = '';
        this.externalId = isFromApi ? Number(item.external_id) : item.externalId;
        this.idTypeTank = item.idTypeTank ?? item.tankTypeId ?? this.idTypeTank;
        this.tankTypeId = item.idTypeTank ?? item.tankTypeId ?? this.idTypeTank;
        this.commodityId = item.commodity_id ?? item.commodityId ?? item.commodity ?? this.commodityId
        this.totalStockIn = convertLbtoQQ(convertStringToNumber(item.totalStockIn)) ?? this.totalStockIn
    }

    public request(data: any): IWarehouseRequestModel {

        let request: IWarehouseRequestModel = {
            name: this.name,
            tank_id: data.tankId,
            type_id: this.idTypeTank,
            warehouse_id: this.externalId ?? null,
            commodity_id: this.commodityId ?? null
        }
        return request
    }

    public get DescriptionTankType() {
        switch (this.idTypeTank) {
            case CONSTANTS.WAREHOUSE_TYPE.PHYSICAL:
                return "tank-type-physical"
                break;
            case CONSTANTS.WAREHOUSE_TYPE.VIRTUAL:
                return "tank-type-virtual"
                break;
            default:
                break;
        }
        return ''
    }

    public get canChangeTypeTank(): boolean {
        return this.totalStorage <= 0
    }

    public isVirutalTank(): boolean {
        return this.idTypeTank == CONSTANTS.WAREHOUSE_TYPE.VIRTUAL
    }
}

