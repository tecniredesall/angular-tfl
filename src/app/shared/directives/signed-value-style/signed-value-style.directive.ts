import { DecimalPipe } from '@angular/common';
import {
    AfterViewChecked,
    AfterViewInit, ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, OnChanges, OnInit,
    SimpleChanges
} from '@angular/core';

import { CONSTANTS } from '../../utils/constants/constants';
import { convertStringToNumber } from '../../utils/functions/string-to-number';

/**
 * Adds correspondant styles and format to a value
 * @valueType optional constant string value to determine if value is discount or excedent, can also be + or -
 * @value the element value we want to process
 * @format optional string value to set a custom string format
 */
@Directive({
    selector: '[appSignedValue]',
})
export class SignedValueDirective implements OnInit, AfterViewInit, OnChanges ,AfterViewChecked {
    @HostBinding('class.sil-form__section__discount-label') isDiscount = false;
    @HostBinding('class.sil-form__section__excedent-label') isExcedent = false;

    @Input() valueType: string;
    @Input() value: any;
    @Input() format: string;
    @Input() measurementUnit:string;

    readonly DECIMAL_DIGITS: number = JSON.parse(
        localStorage.getItem('decimals')
    ).general;

    constructor(
        private elementRef: ElementRef,
        private changeDetector: ChangeDetectorRef,
        private numberPipe: DecimalPipe
    ) { }


    public ngOnChanges(changes: SimpleChanges): void {
        // if (changes.value && !changes.value?.isFirstChange()) {
        //     this.setElemenSign();
        // }
         if (!changes.value?.isFirstChange() || !changes.measurementUnit?.isFirstChange()) {
             this.setElemenSign();
         }
    }


    public ngOnInit() {  }

    public ngAfterViewInit() {
        this.setElemenSign();
    }


    ngAfterViewChecked(): void {

    }

    private setElemenSign() {
        let value = this.formatValue(String(this.value));
        const sign = this.valueSign(this.valueType);

        value = sign ? `${sign} ${value}` : (value.includes('-') ? value.replace('-','- ') : value);
        if (value.includes('-')) {
            this.isDiscount = true;
            this.isExcedent = false;
        } else if (value.includes('+')) {
            this.isDiscount = false;
            this.isExcedent = true;
        } else {
            let isPositive: boolean = convertStringToNumber(this.value) >= 0;
            this.isExcedent = isPositive;
            this.isDiscount = !isPositive;
        }
        this.elementRef.nativeElement.innerText = `${value} ${this.measurementUnit ?? ''}`;

        this.changeDetector.detectChanges();
    }

    private valueSign(valueType: string) {
        if (!valueType) {
            return null;
        } else if (
            valueType === CONSTANTS.SIGNED_VALUE_TYPES.EXCEDENT ||
            valueType === '+'
        ) {
            return '+';
        } else if (
            valueType === CONSTANTS.SIGNED_VALUE_TYPES.DISCCOUNT ||
            valueType === '-'
        ) {
            return '-';
        }
    }

    private formatValue(value: string) {
        return this.numberPipe.transform(
            value,
            this.format ?? `1.${this.DECIMAL_DIGITS}-${this.DECIMAL_DIGITS}`,
            'en'
        );
    }
}
