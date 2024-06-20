import { titleCaseWord } from 'src/app/shared/utils/functions/titlecase';
import { trimSpaces } from '../../../shared/utils/functions/trim-spaces';
import { ITDriverModel } from '../models/driver.model';

export interface IDriverActionRequestModel {
    driver_id: string;
    first_name: string;
    father_last_name: string;
    license: string;
    name: string;
    identity: string;
    driver_type: number;
    transport_company_id: number;
}

export class DriverActionRequestModel implements IDriverActionRequestModel {
    public driver_id: string = null;
    public first_name: string = '';
    public father_last_name: string = '';
    public license: string = '';
    public name: string = '';
    public identity: string = null;
    public driver_type: number;
    public transport_company_id: number;

    constructor(driver?: ITDriverModel) {
        if (driver) {
            this.driver_id = driver.id ? driver.id : this.driver_id;
            this.first_name = driver.name
                ? titleCaseWord(trimSpaces(driver.name))
                : this.first_name;
            this.father_last_name = driver.paternalLast
                ? titleCaseWord(trimSpaces(driver.paternalLast))
                : this.father_last_name;
            this.license = driver.license
                ? trimSpaces(driver.license)
                : this.license;
            this.identity = driver.identity.replace(/\s/g, '') ?? this.identity;
            this.name = `${this.first_name} ${this.father_last_name}`;
            this.driver_type = driver.typeId ?? this.driver_type;
            this.transport_company_id = driver.transportCompanyId ?? this.transport_company_id;
        } else {
            Object.assign(this, {});
        }
    }
}
