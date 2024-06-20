import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { of } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {
    SubscriptionManagerDirective
} from 'src/app/shared/directives/subscription-manager/subscription-manager.directive';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { IotDevicesModel } from '../../models/iot-devices.model';
import { IotDevicesService } from '../../services/iot-devices/iot-devices.service';
import {
    IotDevicesDeleteModalComponent
} from '../iot-devices-delete-modal/iot-devices-delete-modal.component';

@Component({
    selector: 'app-iot-devices-edit',
    templateUrl: './iot-devices-edit.component.html',
    styleUrls: ['./iot-devices-edit.component.scss'],
})
export class IotDevicesEditComponent
    extends SubscriptionManagerDirective
    implements OnInit, OnDestroy {
    @BlockUI('hello') blockUI: NgBlockUI;
    @HostBinding('class') hostClasses = 'sil-overflow-container';
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public TABS = {
        AVAILABLE_DEVICES: 0,
        GRAL_INFO: 1,
    };

    public formIsValid = false;
    public usersChanged = false;
    public formIsTouched = false;
    public iotDevice: IotDevicesModel = new IotDevicesModel();
    private iotDevicesToSave: Partial<IotDevicesModel> = new IotDevicesModel();
    private deleteIotDevicesModalRef: MatDialogRef<
        IotDevicesDeleteModalComponent,
        any
    > = null;
    public selectedIotDevicesUsersId: number[];
    public action: number;
    public selectedTabIndex: 1 | 0 = 0;
    public selectedAvailableDevice = false;
    constructor(
        private iotDevicesService: IotDevicesService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _notifier: NotifierService,
        private _i18n: I18nPipe,
        private _alert: AlertService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _dialog: MatDialog
    ) {
        super();
    }

    ngOnInit() {
        this.blockUI.start();
        this._route.url
            .pipe(
                takeUntil(this.destroy$),
                tap((r) => {
                    this.action = this.setFormAction(r);
                }),
                switchMap(() => this._route.paramMap),
                switchMap((p) =>
                    this.action === this.ACTIONS.CREATE
                        ? of(new IotDevicesModel())
                        : this.iotDevicesService.getIotDevicesDetail(
                            String(p.get('id'))
                        )
                )
            )
            .subscribe(
                (s) => {
                    this.iotDevice = s;
                    this.iotDevicesToSave = s;
                    this.selectedIotDevicesUsersId =
                        this.iotDevice.associatedUsers.map((u) => u.id);
                    this.iotDevicesToSave.associatedUsers =
                        this.selectedIotDevicesUsersId;
                    this.blockUI.stop();
                },
                () => {
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    public onFormChanged(event: {
        value: any;
        isTouched: boolean
    }) {
        const value = event.value;
        this.formIsTouched = event.isTouched;

        this.usersChanged = true;
        this.iotDevicesToSave.deviceType = value.type;
        this.iotDevicesToSave.model = value.model;
        this.iotDevicesToSave.isActive = value.status;
        this.iotDevicesToSave.location = value.location;
        this.iotDevicesToSave.description = value.description;
        this.iotDevicesToSave.ipAddress = value.ip;
        this.iotDevicesToSave.model = value.model;
        this.iotDevicesToSave.brand = value.brand;
        this.iotDevicesToSave.port =  value.port;
        this.iotDevicesToSave.associatedUsers =
            this.iotDevicesToSave.associatedUsers;
    }
    public onLinkedUserChanged(users: number[]) {
        this.iotDevicesToSave.associatedUsers = users.map((v) => v.toString());
        this.usersChanged = true;
        this.formIsTouched = true;
    }
    public onSaveIotDevices() {
        this.action === this.ACTIONS.CREATE
            ? this.postIotDevices(this.iotDevicesToSave)
            : this.putIotDevices(this.iotDevicesToSave);
    }
    private postIotDevices(
        iotDeviceToSave: IotDevicesModel | Partial<IotDevicesModel>
    ) {
        this.blockUI.start();
        this.iotDevicesService
            .postIotDevices(iotDeviceToSave.serializeIotDevicesToSave())
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('iot-devices-created-iot-devices')
                    );
                    this._router.navigate(['/routes/iot-devices']);
                },
                (err) => {
                    this.blockUI.stop();
                    const message: string = err.error.data.ip_address
                        ? this._i18n.transform('iot-devices-ip-duplicated')
                        : this._i18n.transform('unknown-error');
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message.replace('[value]', iotDeviceToSave.ipAddress)
                    );
                }
            );
    }
    private putIotDevices(
        iotDeviceToSave: IotDevicesModel | Partial<IotDevicesModel>
    ) {
        this.blockUI.start();
        this.iotDevicesService
            .putIotDevices(iotDeviceToSave.serializeIotDevicesToSave())
            .pipe(take(1))
            .subscribe(
                (r) => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('iot-devices-updated-iot-devices')
                    );
                    this._router.navigate(['/routes/iot-devices']);
                },
                (err) => {
                    this.blockUI.stop();
                    const message: string = err.error.data.ip_address
                        ? this._i18n.transform('iot-devices-ip-duplicated')
                        : this._i18n.transform('unknown-error');
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message.replace('[value]', iotDeviceToSave.ipAddress)
                    );
                }
            );
    }
    /**
     * Returns form action enum from activated route
     * @param url url segment to get route name from
     */
    private setFormAction(url: UrlSegment[]): number {
        const uri = url.toString();

        return uri.includes('edit') ? this.ACTIONS.UPDATE : this.ACTIONS.CREATE;
    }

    public onCancel() {
        this._router.navigate(['/routes/iot-devices']);
    }

    public onDeleteIotDevices(id: string) {
        this.deleteIotDevicesModalRef = this._dialog.open(
            IotDevicesDeleteModalComponent,
            {
                autoFocus: false,
                disableClose: true,
                data:
                    this.iotDevicesToSave.model ||
                    this.iotDevicesToSave.description,
            }
        );
        this.deleteIotDevicesModalRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((response: any) => {
                this.deleteIotDevicesModalRef = null;
                if (response.delete) {
                    this.deleteIotDevices(id);
                }
            });
    }

    public deleteIotDevices(id: string) {
        this.iotDevicesService
            .deleteIotDevices(id)
            .pipe(take(1))
            .subscribe(
                (r) => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('iot-devices-deleted-iot-devices')
                    );
                    this._router.navigate(['/routes/iot-devices']);
                },
                (err) => {
                    this.blockUI.stop();
                    let message: string = this._errorHandlerService.handleError(
                        err,
                        'iot-device'
                    );
                    message = this._i18n.transform(message);
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }

    public onSelectedDeviceChanged(device: string) {
        let newDevice = new IotDevicesModel();
        newDevice.ipAddress = device;

        this.iotDevice = newDevice;
        this.selectedAvailableDevice = true;
    }

    public onCreateNewDevice() {
        this.selectedTabIndex = 1;
    }
}
