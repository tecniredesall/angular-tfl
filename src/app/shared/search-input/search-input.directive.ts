import {AfterViewInit, Directive, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';
import {SearchInputService} from './search-input.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[searchInput]'
})
export class SearchInputDirective implements AfterViewInit {

  public length:number;
  public focus:boolean;
  
  constructor(
    private ngModel: NgModel,
    private inputSvc: SearchInputService
  ) { 
    
    this.length = 0;

    this.focus = false;

  }

  ngAfterViewInit(): void {
    
    if (this.ngModel) {

      setTimeout(() => {
        
        this.inputSvc.textLength = this.ngModel.model.length;

        this.length = this.ngModel.model.length;

      }, 0);

    }

  }

  @HostListener('focus')
  onFocus() {
    this.focus = true;
  }

  @HostListener('blur')
  onBlur() {
    this.focus = false;
  }

  @HostListener('change', ['$event'])
  @HostListener('input', ['$event'])
  onInput(event: any) {
    
    setTimeout(() => {
      
      this.inputSvc.textLength = event.target.value.length;

      this.length = event.target.value.length;

    }, 0);

  }
}
