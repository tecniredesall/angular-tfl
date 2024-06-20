import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProducerEditComponent } from './components/producer-edit/producer-edit.component';
import { ProducerNewComponent } from './components/producer-new/producer-new.component';
import { ProducersComponent } from './producers.component';

const routes: Routes = [
    { path: '', component: ProducersComponent },
    {
        path: 'edit/:id',
        component: ProducerEditComponent,
    },
    {
        path: 'profile/:id',
        component: ProducerEditComponent,
    },
    {
        path: 'new',
        component: ProducerNewComponent,
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
export class ProducersRoutingModule {}
