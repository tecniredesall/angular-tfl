import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import {
    IotDevicesService
} from 'src/app/routes/iot-devices/services/iot-devices/iot-devices.service';
import {
    ScaleSocketService
} from 'src/app/routes/iot-devices/shared/services/scale-socket/scale-socket.service';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-iot-available-devices',
    templateUrl: './iot-available-devices.component.html',
    styleUrls: ['./iot-available-devices.component.scss'],
})
export class IotAvailableDevicesComponent
    extends SubscriptionManagerDirective
    implements OnInit
{
    public columnAscState: any = {
        brand: true,
        model: false,
    };
    public loadingDevices: boolean;
    public devices = [];
    private loadingEnded$ = new Subject();
    public selectedDevice: string;
    @Output() selectedDeviceChanged = new EventEmitter();
    @Output() createNewDevice = new EventEmitter();
    @BlockUI() blockUi: NgBlockUI;
    constructor(
        private iotScaleSocket: ScaleSocketService,
        private _alert: AlertService,
        private _i18n: I18nPipe,
        private _iotDeviceService: IotDevicesService
    ) {
        super();
    }

    ngOnInit() {
        if (this.iotScaleSocket.socketConfig) {
            this.loadIotDevices();
        } else {
            this.iotScaleSocket.socketConfigIsReady$
                .pipe(
                    takeUntil(this.destroy$),
                    filter((loaded) => loaded === true)
                )
                .subscribe(() => this.loadIotDevices());
        }
    }

    public loadIotDevices() {
        this.blockUi.start();
        this.iotScaleSocket
            .getAvailableIotDevices()
            .pipe(
                takeUntil(this.loadingEnded$),
                map((r) =>
                    r.data.iotConnected.map((d) =>
                        String(d).replace('::ffff:', '')
                    )
                )
            )
            .subscribe(
                (r) => {
                    this.blockUi.stop();
                    this.loadingDevices = false;
                    this.loadingEnded$.next(true);
                    this.devices = r;
                    this.getAvailableIpsFromConnected(this.devices);
                },
                () => {
                    this.blockUi.stop();
                    this.loadingDevices = false;
                    this.loadingEnded$.next(true);
                    const message = this._i18n.transform(
                        'iot-device-list-error'
                    );
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }

    public getAvailableIpsFromConnected(ips: string[]) {
        this.blockUi.start();
        this._iotDeviceService
            .getAvailableIps(ips)
            .pipe(take(1))
            .subscribe((r) => {
                this.devices = this.devices.filter((d) => r.indexOf(d) !== -1);
                this.blockUi.stop();
            }, () => this.blockUi.stop());
    }

    public sortData(column: string) {}
    public onDeviceSelected(device: string) {
        this.selectedDevice = device;
        this.selectedDeviceChanged.emit(device);
    }
    public onNewDevice() {
        this.createNewDevice.emit();
    }
}
