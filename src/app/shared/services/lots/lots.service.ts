import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URIS_CONFIG } from '../../config/uris-config';
import { CONSTANTS } from '../../utils/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class LotsService {

  constructor(private _http: HttpClient) { }

  public getLots(status: string = CONSTANTS.LOT_HISTORY_TYPES.FINALIZED_LOT) {
    const path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_LOTS_BY_STATUS}`;

    return this._http
      .get(path, {
        params: new HttpParams({ fromObject: { status: status } })
      });

  }
}
