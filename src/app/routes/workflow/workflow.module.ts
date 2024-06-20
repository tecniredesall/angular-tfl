import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { WorkflowComponent } from './workflow.component';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { CreateModelComponent } from './production-flows/components/create-model/create-model.component';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LoteComponent } from './lote/lote.component';
import { CreateWorkflowComponent } from './production-flows/components/create-workflow/create-workflow.component';
import { ProcessFormComponent } from './production-flows/components/process-form/process-form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PerfectScrollModule } from '../../shared/utils/perfect-scroll/perfect-scroll.module';
import { WorkflowConfirmDialogComponent } from './confirm-dialog/workflow-confirm-dialog.component';
import { SearchPipe } from './search.pipe';
import { DxDiagramModule } from 'devextreme-angular/ui/diagram';
import { BlockUIModule } from 'ng-block-ui';
import localePy from '@angular/common/locales/es-PY';
import localeEn from '@angular/common/locales/en';
import { ProductionFlowsComponent } from './production-flows/production-flows.component';
import { ProcessesComponent } from './processes/processes.component';
import { CreateProcessComponent } from './processes/components/create-process/create-process.component';
registerLocaleData(localePy, 'es');
registerLocaleData(localeEn, 'en');
@NgModule({
    declarations: [
        SearchPipe,
        LoteComponent,
        WorkflowComponent,
        ProcessesComponent,
        CreateModelComponent,
        ProcessFormComponent,
        CreateProcessComponent,
        CreateWorkflowComponent,
        WorkflowConfirmDialogComponent,
        ProductionFlowsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DxDiagramModule,
        HttpClientModule,
        PerfectScrollModule,
        WorkflowRoutingModule,
        BlockUIModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
    ],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: localStorage.getItem('lang'),
        },
        DatePipe,
    ]
})
export class WorkflowModule { }
