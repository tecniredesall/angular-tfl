import { BlockUIModule } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { NotificationsModule } from '../../shared/utils/notifications/notifications.module';
import {
    ConfirmCancelModalComponent
} from './components/confirm-cancel-modal/confirm-cancel-modal.component';
import { LotCreateNewComponent } from './components/lot-create-new/lot-create-new.component';
import {
    LotCreateResultsFilterComponent
} from './components/lot-create-results-filter/lot-create-results-filter.component';
import { LotCreateComponent } from './components/lot-create/lot-create.component';
import {
    LotDeleteDialogComponent
} from './components/lot-delete-dialog/lot-delete-dialog.component';
import {
    LotDetailEventsComponent
} from './components/lot-detail/components/lot-detail-events/lot-detail-events.component';
import { LotDetailComponent } from './components/lot-detail/lot-detail.component';
import {
    LotListReceivingNoteComponent
} from './components/lot-list-receiving-note/lot-list-receiving-note.component';
import { LotListComponent } from './components/lot-list/lot-list.component';
import {
    LotProductionFlowsComponent
} from './components/lot-production-flows/lot-production-flows.component';
import { LotsRoutingModule } from './lots-routing.module';
import { LotsSharedModule } from './shared/lots-shared.module';
import { LotEventFormComponent } from './components/lot-detail/components/lot-event-form/lot-event-form.component';
import { LotHistoryComponent } from './components/lot-detail/components/lot-history/lot-history.component';
import { LotReprocessDialogComponent } from './components/lot-reprocess-dialog/lot-reprocess-dialog.component';
import { LotSplitDialogComponent } from './components/lot-split-dialog/lot-split-dialog.component';
import { TextMaskModule } from 'angular2-text-mask';
import { LotTransferDialogComponent } from './components/lot-transfer-dialog/lot-transfer-dialog.component';
import { LotTransferSummaryComponent } from './components/lot-transfer-dialog/components/lot-transfer-summary/lot-transfer-summary.component';
import { LotProductionFlowComponent } from './components/lot-transfer-dialog/components/lot-production-flow/lot-production-flow.component'
import { LotMergeComponent } from './components/lot-merge/lot-merge.component';
import { LotListResultComponent } from './components/lot-merge/components/lot-list-result/lot-list-result.component';
import { LotSummaryComponent } from './components/lot-merge/components/lot-summary/lot-summary.component';
import { LotListSummaryComponent } from './components/lot-merge/components/lot-summary/lot-list-summary/lot-list-summary.component';

@NgModule({
    declarations: [
        LotCreateComponent,
        LotCreateResultsFilterComponent,
        LotListReceivingNoteComponent,
        LotCreateNewComponent,
        ConfirmCancelModalComponent,
        LotListComponent,
        LotDeleteDialogComponent,
        LotProductionFlowsComponent,
        LotDetailComponent,
        LotDetailEventsComponent,
        LotEventFormComponent,
        LotHistoryComponent,
        LotReprocessDialogComponent,
        LotSplitDialogComponent,
        LotTransferDialogComponent,
        LotTransferSummaryComponent,
        LotProductionFlowComponent,
        LotMergeComponent,
        LotListResultComponent,
        LotSummaryComponent,
        LotListSummaryComponent
    ],
    imports: [
        CommonModule,
        LotsRoutingModule,
        LotsSharedModule,
        FormsModule,
        NotificationsModule,
        NotificationsModule,
        NgSelectModule,
        MaterialModule,
        BlockUIModule.forRoot({
            template: BlockModalUiComponent,
        }),
        SharedModule,
        TextMaskModule
    ],
    exports: [LotListComponent]
})
export class LotsModule { }
