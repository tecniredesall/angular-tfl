import { UpdateWorkerSyncDataComponent } from './components/update-worker-data/update-worker-data.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';

import {
    NgxMatDatetimePickerModule, NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/04/30
 * Description: shared module,
 * Updated:
 * Comments:
 * Version: 2019.04.30.4000
 * Owner: Grain Chain
 */
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from '../material.module';
import { ConfirmDialogComponent } from '../routes/seals/confirm-dialog/confirm-dialog.component';
import { ActionFooterComponent } from './action-footer/action-footer.component';
import { BlockModalUiComponent } from './block/block-modal.component';
import { BlockUiComponent } from './block/block.component';
import { BlockService } from './block/block.service';
import { AddressComponent } from './components/address/address.component';
import {
    CustomDatePickerComponent
} from './components/custom-date-picker/custom-date-picker.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { FiltersComponent } from './components/filter/filter.component';
import { CsvActionsDropdownComponent } from './csv-actions-dropdown/csv-actions-dropdown.component';
import {
    CustomMatPaginatorIntlService
} from './custom-mat-paginator-intl/custom-mat-paginator-intl.service';
import { FeatureFlagsDirective } from './directives/feature-flags/feature-flags.directive';
import { NoSpecialCharsDirective } from './directives/no-special-chars/no-special-chars.directive';
import { OnlyUppercaseDirective } from './directives/only-uppercase/only-uppercase.directive';
import { PermissionDirective } from './directives/permission/permission.directive';
import {
    ScrollPaginationDirective
} from './directives/scroll-pagination/scroll-pagination.directive';
import { SignedValueDirective } from './directives/signed-value-style/signed-value-style.directive';
import {
    SubscriptionManagerDirective
} from './directives/subscription-manager/subscription-manager.directive';
import { TooltipModule } from './directives/tooltip/tooltip.module';
import { I18nPipe } from './i18n/i18n.pipe';
import { I18nService } from './i18n/i18n.service';
import { CompanyInfoComponent } from './layout/company-info/company-info.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenuComponent } from './layout/menu/menu.component';
import { MenuDirective } from './layout/menu/menu.directive';
import { LayoutService } from './layout/services/layout.service';
import { MainHeaderComponent } from './main-header/main-header.component';
import { NotResultsFoundComponent } from './not-results-found/not-results-found.component';
import { NotifierComponent } from './notifier/notifier.component';
import { PhoneCodeDropdownComponent } from './phone-code-dropdown/phone-code-dropdown.component';
import { DateStringFormatPipe } from './pipes/date-string-format/date-string-format.pipe';
import { FormatDatePipe } from './pipes/format-date/format-date.pipe';
import { FormatMomentPipe } from './pipes/format-moment/format-moment.pipe';
import { SearchByPropertyPipe } from './pipes/search-by-property/search-by-property.pipe';
import { SearchInputComponent } from './search-input/search-input.component';
import { SearchInputDirective } from './search-input/search-input.directive';
import {
    TableActionButtonGroupComponent
} from './table-action-button-group/table-action-button-group.component';
import { HttpInterceptorService } from './utils/http-interceptor.service';
import { NotificationsComponent } from './utils/notifications/notifications.component';
import { NotificationsModule } from './utils/notifications/notifications.module';
import { PerfectScrollModule } from './utils/perfect-scroll/perfect-scroll.module';
import { EllipsisPipe } from './utils/pipes/ellipsis.pipe';
import { FilterObjectArrayPipe } from './utils/pipes/filter-object-array.pipe';
import { LowercasePipe } from './utils/pipes/lowercase.pipe';
import { MapFromArrayPipe } from './utils/pipes/map-from-array/map-from-array.pipe';
import { SafeContentPipe } from './utils/pipes/safe-content.pipe';
import { StringReplacePipe } from './utils/pipes/string-replace.pipe';
import { StringToNumberPipe } from './utils/pipes/string-to-number.pipe';
import { UppercasePipe } from './utils/pipes/uppercase.pipe';
import { WindowEventsService } from './window-events/window-events.service';
import { SelectResultsDialogComponent } from './components/custom-select/components/select-results-dialog/select-results-dialog.component';
import { WeighingTableComponent } from './components/weighing-table/weighing-table.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { CompanyDialogComponent } from './components/company-dialog/company-dialog.component';

import { PenaltiesTableComponent } from './components/penalties-table/penalties-table/penalties-table.component';
import { TagsComponent } from './components/tags/tags.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NotificationsModule,
        ReactiveFormsModule,
        MaterialModule,
        TooltipModule,
        TextMaskModule,
        NgSelectModule,
        AngularResizedEventModule,
        ScrollingModule,
        BlockUIModule.forRoot(),
        PerfectScrollModule,
        NgxMatMomentModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        NgIdleKeepaliveModule.forRoot()
    ],
    declarations: [
        I18nPipe,
        ConfirmDialogComponent,
        MenuComponent,
        HeaderComponent,
        CompanyInfoComponent,
        BlockUiComponent,
        SearchInputComponent,
        SearchInputDirective,
        MenuDirective,
        BlockModalUiComponent,
        UppercasePipe,
        LowercasePipe,
        MainHeaderComponent,
        NotifierComponent,
        NotResultsFoundComponent,
        FormatDatePipe,
        CustomDatePickerComponent,
        StringToNumberPipe,
        CustomSelectComponent,
        ActionFooterComponent,
        TableActionButtonGroupComponent,
        StringReplacePipe,
        SearchByPropertyPipe,
        CsvActionsDropdownComponent,
        PhoneCodeDropdownComponent,
        FeatureFlagsDirective,
        NoSpecialCharsDirective,
        OnlyUppercaseDirective,
        PermissionDirective,
        SignedValueDirective,
        MapFromArrayPipe,
        SafeContentPipe,
        FilterObjectArrayPipe,
        FiltersComponent,
        FormatMomentPipe,
        DateStringFormatPipe,
        ScrollPaginationDirective,
        EllipsisPipe,
        SubscriptionManagerDirective,
        AddressComponent,
        SelectResultsDialogComponent,
        WeighingTableComponent,
        UpdateWorkerSyncDataComponent,
        ConfirmationDialogComponent,
        CompanyDialogComponent,
        PenaltiesTableComponent,
        TagsComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true,
        },
        BlockService,
    ],
    exports: [
        I18nPipe,
        MenuComponent,
        HeaderComponent,
        NotificationsComponent,
        CompanyInfoComponent,
        SearchInputComponent,
        SearchInputDirective,
        MenuDirective,
        UppercasePipe,
        LowercasePipe,
        MainHeaderComponent,
        NotifierComponent,
        NotResultsFoundComponent,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormatDatePipe,
        CustomDatePickerComponent,
        StringToNumberPipe,
        CustomSelectComponent,
        ScrollingModule,
        ActionFooterComponent,
        TableActionButtonGroupComponent,
        StringReplacePipe,
        SearchByPropertyPipe,
        CsvActionsDropdownComponent,
        PhoneCodeDropdownComponent,
        FeatureFlagsDirective,
        NoSpecialCharsDirective,
        OnlyUppercaseDirective,
        PermissionDirective,
        SignedValueDirective,
        MapFromArrayPipe,
        SafeContentPipe,
        FilterObjectArrayPipe,
        FormatMomentPipe,
        DateStringFormatPipe,
        MaterialModule,
        BlockUIModule,
        NotificationsModule,
        ScrollPaginationDirective,
        EllipsisPipe,
        SubscriptionManagerDirective,
        AddressComponent,
        TextMaskModule,
        WeighingTableComponent,
        UpdateWorkerSyncDataComponent,
        TextMaskModule,
        CompanyDialogComponent,
        AngularResizedEventModule,
        PenaltiesTableComponent,
        TagsComponent
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                I18nService,
                I18nPipe,
                LayoutService,
                WindowEventsService,
                CustomMatPaginatorIntlService,
                {
                    provide: MatPaginatorIntl,
                    useClass: CustomMatPaginatorIntlService,
                },
                FormatDatePipe,
                StringToNumberPipe,
                StringReplacePipe,
                SafeContentPipe,
                FilterObjectArrayPipe,
                FormatMomentPipe,
                DateStringFormatPipe,
                SearchByPropertyPipe,
            ],
        };
    }
}
