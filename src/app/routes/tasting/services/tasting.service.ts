import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';

@Injectable({
  providedIn: 'root'
})
export class TastingService {

  constructor(private _http: HttpClient) { }

  public createTasting(tastingForm) {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CUPPING}`;
    return this._http.post(uri, tastingForm)
  }

  public getDynamicForm() {
    const uri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_CUPPING_FORMS}`;
    return this._http.get(uri);
  }
}
