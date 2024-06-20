/* tslint:disable:no-unused-variable */

import { TooltipDirective } from './tooltip.directive';
import {ElementRef, Renderer2} from '@angular/core';

describe('Directive: Tooltip', () => {
  it('should create an instance', () => {
    const el: ElementRef = null;
    const renderer: Renderer2 = null;
    const directive = new TooltipDirective(el, renderer);
    expect(directive).toBeTruthy();
  });
});
