import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommodityService } from './services/commodity.service';
import { BlockUIModule } from 'ng-block-ui';
import { CommodityComponent } from './commodity.component';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ActionCommodityComponent } from './actions/action-commodity.component';
import { ActionTypesCommodityComponent } from './action-types/action-types-commodity.component';
import { NumericModule } from './../../shared/directives/numeric/numeric.module';
import {PerfectScrollModule} from './../../shared/utils/perfect-scroll/perfect-scroll.module';
import { NotificationsModule } from '../../shared/utils/notifications/notifications.module';
import { CUDRequestModule } from '../../shared/CUDRequest/CUDRequest.module';
import { TooltipModule } from '../../shared/directives/tooltip/tooltip.module';
import { SharedModule } from '../../shared/shared.module';
import { CommodityRoutingModule } from './commodity-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {I18nPipe} from '../../shared/i18n/i18n.pipe';
import { CommoditySearchPipe } from './commodity-search.pipe';
import { ModalDeleteCommodityComponent } from './modal-delete-commodity/modal-delete-commodity.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { ModalDeleteCommodityTypeComponent } from './modal-delete-commodity-type/modal-delete-commodity-type.component';

@NgModule({
    imports: [
        CommonModule,
        BlockUIModule.forRoot(),
        FormsModule,
        TextMaskModule,
        NumericModule,
        SharedModule,
        PerfectScrollModule,
        NotificationsModule,
        CUDRequestModule,
        TooltipModule,
        CommodityRoutingModule,
        NgSelectModule,
        MaterialModule,
        AngularResizedEventModule
    ],
    declarations: [
        CommodityComponent,
        ActionCommodityComponent,
        ActionTypesCommodityComponent,
        CommoditySearchPipe,
        ModalDeleteCommodityComponent,
        ModalDeleteCommodityTypeComponent
    ],
    providers: [
        I18nPipe,
        CommodityService,
    ],
    exports: [
        ActionCommodityComponent,
        ModalDeleteCommodityComponent,
        ModalDeleteCommodityTypeComponent
    ]
})
export class CommodityModule { }
