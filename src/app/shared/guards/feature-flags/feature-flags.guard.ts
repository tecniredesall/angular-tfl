import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeatureFlagsService } from '../../services/feature-flags/feature-flags.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsGuard implements CanActivate {

  constructor(
    private _featureFlags: FeatureFlagsService,
    private _router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    const requiredFeatureFlag: string = next.data["requiredFeatureFlag"] as string;
    const featureFlagRedirect: string = (next.data["featureFlagRedirect"] as string) || "/";
    if (this._featureFlags.isLoadFeatureFlag) {
      return this.checkIsFeatureFlagEnabled(requiredFeatureFlag, featureFlagRedirect);
    }
    return this._featureFlags.onGetFlagsEvent.pipe(map((response: any) => {
      if (response) {
        return this.checkIsFeatureFlagEnabled(requiredFeatureFlag, featureFlagRedirect);
      }
    }));
  }

  private checkIsFeatureFlagEnabled(requiredFeatureFlag: string, featureFlagRedirect: string): boolean | UrlTree {
    return this._featureFlags.isFeatureFlagEnabled(requiredFeatureFlag)
      ? true
      : this._router.createUrlTree([featureFlagRedirect]);
  }

}
