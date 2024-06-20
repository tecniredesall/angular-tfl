import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appNoSpecialChars]',
})
export class NoSpecialCharsDirective {
    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return (
            (event.charCode > 96 && event.charCode < 123) ||
            (event.charCode > 64 && event.charCode < 91) ||
            (event.charCode >= 48 && event.charCode <= 57) ||
            event.charCode <= 31
        );
    }
    constructor() {}
}
