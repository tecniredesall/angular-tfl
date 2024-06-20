

export class LotComponentsFlowCreateModel {
    component: LotFlowCreateLotEnum;
    nextComponent?: LotFlowCreateLotEnum;
    prevComponent?: LotFlowCreateLotEnum;
    haveNextStep?: boolean;
    haveBackButton?: boolean;
}

export enum LotFlowCreateLotEnum {
    initialComponent = 0,
    filtersComponent = 1,
    flowProductionComponent = 2,
    createLotComponent = 3
}
