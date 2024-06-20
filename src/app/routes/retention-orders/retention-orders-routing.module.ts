import { RetentionOrderViewComponent } from './components/retention-order-view/retention-order-view.component';
import { RetentionOrderCreateComponent } from './components/retention-order-create/retention-order-create.component';

import { RetentionOrderListComponent } from './components/retention-order-list/retention-order-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';
import { RetentionOrdersComponent } from './retention-orders.component';

const routes: Routes = [
    {
        path: '',
        component: RetentionOrdersComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'list',
        component: RetentionOrderListComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'create',
        component: RetentionOrderCreateComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'edit/:id',
        component: RetentionOrderCreateComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'view/:id',
        component: RetentionOrderViewComponent,
        canActivate: [AuthenticationGuard],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetentionOrdersRoutingModule { }
