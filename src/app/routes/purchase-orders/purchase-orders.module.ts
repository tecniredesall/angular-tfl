import { TextMaskModule } from 'angular2-text-mask';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { OnlyNumberModule } from 'src/app/shared/directives/only-number/only-number.module';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatchFeatureComponent } from './components/match-feature/match-feature.component';
import {
    PurchaseOrderDeleteComponent
} from './components/purchase-order-delete/purchase-order-delete.component';
import {
    PurchaseOrderDetailsComponent
} from './components/purchase-order-details/purchase-order-details.component';
import {
    ContractChangedModalComponent
} from './components/purchase-order-edit/components/contract-changed-modal/contract-changed-modal.component';
import {
    PurchaseOrderContractsComponent
} from './components/purchase-order-edit/components/purchase-order-contracts/purchase-order-contracts.component';
import {
    PurchaseOrderDataFormComponent
} from './components/purchase-order-edit/components/purchase-order-data-form/purchase-order-data-form.component';
import {
    PurchaseOrderRelatedNotesComponent
} from './components/purchase-order-edit/components/purchase-order-related-notes/purchase-order-related-notes.component';
import {
    PurchaseOrderEditComponent
} from './components/purchase-order-edit/purchase-order-edit.component';
import {
    PurchaseOrderSettleComponent
} from './components/purchase-order-settle/purchase-order-settle.component';
import {
    PurchaseOrderWeightNotesComponent
} from './components/purchase-order-weight-notes/purchase-order-weight-notes.component';
import {
    PurchaseOrdersListComponent
} from './components/purchase-orders-list/purchase-orders-list.component';
import { PurchaseOrdersRoutingModule } from './purchase-orders-routing.module';
import { PurchaseOrdersComponent } from './purchase-orders.component';

@NgModule({
    declarations: [
        PurchaseOrdersComponent,
        MatchFeatureComponent,
        PurchaseOrdersListComponent,
        PurchaseOrderWeightNotesComponent,
        PurchaseOrderEditComponent,
        PurchaseOrderDataFormComponent,
        PurchaseOrderContractsComponent,
        PurchaseOrderDeleteComponent,
        PurchaseOrderRelatedNotesComponent,
        PurchaseOrderDetailsComponent,
        PurchaseOrderSettleComponent,
        ContractChangedModalComponent
    ],
    imports: [
        CommonModule,
        PurchaseOrdersRoutingModule,
        SharedModule,
        TextMaskModule,
        OnlyNumberModule
    ],
    providers: [DecimalPipe, PermissionsService]
})
export class PurchaseOrdersModule { }
