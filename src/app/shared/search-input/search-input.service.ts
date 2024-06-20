import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchInputService {

  public textLength:number;

  constructor() { 
    this.textLength = 0;
  }

}
