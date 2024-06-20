import { IWNWeightModel, WNWeightModel } from "./wn-weight.model";
import { IWNBlockModel, WNBlockModel } from "./wn-block.model";
import { IWNPenaltyModel, WNPenaltyModel } from "./wn-penalty.model";
import { IWNCommodityModel, WNCommodityModel } from "./wn-commodity.model";
import { IWNCommodityTypeModel, WNCommodityTypeModel } from "./wn-commodity-type.model";
import { sortBykey, sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { IWNCommodityTransformationModel, WNCommodityTransformationModel } from './wn-commodity-transformation.model';
import { IWNContainerModel, WNContainerModel } from "./wn-container.model";
import { IWNDriverModel, WNDriverModel } from './wn-driver.model';
import { IWNTruckModel, WNTruckModel } from './wn-truck.model';
import { IWNCharacteristicModel } from "./wn-characteristic.model";
import { IWNFarmModel, WNFarmModel } from "./wn-farm.model";
import { IWNCertificationModel, WNCertificationModel } from "./wn-certification.model";
import { CommentModel, ICommentModel } from 'src/app/shared/models/comment.model';
import * as moment from "moment";
import { convertLbtoQQ } from "src/app/shared/utils/functions/convert-qq-to-lb";
import { accurateDecimalSum } from "src/app/shared/utils/functions/accurate-decimal-operation";
import { IWNConfigurationModel } from "./wn-configuration.model";

export interface IWNDescriptionModel {
  transactionInId: number;
  weightNoteId: string;
  indexSort: number;
  localDateCapture: moment.Moment;
  todayDate: moment.Moment;
  allowedMaxDate: moment.Moment;
  date: moment.Moment;
  commodity: IWNCommodityModel;
  isLoadingCommodityTypes: boolean;
  commodityType: IWNCommodityTypeModel;
  commodityTypesByCommodity: Array<IWNCommodityTypeModel>;
  commodityTransformation: IWNCommodityTransformationModel;
  isLoadingContainers: boolean;
  container: IWNContainerModel;
  containersByCommodityTransformation: Array<IWNContainerModel>;
  driver: IWNDriverModel;
  truck: IWNTruckModel;
  deliveredByProducer: boolean;
  farm: IWNFarmModel;
  block: IWNBlockModel;
  blocksByFarm: Array<IWNBlockModel>;
  cacheBlocksByFarm: Array<IWNBlockModel>;
  certifications: Array<IWNCertificationModel>;
  showCertificationControls: boolean;
  isLoadingCertifications: boolean;
  certificationsWasLoaded: boolean
  totalCertifications: number;
  weights: Array<IWNWeightModel>;
  penalties: Array<IWNPenaltyModel>;
  textNote: string;
  totalCharacteristics: number;
  totalPercentCharacteristics: number;
  totalSacks: number;
  totalNet: number;
  totalNetQQ: number;
  totalNetQQRow: number;
  totalTare: number;
  totalTareAditional: number;
  totalSumTares: number;
  totalTareContainer: number;
  totalTareQQ: number;
  totalGross: number;
  totalGrossQQ: number;
  totalDiscount: number;
  totalDiscountQQ: number;
  totalAddition: number;
  totalAdditionQQ: number;
  totalNetDryWt: number;
  totalNetDryWtQQ: number;
  status: number;
  isDataLoadedOnEdit: boolean;
  isLoadingCharacteristics: boolean;
  characteristicsWasLoaded: boolean;
  characteristics: Array<IWNCharacteristicModel>;
  isWarningContainer: boolean;
  inProcess: number;
  inPurchaseOrder: boolean;
  statusLot: number;
  deletionReason?: string;
  comment?: string;
  comments?: ICommentModel[];
}

export class WNDescriptionModel implements IWNDescriptionModel {
  public transactionInId: number = null;
  public weightNoteId: string = null;
  public indexSort: number = 1;
  public localDateCapture: moment.Moment = moment();
  public todayDate: moment.Moment = moment(this.localDateCapture).endOf('day');
  public allowedMaxDate: moment.Moment = moment(this.todayDate);
  public date: moment.Moment = moment(this.localDateCapture);
  public commodity: IWNCommodityModel = null;
  public isLoadingCommodityTypes: boolean = false;
  public commodityType: IWNCommodityTypeModel = null;
  public commodityTypesByCommodity: Array<IWNCommodityTypeModel> = [];
  public commodityTransformation: IWNCommodityTransformationModel = null;
  public isLoadingContainers: boolean = false;
  public container: IWNContainerModel = null;
  public containersByCommodityTransformation: Array<IWNContainerModel> = [];
  public driver: IWNDriverModel = null;
  public truck: IWNTruckModel = null;
  public deliveredByProducer: boolean = false;
  public farm: IWNFarmModel = null;
  public block: IWNBlockModel = null;
  public blocksByFarm: Array<IWNBlockModel> = [];
  public cacheBlocksByFarm: Array<IWNBlockModel> = [];
  public certifications: Array<IWNCertificationModel> = [];
  public showCertificationControls: boolean = false;
  public isLoadingCertifications: boolean = false;
  public certificationsWasLoaded: boolean = false;
  public totalCertifications: number = 0;
  public weights: Array<IWNWeightModel> = [];
  public penalties: Array<IWNPenaltyModel> = [];
  public textNote: string = '';
  public totalCharacteristics: number = 0;
  public totalPercentCharacteristics: number = 0;
  public totalSacks: number = 0;
  public totalNet: number = 0;
  public totalNetQQ: number = 0;
  public totalNetQQRow: number = 0;
  public totalTare: number = 0;
  public totalSumTares: number = 0;
  public totalTareAditional: number = 0;
  public totalTareContainer: number = 0;
  public totalTareQQ: number = 0;
  public totalGross: number = 0;
  public totalGrossQQ: number = 0;
  public totalDiscount: number = 0;
  public totalDiscountQQ: number = 0;
  public totalAddition: number = 0;
  public totalAdditionQQ: number = 0;
  public totalNetDryWt: number = 0;
  public totalNetDryWtQQ: number = 0;
  public status: number = CONSTANTS.WEIGHT_NOTE_STATUS.OPEN;
  public isDataLoadedOnEdit: boolean = false;
  public isLoadingCharacteristics: boolean = false;
  public characteristicsWasLoaded: boolean = false;
  public characteristics: Array<IWNCharacteristicModel> = [];
  public isWarningContainer: boolean = false;
  public inProcess: number = null;
  public inPurchaseOrder: boolean = false;
  public statusLot: number = 0;
  public deletionReason?: string;
  public comment?: string = '';
  public comments?: ICommentModel[] = [];

  constructor(item?: any, isAPIData: boolean = false, decimals?: number, config?: IWNConfigurationModel) {
    if (item) {
      let weightsData: Array<any> = isAPIData ? item.weight_notes_weights : item.weights ?? this.weights;
      let penaltiesData: Array<any> = isAPIData ? item.weight_notes_penalties : item.penalties ?? this.penalties;
      this.status = isAPIData ? item.wn_status : item.status ?? this.status;
      this.transactionInId = isAPIData ? item.transaction_in_id : item.transactionInId ?? this.transactionInId;
      this.weightNoteId = isAPIData ? item.weight_note_id : item.weightNoteId ?? this.weightNoteId;
      this.indexSort = isAPIData ? item.transaction_in_id : item.indexSort ?? this.indexSort;

      if (isAPIData) {
        this.date = item.start_date ? moment(item.start_date, 'YYYY-MM-DD HH:mm:ss') : this.date;
        this.localDateCapture = moment(this.date);
        if (item.commodity) {
          this.commodity = new WNCommodityModel({
            id: item.commodity,
            name: item.commodity_name
          });
        }
        if (null != item.commodity_transformation_id && 'N/A' != item.commodity_transformation_id) {
          this.commodityType = new WNCommodityTypeModel({
            id: item.commodity_transformation_id,
            name: item.commodity_transformation_name
          });
          if (null != item.transformation_type_id) {
            this.commodityType.transformationTypeId = item.transformation_type_id;
          }
          if (null != item.transformation_type_name) {
            this.commodityType.transformationTypeName = item.transformation_type_name;
          }
        }
        if (null != item.transformation_type_id) {
          this.commodityTransformation = new WNCommodityTransformationModel({
            id: item.transformation_type_id,
            name: item.transformation_type_name
          });
        }
        if (null != item.production_tank_id && 'N/A' != item.production_tank_id) {
          this.container = new WNContainerModel({
            id: item.production_tank_id,
            name: item.production_tank_name,
            tankId: item.tank_id,
            tankName: item.tank_name
          });
        }
        this.deliveredByProducer = (1 == item.delivered_by);
        if (!this.deliveredByProducer && item.driver) {
          this.driver = new WNDriverModel({
            id: item.driver.driver_id,
            name: item.driver.first_name,
            paternalLast: item.driver.father_last_name,
            maternalLast: item.driver.mother_last_name,
            license: item.driver.license
          });
        }
        if (!this.deliveredByProducer && item.truck) {
          this.truck = new WNTruckModel({
            id: item.truck.truck_id,
            name: item.truck.name,
            plate: item.truck.license
          });
        }
        if (null != item.farm) {
          this.farm = new WNFarmModel({
            id: item.farm,
            name: item.farm_name,
            address: item.farm_address
          });
        }
        if (item.weight_notes_blocks) {
          this.block = new WNBlockModel({
            id: item.weight_notes_blocks.block_id,
            name: item.weight_notes_blocks.block_name
          });
          if (this.farm) {
            this.block.farmId = this.farm.id
          }
          this.blocksByFarm = [...[this.block]];
          this.cacheBlocksByFarm = [...[this.block]];
        }
        if (item.certifications) {
          item.certifications.forEach((c: any) => {
            c.certification_id = c.certificationId;
            this.certifications.push(new WNCertificationModel(c));
          });
        }
        this.textNote = null != item.note ? item.note : this.textNote;
        this.comment = item.comment ?? this.comment;
        this.comments = item.comments ?
          item.comments.map((comment: any) => new CommentModel(comment)) : this.comments;
      }
      else {
        this.localDateCapture = item.localDateCapture ? moment(item.localDateCapture) : this.localDateCapture;
        this.todayDate = item.todayDate ? moment(item.todayDate) : this.todayDate;
        this.allowedMaxDate = item.allowedMaxDate ? moment(item.allowedMaxDate) : this.allowedMaxDate;
        this.date = item.date ? moment(item.date) : this.date;
        if (item.commodity) {
          this.commodity = new WNCommodityModel(item.commodity);
        }
        if (item.commodityType) {
          this.commodityType = new WNCommodityTypeModel(item.commodityType);
        }
        if (item.commodityTypesByCommodity) {
          item.commodityTypesByCommodity.forEach((ct: IWNCommodityTypeModel) => {
            this.commodityTypesByCommodity.push(new WNCommodityTypeModel(ct));
          });
        }
        if (item.commodityTransformation) {
          this.commodityTransformation = new WNCommodityTransformationModel(item.commodityTransformation);
        }
        if (item.container) {
          this.container = new WNContainerModel(item.container);
        }
        if (item.containersByCommodityTransformation) {
          item.containersByCommodityTransformation.forEach((c: IWNContainerModel) => {
            this.containersByCommodityTransformation.push(new WNContainerModel(c));
          });
        }
        this.deliveredByProducer = item.deliveredByProducer ?? this.deliveredByProducer;
        if (item.driver) {
          this.driver = new WNDriverModel(item.driver);
        }
        if (item.truck) {
          this.truck = new WNTruckModel(item.truck);
        }
        if (item.farm) {
          this.farm = new WNFarmModel(item.farm);
        }
        if (item.block) {
          this.block = new WNBlockModel(item.block);
        }
        if (item.blocksByFarm) {
          item.blocksByFarm.forEach((b: IWNBlockModel) => {
            this.blocksByFarm.push(new WNBlockModel(item.block));
          });
        }
        if (item.cacheBlocksByFarm) {
          item.cacheBlocksByFarm.forEach((b: IWNBlockModel) => {
            this.cacheBlocksByFarm.push(new WNBlockModel(item.block));
          });
        }
        if (item.certifications) {
          this.certifications = item.certifications;
        }
        if (item.hasOwnProperty('showCertificationControls')) {
          this.showCertificationControls = item.showCertificationControls;
        }
        this.textNote = null != item.textNote ? item.textNote : this.textNote;
      }

      this.totalCertifications = this.certifications.length;

      weightsData.forEach((w: any) => {
        this.weights.push(new WNWeightModel(w, isAPIData));
      });

      penaltiesData.forEach((p: any) => {
        this.penalties.push(new WNPenaltyModel(p, isAPIData));
      });

      // totals
      this.totalSacks = isAPIData ? (item.totalSacks ?? this.totalSacks) : item.totalSacks ?? this.totalSacks;
      this.totalNet = isAPIData ? (item.net ?? this.totalNet) : item.totalNet ?? this.totalNet;
      this.totalTare = isAPIData ? (item.tare ?? this.totalTare) : (item.totalTare ?? this.totalTare);
      this.totalGross = isAPIData ? (item.weight ?? this.totalGross) : (item.totalGross ?? this.totalGross);
      this.totalDiscount = isAPIData ? (item.penalties ?? this.totalDiscount) : (item.totalDiscount ?? this.totalDiscount);
      this.totalAddition = isAPIData ? (item.addition ?? this.totalAddition) : (item.totalAddition ?? this.totalAddition);
      this.totalNetDryWt = isAPIData ? (item.netdrywt ?? this.totalNetDryWt) : (item.totalNetDryWt ?? this.totalNetDryWt);
      this.totalCharacteristics = isAPIData ? (item.totalCharacteristics ?? this.totalCharacteristics) : item.totalCharacteristics ?? this.totalCharacteristics;
      this.totalPercentCharacteristics = isAPIData ? (item.penalties * 100 / item.net) : item.totalPercentCharacteristics ?? this.totalPercentCharacteristics;
      // totals QQ
      this.totalNetQQ = isAPIData ? (convertLbtoQQ(this.totalNet, config.conversionMeasurementUnitFactor) ?? this.totalNetQQ) : (item.totalNetQQ ?? this.totalNetQQ);
      this.totalNetQQRow = isAPIData ? (item.netQQ ?? this.totalNetQQRow) : (item.totalNetQQRow ?? this.totalNetQQRow);
      this.totalTareQQ = isAPIData ? (item.tareQQ ?? this.totalTareQQ) : (item.totalTareQQ ?? this.totalTareQQ);
      this.totalGrossQQ = isAPIData ? (item.groos_weightQQ ?? this.totalGrossQQ) : (item.totalGrossQQ ?? this.totalGrossQQ);
      this.totalDiscountQQ = isAPIData ? (item.penaltiesQQ ?? this.totalDiscountQQ) : (item.totalDiscountQQ ?? this.totalDiscountQQ);
      this.totalAdditionQQ = isAPIData ? (item.additionQQ ?? this.totalAdditionQQ) : (item.totalAdditionQQ ?? this.totalAdditionQQ);
      this.totalNetDryWtQQ = isAPIData ? (convertLbtoQQ(this.totalNetDryWt, config.conversionMeasurementUnitFactor) ?? this.totalNetDryWtQQ) : (item.totalNetDryWtQQ ?? this.totalNetDryWtQQ);

      this.isDataLoadedOnEdit = isAPIData ? this.isDataLoadedOnEdit : item.isDataLoadedOnEdit ?? this.isDataLoadedOnEdit;
      this.isLoadingCharacteristics = isAPIData ? this.isLoadingCharacteristics : item.isLoadingCharacteristics ?? this.isLoadingCharacteristics;
      this.characteristicsWasLoaded = isAPIData ? this.characteristicsWasLoaded : item.characteristicsWasLoaded ?? this.characteristicsWasLoaded;
      this.characteristics = isAPIData ? this.characteristics : item.characteristics ?? this.characteristics;
      this.isWarningContainer = isAPIData ? this.isWarningContainer : item.isWarningContainer ?? this.isWarningContainer;
      this.inProcess = isAPIData ? item.in_process : item.inProcess ?? this.inProcess;
      this.inPurchaseOrder = isAPIData ? item.in_purchase_order == 1 : item.inPurchaseOrder ?? this.inPurchaseOrder;
      this.statusLot = isAPIData ? item.status_lot : item.statusLot ?? this.statusLot;
      this.deletionReason = isAPIData ? item.deletion_reason : item.deletionReason ?? this.deletionReason;

      let tareAditional = 0;
      this.weights.forEach(w => tareAditional += w.tareAditional);
      this.totalTareAditional = tareAditional ?? this.totalTareAditional;

      let tareContainer = 0;
      this.weights.forEach(w => tareContainer += w.tare);
      this.totalTareContainer = tareContainer ?? this.totalTareContainer;

      this.totalSumTares = accurateDecimalSum([this.totalTareContainer, this.totalTareAditional], decimals);
    }
    else {
      Object.assign(this, {});
    }
    if (0 == this.weights.length) {
      this.weights.push(new WNWeightModel());
    }
    this.weights = sortBykey(this.weights, 'index');
    this.penalties = sortBykey(this.penalties, 'index');
    this.characteristics = sortByStringValue(this.characteristics, 'name');
    this.certifications = sortBykey(this.certifications, 'id');
  }
}
