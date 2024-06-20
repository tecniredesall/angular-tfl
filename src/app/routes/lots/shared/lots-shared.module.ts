import { LotProcessingOrderDetailedViewComponent } from './../components/lot-detail/components/lot-processing-order/components/lot-processing-order-detailed-view/lot-processing-order-detailed-view.component';
import { LotProcessingOrderGeneralViewComponent } from './../components/lot-detail/components/lot-processing-order/components/lot-processing-order-general-view/lot-processing-order-general-view.component';
import { BlockUIModule } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationsModule } from 'src/app/shared/utils/notifications/notifications.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from '../../../material.module';
import { LotInfoComponent } from '../components/lot-detail/components/lot-info/lot-info.component';
import {
    LotWeightNotesComponent
} from '../components/lot-detail/components/lot-weight-notes/lot-weight-notes.component';
import { RouterModule } from '@angular/router';
import { LotTastingComponent } from '../components/lot-detail/components/lot-tasting/lot-tasting.component';

@NgModule({
    declarations: [
        LotInfoComponent,
        LotWeightNotesComponent,
        LotProcessingOrderDetailedViewComponent,
        LotProcessingOrderGeneralViewComponent,
        LotTastingComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        NotificationsModule,
        NgSelectModule,
        BlockUIModule.forRoot({
            template: BlockModalUiComponent,
        }),
        SharedModule,
        RouterModule
    ],
    exports: [LotInfoComponent, LotWeightNotesComponent],
})
export class LotsSharedModule { }
