import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TastingRoutingModule } from './tasting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateTastingComponent } from './create-tasting/create-tasting.component';
import { TranslateDynamicPipe } from 'src/app/shared/pipes/translate-dynamic/translate-dynamic.pipe';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ModalCancelTastingComponent } from './modal-cancel-tasting/modal-cancel-tasting.component';

@NgModule({
    declarations: [CreateTastingComponent, TranslateDynamicPipe, ModalCancelTastingComponent],
    imports: [
        CommonModule,
        TastingRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
    ],
    exports: [
        TranslateDynamicPipe
    ]
})
export class TastingModule { }
