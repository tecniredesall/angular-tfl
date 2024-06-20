import { IContractFeaturesModel, IFeaturesModel } from "./contract-features.model";

export class MatchFeatureRequestModel {
    contract_id: string;
    features: FeatureRequestModel[] = [];

    constructor(item: IContractFeaturesModel) {
        this.contract_id = item.contracId;
        item.features.forEach(feature => {
            if (feature.idTransformationFeature) {
                let currentFeature = new FeatureRequestModel(feature);
                this.features.push(currentFeature);
            }
        });
    }
}
export class FeatureRequestModel {
    trumodity_characteristic_id: string;
    characteristic_id: string;
    constructor(item: IFeaturesModel) {
        this.trumodity_characteristic_id = item.idTrumodityFeature;
        this.characteristic_id = item.idTransformationFeature;
    }
}
