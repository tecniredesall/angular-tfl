import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';
import { CreateTastingComponent } from './create-tasting/create-tasting.component';

const routes: Routes = [
  { path: 'new-tasting/:lote/:lote_id', component: CreateTastingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TastingRoutingModule { }
