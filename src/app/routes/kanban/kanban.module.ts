import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KanbanRoutingModule } from './kanban-routing.module';
import { HomeComponent } from './components/home/home.component';
import { KanbanDashboardComponent } from './components/dashboard/kanban-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransitionComponent } from './components/transition/transition.component';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { LotDeleteDialogComponent } from '../lots/components/lot-delete-dialog/lot-delete-dialog.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { LotsSharedModule } from '../lots/shared/lots-shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ScaleDialogComponent } from '../iot-devices/components/scale-dialog/scale-dialog.component';
import { SortMachineComponent } from './components/transition/components/sort-machine/sort-machine.component';
import { SortMachineDialogComponent } from '../iot-devices/components/sort-machine-dialog/sort-machine-dialog.component';
import { ScaleSharedModule } from '../iot-devices/shared/scale-shared.module';
import { LotTransferDialogComponent } from '../lots/components/lot-transfer-dialog/lot-transfer-dialog.component';
import { DecimalPipe } from '@angular/common';
@NgModule({
    declarations: [
        HomeComponent,
        KanbanDashboardComponent,
        TransitionComponent,
        SortMachineComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        LotsSharedModule,
        NgxMatMomentModule,
        KanbanRoutingModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        TextMaskModule,
        ScaleSharedModule
    ],
    providers: [
        DecimalPipe
    ]
})
export class KanbanModule { }
