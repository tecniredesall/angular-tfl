import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    UnitMeasureEditComponent
} from './components/unit-measure-edit/unit-measure-edit.component';
import { UnitMeasuresComponent } from './unit-measures.component';

const routes: Routes = [
    {
        path: '',
        component: UnitMeasuresComponent,
    },
    {
        path: 'edit/:name',
        component: UnitMeasureEditComponent,
    },
    {
        path: 'new',
        component: UnitMeasureEditComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UnitMeasuresRoutingModule {}
