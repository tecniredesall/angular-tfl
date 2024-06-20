import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MiscellaneousModule } from '../shared/miscellaneous/miscellaneous.module';
import { SharedModule } from '../shared/shared.module';
import { NotificationsModule } from '../shared/utils/notifications/notifications.module';
import { PerfectScrollModule } from '../shared/utils/perfect-scroll/perfect-scroll.module';
import { RoutesRoutingModule } from './routes-routing.module';
import { RoutesComponent } from './routes.component';

@NgModule({
    declarations: [RoutesComponent],
    imports: [
        CommonModule,
        RoutesRoutingModule,
        SharedModule,
        PerfectScrollModule,
        MiscellaneousModule,
        NotificationsModule
    ],
})
export class RoutesModule { }
