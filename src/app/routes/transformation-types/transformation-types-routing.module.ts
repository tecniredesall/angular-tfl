import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    TransformationTypeEditComponent
} from './components/transformation-type-edit/transformation-type-edit.component';
import { TransformationTypesComponent } from './transformation-types.component';

const routes: Routes = [
    { path: '', component: TransformationTypesComponent },
    { path: 'edit/:name', component: TransformationTypeEditComponent },
    { path: 'new', component: TransformationTypeEditComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TransformationTypesRoutingModule {}
