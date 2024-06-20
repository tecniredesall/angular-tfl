import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    PurchaseOrderEditComponent
} from './components/purchase-order-edit/purchase-order-edit.component';
import { PurchaseOrdersComponent } from './purchase-orders.component';
import { PurchaseOrderDetailsComponent } from './components/purchase-order-details/purchase-order-details.component';

const routes: Routes = [
    { path: '', component: PurchaseOrdersComponent },
    { path: 'new', component: PurchaseOrderEditComponent },
    { path: 'edit/:id', component: PurchaseOrderEditComponent },
    { path: 'details/:id', component: PurchaseOrderDetailsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PurchaseOrdersRoutingModule { }
