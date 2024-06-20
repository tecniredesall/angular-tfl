import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { getGeneralDecimalPlaces } from 'src/app/shared/utils/functions/decimals-configuration';
import { ISortMachineListenerEvent, SortMachineListenerEvent } from '../../models/sort-machine-listener-event.model';
import { IIoTRecord } from '../../models/iot-record.model';
import { ScaleSocketService } from '../../shared/services/scale-socket/scale-socket.service';
import { ISorterMachineEvent } from 'src/app/shared/models/sorter-machine-event.model';
import { ITRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Component({
  selector: 'tr-sort-machine-listener',
  templateUrl: './sort-machine-listener.component.html',
  styleUrls: ['./sort-machine-listener.component.scss']
})
export class SortMachineListenerComponent implements OnDestroy, OnChanges, OnInit {

  @Input() lotId: string;
  @Input() configuration: ITRConfiguration
  @Input() sortMachine: IIoTRecord = null;
  @Input() changeReset: Subject<{isContinue:boolean}> = new Subject();
  @Output() status: EventEmitter<any> = new EventEmitter();

  readonly LISTENER_STATUS: any = CONSTANTS.SCALE_LISTENER_STATUS;
  readonly DECIMAL_PLACES: number = getGeneralDecimalPlaces();

  public weightUnity: string;
  public listenerStatus: string = CONSTANTS.SCALE_LISTENER_STATUS.UNSELECTED;
  public eventSortMachine: ISortMachineListenerEvent;
  public isFirstAttempt: boolean = true;

  private destroySocketMachine$: Subject<boolean> = new Subject<boolean>();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _scaleSocketService: ScaleSocketService
  ) { }

  ngOnInit() {
    this.changeReset
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: {isContinue: boolean}) => {
      this.isFirstAttempt = !response.isContinue;
      this.captureInformation();
    })
  }

  /**
   * Method called on destroy component
   */
  ngOnDestroy() {
    this._scaleSocketService.closeTrigger();
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroySocketMachine$.next(true);
    this.destroySocketMachine$.complete();

  }

  /**
   * Detect whem some input is changed
   * @param changes changes in component
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('sortMachine') && changes.sortMachine.previousValue !== changes.sortMachine.currentValue) {
      if (!this.sortMachine) {
        this.listenerStatus = this.LISTENER_STATUS.UNSELECTED;
        this.status.emit({ code: this.listenerStatus });
      }
      else {
        this.weightUnity = this.sortMachine.metricUnit;
        if(!this.sortMachine.isActive) {
          this.listenerStatus = this.LISTENER_STATUS.DISABLED;
          this.status.emit({ code: this.listenerStatus });
        }
      }
    }
  }

  public captureInformation(): void {
    this.destroySocketMachine$.next(true);
    this.getJSONFromSorterMachine();
  }

  public cancelCapture(): void {
    this.destroySocketMachine$.next(true);
    this.listenerStatus = CONSTANTS.SCALE_LISTENER_STATUS.UNSELECTED;
  }

  private getJSONFromSorterMachine(): void {
    this.listenerStatus = this.LISTENER_STATUS.CONNECTING;
    this.status.emit({ code: this.listenerStatus });
    this._scaleSocketService
      .getJSONSortMachine(this.sortMachine.ipAddress, this.sortMachine.port, this.lotId)
      .pipe(
        takeUntil(this.destroySocketMachine$)
      )
      .subscribe((response: ISorterMachineEvent) => {
        if (CONSTANTS.IOT_EVENT_TYPE.SORTER_MACHINE == response.eventType) {
          this.eventSortMachine = new SortMachineListenerEvent(response.data[0]);
          this.eventSortMachine.exitRatio = (this.eventSortMachine.bad * 100) / this.eventSortMachine.total;
          if(this.isFirstAttempt && this.eventSortMachine.total != 0) {
            this._scaleSocketService.closeTrigger();
            this.destroySocketMachine$.next(true);
            this.listenerStatus = this.LISTENER_STATUS.RESET;
          } else {
            this.isFirstAttempt = false;
            this.listenerStatus = this.LISTENER_STATUS.STABILIZED;
          }
          this.status.emit({
            code: this.listenerStatus,
            data: this.eventSortMachine,
            DECIMAL_PLACES: this.DECIMAL_PLACES
          });
        }
        else if (CONSTANTS.IOT_EVENT_TYPE.STATUS_CONNECTION == response.eventType) {
          switch (response.data) {
            case CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTING:
              this.listenerStatus = this.LISTENER_STATUS.CONNECTING;
              break;
            case CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTED:
              this.listenerStatus = this.LISTENER_STATUS.STABILIZING;
              break;
            case CONSTANTS.SOCKET_CLIENT_STATUS.DISCONNECTED:
              this.listenerStatus = this.LISTENER_STATUS.DISCONNECTED;
              break;
            default:
              break;
          }
          this.status.emit({ code: this.listenerStatus });
        }
      });
  }

}
