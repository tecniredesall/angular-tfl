import { ReceivingComponent } from './receiving/receiving.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightNoteComponent } from './weight-note.component';
import { AuthenticationGuard } from './../../shared/guards/authentication.guard';
import { DetailNoteComponent } from './detail-note/detail-note.component';
import { FeatureFlagsGuard } from 'src/app/shared/guards/feature-flags/feature-flags.guard';
import { ApplicationGuard } from 'src/app/shared/guards/application.guard';
import { availableApps } from 'src/app/shared/config/site-config';

const routes: Routes = [
  { path: '', component: WeightNoteComponent, canActivate: [AuthenticationGuard] },
  { path: 'receiving-ticket', component: ReceivingComponent, canActivate: [AuthenticationGuard] },
  { path: 'receiving-ticket/:receptionId', component: ReceivingComponent, canActivate: [AuthenticationGuard] },
  { path: 'receiving-ticket/:receptionId/:transactionInId', component: ReceivingComponent, canActivate: [AuthenticationGuard] },
  { path: 'detail-note/:id', component: DetailNoteComponent, canActivate: [AuthenticationGuard] },
  { 
    path: 'lots', 
    loadChildren: () =>
            import('../../routes/lots/lots.module').then(
                (m) => m.LotsModule
            ),
        canLoad: [ApplicationGuard],
        canActivate: [FeatureFlagsGuard], 
        data: { 
            requiredFeatureFlag: 'lots',
            featureFlagRedirect: '/weight-note',
            appOwner: [availableApps.Transformaciones] 
        }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WeightNoteRoutingModule { }
