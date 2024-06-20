export class InstanceModel {
    gcbcid?: string;
    id: number;
    name: string;
    uri_farmer?: string;
    uri_oauth_farmer?: string;
    uri_oauth_owner?: string;
    uri_owner?: string;
    apps?: AplicationsModel[] = [];

}

export class AplicationsModel {
    application_id?: string;
    name: string;
    start_date?: string;
    end_date?: string;
}
