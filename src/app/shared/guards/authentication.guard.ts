import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private route: Router) { }
  /**
   * Can activate
   * @param next next state
   * @param state current state
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const userData = localStorage.getItem('token-data');
    if (userData !== null && userData !== undefined) {
      const token = JSON.parse(userData);
      if (token.hasOwnProperty('token')) {
        return true;
      } else {
        this.route.navigateByUrl('login');
        localStorage.clear();
        return false;
      }
    } else {
      this.route.navigateByUrl('login');
      localStorage.clear();
      return false;
    }
  }


}
