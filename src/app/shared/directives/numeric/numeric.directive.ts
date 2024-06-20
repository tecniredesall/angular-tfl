/*
* Programer : Luis Gomez Guerrero
* Creation Date : 2019-05-10
* Modifications:
* Update Date:
* Version: 2019.05.10.1051
* Code created by GrainChain
*/
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable: directive-selector
  selector: '[numeric]',
})

export class NumericDirective {
  private numericType: string; // number | decimal
  @Input()
  public get decimals(): number {
    return parseInt(this.numericType, 0);
  }
  /**
   * set decimal property
   */
  public set decimals(value: number) {
    const decimals = value.toString();
    switch (decimals) {
      case '1':
        this.numericType = 'onedecimal';
        break;
      case '2':
        this.numericType = 'twoDecimal';
        break;
      case '3':
        this.numericType = 'threeDecimal';
        break;
      case '4':
        this.numericType = 'fourDecimal';
        break;
      default:
        this.numericType = 'integer';
        break;
    }
  }
  // regex properties
  private regex = {
    integer: new RegExp(/^\d+$/),
    onedecimal: new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g),
    twoDecimal: new RegExp(/^\d*\.?\d{0,2}$/g),
    threeDecimal: new RegExp(/^\d*\.?\d{0,3}$/g),
    fourDecimal: new RegExp(/^\d*\.?\d{0,3}$/g),
    negativeDecimal: new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g),

  };
  // special keys ignores
  private specialKeys = {
    integer: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    onedecimal: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    twoDecimal: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    threeDecimal: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    fourDecimal: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    negativeDecimal: ['Backspace', 'Tab', 'End', 'Home'],
  };

  constructor(private el: ElementRef) {
  }
  /**
   * Key event
   * @param event event in key
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys[this.numericType].indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex[this.numericType])) {
      event.preventDefault();
    }
  }
}
