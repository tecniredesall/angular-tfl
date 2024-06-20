import { NotifierModule } from 'angular-notifier';
import { PerfectScrollModule } from 'src/app/shared/utils/perfect-scroll/perfect-scroll.module';

import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/04/30
 * Description: App module, main module
 * Updated:
 * Comments:
 * Version: 2019.04.30.4000
 * Owner: Grain Chain
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmDialogComponent } from './routes/seals/confirm-dialog/confirm-dialog.component';
import { SharedModule } from './shared/shared.module';
import { SentryService } from './shared/utils/sentry/sentry.service';
import { MAT_MENU_DEFAULT_OPTIONS } from '@angular/material/menu';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        PerfectScrollModule,
        NotifierModule.withConfig({
            position: {
                horizontal: {
                    position: 'middle',
                },
                vertical: {
                    position: 'bottom',
                    distance: 100,
                },
            },
            behaviour: {
                autoHide: 4000,
            },
            theme: 'material',
        }),
    ],
    providers: [
        { provide: ErrorHandler, useClass: SentryService },
        { provide: MAT_MENU_DEFAULT_OPTIONS, useValue: { xPosition: "before" } }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
