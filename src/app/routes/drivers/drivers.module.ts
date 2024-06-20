import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversService } from './services/drivers.service';
import { DriversComponent } from './drivers.component';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ActionDriversComponent } from './actions/actions-driver.component';
import { NumericModule } from './../../shared/directives/numeric/numeric.module';
import {PerfectScrollModule} from './../../shared/utils/perfect-scroll/perfect-scroll.module';
import { NotificationsModule } from '../../shared/utils/notifications/notifications.module';
import { CUDRequestModule } from '../../shared/CUDRequest/CUDRequest.module';
import { TooltipModule } from '../../shared/directives/tooltip/tooltip.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DriversRoutingModule } from './drivers-routing.module';
import { SearchPipe } from './search.pipe';
import {MaterialModule} from '../../material.module';
import { BlockUIModule } from 'ng-block-ui';
import { AngularResizedEventModule } from 'angular-resize-event';
import { ModalDeleteDriverComponent } from './modal-delete-driver/modal-delete-driver.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TextMaskModule,
        NumericModule,
        SharedModule,
        PerfectScrollModule,
        NotificationsModule,
        CUDRequestModule,
        TooltipModule,
        MaterialModule,
        DriversRoutingModule,
        BlockUIModule.forRoot(),
        AngularResizedEventModule
    ],
    declarations: [
        DriversComponent,
        ActionDriversComponent,
        SearchPipe,
        ModalDeleteDriverComponent
    ],
    providers: [
        DriversService
    ],
    exports: [
        ActionDriversComponent,
        ModalDeleteDriverComponent
    ]
})
export class DriversModule { }
