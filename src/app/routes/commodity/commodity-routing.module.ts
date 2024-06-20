import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';
import { CommodityComponent } from './commodity.component';

const routes: Routes = [
  { path: '', component: CommodityComponent, canActivate: [AuthenticationGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CommodityRoutingModule { }
