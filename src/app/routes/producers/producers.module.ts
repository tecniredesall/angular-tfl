import { AngularResizedEventModule } from 'angular-resize-event';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';
import { MaterialModule } from 'src/app/material.module';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { OnlyNumberModule } from 'src/app/shared/directives/only-number/only-number.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TBlocksModule } from '../t-blocks/t-blocks.module';
import { TFarmsModule } from '../t-farms/t-farms.module';
import { ActionsModalComponent } from './components/actions-modal/actions-modal.component';
import {
    ActionsRelateProducerComponent
} from './components/actions-relate-producer/actions-relate-producer.component';
import {
    ListViewRelatedProducersComponent
} from './components/list-view-related-producers/list-view.component';
import {
    ProducerActionBlockComponent
} from './components/producer-action-block/producer-action-block.component';
import {
    ProducerActionFarmComponent
} from './components/producer-action-farm/producer-action-farm.component';
import {
    ProducerDeleteModalComponent
} from './components/producer-delete-modal/producer-delete-modal.component';
import {
    ProducerEditAdditionalComponent
} from './components/producer-edit-additional/producer-edit-additional.component';
import { ProducerEditComponent } from './components/producer-edit/producer-edit.component';
import { ProducerNewComponent } from './components/producer-new/producer-new.component';
import { ProfileComponent } from './components/producer-profile-related-data/profile.component';
import { ProducersRoutingModule } from './producers-routing.module';
import { ProducersComponent } from './producers.component';
import { ErrorWorkerComponent } from './components/error-worker/error-worker.component';

@NgModule({
    declarations: [
        ProducersComponent,
        ProducerEditComponent,
        ProducerDeleteModalComponent,
        ProfileComponent,
        ActionsRelateProducerComponent,
        ListViewRelatedProducersComponent,
        ProducerActionBlockComponent,
        ProducerActionFarmComponent,
        ActionsModalComponent,
        ProducerEditAdditionalComponent,
        ProducerNewComponent,
        ErrorWorkerComponent
    ],
    imports: [
        CommonModule,
        ProducersRoutingModule,
        SharedModule,
        MaterialModule,
        AngularResizedEventModule,
        TextMaskModule,
        BlockUIModule.forRoot({
            template: BlockModalUiComponent,
        }),
        TFarmsModule,
        TBlocksModule,
        OnlyNumberModule,
    ],
    exports: [ProducerEditComponent]
})
export class ProducersModule {}
