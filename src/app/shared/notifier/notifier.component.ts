import { Component, OnInit } from '@angular/core';
import {rightDirection} from '../utils/animations/directions.animation';
import {NotifyService} from './notify.service';
import {I18nPipe} from '../i18n/i18n.pipe';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css'],
  animations: [rightDirection],
  providers: [I18nPipe]
})
export class NotifierComponent implements OnInit {

  constructor(
    public notifyService: NotifyService
  ) { }

  ngOnInit() {
  }

  close() {
    NotifyService.showing = false;
  }
}
