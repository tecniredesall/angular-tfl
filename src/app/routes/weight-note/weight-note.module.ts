import { AngularResizedEventModule } from 'angular-resize-event';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';
import { FiltersComponent } from 'src/app/shared/components/filter/filter.component';

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
import { DetailNoteComponent } from './detail-note/detail-note.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalNewComponent } from './modal-new/modal-new.component';
import { ReceivingNoteComponent } from './receiving-note/receiving-note.component';
import { ReceivingComponent } from './receiving/receiving.component';
import { WeightService } from './services/weight.service';
import { WeightNoteRoutingModule } from './weight-note-routing.module';
import { WeightNoteComponent } from './weight-note.component';
import { LotsModule } from '../lots/lots.module';
import { ScaleDialogComponent } from '../iot-devices/components/scale-dialog/scale-dialog.component';
import { ReceivingNoteListComponent } from './components/receiving-note-list/receiving-note-list.component';
import { ReceivingNoteListProductionComponent } from './components/receiving-note-list-production/receiving-note-list-production.component';
import { ModalNotesAssociatedComponent } from './components/modal-notes-associated/modal-notes-associated.component';
import { DeleteWeightNoteComponent } from './components/delete-weight-note/delete-weight-note.component';
import { EditWeightNoteComponent } from './components/edit-weight-note/edit-weight-note.component';

registerLocaleData(localePy, 'es');
registerLocaleData(localeEn, 'en');
@NgModule({
    imports: [
        CommonModule,
        WeightNoteRoutingModule,
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
        LotsModule
    ],
    declarations: [
        WeightNoteComponent,
        ReceivingNoteComponent,
        ReceivingComponent,
        DetailNoteComponent,
        ModalNewComponent,
        ModalConfirmComponent,
        ReceivingNoteListComponent,
        ReceivingNoteListProductionComponent,
        ModalNotesAssociatedComponent,
        DeleteWeightNoteComponent,
        EditWeightNoteComponent,
    ],
    providers: [
        DriversService,
        TrucksService,
        WeightService,
        CommodityService,
        {
            provide: LOCALE_ID,
            useValue: localStorage.getItem('lang'),
        },
        DatePipe,
        DecimalPipe,
    ]
})
export class WeightNoteModule {}
