import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URIS_CONFIG } from '../../../../shared/config/uris-config';

@Injectable({
  providedIn: 'root'
})
export class RelatedProducersService {

  constructor(
    private http: HttpClient
  ) {
  }

  public relateProducers(body: any) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RELATED_PRODUCERS}`;
    return this.http.post(uri, body);
  }

  public fetchProducer(pageIndex: number, id: number, search: string) {
    let uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RELATED_PRODUCERS}/${id}?page=${pageIndex}`;
    if (search) {
      uri = `${uri}&q=${search}`;
    }

    return this.http.get(uri);
  }

  public deleteProducerRelation(relationId: string) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_RELATED_PRODUCERS}/${relationId}`;
    return this.http.delete(uri);
  }
}
