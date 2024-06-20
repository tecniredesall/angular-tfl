import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { removeAccents } from 'src/app/shared/utils/functions/remove-accents';
import { ITRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { IIoTRecord } from '../../models/iot-record.model';
import { SortMachineListenerEvent } from '../../models/sort-machine-listener-event.model';
import { IotDevicesService } from '../../services/iot-devices/iot-devices.service';
import { ScaleSocketService } from '../../shared/services/scale-socket/scale-socket.service';
import { ScaleDialogComponent } from '../scale-dialog/scale-dialog.component';

@Component({
  selector: 'app-sort-machine-dialog',
  templateUrl: './sort-machine-dialog.component.html',
  styleUrls: ['./sort-machine-dialog.component.scss']
})
export class SortMachineDialogComponent implements OnInit {

  @BlockUI('block-sort-machine-dialog') blockUI: NgBlockUI;

  public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;
  public sortMachines: IIoTRecord[] = [];
  public selectedSortMachine: IIoTRecord = null;
  public isLoadingSortMachines: boolean = true;
  public isSubmitButtonDisabled: boolean = true;
  public changeReset: Subject<{isContinue: boolean}> = new Subject();
  public isReset: boolean = false;

  private sortMachineData: {action: number, data: SortMachineListenerEvent, DECIMAL_PLACES: number} = {
    action: null,
    data: null,
    DECIMAL_PLACES: null
  };
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private destroySocketStatus$: Subject<boolean> = new Subject<boolean>();
  private destroySocketConfig$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _dialogRef: MatDialogRef<ScaleDialogComponent>,
    private _i18nPipe: I18nPipe,
    private _errorHandlerService: ResponseErrorHandlerService,
    private _alertService: AlertService,
    private _scaleService: IotDevicesService,
    private _notifierService: NotifierService,
    private _scaleSocketService: ScaleSocketService,
    @Inject(MAT_DIALOG_DATA) public data: {lotId: string, configuration: ITRConfiguration},
  ) { }

  /**
   * Callback method that is invoked immediately after the default change detector has checked the component's data-bound properties for the first time
   */
  ngOnInit() {
    this.blockUI.start();
    this.getSortMachines();
  }

  /**
   * Method called on destroy component
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroySocketStatus$.next(true);
    this.destroySocketStatus$.complete();
    this.destroySocketConfig$.next(true);
    this.destroySocketConfig$.complete();
    this._scaleSocketService.closeTrigger();
  }

  /**
   * Allow to filter by custom search function
   * @param term to search
   * @param item to filter
   * @returns true if the item matches the filter and false otherwise
   */
  public customSortMachineSearchFn(term: string, item: IIoTRecord): boolean {
    let search: string = removeAccents(term.toLowerCase());
    return removeAccents(item.model?.toLowerCase()).includes(search) || removeAccents(item.description?.toLowerCase()).includes(search);
  }

  /**
   * Method invocked for change default scale
   * @param event with selected boolean status
   */
  public changeDefaultSortMachine(event: MatSlideToggleChange): void {
    this.blockUI.start();
    let data: any = {
      settings: [{
        name: 'DefaultScale',
        values: []
      }]
    };
    if(event.checked){
      data.settings[0].values = [this.selectedSortMachine.id]
    }
    this._scaleService.setDefaultIotDevicesByUser(data).pipe(
      takeUntil(this.destroy$),
      take(1)
    ).subscribe(
      (response: any) => {
        if (event.checked) {
          let oldSortMachineDefaultIdx: number = this.sortMachines.findIndex((s) => s.isDefault);
          if (oldSortMachineDefaultIdx > -1) {
            this.sortMachines[oldSortMachineDefaultIdx].isDefault = false;
          }
        }
        this.selectedSortMachine.isDefault = event.checked;
        this.blockUI.stop();
        this._notifierService.notify('success', this._i18nPipe.transform('default-sorter-machine-message'));
      },
      (error: HttpErrorResponse) => {
        let message = this._errorHandlerService.handleError(error, 'sorter-machine');
        this._alertService.errorTitle(
          this._i18nPipe.transform('error-msg'),
          message
        );
        this.blockUI.stop();
      }
    );
  }

  public eventSortMachineListenerStatus(event: any): void {
    this.isReset = event.code === CONSTANTS.SCALE_LISTENER_STATUS.RESET;
    this.isSubmitButtonDisabled = event.code != CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED;
    this.sortMachineData.data = event.code == CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED ? event.data : 0;
    this.sortMachineData.DECIMAL_PLACES = event.code == CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED ? event.DECIMAL_PLACES : '';
  }

  /**
   * Method called on cancel action
   */
  public cancel(): void {
    this.sortMachineData.action = CONSTANTS.CRUD_ACTION.CANCEL;
    this._dialogRef.close();
  }

  /**
   * Method called on submit action
   */
  public sumbit(): void {
    this.sortMachineData.action = CONSTANTS.CRUD_ACTION.ACCEPT;
    if(this.selectedSortMachine.metricUnit != this.data.configuration.measurementUnitAbbreviation) {
      this.sortMachineData.data.total = this.sortMachineData.data.total 
      * this.data.configuration.baseMeasurementUnitFactorKgs 
      / this.data.configuration.baseMeasurementUnitFactor
      this.sortMachineData.data.bad = this.sortMachineData.data.bad 
      * this.data.configuration.baseMeasurementUnitFactorKgs 
      / this.data.configuration.baseMeasurementUnitFactor
    }
    this._dialogRef.close(this.sortMachineData);
  }

  /**
   * Get sortMachines by user logged
   */
  private getSortMachines(): void {
    this._scaleService.getSortMachinesByUser().pipe(
      takeUntil(this.destroy$),
      take(1)
    ).subscribe(
      (response: IIoTRecord[]) => {
        this.sortMachines = Array.from(response);
        this.selectedSortMachine = this.sortMachines.find((s) => s.isDefault) ?? null;
        this.getAvailableSorterMachines()
        this.isLoadingSortMachines = false;
        this.blockUI.stop();
      },
      (error: HttpErrorResponse) => {
        this._alertService.errorTitle(
          this._i18nPipe.transform('error-msg'),
          this._errorHandlerService.handleError(error, 'sort-machine')
        );
        this.isLoadingSortMachines = false;
        this.blockUI.stop();
      }
    )
  }

  public getAvailableSorterMachines() {
    if(this._scaleSocketService.socketConfig) {
      this._getSocketStatusIotDevice();
    } else {
      this._scaleSocketService.socketConfigIsReady$
      .pipe(takeUntil(this.destroySocketConfig$))
      .subscribe(
        () => {
          this.destroySocketConfig$.next(true);
          this.destroySocketConfig$.complete();
          this._getSocketStatusIotDevice();
        }
      )
    }
  }

  private _getSocketStatusIotDevice() {
    for (let i = 0; i < this.sortMachines.length; i++) {
      const sortMachine = this.sortMachines[i];
      this._scaleSocketService.getStatusIotDevice(sortMachine.ipAddress, sortMachine.port)
      .pipe(takeUntil(this.destroySocketStatus$))
      .subscribe(
        response => {
          sortMachine.isConnected = response.data === CONSTANTS.SOCKET_CLIENT_STATUS.ONLINE;
          this.destroySocketStatus$.next(true);
          this.destroySocketStatus$.complete();
        },
        error => {
          sortMachine.isConnected = false;
          this.destroySocketStatus$.next(true);
          this.destroySocketStatus$.complete();
        }
      )
    }
  }

  public onChangeActionReset(isContinue: boolean){
    this.changeReset.next({isContinue})
  }
}
