import { trimSpaces } from "../../../shared/utils/functions/trim-spaces";

export interface ISealFarmProducerModel {
  id: number;
  name: string;
}

export class SealFarmProducerModel implements ISealFarmProducerModel {
  public id: number = null;
  public name: string = '';
  constructor(item?: any) {
    if (item) {
      this.id = item.id ?? this.id;
      this.name = item.name ?? this.name;
    }
    else {
      Object.assign(this, {});
    }
  }
}

export interface ISealProducerModel {
  id: number;
  name: string;
  paternalLast: string;
  maternalLast: string;
  farms: Array<ISealFarmProducerModel>;
  fullName: string;
}

export class SealProducerModel implements ISealProducerModel {
  public id: number = null;
  public name: string = '';
  public paternalLast: string = '';
  public maternalLast: string = '';
  public farms: Array<ISealFarmProducerModel> = [];
  public fullName: string = '';
  constructor(item?: any, isAPIData: boolean = false) {
    if (item) {
      this.id = item.id ? item.id : this.id;
      this.name = item.name ?? this.name;
      if (isAPIData) {
        this.paternalLast = item.paternal_last ? trimSpaces(item.paternal_last) : this.paternalLast;
        this.maternalLast = item.maternal_last ? trimSpaces(item.maternal_last) : this.maternalLast;
      }
      else {
        this.paternalLast = item.paternalLast ? trimSpaces(item.paternalLast) : this.paternalLast;
        this.maternalLast = item.maternalLast ? trimSpaces(item.maternalLast) : this.maternalLast;
      }
      this.farms = item.farms ?? this.farms;
      this.fullName = this.name;
      if (this.paternalLast.length > 0) {
        this.fullName += ' ' + this.paternalLast;
      }
      if (this.maternalLast.length > 0) {
        this.fullName += ' ' + this.maternalLast;
      }
    }
    else {
      Object.assign(this, {});
    }

    for (let f = 0; f < this.farms.length; f++) {
      this.farms[f] = new SealFarmProducerModel(this.farms[f]);
    }

  }

}

export interface ISealProducerPaginatorModel {
  producers: Array<ISealProducerModel>;
  lastPage: number
}

export class SealProducerPaginatorModel implements ISealProducerPaginatorModel {
  public producers: Array<ISealProducerModel> = [];
  public lastPage: number = 0;
  constructor(item?: any) {
    if (item) {
      this.producers = item.producers ?? this.producers;
      this.lastPage = item.lastPage ?? this.lastPage;
    }
    else {
      Object.assign(this, {});
    }
    for (let p = 0; p < this.producers.length; p++) {
      this.producers[p] = new SealProducerModel(p);
    }
  }
}