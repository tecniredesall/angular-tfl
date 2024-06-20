import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDashboardComponent } from './t-dashboard.component';
import { TooltipModule } from '../../shared/directives/tooltip/tooltip.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TDashboardRoutingModule } from './t-dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TDashboardRoutingModule,
    SharedModule,
    TooltipModule,
  ],
  declarations: [
    TDashboardComponent,
  ]
})
export class TDashboardModule { }
