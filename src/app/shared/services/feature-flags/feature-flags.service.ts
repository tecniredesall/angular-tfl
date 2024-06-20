import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URIS_CONFIG } from '../../config/uris-config';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from '../../utils/alerts/alert.service';
import { ResponseErrorHandlerService } from '../../utils/response-error-handler/response-error-handler.service';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsService implements OnDestroy {
  public onGetFlagsEvent: Subject<any> = new Subject<any>();
  private featureFlags: any;
  private _subscription: Subscription = new Subscription();

  constructor(
    private _http: HttpClient,
    private _errorHandler: ResponseErrorHandlerService,
    private _alert: AlertService,
    private _i18nPipe: I18nPipe
  ) {
    this._subscription.add(
      this.onGetFlagsEvent.subscribe((response: any) => {
        if (response) {
          this.featureFlags = response.data['feature-flags'];
        }
      })
    );
    this.getFlags();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public getFlags(): void {
    if (localStorage.getItem('uri-owner')) {
      let path: string = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_GET_CONFIG_COMPANY_INFO}`;
      this._subscription.add(
        this._http.get(path).subscribe(
          (response: any) => {
            this.onGetFlagsEvent.next(response);
          },
          (error: HttpErrorResponse) => {
            let message: string = this._errorHandler.handleError(error, 'feature-flags')
            this._alert.errorTitle(this._i18nPipe.transform('error-msg'), message);
            this.onGetFlagsEvent.next(null);
          }
        )
      );
    }
    else {
      this.onGetFlagsEvent.next(null);
    }
  }

  public isFeatureFlagEnabled(flag: string): boolean {
    return this.featureFlags && this.featureFlags[flag];
  }

  public get isLoadFeatureFlag(): boolean {
    return this.featureFlags;
  }
}
