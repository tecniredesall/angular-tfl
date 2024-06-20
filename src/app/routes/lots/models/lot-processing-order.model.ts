import * as moment from 'moment';
import {
    accurateDecimalMultiplication
} from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';

export interface ILotProcessingOrderModel {
    id: string;
    color: string;
    folio: string;
    warehouse: string;
    commodityType: string;
    initialDate: moment.Moment;
    closeDate: moment.Moment;
    transitionAt: moment.Moment;
    updatedDate: moment.Moment;
    weight: number;
    weightQQ: number;
    efficiency: number;
    moisture: number;
    process: string;
    processId: string;
    note: string;
    hours: number;
    creatorUser: string
    initialTareWeight:number;
    projectedWeight:number;
    finalTransitionWeight:number;
}

export class LotProcessingOrderModel implements ILotProcessingOrderModel {
    public id: string = '';
    public color: string = '';
    public folio: string = '';
    public warehouse: string = '';
    public commodityType: string = '';
    public initialDate: moment.Moment = null;
    public closeDate: moment.Moment = null;
    public updatedDate: moment.Moment = null;
    public transitionAt: moment.Moment = null;
    public weight: number = 0;
    public weightQQ: number = 0;
    public efficiency: number = 0;
    public moisture: number = 0;
    public hours: number = null;
    public process: string = '';
    public processId: string = null;
    public note: string = '';
    public creatorUser: string = '';
    public initialTareWeight:number;
    public projectedWeight:number;
    public finalTransitionWeight: number;
    constructor(item: any, config: {
        baseMeasurementUnitFactor: number;
        decimalPlaces: number;
    }) {
        if (item) {
            this.id = item.id ?? this.id;
            this.color = item.color ?? this.color;
            this.folio = item.folio ?? this.folio;
            this.warehouse = item.tank_name ?? this.warehouse;
            this.commodityType = item.transformation_name ?? this.commodityType;
            this.initialDate = item.created_at ? moment(item.created_at, 'YYYY-MM-DD HH:mm:ss') : this.initialDate;
            this.closeDate = item.closed_at ? moment(item.closed_at, 'YYYY-MM-DD HH:mm:ss') : null
            this.updatedDate = item.updated_at ? moment(item.updated_at, 'YYYY-MM-DD HH:mm:ss') : null
            this.weight = item.weight ?? this.weight;
            this.weightQQ = accurateDecimalMultiplication([this.weight, config.baseMeasurementUnitFactor], config.decimalPlaces);
            this.efficiency = item.efficiency ?? this.efficiency;
            this.moisture = item.moisture ?? this.moisture;
            this.process = item.process_name ?? this.process;
            this.processId = item.process_id ?? this.processId;
            this.note = item.note ?? this.note;
            this.hours = item.hours ?? this.hours;
            this.creatorUser = item.author ? item.author.full_name : this.creatorUser
            this.transitionAt = item.transition_at ?? this.transitionAt
            this.finalTransitionWeight =  convertLbtoQQ(item.final_net_weight) ?? this.finalTransitionWeight
            this.projectedWeight =  convertLbtoQQ(item.initial_net_weight) ?? this.projectedWeight
            this.initialTareWeight =  convertLbtoQQ(item.initial_featured_weight) ?? this.initialTareWeight
        } else {
            Object.assign(this, {});
        }
    }
}
export class ProcessingOrderModel {
    folio: string;
    id: string;
    note: string
    origin: ProcessingOrderDataModel;
    destination: ProcessingOrderDataModel;
    efficiency: number;
    moisture: number;
    color: string;
    process: string;
    opened: boolean = false
    hours: number;
}
export class ProcessingOrderDataModel {
    warehouse: string;
    commodityType: string;
    date: moment.Moment;
    quantity: number;
}
