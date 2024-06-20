import * as moment from 'moment';
import {
    accurateDecimalMultiplication, accurateDecimalSum
} from '../../../shared/utils/functions/accurate-decimal-operation';
import { ITRSealImage, TRSealImage } from '../../../shared/utils/models/seal-image.model';
import { ILotListWeightNote, LotListWeightNote } from './lot-list-weight-note.model';
import { ILotProcessingOrderModel, LotProcessingOrderModel } from './lot-processing-order.model';
import { ILotDetailTransitionModel, LotDetailTransitionModel } from './lot-detail-transition.model';
import { ILotWarehouseModel, LotWarehouseModel } from './lot-warehouse.model';
import { WNPenaltyModel } from '../../weight-note/models/wn-penalty.model';
import { convertLbtoQQ } from 'src/app/shared/utils/functions/convert-qq-to-lb';

export interface ILotListWeightNoteGrouper {
    id: string;
    folio: string;
    createdDate: moment.Moment;
    creatorUser: string;
    commodityType: string;
    commodityId?: number;
    transformationTypeId: string;
    warehouse: string;
    currentProductionTankId: string;
    productionTypeName: string;
    processColor: string;
    process: string;
    processId: string;
    weightNotes: Array<ILotListWeightNote>;
    totalNotes: number;
    netWeightQQ: number;
    seals: Array<ITRSealImage>;
    opened: boolean;
    damage: boolean;
    workflowId: string;
    transitions: Array<ILotProcessingOrderModel>;
    weightQQ?: number;
    currentWeightQQ?: number;
    currentTransition?: ILotDetailTransitionModel;
    status?: number;
    lotParentId?: string;
    lotParentFolio?: string;
    productionTanks?: Array<ILotWarehouseModel>;
    currentWeightLB?: number;
    sellers: Array<string>;
    workFlowName: string;
    isSelected: boolean;
    penalties: Array<WNPenaltyModel>
    initialTareWeight: number;
    projectedWeight: number;
    grossWeightQQ?: number;
    grossWeightLB?: number;
    weightNotesWarehouses?: string[];

}

export class LotListWeightNoteGrouper implements ILotListWeightNoteGrouper {
    public id: string = null;
    public folio: string = null;
    public createdDate: moment.Moment = null;
    public creatorUser: string = '';
    public commodityType: string = '';
    public commodityId: number = null;
    public transformationTypeId: string = '';
    public warehouse: string = '';
    public productionTypeName: string = '';
    public processColor: string = null;
    public process: string = '';
    public processId = null;
    public weightNotes: Array<ILotListWeightNote> = [];
    public totalNotes: number = 0;
    public netWeightQQ: number = 0;
    public seals: Array<ITRSealImage> = [];
    public opened: boolean = false;
    public sellers: string[] = [];
    public workflowId = '';
    public transitions: Array<ILotProcessingOrderModel> = [];
    public damage: boolean;
    public weightQQ?: number = 0;
    public currentWeightQQ?: number = 0;
    public currentWeightLB?: number = 0;
    public currentTransition?: ILotDetailTransitionModel;
    public status?: number = null;
    public currentProductionTankId: string = null;
    public lotParentId?: string = null;
    public lotParentFolio?: string = null;
    public productionTanks?: Array<ILotWarehouseModel> = [];
    public workFlowName: string = null;
    public isSelected: boolean = false;
    public penalties: WNPenaltyModel[];
    public initialTareWeight: number = 0;
    public projectedWeight: number = 0;
    public grossWeightQQ = 0;
    public grossWeightLB = 0;
    public weightNotesWarehouses? = [];

    constructor(
        data?: {
            item: any;
            config: {
                baseMeasurementUnitFactor: number;
                decimalPlaces: number;
            };
        },
        isAPIData: boolean = false
    ) {
        if (data) {
            this.id = data.item.id ?? this.id;
            this.folio = data.item.folio ?? this.folio;
            this.currentWeightLB = data.item.weight_current ?? this.currentWeightLB;
            this.currentProductionTankId = data.item.current_production_tank_id ?? data.item.production_tank_id ?? this.currentProductionTankId;
            if (data.item.production_tanks) {
                data.item.production_tanks.forEach(element => {
                    this.productionTanks.push(new LotWarehouseModel(element, true));
                });
            }

            this.createdDate = isAPIData ? (data.item.created_at ? moment(data.item.created_at, 'YYYY-MM-DD HH:mm:ss')
                : this.createdDate) :
                (data.item.createdDate ? moment(data.item.createdDate, 'YYYY-MM-DD HH:mm:ss') : this.createdDate);
            this.creatorUser = isAPIData
                ? data.item.author?.full_name ?? this.creatorUser
                : data.item.creatorUser ?? this.creatorUser;
            this.commodityType = isAPIData
                ? data.item.transformation_name_current ?? this.commodityType
                : data.item.commodityType ?? this.commodityType;
            this.commodityId = isAPIData
                ? data.item.commodity_id ?? this.commodityId
                : data.item.commodityId ?? this.commodityId;
            this.warehouse = isAPIData
                ? data.item.tank_name ?? this.warehouse
                : data.item.warehouse ?? this.warehouse;
            this.productionTypeName = isAPIData
                ? data.item.production_type_name ?? this.productionTypeName
                : data.item.productionFlow ?? this.productionTypeName;
            this.processColor = isAPIData
                ? data.item.current
                    ? data.item.current.color ?? this.processColor
                    : data.item.color ?? this.processColor
                : data.item.processColor ?? this.processColor;
            this.process = isAPIData
                ? data.item.current
                    ? data.item.current.process_name ?? this.process
                    : data.item.process_name ?? this.process
                : data.item.process ?? this.process;
            this.processId = isAPIData
                ? data.item.current_process_id ?? this.processId
                : data.item.processId ?? this.processId;
            this.workflowId = isAPIData
                ? data.item.workflow_id ?? this.workflowId
                : data.item.workflowId ?? this.workflowId;
            this.workFlowName = isAPIData
                ? data.item.workflow_name ?? this.workFlowName
                : data.item.workFlowName ?? this.workFlowName;
            this.opened = data.item.hasOwnProperty('opened')
                ? data.item.opened
                : this.opened;
            this.damage = data.item.damage === 1 ? true : false;
            this.transformationTypeId = isAPIData
                ? data.item.commodity_transformation_id ?? this.transformationTypeId
                : data.item.transformationTypeId ?? this.transformationTypeId;
            this.currentWeightQQ = data.item.weight_current
                ? accurateDecimalMultiplication(
                    [
                        data.item.weight_current,
                        data.config.baseMeasurementUnitFactor,
                    ],
                    data.config.decimalPlaces)
                : accurateDecimalMultiplication(
                    [
                        data.item.weight,
                        data.config.baseMeasurementUnitFactor,
                    ],
                    data.config.decimalPlaces);
            this.weightQQ = accurateDecimalMultiplication(
                [
                    data.item.weight,
                    data.config.baseMeasurementUnitFactor,
                ],
                data.config.decimalPlaces);
            this.currentTransition = new LotDetailTransitionModel(data.item.current);
            this.currentTransition.transitionAt = this.currentTransition.transitionAt;
            this.currentTransition.productionTankId = this.currentTransition.productionTankId ?? this.currentProductionTankId;
            this.currentTransition.transformationTypeId = this.currentTransition.transformationTypeId ?? this.transformationTypeId;
            this.status = data.item.status;
            this.lotParentId = isAPIData
                ? data.item.lot_id_parent ?? this.lotParentId
                : data.item.lotParentId ?? this.lotParentId;
            this.lotParentFolio = isAPIData
                ? data.item.lot_folio_parent ?? this.lotParentFolio
                : data.item.lotParentFolio ?? this.lotParentFolio;
            if (isAPIData && data.item.transitions) {
                let trans: ILotProcessingOrderModel = null;
                data.item.transitions.forEach((t) => {
                    trans = new LotProcessingOrderModel(t, data.config);
                    this.transitions.push(trans);
                });
            }
            if (isAPIData && data.item.production_tanks) {
                data.item.production_tanks.forEach(t => {
                    let tank: ILotWarehouseModel = new LotWarehouseModel();
                    tank.id = t.id;
                    this.productionTanks.push(tank);
                });
            }
            if (null == this.processId) {
                this.processColor = '#70889e';
            }
            if (isAPIData && data.item.weight_notes) {
                let note: ILotListWeightNote = null;
                let grossWeightQQ = 0;
                let grossWeightLB = 0;
                data.item.weight_notes.forEach((w: any) => {
                    note = new LotListWeightNote(
                        { item: w, config: data.config },
                        true
                    );
                    this.weightNotes.push(note);
                    this.totalNotes++;
                    this.netWeightQQ = accurateDecimalSum(
                        [this.netWeightQQ, note.netWeightQQ],
                        data.config.decimalPlaces
                    );
                    this.seals = [
                        ...this.seals,
                        ...note.seals.filter(
                            (s: ITRSealImage) =>
                                -1 ==
                                this.seals.findIndex(
                                    (i: TRSealImage) => s.id == i.id
                                )
                        ),
                    ];
                    const sellers = data.item.weight_notes.map(
                        (n) => n.seller_name
                    );
                    this.sellers = sellers.filter(
                        (v, i) => sellers.findIndex((item) => item == v) === i
                    );
                    grossWeightLB +=parseFloat(w.net)
                    grossWeightQQ += convertLbtoQQ(parseFloat(w.net));
                });
                this.grossWeightLB = grossWeightLB;
                this.grossWeightQQ = grossWeightQQ;
                this.seals = data.item.certifications ? data.item.certifications.map((seals: any) => new TRSealImage(seals)) : this.seals;
            } else {
                this.sellers = data.item.sellers
                    ? data.item.sellers
                    : this.sellers;
                this.weightNotes = data.item.weightNotes
                    ? [...data.item.weightNotes]
                    : this.weightNotes;
                this.totalNotes = data.item.totalNotes ?? this.totalNotes;
                this.netWeightQQ = data.item.netWeightQQ ?? this.netWeightQQ;
                this.seals = data.item.seals
                    ? [...data.item.seals]
                    : this.seals;
            }
            this.penalties = data.item.lots_weight_penalties ? data.item.lots_weight_penalties.map((p: any) => new WNPenaltyModel(p, true)) : this.penalties
            this.initialTareWeight = data.item.current ? convertLbtoQQ(data.item.current?.initial_featured_weight ?? 0) : this.initialTareWeight;
            this.projectedWeight = data.item.current ? convertLbtoQQ(data.item.current?.initial_net_weight ?? 0) : this.projectedWeight

        } else {
            Object.assign(this, {});
        }
    }


    public getEstimatedNetWeight?(): number {
        return this.processId === 'pending_process' ? convertLbtoQQ(this.currentWeightLB) : this.projectedWeight;
    }

    public getCurrentFeaturedWeight?(): number {
        return this.processId === 'pending_process' ? convertLbtoQQ(this.currentWeightLB) : this.initialTareWeight;
    }



}
