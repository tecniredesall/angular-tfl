import { ITastingModel } from './tasting.model';
import { ITastingGeneralInformationRequestModel, TastingGeneralInformationRequestModel } from './tastingGeneralInformationRequest.model';
import { STTastingLaboratoryDetailsModel, TastingLaboratoryDetailsModel } from './tastingLaboratoryDetails.model';
import { STTastingLaboratoryDetailsRequestModel, TastingLaboratoryDetailsRequestModel } from './tastingLaboratoryDetailsRequest.model';
import { STTastingSensoryAnalysisRequestModel, TastingSensoryAnalysisRequestModel } from './tastingSensoryAnalysisRequest.model';

export interface ITastingRequestModel {
    lot_id: string,
    note: string,
    general_data: ITastingGeneralInformationRequestModel,
    sensory_analysis: STTastingSensoryAnalysisRequestModel,
    lab_details: STTastingLaboratoryDetailsModel,
    flavors: Array<string>

}

export class TastingRequestModel implements ITastingRequestModel {

    public lot_id: string;
    public note: string;
    public general_data: ITastingGeneralInformationRequestModel;
    public sensory_analysis: STTastingSensoryAnalysisRequestModel;
    public lab_details: STTastingLaboratoryDetailsRequestModel;
    public flavors: Array<string>;


    constructor(tasting: ITastingModel, lotId: string, note: string) {
        this.lot_id = lotId;
        this.note = note;
        this.general_data = new TastingGeneralInformationRequestModel(tasting.generalInformation);
        this.sensory_analysis = new TastingSensoryAnalysisRequestModel(tasting.sensoryAnalysis);
        this.lab_details = new TastingLaboratoryDetailsRequestModel(tasting.laboratoryDetails);
        this.flavors = tasting.flavors;
    };

}



