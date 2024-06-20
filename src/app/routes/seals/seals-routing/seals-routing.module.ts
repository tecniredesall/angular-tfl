import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SealsComponent} from '../seals/seals.component';
import {AuthenticationGuard} from '../../../shared/guards/authentication.guard';

const routes: Routes = [
  { path: '', component: SealsComponent, canActivate: [AuthenticationGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SealsRoutingModule { }
