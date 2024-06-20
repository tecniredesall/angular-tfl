import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';

export interface IWNDriverModel {
  id: string;
  name: string;
  paternalLast: string;
  maternalLast: string;
  license: string;
  fullName: string;
}

export class WNDriverModel implements IWNDriverModel {
  public id: string = null;
  public name: string = '';
  public paternalLast: string = '';
  public maternalLast: string = '';
  public license: string = '';
  public fullName: string = '';

  constructor(item?: any) {
    if (item) {
      this.id = item.id ?? item.driver_id ?? this.id;
      this.name = trimSpaces(item.name ?? item.first_name ?? this.name);
      this.paternalLast = trimSpaces(item.paternalLast ?? item.father_last_name ?? this.paternalLast);
      this.maternalLast = trimSpaces(item.maternalLast ?? item.mother_last_name ?? this.maternalLast);
      this.license = item.license ?? this.license;
      this.fullName = this.name;
      if (this.paternalLast.length > 0) {
        this.fullName += ` ${this.paternalLast}`;
      }
      if (this.maternalLast.length > 0) {
        this.fullName += ` ${this.maternalLast}`;
      }
    }
    else {
      Object.assign(this, {});
    }
  }
}
