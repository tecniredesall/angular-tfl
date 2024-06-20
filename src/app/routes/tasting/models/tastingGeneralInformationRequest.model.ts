import * as moment from "moment";

export interface ITastingGeneralInformationRequestModel {
    created_at: moment.Moment,
    country_id: string,
    producer: string,
    reference: string,
    region: string
}

export class TastingGeneralInformationRequestModel implements ITastingGeneralInformationRequestModel {
    public created_at: moment.Moment = null;
    public country_id: string = 'Honduras';
    public producer: string = null;
    public reference: string = null;
    public region: string = null;

    constructor(item?: any, isAPIData: boolean = false, isFromDetailed: boolean = false) {
        if (item) {
            this.created_at = isAPIData ? item.created_at : item.creationDate.format();
            this.country_id = 'aadae5593d17e88c15bf21c9';
            // this.country_id = isAPIData ? item.country_id : item.countryId;
            this.producer = isAPIData ? item.producer : item.producer;
            this.reference = isAPIData ? item.reference : item.reference;
            this.region = isAPIData ? item.region : item.region;

        } else {
            Object.assign({}, this);
        }
    }

}