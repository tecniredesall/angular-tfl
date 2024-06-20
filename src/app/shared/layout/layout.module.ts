import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutService } from './services/layout.service';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUiComponent } from '../block/block.component';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { PerfectScrollModule } from '../utils/perfect-scroll/perfect-scroll.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from '../directives/tooltip/tooltip.module';
import { SharedModule } from '../shared.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        SharedModule,
        BlockUIModule.forRoot({
            template: BlockUiComponent
        }),
        TextMaskModule,
        PerfectScrollModule,
        NgSelectModule,
        TooltipModule,
        // NotificationsModule
    ],
    declarations: [],
    providers: [
        LayoutService
    ],
    exports: []
})
export class LayoutModule { }
