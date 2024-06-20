/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/10/04
 * Description: Notification conponent, create notifications utilitie
 * Updated:
 * Comments:
 * Version: 2019.10.04.1335
 * Code created by: Grain Chain
 */
import { Component, OnInit, NgZone } from '@angular/core';
import { NotificationService } from './services/notification.service';
declare let $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notiStatus: boolean;
  type: string;
  time: number;
  message: string;
  // tslint:disable-next-line: variable-name
  constructor(private _notiService: NotificationService, private _ngZone: NgZone) { }
  /**
   * init alert
   */
  ngOnInit() {
    this._notiService.notificationSettings.subscribe(
      (data) => {
        this.type = data.type;
        this.time = data.time;
        this.message = data.message;
        this.notiStatus = true;
        /**
         * create aout of component
         */
        this._ngZone.runOutsideAngular(() => {
          /**
           * add animation, transition in demiss alert
           */
          setTimeout(() => {
            $('.alert').fadeTo(500, 0).slideUp(500, () => {
              $(this).remove();
            });
            /**
             * waiting for close alert
             */
            setTimeout(() => {
              this.notiStatus = false;
            }, 3000);
          }, this.time);
        });
      });

  }
  public getIcon() {
    switch (this.type) {
      case 'success':
        return 'icon-check-circle.png';
      case 'info':
        return 'icon-info-circle.png';
      case 'error':
        return 'icon-error-circle.png';
      case 'warning':
        return 'icon-warning-circle.png';
    }
  }
  /**
   * demiss alert
   */
  resolve() {
    this.notiStatus = false;
  }

}
