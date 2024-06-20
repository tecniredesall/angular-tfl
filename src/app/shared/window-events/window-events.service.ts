import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowEventsService {

  public onResizeEvent: BehaviorSubject<any>;
  public onMenuStatusChangeEvent: BehaviorSubject<string>;

  constructor() {

    this.onResizeEvent = new BehaviorSubject<any>(null);
    this.onMenuStatusChangeEvent = new BehaviorSubject<string>(null);

  }

  public emitResizeEvent(event: any): void {
    this.onResizeEvent.next(event);
  }

  public emitMenuStatusChangeEvent(): void {
    this.onMenuStatusChangeEvent.next('changed');
  }

}
