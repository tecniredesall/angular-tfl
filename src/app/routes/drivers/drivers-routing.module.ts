import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriversComponent } from './drivers.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';

const routes: Routes = [
  { path: '', component: DriversComponent, canActivate: [AuthenticationGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DriversRoutingModule { }
