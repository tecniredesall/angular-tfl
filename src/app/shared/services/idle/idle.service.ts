import { Injectable } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  constructor(
    private _idle: Idle,
    private _keepalive: Keepalive
  ) {
    // set idle parameters
    this._idle.setIdle(10); // how long can init idle, in seconds
    this._idle.setTimeout(environment.TIME_IDLE); // how long can they be idle before considered timed out, in seconds
    this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES)
    this._keepalive.interval(environment.TIME_IDLE); // will ping at this interval while not idle, in seconds
  }

  public onIdleStart() {
    return this._idle.onIdleStart;
  }

  public onIdleEnd() {
      return this._idle.onIdleEnd;
  }

  public onTimeout() {
    return this._idle.onTimeout;
  }

  public onTimeoutWarning() {
      return this._idle.onTimeoutWarning
  }

  public onPing() {
    return this._keepalive.onPing;
  }

  public onResetIdle() {
      this._idle.watch();
  }

  public onDestroyIdle() {
    this._idle.stop();
  }
}
