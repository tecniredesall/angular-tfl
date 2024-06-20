import { LayoutModule } from './../../shared/layout/layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyersRoutingModule } from './buyers-routing.module';
import { BuyersComponent } from './buyers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { BlockUIModule } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';


@NgModule({
  declarations: [BuyersComponent],
  imports: [
    CommonModule,
    BuyersRoutingModule,
    CommonModule,
    SharedModule,
    MaterialModule,
    BlockUIModule.forRoot({
        template: BlockModalUiComponent,
    }),
  ]
})
export class BuyersModule { }
