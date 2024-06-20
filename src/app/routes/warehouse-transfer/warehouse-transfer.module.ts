import { AngularResizedEventModule } from 'angular-resize-event';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';

import { CommonModule, DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localePy from '@angular/common/locales/es-PY';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from '../../material.module';
import { OnlyNumberModule } from '../../shared/directives/only-number/only-number.module';
import { SharedModule } from '../../shared/shared.module';
import { NotificationsModule } from '../../shared/utils/notifications/notifications.module';
import { PerfectScrollModule } from '../../shared/utils/perfect-scroll/perfect-scroll.module';
import { CommodityService } from '../commodity/services/commodity.service';
import { DriversModule } from '../drivers/drivers.module';
import { DriversService } from '../drivers/services/drivers.service';
import { ProducersModule } from '../producers/producers.module';
import { TBlocksModule } from '../t-blocks/t-blocks.module';
import { TFarmsModule } from '../t-farms/t-farms.module';
import { TrucksService } from '../trucks/services/trucks.service';
import { TrucksModule } from '../trucks/trucks.module';
import { WarehouseTransferHeaderComponent } from './components/warehouse-transfer-header/warehouse-transfer-header.component';
import { WarehouseTransferRoutingModule } from './warehouse-transfer-routing.module';
import { WarehouseTransferComponent } from './warehouse-transfer.component';
import { LotsModule } from '../lots/lots.module';
import { ScaleDialogComponent } from '../iot-devices/components/scale-dialog/scale-dialog.component';
import { CreateOutputTransferComponent } from './components/warehouse-transfer-out/create-output-transfer/create-output-transfer.component';
import { WarehouseTransferInComponent } from './components/warehouse-transfer-in/warehouse-transfer-in.component';
import { WarehouseTransferListComponent } from './components/warehouse-transfer-list/warehouse-transfer-list.component';
import { FiltersComponent } from './components/filter/filter.component';
import { DetailMovementComponent } from './components/detail-movement/detail-movement.component';
import { warehouseTransferService } from './services/warehouse-transfer.service';
import { DeleteWarehouseTransferComponent } from './components/delete-warehouse-transfer/delete-warehouse-transfer.component';
import { ShippingTicketModule } from '../shipping-ticket/shipping-ticket.module';

registerLocaleData(localePy, 'es');
registerLocaleData(localeEn, 'en');
@NgModule({
    imports: [
        CommonModule,
        WarehouseTransferRoutingModule,
        FormsModule,
        SharedModule,
        PerfectScrollModule,
        NotificationsModule,
        NgSelectModule,
        OnlyNumberModule,
        MaterialModule,
        BlockUIModule.forRoot(),
        AngularResizedEventModule,
        TextMaskModule,
        TFarmsModule,
        TBlocksModule,
        DriversModule,
        TrucksModule,
        ProducersModule,
        LotsModule,
        ShippingTicketModule
    ],
    declarations: [
        WarehouseTransferComponent,
        CreateOutputTransferComponent,
        WarehouseTransferInComponent,
        WarehouseTransferHeaderComponent,
        WarehouseTransferListComponent,
        FiltersComponent,
        DetailMovementComponent,
        DeleteWarehouseTransferComponent
    ],
    providers: [
        DriversService,
        TrucksService,
        warehouseTransferService,
        CommodityService,
        {
            provide: LOCALE_ID,
            useValue: localStorage.getItem('lang'),
        },
        DatePipe,
        DecimalPipe,
    ]
})
export class WarehouseTransferModule { }
