import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUDRequestComponent } from './CUDRequest.component';
import { PerfectScrollModule } from '../utils/perfect-scroll/perfect-scroll.module';
import { TooltipModule } from '../directives/tooltip/tooltip.module';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollModule,
    TooltipModule,
    SharedModule
  ],
  declarations: [
    CUDRequestComponent
  ],
  exports: [
    CUDRequestComponent
  ]
})
export class CUDRequestModule { }
