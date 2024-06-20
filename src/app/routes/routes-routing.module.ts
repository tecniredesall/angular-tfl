import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { availableApps } from '../shared/config/site-config';
import { ApplicationGuard } from '../shared/guards/application.guard';
import { FeatureFlagsGuard } from '../shared/guards/feature-flags/feature-flags.guard';
import { ForbiddenComponent } from '../shared/miscellaneous/forbidden/forbidden.component';
import { NotFoundComponent } from '../shared/miscellaneous/notfound/notfound.component';
import { RoutesComponent } from './routes.component';

const routes: Routes = [
    {
        path: '',
        component: RoutesComponent,
        children: [
            {
                path: '',
                redirectTo: 'weight-note',
                pathMatch: 'full',
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./users/user.module').then((m) => m.UserModule),
                canLoad: [ApplicationGuard],
                canActivate: [FeatureFlagsGuard],
                data: {
                    requiredFeatureFlag: 'users',
                    featureFlagRedirect: '/weight-note',
                    appOwner: [availableApps.Transformaciones],
                },
            },
            {
                path: 'tasting',
                loadChildren: () =>
                    import('./tasting/tasting.module').then((m) => m.TastingModule)
            },
            {
                path: 'trucks',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./trucks/trucks.module').then(
                        (m) => m.TrucksModule
                    ),
            },
            {
                path: 'unit-measures',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./unit-measures/unit-measures.module').then(
                        (m) => m.UnitMeasuresModule
                    ),
            },
            {
                path: 'workflow',
                loadChildren: () =>
                    import('./workflow/workflow.module').then(
                        (m) => m.WorkflowModule
                    ),
                canLoad: [ApplicationGuard],
                canActivate: [FeatureFlagsGuard],
                data: {
                    requiredFeatureFlag: 'workflow',
                    featureFlagRedirect: '/weight-note',
                    appOwner: [availableApps.Transformaciones],
                },
            },
            {
                path: 'warehouse',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./warehouse/warehouse.module').then(
                        (m) => m.WarehouseModule
                    ),
            },
            {
                path: 'commodity',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./commodity/commodity.module').then(
                        (m) => m.CommodityModule
                    ),
            },
            {
                path: 'transformation-types',
                loadChildren: () =>
                    import(
                        './transformation-types/transformation-types.module'
                    ).then((m) => m.TransformationTypesModule),
            },
            {
                path: 'weight-note',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./weight-note/weight-note.module').then(
                        (m) => m.WeightNoteModule
                    ),
            },
            {
                path: 'drivers',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./drivers/drivers.module').then(
                        (m) => m.DriversModule
                    ),
            },
            {
                path: 'seals',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./seals/seals.module').then((m) => m.SealsModule),
            },
            {
                path: 'producers',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./producers/producers.module').then(
                        (m) => m.ProducersModule
                    ),
            },
            {
                path: 'kanban',
                loadChildren: () =>
                    import('./kanban/kanban.module').then(
                        (m) => m.KanbanModule
                    ),
                canLoad: [ApplicationGuard],
                canActivate: [FeatureFlagsGuard],
                data: {
                    requiredFeatureFlag: 'kanban',
                    featureFlagRedirect: '/weight-note',
                    appOwner: [availableApps.Transformaciones],
                },
            },
            {
                path: 'iot-devices',
                loadChildren: () =>
                    import('./iot-devices/iot-devices.module').then(
                        (m) => m.IotDevicesModule
                    ),
                canLoad: [ApplicationGuard],
                data: {
                    appOwner: [availableApps.Transformaciones],
                },
            },
            {
                path: 'purchase-orders',
                loadChildren: () =>
                    import('./purchase-orders/purchase-orders.module').then(
                        (m) => m.PurchaseOrdersModule
                    ),
                canLoad: [ApplicationGuard],
                data: {
                    requiredFeatureFlag: 'purchase-order',
                    featureFlagRedirect: '/weight-note',
                    appOwner: [availableApps.Transformaciones],
                },
            },
            {
                path: 'shipping-ticket',
                loadChildren: () =>
                    import('./shipping-ticket/shipping-ticket.module').then(
                        (m) => m.ShippingTicketModule
                    ),
                canLoad: [ApplicationGuard],
                data: {
                    requiredFeatureFlag: 'shipping-ticket',
                    featureFlagRedirect: '/weight-note',
                    appOwner: [availableApps.Transformaciones],
                },
            },
            {
                path: 'buyers',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./buyers/buyers.module').then(
                        (m) => m.BuyersModule
                    ),
            },
            {
                path: 'warehouse-transfer',
                data: { appOwner: [availableApps.Transformaciones] },
                canLoad: [ApplicationGuard],
                loadChildren: () =>
                    import('./warehouse-transfer/warehouse-transfer.module').then(
                        (m) => m.WarehouseTransferModule
                    ),
            },
            {
                path: 'retention-orders',
                loadChildren: () =>
                    import('./retention-orders/retention-orders.module').then(
                        (m) => m.RetentionOrdersModule
                    ),
                canLoad: [ApplicationGuard],
                data: {
                    requiredFeatureFlag: 'retention-orders',
                    featureFlagRedirect: '/weight-note',
                    appOwner: [availableApps.Transformaciones],
                },
            },
            {
                path: 'forbidden',
                component: ForbiddenComponent,
            },
            {
                path: 'notfound',
                component: NotFoundComponent,
            },
            { path: '**', redirectTo: 'notfound' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutesRoutingModule { }
