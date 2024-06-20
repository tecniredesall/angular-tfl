
/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/10/04
 * Description: Notification module
 * Updated:
 * Comments:
 * Version: 2019.10.04.1335
 * Code created by: Grain Chain
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { NotificationService } from './services/notification.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NotificationsComponent],
  exports: [NotificationsComponent],
  providers: [NotificationService]
})
export class NotificationsModule { }
