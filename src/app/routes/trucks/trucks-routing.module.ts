import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';
import { TrucksComponent } from './trucks.component';

const routes: Routes = [
  { path: '', component: TrucksComponent, canActivate: [AuthenticationGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TrucksRoutingModule { }
