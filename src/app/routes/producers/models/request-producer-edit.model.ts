import { TIProducerModel } from 'src/app/shared/models/sil-producer';

import { trimSpaces } from '../../../shared/utils/functions/trim-spaces';

export interface IRequestProducerEditModel {
  id: number;
  name: string;
  paternal_last: string;
  maternal_last: string;
  phone: string;
}


export class RequestProducerEditModel implements IRequestProducerEditModel {

  public id: number = null;
  public name: string = '';
  public paternal_last: string = '';
  public maternal_last: string = null;
  public phone: string = '';

  constructor(producer: TIProducerModel) {

    this.id = producer.id;

    this.name = trimSpaces(producer.name);

    this.paternal_last = trimSpaces(producer.paternalLast);

    this.maternal_last = producer.maternalLast.length > 0 ? trimSpaces(producer.maternalLast) : null;

    this.phone = trimSpaces(producer.phone).replace(/[^0-9\+]/gm, '');

  }

}