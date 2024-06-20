export interface IProducerRelatedModel {
  id: number;
  associates: Array<any>;
  email: string;
  farms: Array<any>;
  maternalLast: string;
  name: string;
  paternalLast: string;
  phone: string;
  totalAssociates: number;
  totalRelatedFarms: number;
  isSelected: boolean;
}

export class ProducerRelatedModel implements IProducerRelatedModel {
  id: number = null;
  associates: Array<any> = [];
  email: string = '';
  farms: Array<any> = [];
  maternalLast: string = '';
  name: string = '';
  paternalLast: string = '';
  phone: string = '';
  totalAssociates: number = 0;
  totalRelatedFarms: number = 0;
  isSelected: boolean = false;

  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = item.id ?? this.id;
      this.associates = isAPIData ? this.associates : (item.associates ?? this.associates);
      this.email = item.email;
      this.farms = isAPIData ? this.farms : (item.farms ?? this.farms);
      this.maternalLast = isAPIData ? (item.maternal_last ?? this.maternalLast) : (item.maternalLast ?? this.maternalLast);
      this.name = item.name ?? this.name;
      this.paternalLast = isAPIData ? (item.paternal_last ?? this.paternalLast) : (item.paternalLast ?? this.paternalLast);
      this.phone = item.phone;
      this.totalAssociates = isAPIData ? this.totalAssociates : (item.totalAssociates ?? this.totalAssociates);
      this.totalRelatedFarms = isAPIData ? this.totalRelatedFarms : (item.totalRelatedFarms ?? this.totalRelatedFarms);
      this.isSelected = isAPIData ? this.isSelected : (item.hasOwnProperty('isSelected') ? item.isSelected : this.isSelected)
    }
    else {
      Object.assign(this, {});
    }
  }
}
