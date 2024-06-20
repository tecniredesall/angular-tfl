import { NumericDirective } from './numeric.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NumericDirective
  ],
  exports: [
    NumericDirective
  ],
})
export class NumericModule { }
