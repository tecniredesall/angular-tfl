import * as moment from "moment";

export interface ILotDetailTransitionModel {
    id: string;
    level: number;
    lotId: string;
    weight: number;
    closedAt: moment.Moment;
    createdAt: moment.Moment;
    updateAt: moment.Moment;
    transitionAt: moment.Moment;
    productionTankId : string;
    commodityTransformationId: string;
    transformationTypeId:string;
    initialFeaturedWeight: number;
}

export class LotDetailTransitionModel implements ILotDetailTransitionModel {
    public id: string = null;
    public level: number = -1;
    public lotId: string = null;
    public weight: number = null;
    public closedAt: moment.Moment = null;
    public createdAt: moment.Moment = null;
    public updateAt: moment.Moment = null;
    public transitionAt: moment.Moment = null;
    public productionTankId: string;
    public commodityTransformationId: string;
    public transformationTypeId: string;
    public initialFeaturedWeight: number;
    constructor(item?: any) {
        this.id = item ? item.id : this.id;
        this.level = item? item.level : this.level,
        this.lotId = item ? item.lot_id : this.lotId;
        this.weight = item ? item.weight : this.weight;
        this.closedAt = item ? this.getClosedAt(item.closed_at): this.closedAt;
        this.createdAt = item ? moment(item.created_at, 'YYYY-MM-DD HH:mm:ss') : this.createdAt;
        this.updateAt = item ? moment(item.updated_at, 'YYYY-MM-DD HH:mm:ss') : this.updateAt;
        this.transitionAt = item ? moment(item.transition_at, 'YYYY-MM-DD HH:mm:ss') : this.transitionAt;
        this.productionTankId = item ? item.production_tank_id : this.productionTankId;
        this.commodityTransformationId = item?.commodity_transformation_id ?? item?.commodityTransformationId ?? this.commodityTransformationId;
        this.transformationTypeId = item ?  item.transformation_type_id : this.transformationTypeId;
        this.initialFeaturedWeight = item ? item.initial_featured_weight ?? item.initialFeaturedWeight : this.initialFeaturedWeight;
    }

    getClosedAt(date){
         return moment(date,'YYYY-MM-DD HH:mm:ss').isValid() ?  moment(date,'YYYY-MM-DD HH:mm:ss') : undefined ;
    }

}
