import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShippingTicketEditComponent } from './components/shipping-ticket-edit/shipping-ticket-edit.component';
import { ShippingTicketListComponent } from './components/shipping-ticket-list/shipping-ticket-list.component';
import { ShippingTicketDetailComponent } from './components/shipping-ticket-detail/shipping-ticket-detail.component';


const routes: Routes = [
    {
        path: "new",
        component: ShippingTicketEditComponent
    },
    {
        path: "edit/:id",
        component: ShippingTicketEditComponent
    },
    {
        path: '',
        component: ShippingTicketListComponent
    },
    {
        path: 'details/:id',
        component: ShippingTicketDetailComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShippingTicketRoutingModule { }
