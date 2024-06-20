import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { TDashboardComponent } from './t-dashboard.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';

const routes: Routes = [
  { path: '', component: TDashboardComponent, canActivate: [AuthenticationGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TDashboardRoutingModule { }
