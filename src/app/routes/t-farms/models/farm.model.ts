import { SealModel } from 'src/app/shared/utils/models/seal.model';

import { convertStringToNumber } from '../../../shared/utils/functions/string-to-number';
import { TBlockModel, TIBlockModel } from '../../t-blocks/models/block.model';
import { IDimensionsModel, DimensionsModel } from '../models/dimensions.model'
import { CONSTANTS } from '../../../shared/utils/constants/constants';
export interface TIFarmModel {
    id: number;
    name: string;
    seller: number;
    address: string;
    federated: boolean;
    blocks: Array<TIBlockModel>;
    seals: Array<SealModel>;
    cityId: string;
    city: string;
    countryId: string;
    country: string;
    stateId: string;
    state: string;
    dimensions: Array<IDimensionsModel>;
    measurementUnit: string;
    status: boolean;
    totalBlocksByFarm: number;
    villageId: string;
    village: string;
    extension: number;
    extensionUnit: any;
    wastelandArea: number;
    wastelandUnit: any;
    productiveUnit: any;
    productiveArea: number;
    extensionUnitId: string;
    federatedId: string;
    code?: string;
    zipCode?: string;
}

export class TFarmModel implements TIFarmModel {
    public id: number = null;
    public name: string = '';
    public seller: number = null;
    public address: string = null;
    public federated = false;
    public blocks: Array<TIBlockModel> = [];
    public seals: Array<SealModel> = [];
    public cityId: string = null;
    public countryId: string = null;
    public stateId: string = null;
    public dimensions: Array<IDimensionsModel> = [];
    public measurementUnit: string = '';
    public status: boolean = false;
    public totalBlocksByFarm: number = 0;
    public villageId: string = null;
    public extension: number = null;
    public extensionUnit: string = null;
    public wastelandArea: number = null;
    public wastelandUnit: string = null;
    public productiveUnit: string = null;
    public productiveArea: number = null;
    public city: string = null;
    public country: string = null;
    public state: string = null;
    public village: string = null;
    public extensionUnitId: string = null;
    public federatedId: string = null;
    public code?: string = null;
    public zipCode?: string = null;
    constructor(item?: any, fromFederated = false) {
        if (item) {
            this.id = item.id ?? this.id;
            this.name = item.name ?? this.name;
            this.seller = item.seller ?? this.seller;
            this.address = item.address ?? this.address;
            this.blocks = item.blocks ?? this.blocks;
            this.federated = item.federated ?? this.federated;

            this.cityId = item.city_id ?? this.cityId;
            this.countryId = item.country_id ?? this.countryId;
            this.stateId = item.state_id ?? this.stateId;
            this.dimensions = item.dimensions ? item.dimensions.map((d) => new DimensionsModel(d)) : this.dimensions;
            this.measurementUnit = item.measurement_unit ?? this.measurementUnit;
            this.status = item.status ?? this.status;
            this.totalBlocksByFarm = item.totalBlocksByFarm ?? this.totalBlocksByFarm;
            this.villageId = item.village_id ?? this.villageId;
            this.seals =
            item.sealsByFarm?.certifications ?? item.seals ?? this.seals;
            if (fromFederated) {
                this.extension = item.extension ?? this.extension;
                this.productiveArea = item.productive_area ?? this.productiveArea;
                this.wastelandArea = item.wasteland_area ?? this.wastelandArea;
                this.extensionUnit = item.measurement_unit ?? this.extensionUnit;
                this.code = item.code ?? this.code;
                this.blocks = item.blocks ? (item.blocks as Array<any>).map((b: any) => new TBlockModel(b, b['federated_id'])) : this.blocks;
            } else {
                const prodArea = this.dimensions.find(x => x.name === CONSTANTS.DIMENSIONS_AREAS.PRODUCTIVE_AREA_KEY);
                const extensionArea = this.dimensions.find(x => x.name === CONSTANTS.DIMENSIONS_AREAS.EXTENSION_AREA_KEY);
                const wastelandArea = this.dimensions.find(x => x.name === CONSTANTS.DIMENSIONS_AREAS.WASTELAND_AREA_KEY);
                this.productiveArea = prodArea ? prodArea.value : this.productiveArea;
                this.extension = extensionArea ? extensionArea.value : this.extension;
                this.wastelandArea = wastelandArea ? wastelandArea.value : this.wastelandArea;
                for (let b = 0; b < this.blocks.length; b++) {
                    this.blocks[b] = new TBlockModel(this.blocks[b]);
                }

            }
            this.state = item.state ?? this.state;
            this.country = item.country ?? this.country;
            this.city = item.city ?? this.city;
            this.village = item.village ?? this.village;
            this.federatedId = item.federated_id ?? this.federatedId;
            this.zipCode = item.zip_code ?? this.zipCode;
        } else {
            Object.assign(this, {});
        }

    }

}
export class FarmRequestFromBlockFederatedModel {
    public id: string = null;
    public name: string = null;
    public extension: number = null;
    public measurement_type_id: number = null;
    public measurement_unit_id: string = null;
    public country_id: string = null;
    public state_id: string = null;
    public city_id: string = null;
    public village_id: string = null;
    public wasteland_area: number = null;
    public productive_area: number = null;
    public seller: number = null;
    public address: string = null;
    public federated_id: string = null;
    constructor(item: TFarmModel, sellerId: number, extensionUnit: string) {
        if (item) {
            this.name = item.name ?? this.name;
            this.extension = item.extension ?? this.extension;
            this.measurement_type_id = 2;
            this.measurement_unit_id = extensionUnit;
            this.country_id = item.countryId ?? this.country_id;
            this.state_id = item.stateId ?? this.state_id;
            this.city_id = item.cityId ?? this.city_id;
            this.village_id = item.villageId ?? this.village_id;
            this.address = item.address ?? this.address;
            this.wasteland_area = item.wastelandArea ?? this.wasteland_area;
            this.productive_area = item.productiveArea ?? this.productive_area;
            this.seller = sellerId;
            this.federated_id = item.federatedId;

        } else {
            Object.assign(this, {});
        }
    }
}
