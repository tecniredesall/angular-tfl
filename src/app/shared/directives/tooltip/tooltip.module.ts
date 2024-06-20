import { TooltipDirective } from './tooltip.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TooltipDirective
  ],
  exports: [
    TooltipDirective
  ],
})
export class TooltipModule { }
