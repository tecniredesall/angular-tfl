import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseTransferComponent } from './warehouse-transfer.component';
import { AuthenticationGuard } from '../../shared/guards/authentication.guard';
import { DetailMovementComponent } from './components/detail-movement/detail-movement.component';
import { CreateOutputTransferComponent } from './components/warehouse-transfer-out/create-output-transfer/create-output-transfer.component';

const routes: Routes = [
  { path: '', component: WarehouseTransferComponent, canActivate: [AuthenticationGuard] },
  { path: 'detail-movement/:id', component: DetailMovementComponent, canActivate: [AuthenticationGuard] },
  {
    path: "create-output-transfer/:movementType",
    component: CreateOutputTransferComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: "create-output-transfer/:out-edit/:id",
    component: CreateOutputTransferComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: "create-output-transfer/:in-edit/:id",
    component: CreateOutputTransferComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: "create-output-transfer/new-override/:override/:id",
    component: CreateOutputTransferComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],

})
export class WarehouseTransferRoutingModule { }
