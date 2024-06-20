import { IWNWeightRequestModel, WNWeightRequestModel } from './../../../shared/models/wn-weight-request-model';
import { IWNWeightModel, WNWeightModel } from './../../weight-note/models/wn-weight.model';
import * as moment from "moment";
import { accurateDecimalDivision } from "src/app/shared/utils/functions/accurate-decimal-operation";
import { truncateDecimals } from "src/app/shared/utils/functions/truncate-decimals";
import { sortBykey } from 'src/app/shared/utils/functions/sortFunction';
import { IWNRequestPenaltyModel, WNRequestPenaltyModel } from '../../weight-note/models/wn-request-action-receiving-note.model';
import { WNPenaltyModel } from '../../weight-note/models/wn-penalty.model';

export interface ITransitionViewModel {
    lotId: string;
    current: ITransitionModel;
    target: ITransitionModel;
}

export interface ITransitionViewRequestModel {
    lot_id: string;
    current: ITransitionRequestCurrentModel;
    target: ITransitionRequestTargetModel
}

export interface ITransitionModel {
    id?: string;
    lotId: string;
    processId: string;
    workflowId: string;
    commodityTransformationId: string;
    transformationTypeId: string;
    warehouseId: string;
    weight: number;
    hours: number;
    weights: IWNWeightModel[];
    penalties: WNPenaltyModel[];
    note?: string;
    closedAt?: moment.Moment;
    transitionAt?: moment.Moment;
    initialFeaturedWeight: number;
    finalFeaturedWeight: number;
    initialNetWeight: number;
    finalNetWeight: number;
}

export interface ITransitionRequestCurrentModel {
    process_id: string;
    weight: number;
    moisture?: string;
    note?: string;
    closed_at?: any;
    transition_at?: any;
    commodity_transformation_id: string;
    weights : IWNWeightRequestModel[]
    penalties: IWNRequestPenaltyModel[]
    production_tank_id:string;
    final_featured_weight: number;
    final_net_weight: number;
}

export interface ITransitionRequestTargetModel {
    process_id:string;
    commodity_transformation_id:string;
    production_tank_id:string;
    transition_at:moment.Moment;

}

export class TransitionViewModel implements ITransitionViewModel {
    public lotId: string;
    public current: ITransitionModel;
    public target: ITransitionModel;

    constructor(
        item: any,
        config: {
            decimalPlaces: number;
            baseMeasurementUnitFactor: number;
        }
    ) {
        this.lotId = item.lotId ?? item.current.lotId;
        this.current = new TransitionModel(item.current, config);
        this.target = item.target ? new TransitionModel(item.target, config) : null;
    }
}

export class TransitionModel implements ITransitionModel {
    public id?: string;
    public lotId: string;
    public processId: string;
    public workflowId: string;
    public commodityTransformationId: string;
    public transformationTypeId: string;
    public warehouseId: string;
    public weight: number;
    public hours: number = 0;
    public weights: IWNWeightModel[] = [];
    public penalties: WNPenaltyModel[] = [];
    public note?: string = '';
    public closedAt?: moment.Moment;
    public transitionAt?: moment.Moment;
    public initialFeaturedWeight: number;
    public finalFeaturedWeight: number;
    public initialNetWeight: number;
    public finalNetWeight: number;

    constructor(
        item: any,
        config: {
            decimalPlaces: number;
            baseMeasurementUnitFactor: number;
        },
        isFromApi = false
    ) {
        this.id = item.id;
        this.lotId = item.lot_id ?? item.lotId;
        this.processId = item.process_id ?? item.processId;
        this.workflowId = item.workflow_id ?? item.workflowId ?? this.workflowId;
        this.commodityTransformationId = item.commodity_transformation_id ?? item.commodityTransformationId;
        this.transformationTypeId = item.transformation_type_id ?? item.transformationTypeId;
        this.warehouseId = item.production_tank_id ?? item.warehouseId ?? item.productionTankId;
        this.weight = isFromApi ? truncateDecimals(item.weight * config.baseMeasurementUnitFactor, config.decimalPlaces) : item.weight;
        this.note = item.note ?? this.note;
        this.closedAt = isFromApi ? moment(item.closed_at, 'YYYY-MM-DD HH:mm:ss') : item.closedAt;
        this.transitionAt = isFromApi ? moment(item.transition_at, 'YYYY-MM-DD HH:mm:ss') : item.transitionAt;
        this.weights = isFromApi ? item.weight_lots_weights?.map((w:any) => {return new WNWeightModel(w,isFromApi)}) : item.weights  ?? this.weights
        this.penalties = isFromApi ? item.penalties_lots_weight?.map((w:any) => {return new WNWeightModel(w,isFromApi)}) : item.penalties  ?? this.penalties
        if(this.weights?.length > 0)
            this.weights = sortBykey(this.weights, 'index');
        if(this.penalties?.length > 0)
            this.penalties = sortBykey(this.penalties, 'index');
        this.hours = item.hours ?? this.hours;
        this.initialFeaturedWeight = item.initial_featured_weight ?? item.initialFeaturedWeight ?? this.initialFeaturedWeight;
        this.finalFeaturedWeight = item.final_featured_weight ?? item.finalFeaturedWeight ?? this.finalFeaturedWeight;
        this.initialNetWeight = item.initial_net_weight ?? item.initialNetWeight ?? this.initialNetWeight;
        this.finalNetWeight = item.final_net_weight ?? item.finalNetWeight ?? this.finalNetWeight
    }

}

export class TransitionViewRequestModel implements ITransitionViewRequestModel {

    public lot_id: string;
    public current: ITransitionRequestCurrentModel;
    public target: ITransitionRequestTargetModel

    constructor(
        transition: ITransitionViewModel,
        _config: {
            decimalPlaces: number;
            baseMeasurementUnitFactor: number;
        }
    ) {
        this.lot_id = transition.lotId;
        this.current = new TransitionRequestCurrentModel(transition.current, _config);
        this.target = transition.target ? new TransitionRequestTargetModel(transition.target, _config) : null;
    }
}

export class TransitionRequestCurrentModel implements  ITransitionRequestCurrentModel{
    public process_id: string;
    public weight: number;
    public note?: string;
    public closed_at?: any;
    public transition_at?: any;
    public commodity_transformation_id: string;
    public weights: IWNWeightRequestModel[];
    public penalties: IWNRequestPenaltyModel[];
    public production_tank_id: string;
    public final_featured_weight: number;
    public final_net_weight: number;

    constructor(
        transition: ITransitionModel,
        _config: {
            decimalPlaces: number;
            baseMeasurementUnitFactor: number;
        }
    ){
        this.process_id = transition.processId;
        this.transition_at = transition.transitionAt;
        this.closed_at = transition.closedAt;
        this.commodity_transformation_id = transition.commodityTransformationId;
        this.production_tank_id = transition.warehouseId;
        this.weights = transition.weights.map((w: IWNWeightModel, index: number) => {
            w.index = index;
            return new WNWeightRequestModel(w);
        });
        this.penalties = transition.penalties.map((w: WNPenaltyModel, index: number) => {
            w.index = index;
            return new WNRequestPenaltyModel(w);
        });
        this.note = transition.note;
        this.weight = transition.weight;
        this.final_net_weight = transition.finalNetWeight;
        this.final_featured_weight = transition.finalFeaturedWeight;
    }
}

export class TransitionRequestTargetModel implements  ITransitionRequestTargetModel{
    transition_at: moment.Moment;
    process_id: string;
    commodity_transformation_id: string;
    production_tank_id: string;

    constructor(
        transition: ITransitionModel,
        _config: {
            decimalPlaces: number;
            baseMeasurementUnitFactor: number;
        }
    ){
        this.process_id = transition.processId;
        this.transition_at = transition.transitionAt;
        this.commodity_transformation_id = transition.commodityTransformationId;
        this.production_tank_id = transition.warehouseId;
    }
}
