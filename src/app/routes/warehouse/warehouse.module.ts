import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseComponent } from './warehouse/warehouse.component';
import {SharedModule} from '../../shared/shared.module';
import {WarehouseRoutingModule} from './warehouse-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from '../../material.module';
import { WarehouseInputComponent } from './warehouse-input/warehouse-input.component';
import { SubTankCardComponent } from './sub-tank-card/sub-tank-card.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import { SearchPipe } from './search.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
    declarations: [
        WarehouseComponent,
        ConfirmDialogComponent,
        CreateWarehouseComponent,
        WarehouseInputComponent, SubTankCardComponent, SearchPipe
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        WarehouseRoutingModule,
        NgSelectModule,
        BlockUIModule.forRoot()
    ]
})
export class WarehouseModule { }
