import { IDataActionsBlockModel } from "../models/data-actions-block.model";
import { trimSpaces } from "../../../shared/utils/functions/trim-spaces";
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';

export interface TIRequestCreateBlockModel {
  seller: number;
  farm: number;
  height: number;
  extensionBlock: number;
  variety_id: string;
  blocks: Array<{ name: string }>;
}


export class TRequestCreateBlockModel implements TIRequestCreateBlockModel {

  public seller: number = null;
  public farm: number = null;
  public height: number = null;
  public extensionBlock: number = null;
  public variety_id: string = null;
  public blocks: Array<{ name: string }> = [];

  constructor(item?: IDataActionsBlockModel) {

    if (item) {

      this.seller = item.currentBlock.seller ? item.currentBlock.seller : this.seller;

      this.farm = item.currentBlock.farmId ? item.currentBlock.farmId : this.farm;

      this.height = item.currentBlock.height || 0 == item.currentBlock.height ? convertStringToNumber(item.currentBlock.height.toString()) : this.height;

      this.extensionBlock = item.currentBlock.extension || 0 == item.currentBlock.extension ? convertStringToNumber(item.currentBlock.extension.toString()) : this.extensionBlock;

      this.variety_id = item.currentBlock.varietyId ? item.currentBlock.varietyId : this.variety_id;

      this.blocks = item.currentBlock.name ? [{ name: trimSpaces(item.currentBlock.name) }] : [{ name: null }];

    }
    else {

      Object.assign(this, {});

    }

  }

}