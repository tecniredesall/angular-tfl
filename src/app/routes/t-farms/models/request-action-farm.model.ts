import { trimSpaces } from "../../../shared/utils/functions/trim-spaces";
import { convertStringToNumber } from '../../../shared/utils/functions/string-to-number';
import { TIFarmModel } from "./farm.model";
import { TIBlockModel } from "../../t-blocks/models/block.model";
import { AddressModel, IAddressModel } from '../../../shared/models/address.model';
import { TProducerModel } from "src/app/shared/models/sil-producer";

export interface TIRequestActionFarmModel {
    id: number;
    federated_id: string;
    name: string;
    extension: number;
    seller: number;
    address: string;
    blocks: Array<any>;
    measurement_type_id: number;
    measurement_unit_id: string;
    country_id: string;
    state_id: string;
    city_id: string;
    village_id: string;
    wasteland_area: number;
    productive_area: number
    zip_code?: string;

}


export class TRequestActionFarmModel implements TIRequestActionFarmModel {

    public id: number = null;
    public name: string = null;
    public extension: number = null;
    public seller: number = null;
    public address: string = null;
    public blocks: Array<any> = [];
    public measurement_type_id: number = null;
    public measurement_unit_id: string = null;
    public country_id: string = null;
    public state_id: string = null;
    public city_id: string = null;
    public village_id: string = null;
    public wasteland_area: number = null;
    public productive_area: number = null;
    public federated_id: string = null;
    public zip_code: string = null;
    constructor(item?: TIFarmModel | any, fromFederated = false, seller?: TProducerModel) {
        if (item) {
            this.id = item.id ? item.id : this.id;
            this.name = item.name ? trimSpaces(item.name) : this.name;
            this.seller = item.seller ? item.seller : this.seller;
            this.blocks = [];
            if (fromFederated) {
                this.blocks = item.blocks.map((b: TIBlockModel) => new BlocksCreateRequestFarmFederated(b, seller.id));
                this.seller = seller.id;
            } else {
                item.blocks.forEach((b: TIBlockModel) => {
                    this.blocks.push({ block_id: b.id });
                });
            }
            this.measurement_type_id = 2;
            this.measurement_unit_id = fromFederated ? item.extensionUnitId : item.extensionUnit.measurement_unit_id;
            this.country_id = item ? item.country: this.country_id;
            this.state_id = item ? item.state : this.state_id;
            this.city_id = item ? item.city : this.city_id;
            this.village_id = item ? item.village : this.village_id;
            this.address = item ? item.address : this.address;
            this.zip_code = item ? item.zipCode ?? item.zip_code : this.zip_code;
            this.wasteland_area = item.wastelandArea ? convertStringToNumber(String(item.wastelandArea)) : this.wasteland_area;
            this.productive_area = item.productiveArea ? convertStringToNumber(String(item.productiveArea)) : this.productive_area;
            this.extension = item.extension ? convertStringToNumber(String(item.extension)) : this.extension;
            this.federated_id = item.federatedId;
        }
        else {
            Object.assign(this, {});
        }

    }

}

export class BlocksCreateRequestFarmFederated {
    public name: string = null;
    public seller: number;
    public farm: number;
    public height: number;
    public extensionBlock: number = 0;
    public country_id: string = null;
    public state_id: string = null;
    public city_id: string = null;
    public village_id: string = null;
    public address: string = null;
    public latitude;
    public longitude;
    public federated_id: string = null;
    constructor(item?: TIBlockModel, sellerId?: number) {
        if (item) {
            this.name = item.name ?? this.name;
            this.seller = sellerId ?? this.seller;
            // farm is created in this flow
            this.farm = null;
            this.height = item.height ?? this.height;
            this.extensionBlock = item.extension ?? this.extensionBlock;
            this.country_id = item.countryId ?? this.country_id;
            this.state_id = item.stateId ?? this.state_id;
            this.city_id = item.cityId ?? this.city_id;
            this.village_id = item.townId ?? this.village_id;
            this.address = item.address ?? this.address;
            this.latitude = item.latitude ?? this.latitude;
            this.longitude = item.longitude ?? this.longitude;
            // set federated_id
            this.federated_id = item.federatedId ?? this.federated_id;
        } else {
            Object.assign(this, {});
        }
    }
}
