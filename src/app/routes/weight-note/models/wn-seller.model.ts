import { IWNFarmModel, WNFarmModel } from "./wn-farm.model";
import { trimSpaces } from "../../../shared/utils/functions/trim-spaces";

export interface IWNSellerModel {
  id: number;
  name: string;
  paternalLast: string;
  maternalLast: string;
  farms: Array<IWNFarmModel>;
  fullName: string;
  address: string;
  carnet?: string;
  type?: number;
  clientNumber?: string;
  identifier?: string;
  rtn: string;
}

export class WNSellerModel implements IWNSellerModel {
  public id: number = null;
  public name: string = '';
  public paternalLast: string = '';
  public maternalLast: string = '';
  public farms: Array<IWNFarmModel> = [];
  public fullName: string = '';
  public address: string = '';
  public carnet?: string = '';
  public type?: number;
  public clientNumber?: string = '';
  public identifier?: string = '';
  public rtn: string = '';

  constructor(item?: any) {
    if (item) {
      this.id = item.id ? item.id : this.id;
      this.name = item.name ? trimSpaces(item.name) : this.name;
      this.paternalLast = item.paternalLast ? trimSpaces(item.paternalLast) : item.paternal_last ? trimSpaces(item.paternal_last) : this.paternalLast;
      this.maternalLast = item.maternalLast ? trimSpaces(item.maternalLast) : item.maternal_last ? trimSpaces(item.maternal_last) : this.maternalLast;
      this.farms = item.farms ? item.farms : this.farms;
      this.fullName = this.name;
      this.address = item.address ?? this.address;
      this.carnet = item.carnet ?? item.ihcafe_carnet ?? this.carnet;
      this.type = item.type ?? this.type;
      this.clientNumber = item.external_id ?? item.clientNumber ?? this.clientNumber;
      this.identifier = item.identifier ?? this.identifier;
      this.rtn = item.rtn ?? this.rtn;
      if (this.paternalLast.length > 0) {
        this.fullName += ' ' + this.paternalLast;
      }
      if (this.maternalLast.length > 0) {
        this.fullName += ' ' + this.maternalLast;
      }
    }
    else {
      Object.assign(this, {});
    }
    for (let f = 0; f < this.farms.length; f++) {
      this.farms[f] = new WNFarmModel(this.farms[f]);
    }
  }
}
