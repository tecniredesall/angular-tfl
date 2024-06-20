import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';
import { KanbanDashboardComponent } from './components/dashboard/kanban-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { TransitionComponent } from './components/transition/transition.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'dashboard/:workflowId',
    component: KanbanDashboardComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'transition/:id',
    component: TransitionComponent,
    canActivate: [AuthenticationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KanbanRoutingModule { }
