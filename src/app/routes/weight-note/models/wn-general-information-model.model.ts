import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { IWNFarmModel, WNFarmModel } from './wn-farm.model';
import { IWNSeasonModel, WNSeasonModel } from './wn-season.model';
import { IWNSellerModel, WNSellerModel } from './wn-seller.model';
import * as moment from 'moment';

export interface IWNGeneralInformationModel {
  id: string;
  folio: string;
  date: string;
  producer: IWNSellerModel;
  season: IWNSeasonModel;
  fieldTicket: string;
  contractId: string;
  status: number;
  totalDiscount: number;
  totalAddition: number;
  totalNetWeightQQ: number;
  totalNetWeight: number;
  totalNetDryWeightQQ: number;
  creationDate?: string;
  creationUserEmail?: string;
  editionDate?: string;
  editionUserEmail?: string;
  print?: number;
}

export class WNGeneralInformationModel implements IWNGeneralInformationModel {
  public id: string = null;
  public folio: string = '---';
  public date: string = null;
  public producer: IWNSellerModel = null;
  public season: IWNSeasonModel = null;
  public fieldTicket: string = '';
  public contractId: string = null;
  public totalDiscount: number = 0;
  public totalAddition: number = 0;
  public totalNetWeightQQ: number = 0;
  public totalNetWeight: number = 0;
  public totalNetDryWeightQQ: number = 0;
  public status: number = CONSTANTS.RECEIVING_NOTE_STATUS.OPEN;
  public creationDate?: string = null;
  public creationUserEmail?: string = '';
  public editionDate?: string = null;
  public editionUserEmail?: string = '';
  public print?: number = 0;

  constructor(item?: any, isAPIData: boolean = false) {

    if (item) {
      this.id = isAPIData ? item.reception_id : item.id ?? this.id;
      this.folio = item.folio ?? this.folio;

      if (isAPIData) {
        this.date = item.start_date ?? this.date;
        this.creationDate = item.creation_storage_date ?? this.creationDate;
        this.editionDate = item.edition_storage_date ?? this.editionDate;
      }
      else {
        this.date = item.date ?? this.date;
        this.creationDate = item.creationDate ?? this.creationDate;
        this.editionDate = item.editionDate ?? this.editionDate;
      }

      if (isAPIData) {
        if (null != item.weight_notes[0].producer_id) {
          this.producer = new WNSellerModel({
            id: item.weight_notes[0].producer_id,
            name: item.weight_notes[0].producer_name,
            paternalLast: item.weight_notes[0].paternal_last,
            maternalLast: item.weight_notes[0].maternal_last,
            farms: [],
            carnet: item.weight_notes[0].ihcafe_carnet,
            type: item.weight_notes[0].productor_type,
            clientNumber: item.weight_notes[0].external_id,
            identifier: item.weight_notes[0].identifier,
            address: item.weight_notes[0].producer_address,
            rtn: item.weight_notes[0].rtn
          });
          let farms: Array<IWNFarmModel> = [];
          item.weight_notes.forEach((f: any) => {
            if (null != f.farm) {
              farms.push(new WNFarmModel({
                id: f.farm,
                name: f.farm_name,
                address: f.farm_address
              }));
            }
          });
          this.producer.farms = farms;
        }
        if (null != item.season_id) {
          this.season = new WNSeasonModel({
            season_id: item?.season_id,
            season: item?.season,
            start_date: item?.season_start_date,
            end_date: item?.season_end_date
          }, true);
        }
        if (null != item.weight_notes[0].fieldTicket) {
          this.fieldTicket = item.weight_notes[0].fieldTicket;
        }
        if (null != item.weight_notes[0].contract_id) {
          this.contractId = item.weight_notes[0].contract_id;
        }
      }
      else {
        if (item.producer) {
          this.producer = new WNSellerModel(item.producer);
        }
        if (item.season) {
          this.season = new WNSeasonModel(item.season);
        }
        if (null != item.fieldTicket) {
          this.fieldTicket = item.fieldTicket;
        }
        if (null != item.contractId) {
          this.contractId = item.contractId;
        }
      }
      // totals
      this.totalDiscount = isAPIData ? item.penalties : this.totalDiscount;
      this.totalAddition = isAPIData ? item.addition ?? this.totalAddition : this.totalAddition;
      this.totalNetWeightQQ = isAPIData ? item.net : this.totalNetWeightQQ;
      this.totalNetWeight = isAPIData ? item.net : this.totalNetWeight;
      this.totalNetDryWeightQQ = isAPIData ? item.netdrywt : this.totalNetDryWeightQQ;
      // status
      this.status = isAPIData ? item.is_close : item.status ?? this.status;
      this.creationUserEmail = isAPIData ? item.creation_user_email : this.creationUserEmail;
      this.editionUserEmail = isAPIData ? item.edition_user_email : this.editionUserEmail;
      //print
      this.print = item.print ?? this.print;
    }
    else {
      Object.assign(this, {});
    }
  }

}
