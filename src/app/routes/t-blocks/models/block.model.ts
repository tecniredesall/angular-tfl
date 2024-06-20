import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { SealModel } from 'src/app/shared/utils/models/seal.model';

import { TFarmModel } from '../../t-farms/models/farm.model';
import { CoffeeVarietyModel } from './coffee-variety.model';
import { ShadeVarietyModel } from './shade-variety.model';
import { SoilTypeModel } from './soil-type.model';

export interface TIBlockModel {
    id: string;
    name: string;
    farmId: number;
    height: number;
    extension: number;
    extensionMeasurementUnitId: string;
    measuremnetUnitName: string;
    varietyId: string;
    seller: number;
    farmName: string;
    varietyName: string;
    federated: boolean;
    seals: Array<SealModel>;
    countryId: string;
    country: string;
    stateId: string;
    state: string;
    cityId: string;
    city: string;
    townId: string;
    town: string;
    address: string;
    latitude: number;
    longitude: number;
    shadeVariety: ShadeVarietyModel[];
    coffeeVariety: CoffeeVarietyModel[];
    soilType: SoilTypeModel[];
    farm?: TFarmModel;
    appCode?: string;
    isEditing?: boolean;
    isSelected?: boolean;
    isExpanded?: boolean;
    federatedId?: string;
    isCompleted?: boolean;
    code?: string;
    zipCode?: string;
}

export class TBlockModel implements TIBlockModel {
    public id: string = null;
    public name = null;
    public farmId: number = null;
    public height: number = 0;
    public extension: number = 0;
    public varietyId: string = null;
    public seller: number = null;
    public farmName = null;
    public varietyName = null;
    public federated = false;
    public seals = [];
    public countryId = null;
    public country = null;
    public stateId = null;
    public state = null;
    public cityId = null;
    public city = null;
    public townId = null;
    public town = null;
    public address = null;
    public latitude = 0;
    public longitude = 0;
    public shadeVariety: ShadeVarietyModel[] = [];
    public coffeeVariety: CoffeeVarietyModel[] = [];
    public soilType: SoilTypeModel[] = [];
    public extensionMeasurementUnitId = null;
    public measuremnetUnitName = null;
    public farm = null;
    public appCode = null;
    public isEditing = false;
    public isSelected = false;
    public isExpanded = false;
    public federatedId: string = null;
    public isCompleted: boolean = false;
    public code: string = null;
    public zipCode: string = null;

    constructor(item?: any, federatedId?: string) {
        if (item) {
            this.id = item.id ?? item.block_id ?? this.id;
            this.name = item.name ?? this.name;
            this.farmId = item.farmId ?? item.farm_id ?? this.farmId;
            this.farmName = item.farmName ?? item.farm_name ?? this.farmName;
            this.height =
                item.height || 0 === item.height
                    ? convertStringToNumber(item.height)
                    : this.height;
            this.extension =
                item.extension || 0 === item.extension
                    ? convertStringToNumber(item.extension)
                    : this.extension;
            this.varietyId =
                item.varietyId ?? (item.variety_id && 0 !== item.variety_id)
                    ? item.variety_id
                    : this.varietyId;
            this.seller = item.seller ?? item.seller_id ?? this.seller;
            this.varietyName =
                item.varietyName ?? item.variety_name ?? this.varietyName;
            this.federated = item.federated ?? this.federated;
            this.seals =
                item.seals?.certifications ??
                item.sealsByBlock?.certifications ??
                item.seals ??
                this.seals;
            this.countryId =
                item.country_id ?? item.countryId ?? this.countryId;
            this.country = item.country ?? this.country;
            this.cityId = item.city_id ?? item.cityId ?? this.cityId;
            this.city = item.city ?? this.city;
            this.townId = item.village_id ?? item.townId ?? this.townId;
            this.town = item.village ?? item.town ?? this.town;
            this.stateId = item.state_id ?? item.stateId ?? this.stateId;
            this.state = item.state ?? this.state;
            this.address = item.address ?? item.address ?? this.address;
            this.latitude = item.latitude ?? this.latitude;
            this.longitude = item.longitude ?? this.longitude;
            this.shadeVariety = item.shade_variety
                ? item.shade_variety.map((v) => new ShadeVarietyModel(v))
                : item.shadeVariety ?? this.shadeVariety;
            this.coffeeVariety = item.variety_coffee
                ? item.variety_coffee.map((v) => new CoffeeVarietyModel(v))
                : item.coffeeVariety ?? this.coffeeVariety;
            this.soilType = item.soil_type
                ? item.soil_type.map((v) => new SoilTypeModel(v))
                : item.soilType ?? this.soilType;
            this.extensionMeasurementUnitId =
                item.measurement_unit_id ??
                item.extensionMeasurementUnitId ??
                this.extensionMeasurementUnitId;
            this.measuremnetUnitName =
                item.measurement_unit ??
                item.measurementUnitName ??
                this.measuremnetUnitName;
            this.farm = item.farm
                ? new TFarmModel(
                    (Array.isArray(item.farm) ? item.farm[0] : item.farm),
                    federatedId !== null
                )
                : this.farm;
            if (this.farm) {
                this.farmId = this.farm.id;
                this.farmName = this.farm.name;
            }
            this.appCode = item.code ?? item.appCode ?? this.appCode;
            this.isEditing = item.isEditing ?? this.isEditing;
            this.isSelected = item.isSelected ?? this.isSelected;
            this.isExpanded = item.isExpanded ?? this.isExpanded;
            this.federatedId = federatedId ?? this.federatedId;
            this.code = item.code ?? this.code;
            this.zipCode = item.zip_code ?? item.zipCode ?? this.zipCode;
        } else {
            Object.assign(this, {});
        }
    }
}
