import { LotMergeComponent } from './components/lot-merge/lot-merge.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from '../../shared/guards/authentication.guard';
import { LotCreateComponent } from './components/lot-create/lot-create.component';
import { LotDetailComponent } from './components/lot-detail/lot-detail.component';

const routes: Routes = [
    { path: '',
    redirectTo: '/weight-note?tab=lots',
    pathMatch: 'full' },
    {
        path: 'create',
        component: LotCreateComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'lot/:id',
        component: LotDetailComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'merge-lot/:id',
        component: LotMergeComponent,
        canActivate: [AuthenticationGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LotsRoutingModule {}
