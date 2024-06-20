import { AngularResizedEventModule } from 'angular-resize-event';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';
import { MaterialModule } from 'src/app/material.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { UnitMeasuresService } from '../unit-measures/services/units-measure.service';
import { ActionsBlockComponent } from './components/actions-block/actions-block.component';
import {
    BlockEditFederatedComponent
} from './components/block-edit-federated/block-edit-federated.component';
import { BlockEditComponent } from './components/block-edit/block-edit.component';
import {
    BlockFederatedListComponent
} from './components/block-federated-list/block-federated-list.component';
import { BlockViewComponent } from './components/block-view/block-view.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import {
    ModalDeleteBlockComponent
} from './components/modal-delete-block/modal-delete-block.component';
import { TBlocksRoutingModule } from './t-blocks-routing.module';
import { BlockFederatedViewComponent } from './components/block-federated-view/block-federated-view.component';

@NgModule({
    declarations: [
        ListViewComponent,
        ActionsBlockComponent,
        ModalDeleteBlockComponent,
        BlockEditComponent,
        BlockViewComponent,
        BlockFederatedListComponent,
        BlockEditFederatedComponent,
        BlockFederatedViewComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        TBlocksRoutingModule,
        SharedModule,
        MaterialModule,
        BlockUIModule.forRoot(),
        AngularResizedEventModule,
        TextMaskModule,
    ],
    exports: [
        ListViewComponent,
        ActionsBlockComponent,
        BlockEditComponent,
        BlockViewComponent,
        BlockFederatedListComponent,
        BlockEditFederatedComponent,
    ],
    providers: [UnitMeasuresService]
})
export class TBlocksModule {}
