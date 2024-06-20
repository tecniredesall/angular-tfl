import { conformToMask } from 'angular2-text-mask';
import * as moment from 'moment';
import {
    AssociatesModel, IAssociatesModel
} from 'src/app/routes/producers/models/associates.model';
import {
    InternationalPhoneConfigurationEnum
} from 'src/app/routes/producers/models/international-phones-configuration.enum';
import {
    ContractTrumodityModel
} from 'src/app/routes/purchase-orders/models/contract-trumodity.model';
import { TBlockModel, TIBlockModel } from 'src/app/routes/t-blocks/models/block.model';
import { TFarmModel, TIFarmModel } from 'src/app/routes/t-farms/models/farm.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { sortBykey } from 'src/app/shared/utils/functions/sortFunction';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import { SealModel } from 'src/app/shared/utils/models/seal.model';

import { trimSpaces } from '../../shared/utils/functions/trim-spaces';

export interface TIProducerModel {
    id: number;
    age: number;
    name: string;
    paternalLast: string;
    maternalLast: string;
    email: string;
    phone: string;
    contactPhone: string;
    contactPhoneCountry: string;
    contactName: string;
    federated: boolean;
    farms: Array<TIFarmModel>;
    blocksWithoutFarm: Array<TIBlockModel>;
    allBlocks: Array<TIBlockModel>;
    totalRelatedFarms: number;
    totalRelatedBlocks: number;
    totalAssociates: number;
    associates: Array<IAssociatesModel>;
    initialsName?: string;
    fullName?: string;
    farmsName?: string;
    blocksName?: string;
    associatesName?: string;
    phoneCountry?: string;
    seals?: SealModel[];
    type: number;
    typeName: string;
    address: string;
    contracts?: ContractTrumodityModel[];
    externalId: string;
    rtn: string;
    ihcafeCarnet: string;
    country: string;
    countryId: string;
    state: string;
    stateId: string;
    city: string;
    cityId: string;
    town: string;
    townId: string;
    scholarship: string;
    scholarshipId: number;
    maritalStatus: string;
    maritalStatusId: number;
    profession: string;
    professionId: number;
    identity: string;
    birthdate: moment.Moment;
    associationDate: moment.Moment;
    gender: string;
    code?: string;
    zipCode?: string;
}

export interface TIProducerRequestModel {
    id: number;
    name: string;
    paternal_last: string;
    external_id: string;
    email: string;
    phone: string;
    phone_contact: string;
    contact: string;
    ihcafe_carnet: string;
    productor_type: number;
    country_id: string;
    state_id: string;
    city_id: string;
    town_id: string;
    address: string;
    scholarship_id: number;
    marital_status_id: number;
    profession_id: number;
    tax_identifier: string;
    population_identifier: string;
    date_birth: moment.Moment;
    association_date: moment.Moment;
    gender: string;
    calling_code: string;
    phone_contact_code: string;
    federated_id: string;
    zip_code: string;
}

export class TProducerModel implements TIProducerModel {
    public id: number = null;
    public age: number = null;
    public name: string = '';
    public paternalLast: string = '';
    public maternalLast: string = '';
    public email: string = '';
    public phone: string = null;
    public contactPhone: string = null;
    public phoneCountry: string = InternationalPhoneConfigurationEnum.DEFAULT_COUNTRY;
    public contactPhoneCountry: string = InternationalPhoneConfigurationEnum.DEFAULT_COUNTRY;
    public contactName: string = '';
    public federated = false;
    public farms: Array<TIFarmModel> = [];
    public blocksWithoutFarm: Array<TIBlockModel> = [];
    public allBlocks: Array<TIBlockModel> = [];
    public totalRelatedFarms: number = 0;
    public totalRelatedBlocks: number = 0;
    public totalAssociates: number = 0;
    public associates: Array<IAssociatesModel> = [];
    public partners: Array<any> = [];
    public initialsName?: string = '';
    public fullName?: string = '';
    public farmsName?: string = '';
    public blocksName?: string = '';
    public associatesName?: string = '';
    public seals?: SealModel[];
    public type: number = null;
    public typeName: string = null;
    public address: string = null;
    public contracts: ContractTrumodityModel[];
    public externalId: string = null;
    public rtn: string = null;
    public ihcafeCarnet: string = null;
    public country: string = null;
    public countryId: string = null;
    public state: string = null;
    public stateId: string = null;
    public city: string = null;
    public cityId: string = null;
    public town: string = null;
    public townId: string = null;
    public scholarship: string = null;
    public scholarshipId: number = null;
    public maritalStatus: string = null;
    public maritalStatusId: number = null;
    public profession: string = null;
    public professionId: number = null;
    public identity: string = null;
    public birthdate: moment.Moment = null;
    public associationDate: moment.Moment = null;
    public gender: string = null;
    public code?: string;
    public zipCode?: string;

    constructor(producer?: any) {
        if (producer) {
            this.id = producer.id ?? this.id;
            this.type = producer.productor_type_id ? parseInt(producer.productor_type_id) : producer.productor_type ?? producer.type ?? this.type;
            this.typeName = producer.productor_type ?? this.typeName;
            this.address = producer.address ?? this.address;
            this.contracts = producer.contracts ? producer.contracts.map(c => new ContractTrumodityModel(c)) : [];
            this.scholarship = producer.scholarship ?? this.scholarship;
            this.scholarshipId = producer.scholarship_id ? parseInt(producer.scholarship_id) : this.scholarshipId;
            this.maritalStatus = producer.marital_status ?? this.maritalStatus;
            this.maritalStatusId =  producer.marital_status_id ? parseInt(producer.marital_status_id) : this.maritalStatusId;
            this.profession = producer.profession ?? this.profession;
            this.professionId = producer.profession_id ? parseInt(producer.profession_id) : this.professionId;
            this.identity = producer.population_identifier ?? producer.identity ?? this.identity;
            this.birthdate = producer.date_birth ? moment(producer.date_birth) : producer.birthdate ?? this.birthdate;
            this.age = this.birthdate ? this.birthdate.diff(moment(), 'years') * -1 : 0;
            this.externalId = producer.external_id ?? this.externalId;
            this.rtn = producer.tax_identifier ?? producer.rtn ?? this.rtn;
            this.ihcafeCarnet = producer.ihcafe_carnet ?? producer.ihcafeCarnet ?? this.ihcafeCarnet;
            this.country = producer.country ?? this.country;
            this.countryId = producer.country_id ?? producer.countryId ?? this.countryId;
            this.city = producer.city ?? this.city;
            this.cityId = producer.city_id ?? producer.cityId ?? producer.city ?? this.cityId;
            this.town = producer.town ?? producer.village ?? this.town;
            this.townId = producer.town_id ??  producer.townId ?? this.townId;
            this.state = producer.state ?? this.state;
            this.stateId = producer.state_id ?? producer.stateId ?? this.stateId;
            this.associationDate = producer.association_date ? moment(producer.association_date) : producer.associationDate ?? this.associationDate;
            this.gender = producer.gender ?? this.gender;

            this.name = producer.name
                ? trimSpaces(producer.name)
                : trimSpaces(this.name);

            this.paternalLast = producer.paternalLast
                ? trimSpaces(producer.paternalLast)
                : producer.paternal_last
                    ? trimSpaces(producer.paternal_last)
                    : trimSpaces(this.paternalLast);

            this.maternalLast = producer.maternalLast
                ? trimSpaces(producer.maternalLast)
                : producer.maternal_last
                    ? trimSpaces(producer.maternal_last)
                    : trimSpaces(this.maternalLast);

            this.email = producer.email ?? this.email;

            this.phone = producer.phone ?? this.phone;
            this.phoneCountry = producer.calling_code ? this.getCountryFromCode(producer.calling_code) : producer.phoneCountry ?? this.phoneCountry
            this.contactName = producer.contact ?? this.contactName;
            this.contactPhone = producer.phone_contact ?? producer.contactPhone ?? this.contactPhone;
            this.contactPhoneCountry = producer.phone_contact_code ? this.getCountryFromCode(producer.phone_contact_code) : producer.contactPhoneCountry ?? this.contactPhoneCountry;
            this.federated = producer.federated ?? this.federated;
            this.farms = producer.farms ? producer.farms.map((f: any) => new TFarmModel(f)) : this.farms;

            this.blocksWithoutFarm =
                producer.blocksWithoutFarm ?? this.blocksWithoutFarm;

            this.allBlocks = producer.allBlocks ?? this.allBlocks;
            this.seals = producer.seals ?? this.seals;

            this.totalRelatedFarms = producer.totalRelatedFarms
                ? convertStringToNumber(producer.totalRelatedFarms)
                : producer.totalFarmsByProducer
                    ? convertStringToNumber(producer.totalFarmsByProducer)
                    : this.totalRelatedFarms;

            this.totalRelatedBlocks = producer.totalRelatedBlocks
                ? convertStringToNumber(producer.totalRelatedBlocks)
                : producer.totalBlocksByProducer
                    ? convertStringToNumber(producer.totalBlocksByProducer)
                    : this.totalRelatedBlocks;

            this.totalAssociates = producer.totalAssociates
                ? convertStringToNumber(producer.totalAssociates)
                : producer.totalPartnersByProducer
                    ? convertStringToNumber(producer.totalPartnersByProducer)
                    : this.totalAssociates;

            if (producer.partners) {
                this.partners = producer.partners;
            }

            this.formatPhoneNumber(this);

            let initName: string =
                this.name.length > 0 ? this.name.charAt(0) : '';

            let initialPaternalLast: string =
                this.paternalLast.length > 0 ? this.paternalLast.charAt(0) : '';

            this.initialsName = initName + initialPaternalLast;

            this.fullName = this.name;

            this.code = producer.code ?? null;

            this.zipCode = producer.zip_code ?? producer.zipCode;

            if (this.paternalLast.length > 0) {
                this.fullName += ' ' + this.paternalLast;
            }

            if (this.maternalLast.length > 0) {
                this.fullName += ' ' + this.maternalLast;
            }

            let idxBlockFound: number = -1;

            for (let f = 0; f < this.farms.length; f++) {
                // this.farms[f] = new TFarmModel(this.farms[f]);

                this.farmsName += this.farms[f].name;

                if (f < this.farms.length - 1) {
                    this.farmsName += '\n';
                }

                for (let b = 0; b < this.farms[f].blocks.length; b++) {
                    idxBlockFound = this.allBlocks.findIndex(
                        (block: TIBlockModel) =>
                            this.farms[f].blocks[b].id == block.id
                    );

                    if (-1 == idxBlockFound) {
                        this.allBlocks.push(
                            new TBlockModel(this.farms[f].blocks[b])
                        );
                    }
                }
            }
            for (let b = 0; b < this.blocksWithoutFarm.length; b++) {
                this.blocksWithoutFarm[b] = new TBlockModel(
                    this.blocksWithoutFarm[b]
                );

                idxBlockFound = this.allBlocks.findIndex(
                    (block: TIBlockModel) =>
                        this.blocksWithoutFarm[b].id == block.id
                );

                if (-1 == idxBlockFound) {
                    this.allBlocks.push(
                        new TBlockModel(this.blocksWithoutFarm[b])
                    );
                }
            }

            this.allBlocks = sortBykey(this.allBlocks, 'name');

            for (let b = 0; b < this.allBlocks.length; b++) {
                this.blocksName += this.allBlocks[b].name;

                if (b < this.allBlocks.length - 1) {
                    this.blocksName += '\n';
                }
            }
            for (let a = 0; a < this.partners.length; a++) {
                this.associates[a] = new AssociatesModel(this.partners[a]);

                this.associatesName += this.associates[a].name;

                if (a < this.partners.length - 1) {
                    this.associatesName += '\n';
                }
            }
        } else {
            Object.assign(this, {});

            for (let f = 0; f < this.farms.length; f++) {
                this.farms[f] = new TFarmModel(this.farms[f]);
            }

            for (let b = 0; b < this.blocksWithoutFarm.length; b++) {
                this.blocksWithoutFarm[b] = new TBlockModel(
                    this.blocksWithoutFarm[b]
                );
            }

            for (let b = 0; b < this.allBlocks.length; b++) {
                this.allBlocks[b] = new TBlockModel(this.allBlocks[b]);
            }

            for (let a = 0; a < this.associates.length; a++) {
                this.associates[a] = new AssociatesModel(this.associates[a]);
            }

            this.allBlocks = sortBykey(this.allBlocks, 'name');
        }
    }

    private getCountryFromCode(code: string) {
        return !code ?
            InternationalPhoneConfigurationEnum.DEFAULT_COUNTRY
            :
            code === CONSTANTS.INTERNATIONAL_PHONES.MEXICO.PREFIX ?
                'MEXICO' :
                code === CONSTANTS.INTERNATIONAL_PHONES.HONDURAS.PREFIX ?
                'HONDURAS' : 'USA'
    }

    private formatPhoneNumber(producer: TIProducerModel) {
        if (producer.phone) {
            let phoneFormated: string = this.phone.replace(/[^0-9\+]/gm, '');

            let prefixPhone: string = '';

            if (phoneFormated.length > 0) {
                let firstChar: string = phoneFormated.charAt(0);

                phoneFormated = phoneFormated
                    .substring(1)
                    .replace(/[^0-9]/gm, '');

                phoneFormated = firstChar + phoneFormated;

                if ('+' === firstChar) {
                    prefixPhone =
                        phoneFormated.length > 10
                            ? phoneFormated.substring(
                                0,
                                phoneFormated.length - 10
                            )
                            : phoneFormated;
                } else {
                    prefixPhone =
                        phoneFormated.length > 10
                            ? phoneFormated.substring(
                                0,
                                phoneFormated.length - 10
                            )
                            : '';
                }

                for (const key in CONSTANTS.INTERNATIONAL_PHONES) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            CONSTANTS.INTERNATIONAL_PHONES,
                            key
                        )
                    ) {
                        if (
                            prefixPhone ==
                            CONSTANTS.INTERNATIONAL_PHONES[key].PREFIX
                        ) {
                            this.phoneCountry = key;
                            break;
                        }
                    }
                }

                this.phone =
                    InternationalPhoneConfigurationEnum.DEFAULT_COUNTRY !=
                        this.phoneCountry
                        ? conformToMask(
                            phoneFormated,
                            CONSTANTS.INTERNATIONAL_PHONES[this.phoneCountry]
                                .MASK,
                            { guide: false }
                        ).conformedValue
                        : phoneFormated;
            } else {
                this.phone = '';
            }
        } else {
            this.phone = '';
        }

        if (producer.contactPhone) {
            let phoneFormated: string = this.contactPhone.replace(/[^0-9\+]/gm, '');

            let prefixPhone: string = '';

            if (phoneFormated.length > 0) {
                let firstChar: string = phoneFormated.charAt(0);

                phoneFormated = phoneFormated
                    .substring(1)
                    .replace(/[^0-9]/gm, '');

                phoneFormated = firstChar + phoneFormated;

                if ('+' === firstChar) {
                    prefixPhone =
                        phoneFormated.length > 10
                            ? phoneFormated.substring(
                                  0,
                                  phoneFormated.length - 10
                              )
                            : phoneFormated;
                } else {
                    prefixPhone =
                        phoneFormated.length > 10
                            ? phoneFormated.substring(
                                  0,
                                  phoneFormated.length - 10
                              )
                            : '';
                }

                for (const key in CONSTANTS.INTERNATIONAL_PHONES) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            CONSTANTS.INTERNATIONAL_PHONES,
                            key
                        )
                    ) {
                        if (
                            prefixPhone ==
                            CONSTANTS.INTERNATIONAL_PHONES[key].PREFIX
                        ) {
                            this.contactPhoneCountry = key;
                            break;
                        }
                    }
                }

                this.contactPhone =
                    InternationalPhoneConfigurationEnum.DEFAULT_COUNTRY !=
                    this.contactPhoneCountry
                        ? conformToMask(
                              phoneFormated,
                              CONSTANTS.INTERNATIONAL_PHONES[this.contactPhoneCountry]
                                  .MASK,
                              { guide: false }
                          ).conformedValue
                        : phoneFormated;
            } else {
                this.contactPhone = '';
            }
        } else {
            this.contactPhone = '';
        }
    }
}
