import { FederateFarmSelectedComponent } from './actions/federate-farm/federate-farm-selected/federate-farm-selected.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ActionsComponent } from './actions/actions.component';
import { ListViewComponent } from './list-view/list-view.component';
import { ModalDeleteFarmComponent } from './modal-delete-farm/modal-delete-farm.component';
import { TFarmsRoutingModule } from './t-farms-routing.module';
import { UnitMeasuresService } from '../unit-measures/services/units-measure.service';
import { FormDataComponent } from './actions/form-data/form-data.component';
import { FederateFarmComponent } from './actions/federate-farm/federate-farm.component';
import { FederateFarmListComponent } from './actions/federate-farm/federate-farm-list/federate-farm-list.component';

@NgModule({
    declarations: [
        ActionsComponent,
        ListViewComponent,
        ModalDeleteFarmComponent,
        FormDataComponent,
        FederateFarmComponent,
        FederateFarmListComponent,
        FederateFarmSelectedComponent
    ],
    imports: [
        CommonModule,
        TFarmsRoutingModule,
        SharedModule,
        MaterialModule,
        BlockUIModule.forRoot(),
        TextMaskModule,
        AngularResizedEventModule,
    ],
    exports: [ActionsComponent, ListViewComponent],
    providers: [UnitMeasuresService]
})
export class TFarmsModule { }
