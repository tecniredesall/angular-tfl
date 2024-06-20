import { NotifierService } from 'angular-notifier';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { IotDeviceBrand } from 'src/app/routes/iot-devices/models/iot-device-brand.model';
import { IotDeviceModel } from 'src/app/routes/iot-devices/models/iot-device-model.model';
import { IotDevicesModel } from 'src/app/routes/iot-devices/models/iot-devices.model';
import {
    IotDevicesService
} from 'src/app/routes/iot-devices/services/iot-devices/iot-devices.service';
import {
    ScaleSocketService
} from 'src/app/routes/iot-devices/shared/services/scale-socket/scale-socket.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IScaleWeightEvent } from 'src/app/shared/models/scale-weight-event.model';

@Component({
    selector: 'app-iot-devices-data-form',
    templateUrl: './iot-devices-data-form.component.html',
    styleUrls: ['./iot-devices-data-form.component.scss'],
})
export class IotDevicesDataFormComponent implements OnDestroy, OnChanges {

    readonly CONSTANTS = CONSTANTS;
    private destroy$ = new Subject();
    private testEnded$ = new Subject();
    public form: UntypedFormGroup;
    public testingConnection = false;
    public deviceTypeList = CONSTANTS.IOT_DEVICE_TYPE;
    public deviceModels: IotDeviceModel[];
    public deviceBrands: IotDeviceBrand[];
    public currentBrand: IotDeviceBrand;
    public origBrands: IotDeviceBrand[];
    public loadingBrand = false;
    @Input() iotDevice: IotDevicesModel;
    @Input() isCreate: number;
    @Output() formIsValid = new EventEmitter();
    @Output() formChanged = new EventEmitter();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private iotScaleSocket: ScaleSocketService,
        private _notifier: NotifierService,
        private _i18n: I18nPipe,
        private _alert: AlertService,
        private _iotDeviceService: IotDevicesService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.iotDevice && changes.iotDevice.currentValue) {
            this.iotDevice = changes.iotDevice.currentValue;
            if (this.isCreate) {
                this.setForm(this.iotDevice);
            } else if (!changes.iotDevice.firstChange) {
                this.setForm(this.iotDevice);
            }
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
    }

    private _setModels(device: IotDevicesModel) {
        if (this.form.get('brand').value && this.deviceBrands) {
            const brand = this.deviceBrands.find(
                (b) => b.id === device.iotBrandId
            );
            if (brand) {
                this.deviceModels = brand.models;
                this.form.get('model').enable();

            }
        } else {
            this.form.get('model').disable();
            const brand = this.deviceBrands?.find((b) => b.id === this.iotDevice.iotBrandId);
            if (brand) {
                this.form.get('brand').setValue(brand.id)
                this.form.get('model').setValue(this.iotDevice.iotModelId)
            }
        }
    }

    private _setFormChangesHandler() {
        //Form changes
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v) => {
            this.formIsValid.emit(this.form.valid);
            this.formChanged.emit({
                value: v,
                isTouched: this.form.dirty
            });
        });
        //Device type changes
        this.form.get('type').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (value == CONSTANTS.IOT_DEVICE_TYPES.SORTER_MACHINE) {
                this.form.get('port').enable();
                this.form.get('port').setValue(this.iotDevice.port)
            } else {
                this.form.get('port').setValue('');
                this.form.get('port').disable();
            }
            if (value) {
                this.form.get('brand').reset();
                this.form.get('brand').enable();
                this._getDeviceBrands(value);
            } else {
                this.form.get('brand').reset();
                this.form.get('brand').disable();
            }
        });
        //Brand type changes
        this.form
            .get('brand')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((id: string) => {
                if (id) {
                    const brand = this.deviceBrands.find((b) => b.id === id);
                    this.currentBrand = brand;
                    this.deviceModels = brand.models;
                    this.form.get('model').reset();
                    this.form.get('model').enable();
                } else {
                    this.deviceModels = [];
                    this.form.get('model').reset();
                    this.form.get('model').disable();
                }
            });
    }

    private _getDeviceBrands(deviceType: string) {
        this._iotDeviceService
            .getIotDeviceBrands(deviceType)
            .pipe(take(1))
            .subscribe((b) => {
                this.deviceBrands = b;
                this.origBrands = b;
                if (this.iotDevice) {
                    this._setModels(this.iotDevice);
                }
            });
    }

    public setForm(iotDevice: IotDevicesModel) {
        this.form = this.formBuilder.group({
            type: [
                iotDevice.deviceType,
                Validators.required,
            ],
            brand: [
                {
                    value: iotDevice.iotBrandId,
                    disabled: iotDevice.deviceType == null
                },
                Validators.required,
            ],
            model: [
                iotDevice.iotModelId,
                Validators.required,
            ],
            port: [
                {
                    value: iotDevice.deviceType == CONSTANTS.IOT_DEVICE_TYPES.SCALE ? '' : iotDevice.port,
                    disabled: iotDevice.deviceType == CONSTANTS.IOT_DEVICE_TYPES.SCALE
                },
                Validators.compose([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(65535),
                ]),
            ],
            ip: [
                iotDevice.ipAddress,
                [
                    Validators.required,
                    Validators.pattern(CONSTANTS.VALID_IP_REGEXP),
                ],
            ],
            location: [
                iotDevice.location,
                Validators.required,
            ],
            description: [iotDevice.description],
            status: [iotDevice.isActive],
            verifiedConnection: [false],
        });
        this.formIsValid.next(this.form.valid);
        this._setFormChangesHandler();
        this._getDeviceBrands(iotDevice.deviceType);
        this._setModels(iotDevice);
    }

    public onTestConnection() {
        this.testingConnection = true;
        let typeMachine: Observable<IScaleWeightEvent>;
        if (this.form.get('type').value == CONSTANTS.IOT_DEVICE_TYPES.SORTER_MACHINE) {
            typeMachine = this.iotScaleSocket
                .testConnection(this.form.get('ip').value, this.form.get('port').value, true)
        } else {
            typeMachine = this.iotScaleSocket
                .testConnection(this.form.get('ip').value)
        }
        typeMachine.pipe(takeUntil(this.testEnded$))
            .subscribe(
                (r) => {
                    this.testingConnection = false;
                    this.testEnded$.next(true);
                    if (r.data === true) {
                        this._notifier.notify(
                            'success',
                            this._i18n.transform('scales-online-scale')
                        );
                        this.form.get('verifiedConnection').setValue(true);
                    } else {
                        this._notifier.notify(
                            'error',
                            this._i18n.transform('scales-offline-scale')
                        );
                        this.form.get('verifiedConnection').setValue(false);
                    }
                },
                (err) => {
                    this.testingConnection = false;
                    this.testEnded$.next(true);
                    const message = this._i18n.transform('scales-test-failed');
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }
}
