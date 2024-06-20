import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { CONSTANTS } from '../utils/constants/constants';

@Component({
    selector: 'app-phone-code-dropdown',
    templateUrl: './phone-code-dropdown.component.html',
    styleUrls: ['./phone-code-dropdown.component.scss'],
})
export class PhoneCodeDropdownComponent {
    @HostBinding('class.input-group') isInputGroup = true;
    public phoneCodes: any = CONSTANTS.INTERNATIONAL_PHONES;
    @Output() countryChange: EventEmitter<string> = new EventEmitter();
    @Input() country: string;
    @Input() readOnly = false;
    readonly INTERNATIONAL_PHONES = CONSTANTS.INTERNATIONAL_PHONES;

    public onCountryChanged(country: string): void {
        this.country = country;
        this.countryChange.emit(country);
    }
}
