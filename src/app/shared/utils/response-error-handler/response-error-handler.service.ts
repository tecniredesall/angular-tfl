import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { I18nPipe } from '../../i18n/i18n.pipe';

@Injectable({
  providedIn: 'root'
})
export class ResponseErrorHandlerService {

  constructor(
    private _i18nPipe: I18nPipe
  ) { }

  public handleError(error: HttpErrorResponse, prefixMessage: string): string {
    if (400 == error.status  || 406 == error.status || 409 == error.status || 422 == error.status) {
      let hasObjectReference: boolean = error.error.data.hasOwnProperty('reference');
      let valueIdentifiquer: string = '[value]';
      let errorMessages: Array<string> = [];

      for (const key in error.error.data) {
        if (Object.prototype.hasOwnProperty.call(error.error.data, key)) {
          if ('reference' != key) {
            let propertyName: string = key;
            let errorData: string = error.error.data[key][0].replace('.', '-');
            let msg: string = (hasObjectReference && -1 == errorData.indexOf('required')) ?
              prefixMessage + '-' + propertyName + '-' + valueIdentifiquer + '-' + errorData :
              prefixMessage + '-' + propertyName + '-' + errorData;


            msg = this._i18nPipe.transform(msg);

            if (hasObjectReference) {
              msg = msg.replace(valueIdentifiquer, error.error.data.reference[0][key]);
            }

            errorMessages.push(msg);
          }
        }
      }
      return errorMessages.join('<br>');
    } else if(error.status == 403) {
      return this._i18nPipe.transform('not-permission');
    } else if(error.status == 401) {
      return this._i18nPipe.transform('unauthorized');
    } else {
      return this._i18nPipe.transform('unidentified-problem');
    }
  }
}
