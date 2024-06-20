import { ITRSealImage, TRSealImage } from './../../../shared/utils/models/seal-image.model';
import * as moment from "moment";
import { IWNPurchaseOrderModel, WNPurchaseOrderModel } from './receiving-note-list.model';

export interface IWNProductionModel {
    print: number,
    lotId: number,
    folio: number,
    productionTankId:string,
    transactionInId: number,
    weightNoteId: string,
    receptionId: string,
    status: number,
    paymentStatus: number,
    tank: number,
    producerName: string,
    paternalLast: string,
    ctName:string,
    vtankName: string,
    startDate: moment.Moment;
    weight: number,
    email: string,
    creationName: string,
    groosWeight: number,
    net: number,
    tareUnits: number,
    tareWeight: number,
    penalties: number,
    netdrywt: number,
    certifications: ITRSealImage[],
    inProcess : number
    associated: IWNPurchaseOrderModel;
}


  export class WNProductionModel implements IWNProductionModel {
    print: number = null;
    lotId: number = null;
    folio: number = null;
    productionTankId: string = '';
    transactionInId: number = null;
    weightNoteId: string = '';
    receptionId: string = '';
    status: number = null;
    paymentStatus: number = null;
    tank: number = null;
    producerName: string = '';
    paternalLast: string = '';
    ctName: string = '';
    vtankName: string = '';
    startDate: moment.Moment = null;
    weight: number = null;
    email: string = '';
    creationName: string = '';
    groosWeight: number = null;
    net: number = null;
    tareUnits: number = null;
    tareWeight: number = null;
    penalties: number = null;
    netdrywt: number = null;
    certifications : ITRSealImage[] = [];
    inProcess : number = 0
    public associated: IWNPurchaseOrderModel;

    constructor(item?: any, isAPIData: boolean = false) {
      if (isAPIData) {
        this.print=  isAPIData ? item.print  :  this.print;
        this.lotId=  isAPIData ? item.lot_id : this.lotId ;
        this.folio=  isAPIData ? item.folio :  this.folio;
        this.productionTankId= isAPIData ? item.production_tank_id : this.productionTankId;
        this.transactionInId=  isAPIData ? item.transaction_in_id  :  this.transactionInId;
        this.weightNoteId= isAPIData ? item.weight_note_id : this.weightNoteId
        this.receptionId= isAPIData ? item.reception_id : this.receptionId;
        this.status=  isAPIData ? item.production_status ?? item.wn_status : this.status;
        this.paymentStatus=  isAPIData ? item.payment_status : this.paymentStatus;
        this.tank=  isAPIData ? item.tank : this.tank;
        this.producerName= isAPIData ? item. producer_name : this.producerName;
        this.paternalLast= isAPIData ? item.paternal_last : this. paternalLast;
        this.ctName= isAPIData ? item.ct_name: this.ctName ;
        this.vtankName= isAPIData ? item.vtank_name: this.vtankName ;
        this.startDate=   isAPIData ? item.start_date ? moment(item.start_date, 'YYYY-MM-DD HH:mm:ss') : this.startDate : item.start_date
                            ? moment(item.start_date)
                            : this.startDate;
        this.weight=  isAPIData ? item.weight : this.weight;
        this.email= isAPIData ? item.email: this.email;
        this.creationName= isAPIData ? item.creation_name : this.creationName;
        this.groosWeight=  isAPIData ? item.groos_weight : this.groosWeight;
        this.net=  isAPIData ? item.net : this.net;
        this.tareUnits=  isAPIData ? item.tare_units : this.tareUnits  ;
        this.tareWeight=  isAPIData ? item.tare_weight: this.tareWeight ;
        this.penalties=  isAPIData ? item. penalties : this.penalties;
        this.netdrywt=  isAPIData ? item.netdrywt : this.netdrywt ;
        this.inProcess=  isAPIData ? (item.in_process == null ? 1 : item.in_process) : this.inProcess ;
        this.certifications =  isAPIData ?  item.certifications.map((item : any) => {return  new TRSealImage(item)}) : this.certifications;
        this.associated = item.associated ? new WNPurchaseOrderModel(item.associated) : this.associated;
      }
      else {
        Object.assign(this, {});
      }
    }

  }
