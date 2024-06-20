import { BlockUIModule } from 'ng-block-ui';
import { MaterialModule } from 'src/app/material.module';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { OnlyNumberModule } from 'src/app/shared/directives/only-number/only-number.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
    IotDevicesDeleteModalComponent
} from './components/iot-devices-delete-modal/iot-devices-delete-modal.component';
import {
    IotAvailableDevicesComponent
} from './components/iot-devices-edit/components/iot-available-devices/iot-available-devices.component';
import {
    IotDevicesDataFormComponent
} from './components/iot-devices-edit/components/iot-devices-data-form/iot-devices-data-form.component';
import {
    IotDevicesRelatedUsersComponent
} from './components/iot-devices-edit/components/iot-devices-related-users/iot-devices-related-users.component';
import { IotDevicesEditComponent } from './components/iot-devices-edit/iot-devices-edit.component';
import { IotDevicesListComponent } from './components/iot-devices-list/iot-devices-list.component';
import { IotDevicesRoutingModule } from './iot-devices-routing.module';
import { IotDevicesComponent } from './iot-devices.component';
import { ScaleSharedModule } from './shared/scale-shared.module';
import { TestSocketComponent } from './components/test-socket/test-socket.component';

@NgModule({
    declarations: [
        IotDevicesComponent,
        IotDevicesEditComponent,
        IotDevicesDataFormComponent,
        IotDevicesRelatedUsersComponent,
        IotDevicesListComponent,
        IotDevicesDeleteModalComponent,
        IotAvailableDevicesComponent,
        TestSocketComponent
    ],
    imports: [
        CommonModule,
        IotDevicesRoutingModule,
        ScaleSharedModule,
        SharedModule,
        MaterialModule,
        ReactiveFormsModule,
        BlockUIModule.forRoot({
            template: BlockModalUiComponent,
        }),
        OnlyNumberModule
    ]
})
export class IotDevicesModule { }
