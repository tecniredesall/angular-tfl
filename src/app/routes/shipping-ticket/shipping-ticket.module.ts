import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { ShippingTicketRoutingModule } from './shipping-ticket-routing.module';
import { ShippingTicketEditComponent } from './components/shipping-ticket-edit/shipping-ticket-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShippingTicketWarehouseComponent } from './components/shipping-ticket-warehouse/shipping-ticket-warehouse.component';
import { ScaleDialogComponent } from '../iot-devices/components/scale-dialog/scale-dialog.component';
import { ShippingTicketListComponent } from './components/shipping-ticket-list/shipping-ticket-list.component';
import { ShippingTicketDetailComponent } from './components/shipping-ticket-detail/shipping-ticket-detail.component';


@NgModule({
    declarations: [
        ShippingTicketEditComponent,
        ShippingTicketWarehouseComponent,
        ShippingTicketListComponent,
        ShippingTicketDetailComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ShippingTicketRoutingModule
    ],
    exports: [
        ShippingTicketWarehouseComponent
    ],
    providers: [
        DatePipe,
        DecimalPipe,
    ]
})
export class ShippingTicketModule { }
