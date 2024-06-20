import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appOnlyUppercase]',
})
export class OnlyUppercaseDirective {
    @HostListener('input', ['$event']) onKeyPress(event) {
        this.elRef.nativeElement.value = event.target.value.toUpperCase();
    }
    constructor(private elRef: ElementRef) {}
}
