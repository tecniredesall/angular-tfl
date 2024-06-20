import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IotDevicesEditComponent } from './components/iot-devices-edit/iot-devices-edit.component';
import { IotDevicesListComponent } from './components/iot-devices-list/iot-devices-list.component';
import { TestSocketComponent } from './components/test-socket/test-socket.component';

const routes: Routes = [
    { path: '', component: IotDevicesListComponent },
    { path: 'new', component: IotDevicesEditComponent },
    { path: 'edit/:id', component: IotDevicesEditComponent },
    { path: 'test', component: TestSocketComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IotDevicesRoutingModule {}
