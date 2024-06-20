import { BlockUIModule } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { OnlyNumberModule } from 'src/app/shared/directives/only-number/only-number.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
    UnitDeleteModalComponent
} from './components/unit-delete-modal/unit-delete-modal.component';
import {
    UnitMeasureEditComponent
} from './components/unit-measure-edit/unit-measure-edit.component';
import { UnitMeasuresService } from './services/units-measure.service';
import { UnitMeasuresRoutingModule } from './unit-measures-routing.module';
import { UnitMeasuresComponent } from './unit-measures.component';

@NgModule({
    declarations: [
        UnitMeasuresComponent,
        UnitMeasureEditComponent,
        UnitDeleteModalComponent,
    ],
    imports: [
        CommonModule,
        UnitMeasuresRoutingModule,
        SharedModule,
        OnlyNumberModule,
        BlockUIModule.forRoot({
            template: BlockModalUiComponent,
        }),
    ],
    providers: [UnitMeasuresService],
})
export class UnitMeasuresModule {}
