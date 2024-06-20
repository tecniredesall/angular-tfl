import { IWNCharacteristicModel } from '../../weight-note/models/wn-characteristic.model';

export interface IContractFeaturesModel {
    contracId: string;
    date: string;
    features: IFeaturesModel[];
}

export class ContractFeaturesModel implements IContractFeaturesModel {
    public contracId: string = null;
    public date: string = null;
    public features: IFeaturesModel[] = [];


    constructor(item: any, features: IWNCharacteristicModel[] = []) {
        this.contracId = item.contract_id ? item.contract_id : this.contracId
        this.date = item.date ? item.date : this.date;
        if (item.features) {
            item.features.forEach(element => {
                let feature = new FeaturesModel(element, features);
                this.features.push(feature);
            });
        }
    }
}
export interface IFeaturesModel {
    idTrumodityFeature: string;
    transformationFeature: string;
    idTransformationFeature: string;
    availableFeatures?: IWNCharacteristicModel[];
    selected?: IWNCharacteristicModel;

}
export class FeaturesModel implements IFeaturesModel {
    public idTrumodityFeature: string = null;
    public transformationFeature: string = null;
    public idTransformationFeature: string = null;
    public availableFeatures?: IWNCharacteristicModel[];
    public selected?: IWNCharacteristicModel= null;
    constructor(item: any, features: IWNCharacteristicModel[]) {
        this.idTrumodityFeature = item.idFeature ? item.idFeature : this.idTrumodityFeature;
        this.idTransformationFeature = item.characteristic_id ? item.characteristic_id : this.idTransformationFeature;
        this.transformationFeature = item.characteristic ? item.characteristic : this.transformationFeature;
        this.availableFeatures = features;
    }
}

