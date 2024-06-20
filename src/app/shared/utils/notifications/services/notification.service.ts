/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/10/04
 * Description: Notification service, alert service
 * Updated:
 * Comments:
 * Version: 2019.10.04.1335
 * Code created by: Grain Chain
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationModel } from '../models/notification';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationSettings = new Subject<NotificationModel>();
  constructor() { }
  /**
   * Create new alert
   * @param type type alert, default value is info
   *             * success
   *             * info
   *             * error
   *             * warning
   * @param time time for auto close alert by default is 3 seconds
   * @param message menssage for show
   */
  public create(type: string = 'info', time: number = 3000, message: string = 'Message') {
    this.notificationSettings.next({
      type, time, message
    });
  }

}
