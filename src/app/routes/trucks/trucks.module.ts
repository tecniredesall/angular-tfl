import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrucksService } from './services/trucks.service';
import { BlockUIModule } from 'ng-block-ui';
import { TrucksComponent } from './trucks.component';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ActionTrucksComponent } from './actions/action-trucks.component';
import { NumericModule } from './../../shared/directives/numeric/numeric.module';
import {PerfectScrollModule} from './../../shared/utils/perfect-scroll/perfect-scroll.module';
import { NotificationsModule } from '../../shared/utils/notifications/notifications.module';
import { CUDRequestModule } from '../../shared/CUDRequest/CUDRequest.module';
import { TooltipModule } from '../../shared/directives/tooltip/tooltip.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrucksRoutingModule } from './trucks-routing.module';
import { SearchPipe } from './search.pipe';
import {MaterialModule} from '../../material.module';
import { ModalDeleteTruckComponent } from './modal-delete-truck/modal-delete-truck.component';
import { AngularResizedEventModule } from 'angular-resize-event';

@NgModule({
    imports: [
        CommonModule,
        BlockUIModule.forRoot(),
        FormsModule,
        TextMaskModule,
        NumericModule,
        SharedModule,
        MaterialModule,
        PerfectScrollModule,
        NotificationsModule,
        CUDRequestModule,
        TooltipModule,
        TrucksRoutingModule,
        AngularResizedEventModule
    ],
    declarations: [
        TrucksComponent,
        ActionTrucksComponent,
        SearchPipe,
        ModalDeleteTruckComponent,
    ],
    providers: [
        TrucksService
    ],
    exports: [
        ActionTrucksComponent
    ]
})
export class TrucksModule { }
