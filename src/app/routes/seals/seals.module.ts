import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SealsComponent } from './seals/seals.component';
import {SealsRoutingModule} from './seals-routing/seals-routing.module';
import {SealsService} from './seals.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PerfectScrollModule} from '../../shared/utils/perfect-scroll/perfect-scroll.module';
import {SharedModule} from '../../shared/shared.module';
import { SealsModalComponent } from './seals-modal/seals-modal.component';
import {MaterialModule} from '../../material.module';
import {DragndropDirective} from './dragndrop.directive';
import {HttpClientModule} from '@angular/common/http';
import {BlockUiComponent} from '../../shared/block/block.component';
import { SealsCreateComponent } from './seals/seals-create/seals-create.component';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
    imports: [
        CommonModule,
        SealsRoutingModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        PerfectScrollModule,
        ReactiveFormsModule,
        HttpClientModule,
        BlockUIModule.forRoot()
    ],
    declarations: [
        SealsComponent,
        SealsModalComponent,
        DragndropDirective,
        SealsCreateComponent
    ],
    providers: [SealsService]
})
export class SealsModule { }
