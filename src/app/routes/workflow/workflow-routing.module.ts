import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WorkflowComponent} from '../workflow/workflow.component';
import {AuthenticationGuard} from '../../shared/guards/authentication.guard';
import {CreateModelComponent} from './production-flows/components/create-model/create-model.component';
import {CreateWorkflowComponent} from './production-flows/components/create-workflow/create-workflow.component';
import { CreateProcessComponent } from './processes/components/create-process/create-process.component';

export const routes: Routes = [
  { 
    path: '',
    component: WorkflowComponent,
    canActivate: [AuthenticationGuard]
  },
  { 
    path: 'create-production-flow/:commodityId',
    component: CreateModelComponent,
    canActivate: [AuthenticationGuard]
  },
  { 
    path: 'create-workflow',
    component: CreateWorkflowComponent,
    canActivate: [AuthenticationGuard]
  },
  { 
    path: 'create-process',
    component: CreateProcessComponent,
    canActivate: [AuthenticationGuard]
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
