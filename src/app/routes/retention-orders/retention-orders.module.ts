import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RetentionOrdersRoutingModule } from './retention-orders-routing.module';
import { RetentionOrdersComponent } from './retention-orders.component';
import { RetentionOrderListComponent } from './components/retention-order-list/retention-order-list.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';
import { MaterialModule } from 'src/app/material.module';
import { OnlyNumberModule } from 'src/app/shared/directives/only-number/only-number.module';
import { NotificationsModule } from 'src/app/shared/utils/notifications/notifications.module';
import { PerfectScrollModule } from 'src/app/shared/utils/perfect-scroll/perfect-scroll.module';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';
import { RetentionOrderCreateComponent } from './components/retention-order-create/retention-order-create.component';
import { RetentionOrderWeightNotesComponent } from './components/retention-order-weight-notes/retention-order-weight-notes.component';
import { RetentionOrderFilterComponent } from './components/retention-order-filter/retention-order-filter.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { RetentionOrderViewComponent } from './components/retention-order-view/retention-order-view.component';


@NgModule({
  declarations: [

    RetentionOrdersComponent,
       RetentionOrderListComponent,
       RetentionOrderCreateComponent,
       RetentionOrderWeightNotesComponent,
       RetentionOrderFilterComponent,
       RetentionOrderViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RetentionOrdersRoutingModule,
    PerfectScrollModule,
    NotificationsModule,
    NgSelectModule,
    OnlyNumberModule,
    MaterialModule,
    BlockUIModule.forRoot(),
    AngularResizedEventModule,
    TextMaskModule
  ],
  providers: [
    DatePipe,
    DecimalPipe,
  ],
  entryComponents : [
    FiltersComponent,
    ConfirmationDialogComponent
  ]
})
export class RetentionOrdersModule { }
