/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/04/30
 * Description: perfect scroll bar module,
 *              configure all for custom scroll bar
 * Updated:
 * Comments:
 * Version: 2019.04.30.4000
 * Owner: Grain Chain
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule
  ],
  declarations: [],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    PerfectScrollbarModule
  ]
})
export class PerfectScrollModule { }
