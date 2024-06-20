import {Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[menuDirective]'
})
export class MenuDirective {

    @Output() clicked = new EventEmitter();
    constructor() {}

    @HostListener('click', ['$event'])
    onClick($event) {
        this.clicked.emit($event);
    }
}
