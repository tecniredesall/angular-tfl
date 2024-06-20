import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScaleDialogComponent } from '../components/scale-dialog/scale-dialog.component';
import { ScaleListenerComponent } from '../components/scale-listener/scale-listener.component'
import { SortMachineDialogComponent } from '../components/sort-machine-dialog/sort-machine-dialog.component'
import { SortMachineListenerComponent } from '../components/sort-machine-listener/sort-machine-listener.component'

@NgModule({
    declarations: [
        ScaleDialogComponent,
        ScaleListenerComponent,
        SortMachineDialogComponent,
        SortMachineListenerComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class ScaleSharedModule { }
