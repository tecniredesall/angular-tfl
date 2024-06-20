import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  static showing: boolean;
  static message: string;
  static type: string;

  constructor() { }

  get message() {
    return NotifyService.message;
  }

  get showing() {
    return NotifyService.showing;
  }

  get type() {
    return NotifyService.type;
  }

  public static showNotify(message, type) {
    this.type = type;
    this.message = message;
    NotifyService.showing = true;
    setTimeout(() => {
      NotifyService.hideNotify();
    }, 2000);
  }

  public static showError(message, type) {
    this.type = type;
    this.message = message;
    NotifyService.showing = true;

  }

  public static hideNotify() {
    NotifyService.showing = false;
  }
}

export function Notifier(success: string, error: string) {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function() {
      return original.apply(this, arguments)
        .pipe(
          map((res) => {
            NotifyService.showNotify(success, 'success');
            return res;
          }),
          catchError((err) => {
            NotifyService.showError(error, 'error');
            throw err;
          })
        );
    };
    return descriptor;
  };
}
