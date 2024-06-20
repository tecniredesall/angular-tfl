import { OnlyNumberDirective } from './only-number.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OnlyNumberDirective
  ],
  exports: [
    OnlyNumberDirective
  ],
})
export class OnlyNumberModule { }
