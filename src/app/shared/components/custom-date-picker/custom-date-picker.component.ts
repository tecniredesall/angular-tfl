import { Subscription } from 'rxjs';
import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { I18nService } from '../../i18n/i18n.service';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
    selector: 'app-custom-date-picker',
    templateUrl: './custom-date-picker.component.html',
    styleUrls: ['./custom-date-picker.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MAT_MOMENT_DATE_FORMATS
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomDatePickerComponent),
            multi: true,
        },
    ],
})
export class CustomDatePickerComponent
    implements OnDestroy, ControlValueAccessor {
    @Input() dateFormat: string = 'dddd, LL';
    @Input() placeholder: string = 'select-date';
    @Input() minDate: moment.Moment = null;
    @Input() maxDate: moment.Moment = null;
    @Input() hasInputClass: boolean = true;

    public date: moment.Moment = null;
    public isDisabled: boolean = false;
    private _subscription: Subscription = new Subscription();
    private onChange = (value: any) => { };
    private onTouch = () => { };

    constructor(
        private _i18nService: I18nService,
        private _dateAdapter: DateAdapter<any>,
        private controlContainer: ControlContainer
    ) {
        this._subscription.add(
            this._i18nService.lang.subscribe((result: any) => {
                this._dateAdapter.setLocale(result ? result : 'es');
            })
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public onChangeDatepicker(event: MatDatepickerInputEvent<any>): void {
        this.date = event.value;
        this.markAsDirtyControl();
        if (!this.isDisabled) {
            this.onTouch();
        }
        this.onChange(this.date);
    }

    public writeValue(value: any): void {
        this.date = value ?? null;
    }

    private markAsDirtyControl(): void {
        if (this.date && this.controlContainer?.control) {
            this.controlContainer.control.markAsDirty();
        }
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }
}
