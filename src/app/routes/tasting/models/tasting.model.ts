import { ITastingGeneralInformationModel, TastingGeneralInformationModel } from "./tastingGeneralInformation.model";
import { STTastingLaboratoryDetailsModel, TastingLaboratoryDetailsModel } from "./tastingLaboratoryDetails.model";
import { STTastingSensoryAnalysisModel, TastingSensoryAnalysisModel } from "./tastingSensoryAnalysis.model";

export interface ITastingModel {
    generalInformation: ITastingGeneralInformationModel;
    sensoryAnalysis: STTastingSensoryAnalysisModel;
    laboratoryDetails: STTastingLaboratoryDetailsModel;
    flavors: Array<string>;
}

export class TastingModel implements ITastingModel {

    public generalInformation: ITastingGeneralInformationModel = new TastingGeneralInformationModel();
    public sensoryAnalysis: STTastingSensoryAnalysisModel = new TastingSensoryAnalysisModel();
    public laboratoryDetails: STTastingLaboratoryDetailsModel = new TastingLaboratoryDetailsModel();
    public flavors: Array<string> = []

}