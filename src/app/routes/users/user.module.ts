import { CUDRequestModule } from './../../shared/CUDRequest/CUDRequest.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { BlockUIModule } from 'ng-block-ui';
import { UsersComponent } from './users.component';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ActionUserComponent } from './actions/action-user.component';
import { PerfectScrollModule } from '../../shared/utils/perfect-scroll/perfect-scroll.module';
import { NotificationsModule } from '../../shared/utils/notifications/notifications.module';
import { TooltipModule } from '../../shared/directives/tooltip/tooltip.module';
import {MaterialModule} from '../../material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersRoutingModule } from './user-routing.module';
@NgModule({
    imports: [
        CommonModule,
        BlockUIModule.forRoot(),
        FormsModule,
        TextMaskModule,
        MaterialModule,
        SharedModule,
        PerfectScrollModule,
        NotificationsModule,
        CUDRequestModule,
        TooltipModule,
        UsersRoutingModule
    ],
    declarations: [
        UsersComponent,
        ActionUserComponent,
    ],
    providers: [
        UserService,
    ]
})
export class UserModule { }
