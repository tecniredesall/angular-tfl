import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from './shared/guards/loggedIn.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'routes',
        pathMatch: 'full',
    },
    {
        path: 'login',
        canActivate: [LoggedInGuard],
        loadChildren: () =>
            import('./login/login.module').then((m) => m.LoginModule),
    },
    {
        path: 'routes',
        loadChildren: () =>
            import('./routes/routes.module').then((m) => m.RoutesModule),
    },
    { path: '**', redirectTo: 'routes' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
