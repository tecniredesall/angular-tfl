import * as moment from "moment";

export interface ITastingGeneralInformationModel {
    creationDate: moment.Moment,
    countryId: string,
    producer: string,
    reference: string,
    region: string
}

export class TastingGeneralInformationModel implements ITastingGeneralInformationModel {
    public id: string = null;
    public creationDate: moment.Moment = null;
    public countryId: string = 'Honduras';
    public producer: string = null;
    public reference: string = null;
    public region: string = null;

    constructor(item?: any, isAPIData: boolean = false, isFromDetailed: boolean = false) {
        if (item) {
            this.creationDate = isAPIData ? item.created_at : item.creationDate ?? this.creationDate;
            this.countryId = isAPIData ? item.country_id : item.countryId ?? this.countryId;
            this.producer = isAPIData ? item.producer : item.producer ?? this.producer;
            this.reference = isAPIData ? item.reference : item.reference ?? this.reference;
            this.region = isAPIData ? item.region : item.region ?? this.region;
        } else {
            Object.assign({}, this);
        }
    }

}