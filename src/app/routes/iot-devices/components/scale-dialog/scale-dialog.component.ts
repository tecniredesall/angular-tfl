import { SstSocketService } from './../../shared/services/sst-socket/sst-socket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, interval } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { IIoTRecord, IoTRecord } from 'src/app/routes/iot-devices/models/iot-record.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { bufferWhen, finalize, take, takeUntil } from 'rxjs/operators';
import { IotDevicesService } from 'src/app/routes/iot-devices/services/iot-devices/iot-devices.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { removeAccents } from 'src/app/shared/utils/functions/remove-accents';
import { NotifierService } from 'angular-notifier';
import { IScaleData, ScaleData } from 'src/app/shared/models/scale-data.model';
import { IScaleListenerEvent } from '../../models/scale-listener-event.model';
import { ScaleSocketService } from '../../shared/services/scale-socket/scale-socket.service';
import { SCALES_LISTENER_ACTIONS, SSTSocketContract, SocketType } from '../../shared/services/sst-socket/contracts/sst-socket-contract';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { getGeneralDecimalPlaces } from 'src/app/shared/utils/functions/decimals-configuration';

@Component({
    selector: 'tr-scale-dialog',
    templateUrl: './scale-dialog.component.html',
    styleUrls: ['./scale-dialog.component.scss']
})
export class ScaleDialogComponent implements OnInit, OnDestroy {

    @BlockUI('block-scale-dialog') blockUI: NgBlockUI;

    public templateBlockModalUi: BlockModalUiComponent = BlockModalUiComponent;
    public scales: IIoTRecord[] = [];
    public selectedScale: { scale: IIoTRecord, socket: SSTSocketContract } = null;
    public isLoadingScales: boolean = true;
    public isSubmitButtonDisabled: boolean = true;
    public scaleStatus: string = CONSTANTS.SCALE_LISTENER_STATUS.UNSELECTED;
    public status: IScaleListenerEvent
    public weight: number = 0;
    readonly SCALE_LISTENER_STATUS: any = CONSTANTS.SCALE_LISTENER_STATUS;
    readonly DECIMAL_PLACES: number = getGeneralDecimalPlaces();
    readonly MAX_COUNTER_RETRY_CONNECTION: number = 3;
    private countRetryConnection: number = 1;
    private scalesData: IScaleData = new ScaleData();
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private destroySocketStatus$: Subject<boolean> = new Subject<boolean>();
    private destroySocketConfig$: Subject<boolean> = new Subject<boolean>();
    private destroyActive$: Subject<boolean> = new Subject<boolean>();
    public socketScales: { scale: IIoTRecord, socket: SSTSocketContract }[] = []
    constructor(
        private _dialogRef: MatDialogRef<ScaleDialogComponent>,
        private _i18nPipe: I18nPipe,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _alertService: AlertService,
        private __iotDevicesService: IotDevicesService,
        private _notifierService: NotifierService,
        private _scaleSocketService: ScaleSocketService,
        private _sstSocketService: SstSocketService
    ) { }

    /**
     * Callback method that is invoked immediately after the default change detector has checked the component's data-bound properties for the first time
     */
    ngOnInit() {
        this.getScales();
    }

    /**
     * Method called on destroy component
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroySocketStatus$.next(true);
        this.destroySocketStatus$.complete();
        this._clearSocketScales();

    }

    /**
     * Allow to filter by custom search function
     * @param term to search
     * @param item to filter
     * @returns true if the item matches the filter and false otherwise
     */
    public customScaleSearchFn(term: string, item: IIoTRecord): boolean {
        let search: string = removeAccents(term.toLowerCase());
        return removeAccents(item.model?.toLowerCase()).includes(search) || removeAccents(item.description?.toLowerCase()).includes(search);
    }

    /**
     * Method invocked for change default iot-devices
     * @param event with selected boolean status
     */
    public changeDefaultScale(event: MatSlideToggleChange): void {
        this.blockUI.start();
        let data: any = {
            settings: [{
                name: 'DefaultScale',
                values: []
            }]
        };
        if (event.checked) {
            data.settings[0].values = [this.selectedScale.scale.id]
        }
        this.__iotDevicesService.setDefaultIotDevicesByUser(data).pipe(
            takeUntil(this.destroy$),
            take(1)
        ).subscribe(
            (response: any) => {
                if (event.checked) {
                    let oldScaleDefaultIdx: number = this.scales.findIndex((s) => s.isDefault);
                    if (oldScaleDefaultIdx > -1) {
                        this.scales[oldScaleDefaultIdx].isDefault = false;
                    }
                }
                this.selectedScale.scale.isDefault = event.checked;
                this.blockUI.stop();
                this._notifierService.notify('success', this._i18nPipe.transform('default-scale-message'));
            },
            (error: HttpErrorResponse) => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._i18nPipe.transform('unidentified-problem')
                );
                this.blockUI.stop();
            }
        );
    }

    public eventScaleListenerStatus(event: IScaleListenerEvent): void {
        this.isSubmitButtonDisabled = event.code != CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED;
        this.scalesData.weight = event.code == CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED ? event.weight : 0;
        this.scalesData.unityMeasurement = event.code == CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED ? event.unityMeasurement : '';
        this._setDisconnectScale(event)
    }

    private _setDisconnectScale(event: IScaleListenerEvent) {
        if (this.selectedScale) {
            const isActive = event.code == CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED || event.code == CONSTANTS.SCALE_LISTENER_STATUS.CONNECTING
            const id = this.selectedScale.scale.id
            this.selectedScale.scale.isActive = isActive
            this.selectedScale.scale.isConnected = isActive
            this.socketScales.find((item) => item.scale.id == this.selectedScale.scale.id).scale.isActive = isActive
            this.socketScales.find((item) => item.scale.id == this.selectedScale.scale.id).scale.isConnected = isActive
            if (event.code == CONSTANTS.SCALE_LISTENER_STATUS.RESET) {
                this.selectedScale.socket.disconnect()
                this.selectedScale = null
                setTimeout(() => {
                    this.socketScales.find((item) => item.scale.id == id).socket.disconnect()
                    this.socketScales.find((item) => item.scale.id == id).socket = null
                    this.socketScales.find((item) => item.scale.id == id).socket = this._sstSocketService.createSocketService(SocketType.WEB_SOCKET)
                    this.socketScales.find((item) => item.scale.id == id).scale.isActive = true
                    this.socketScales.find((item) => item.scale.id == id).scale.isConnected = true
                    this.selectedScale = this.socketScales.find((item) => item.scale.id == id)
                }, 500)
            }
        }
    }

    /**
     * Method called on cancel action
     */
    public cancel(): void {
        this.scalesData.action = CONSTANTS.CRUD_ACTION.CANCEL;
        this._dialogRef.close(this.scalesData);
    }

    /**
     * Method called on submit action
     */
    public sumbit(): void {
        this.scalesData.action = CONSTANTS.CRUD_ACTION.ACCEPT;
        this.scalesData.weight = this.weight
        this._dialogRef.close(this.scalesData);
    }

    /**
     * Get iot-devicess by user logged
     */
    private getScales(): void {
        this.blockUI.start();
        this.__iotDevicesService.getScalesByUser().pipe(
            takeUntil(this.destroy$),
            take(1)
        ).subscribe(
            (response: IIoTRecord[]) => {
                this.scales = Array.from(response);
                this.isLoadingScales = false;
                this.onOpenSelectScale(null);
            },
            (error: HttpErrorResponse) => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._errorHandlerService.handleError(error, 'kanban')
                );
                this.isLoadingScales = false;
                this.blockUI.stop();
            }
        )
    }

    public _getAvailableIotMachines() {
        if (this._scaleSocketService.socketConfig) {
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

    public onChangeScale($event: { scale: IIoTRecord, socket: SSTSocketContract }) {
        if (this.selectedScale && this.selectedScale.socket) {
            this.selectedScale.socket.disconnect();
            this.selectedScale.socket = null
            this.selectedScale.socket = this._sstSocketService.createSocketService(SocketType.WEB_SOCKET)
        }
        this.countRetryConnection = 0
        this.selectedScale = $event
        this._initSetupConnection()
    }

    public onActionScaleListener(actions: SCALES_LISTENER_ACTIONS) {
        switch (actions) {
            case SCALES_LISTENER_ACTIONS.WIGHT_AGAIN:
            case SCALES_LISTENER_ACTIONS.RETRY_CONNECTION:
                this.countRetryConnection = 0;
                this._resetScale()
                break;
            default:
                break;
        }

    }

    public onOpenSelectScale($event) {
        this._clearSocketScales();
        this._builSocketScales();
        this._checkStatusScales();
    }

    private _getSocketStatusIotDevice() {
        for (let i = 0; i < this.scales.length; i++) {
            const iotDevice = this.scales[i];
            this._scaleSocketService.getStatusIotDevice(iotDevice.ipAddress, iotDevice.port)
                .pipe(takeUntil(this.destroySocketStatus$))
                .subscribe(
                    response => {
                        iotDevice.isConnected = response.data === CONSTANTS.SOCKET_CLIENT_STATUS.ONLINE;
                    },
                    error => {
                        iotDevice.isConnected = false;
                    }
                )
        }
    }

    private _setDefaultScale(device: { scale: IIoTRecord, socket: SSTSocketContract }) {
        if (!this.selectedScale && device.scale.isDefault) {
            this.selectedScale = device;
            this.onChangeScale(this.selectedScale)
        }
        this.blockUI.stop()
    }

    private _clearSelectedScale() {
        if (this.selectedScale && this.selectedScale.socket) {
            this.selectedScale.socket.disconnect();
            this.selectedScale.socket = null
        }
    }

    private _builSocketScales() {
        this.socketScales = []
        for (const item of this.scales) {
            this.socketScales = [...this.socketScales, { scale: item, socket: this._sstSocketService.createSocketService(SocketType.WEB_SOCKET) }]
        }
    }

    private _clearSocketScales() {
        for (const item of this.socketScales) {
            if (item.socket) {
                item.socket.disconnect()
                item.socket = null
            }
        }
        this.socketScales = []
    }

    private _checkStatusScales() {
        for (const item of this.socketScales) {
            item.scale.loader = true
            item.socket.setupSocketConnection(item.scale.ipAddress.toString(), item.scale.port?.toString())
            item.socket.isActive$.subscribe((result) => {
                item.scale.loader = false
                this.scales.find(x => x.id == item.scale.id).isActive = result.active
                this.scales.find(x => x.id == item.scale.id).isConnected = result.active
                item.socket.disconnect()
                this._setDefaultScale(item)

            })
            item.socket.connectionError().subscribe((result) => {
                item.scale.loader = false
                this.scales.find(x => x.id == item.scale.id).isActive = result.active
                this.scales.find(x => x.id == item.scale.id).isConnected = result.active
                if(this.blockUI.isActive){
                    this.blockUI.stop()
                }
            })
        }

    }

    //#region  WEB SCOKET CONNECTION
    private _resetScale(): void {
        this.weight = 0;
        this.selectedScale.socket?.disconnect();
        setTimeout(() => { this._initSetupConnection(); }, 1000)
    }

    private _initSetupConnection() {
        this.scaleStatus = CONSTANTS.SCALE_LISTENER_STATUS.STABILIZING
        this._setStatusScale()
        this.selectedScale.socket.setupSocketConnection(this.selectedScale.scale.ipAddress, this.selectedScale.scale.port.toString())
        this._listenIsActive()
        this._listenConnectionError()
    }

    private _listenIsActive() {
        this.selectedScale.socket.isActive$.pipe(takeUntil(this.destroyActive$),).subscribe((result) => {
            this.selectedScale.scale.isActive = result.active;
            this.scaleStatus = this.SCALE_LISTENER_STATUS.STABILIZED;
            if (result.active) {
                this._listenAllMessages();
            } else {
                this.scaleStatus = this.SCALE_LISTENER_STATUS.DISCONNECTED;
                this.destroyActive$.next(true)
                this.validateRetryConnection();
            }
            this._setStatusScale()
        })
    }

    private validateRetryConnection() {
        if (this.countRetryConnection < this.MAX_COUNTER_RETRY_CONNECTION) {
            this._resetScale()
        }
        this.countRetryConnection++
    }

    private _listenAllMessages() {
        const timeToInvertal: number = 2000
        const intervalToGetData = () => interval(timeToInvertal);
        this.selectedScale.socket.listenMessages().pipe(takeUntil(this.destroyActive$), bufferWhen(intervalToGetData)).subscribe((data) => {

            if (data && Object.keys(data).length > 0) {
                this.scaleStatus = CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED
                const weight = truncateDecimals(Number(this._cleanWeight(data.map((item) => item?.params))), this.DECIMAL_PLACES);
                this.weight = weight
                this._setStatusScale()
            }
        })
        this.scaleStatus = CONSTANTS.SCALE_LISTENER_STATUS.CONNECTING
        this._setStatusScale()
    }

    private _listenConnectionError() {
        this.selectedScale.socket.connectionError().pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.scaleStatus = this.SCALE_LISTENER_STATUS.DISCONNECTED;
            this._setStatusScale()
        })
    }

    private _cleanWeight(weigthBuffer) {
        weigthBuffer = weigthBuffer.filter((item) => item)
        weigthBuffer = [...new Set(weigthBuffer)]
        const weight = weigthBuffer.join().toString()

        let weightClean = weight.replace(/\n/g, '').replace(/\t/g, '').replace(/ /g, '').replace(/,/g, '').toLowerCase()
        let weights = undefined


        if (weightClean.includes(CONSTANTS.SCALES_MEASUREMENT_UNIT.KG)) {
            weights = this._getSplitData(weightClean, CONSTANTS.SCALES_MEASUREMENT_UNIT.KG)
        }
        if (weightClean.includes(CONSTANTS.SCALES_MEASUREMENT_UNIT.LB)) {
            weights = this._getSplitData(weightClean, CONSTANTS.SCALES_MEASUREMENT_UNIT.LB)
        }
        if (weightClean.includes(CONSTANTS.SCALES_MEASUREMENT_UNIT.G)) {
            weights = this._getSplitData(weightClean, CONSTANTS.SCALES_MEASUREMENT_UNIT.G)
        }

        return (weights ? this._getmaxValueArray(weights) : '0')
    }

    private _getSplitData(weightClean, measurementUnit): string[] {
        let weigthSplits: [] = weightClean.split(measurementUnit)
        return weigthSplits.map((item: string) => item.replace(CONSTANTS.GET_NUMBER, ''));
    }

    private _getmaxValueArray(array: any) {
        const maxvalue = Math.max(...array);
        return maxvalue
    }

    private _setStatusScale(): void {
        this.status = null
        this.status = Object.assign({})
        this.status = {
            code: this.scaleStatus,
            weight: this.weight,
            unityMeasurement: CONSTANTS.SCALES_MEASUREMENT_UNIT.LB
        };
        const isActive = this.status.code == CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED || this.status.code == CONSTANTS.SCALE_LISTENER_STATUS.CONNECTING
        this.isSubmitButtonDisabled = this.status.code != CONSTANTS.SCALE_LISTENER_STATUS.STABILIZED;
        this.selectedScale.scale.isActive = this.selectedScale.scale.isConnected = isActive;
    }
    //#endregion

}
