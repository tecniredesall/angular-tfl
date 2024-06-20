import { IDataActionsBlockModel } from "../models/data-actions-block.model";
import { trimSpaces } from "../../../shared/utils/functions/trim-spaces";
import { convertStringToNumber } from '../../../shared/utils/functions/string-to-number';
import { TIBlockModel } from "./block.model";

export interface TIRequestEditBlockModel {
  id: string;
  name: string;
  farm_id: number;
  variety_id: string;
  height: number;
  extension: number;
  seller_id: number;
}


export class TRequestEditBlockModel implements TIRequestEditBlockModel {

  public id: string = null;
  public name: string = null;
  public farm_id: number = null;
  public variety_id: string = null;
  public height: number = null;
  public extension: number = null;
  public seller_id: number = null;

  constructor(item?: TIBlockModel) {

    if (item) {

      this.id = item.id ? item.id : this.id;

      this.name = item.name ? trimSpaces(item.name) : this.name;

      this.farm_id = item.farmId ? item.farmId : this.farm_id;

      this.variety_id = item.varietyId ? item.varietyId : this.variety_id;

      this.height = item.height || 0 == item.height ? convertStringToNumber(item.height.toString()) : this.height;

      this.extension = item.extension || 0 == item.extension ? convertStringToNumber(item.extension.toString()) : this.extension;

      this.seller_id = item.seller ? item.seller : this.seller_id;

    }
    else {

      Object.assign(this, {});

    }

  }

}