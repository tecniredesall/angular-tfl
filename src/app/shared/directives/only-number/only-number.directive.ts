/* tslint:disable:no-string-literal */
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
  selector: '[onlyNumber]',
})

export class OnlyNumberDirective {
  @Input() allowDecimals = true;
  @Input() allowSign = true;
  @Input() decimalSeparator = '.';

  previousValue = '';

  // --------------------------------------
  //  Regular expressions
  integerUnsigned = '^[0-9]*$';
  integerSigned = '^-?[0-9]+$';
  decimalUnsigned = '^[0-9]+(.[0-9]+)?$';
  decimalSigned = '^-?[0-9]+(.[0-9]+)?$';

  /**
   * Class constructor
   */
  constructor(private hostElement: ElementRef) {
  }

  /**
   * Event handler for host's change event
   */
  @HostListener('change', ['$event']) onChange(e) {
    this.validateValue(this.hostElement.nativeElement.value);
  }

  /**
   * Event handler for host's paste event
   */
  @HostListener('paste', ['$event']) onPaste(e) {
    // get and validate data from clipboard
    const value = e.clipboardData.getData('text/plain');
    this.validateValue(value);
    e.preventDefault();
  }

  /**
   * Event handler for host's keydown event
   */
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const cursorPosition: number = e.target['selectionStart'];
    const originalValue = e.target['value'];
    const key = this.getName(e);
    const controlOrCommand = (e.ctrlKey === true || e.metaKey === true);
    const signExists = originalValue.includes('-');
    const separatorExists = originalValue.includes(this.decimalSeparator);

    // allowed keys apart from numeric characters
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab'
    ];

    // when decimals are allowed, add
    // decimal separator to allowed codes when
    // its position is not close to the the sign (-. and .-)
    const separatorIsCloseToSign = (signExists && cursorPosition <= 1);
    if (this.allowDecimals && !separatorIsCloseToSign && !separatorExists) {

      if (this.decimalSeparator === '.') {
        allowedKeys.push('.');
      } else {
        allowedKeys.push(',');
      }
    }

    // when minus sign is allowed, add its
    // key to allowed key only when the
    // cursor is in the first position, and
    // first character is different from
    // decimal separator
    const firstCharacterIsSeparator = (originalValue.charAt(0) !== this.decimalSeparator);
    if (this.allowSign && !signExists &&
      firstCharacterIsSeparator && cursorPosition === 0) {

      allowedKeys.push('-');
    }

    // allow some non-numeric characters
    if (allowedKeys.indexOf(key) !== -1 ||
      // Allow: Ctrl+A and Command+A
      (key === 'a' && controlOrCommand) ||
      // Allow: Ctrl+C and Command+C
      (key === 'c' && controlOrCommand) ||
      // Allow: Ctrl+V and Command+V
      (key === 'v' && controlOrCommand) ||
      // Allow: Ctrl+X and Command+X
      (key === 'x' && controlOrCommand)) {
      //  const it happen, don't do anything
      return;
    }

    // save value before keydown event
    this.previousValue = originalValue;

    // allow number characters only
    const isNumber = (new RegExp(this.integerUnsigned)).test(key);
    if (isNumber) { return; } else { e.preventDefault(); }
  }

  /**
   * Test whether value is a valid number or not
   */
  validateValue(value: string): void {
    // choose the appropiate regular expression
    let regex: string;
    if (!this.allowDecimals && !this.allowSign) { regex = this.integerUnsigned; }
    if (!this.allowDecimals && this.allowSign) { regex = this.integerSigned; }
    if (this.allowDecimals && !this.allowSign) { regex = this.decimalUnsigned; }
    if (this.allowDecimals && this.allowSign) { regex = this.decimalSigned; }

    // when a numbers begins with a decimal separator,
    // fix it adding a zero in the beginning
    const firstCharacter = value.charAt(0);
    if (firstCharacter === this.decimalSeparator) {
      value = 0 + value;
    }
    // when a numbers ends with a decimal separator,
    // fix it adding a zero in the end
    const lastCharacter = value.charAt(value.length - 1);
    if (lastCharacter === this.decimalSeparator) {
      value = value + 0;
    }
    // test number with regular expression, when
    // number is invalid, replace it with a zero
    const valid = (new RegExp(regex)).test(value);
    this.hostElement.nativeElement.value = valid ? value : '';
  }

  /**
   * Get key's name
   */
  getName(e): string {
    if (e.key) {
      return e.key;
    } else {
      // for old browsers
      if (e.keyCode && String.fromCharCode) {
        switch (e.keyCode) {
          case 8: return 'Backspace';
          case 9: return 'Tab';
          case 27: return 'Escape';
          case 37: return 'ArrowLeft';
          case 39: return 'ArrowRight';
          case 188: return ',';
          case 190: return '.';
          case 109: return '-'; // minus in numbpad
          case 173: return '-'; // minus in alphabet keyboard in firefox
          case 189: return '-'; // minus in alphabet keyboard in chrome
          default: return String.fromCharCode(e.keyCode);
        }
      }
    }
  }
}
