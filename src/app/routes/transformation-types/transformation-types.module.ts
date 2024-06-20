import { BlockUIModule } from 'ng-block-ui';
import { MaterialModule } from 'src/app/material.module';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
    TransformationDeleteModalComponent
} from './components/transformation-delete-modal/transformation-delete-modal.component';
import {
    TransformationTypeEditComponent
} from './components/transformation-type-edit/transformation-type-edit.component';
import { TransformationTypesService } from './services/transformation-types.service';
import { TransformationTypesRoutingModule } from './transformation-types-routing.module';
import { TransformationTypesComponent } from './transformation-types.component';

@NgModule({
    declarations: [
        TransformationTypesComponent,
        TransformationTypeEditComponent,
        TransformationDeleteModalComponent,
    ],
    imports: [
        CommonModule,
        TransformationTypesRoutingModule,
        SharedModule,
        MaterialModule,
        BlockUIModule.forRoot({
            template: BlockModalUiComponent,
        }),
    ],
    providers: [TransformationTypesService],
})
export class TransformationTypesModule {}
