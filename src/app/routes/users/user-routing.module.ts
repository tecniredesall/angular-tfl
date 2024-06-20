import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { UsersComponent } from './users.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';

const routes: Routes = [
  { path: '', component: UsersComponent, canActivate: [AuthenticationGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule { }