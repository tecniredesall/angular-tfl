import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URIS_CONFIG } from '../../config/uris-config';
import { ITRSealImage, TRSealImage } from '../../utils/models/seal-image.model';

@Injectable({
  providedIn: 'root'
})
export class SealsService {

  constructor(private _http: HttpClient) { }

  /**
   * Get seals
   */
  public getSeals(uri: string, params?: any): Observable<ITRSealImage[]> {
    let url: string = uri ?? `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CERTIFICATION}`;
    let opts: any = params ? { params: new HttpParams({ fromObject: params }) } : {};
    return this._http.get(url, opts).pipe(
      map((result: any) => {
        let response: ITRSealImage[] = null;
        if (result.status) {
          response = result.data.data.map((d: any) => new TRSealImage({
            id: d.certification_id,
            name: d.name,
            image: d.image
          }));
        }
        return response;
      })
    );
  }
}
