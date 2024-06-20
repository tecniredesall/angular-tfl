import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private selectedTheme = new BehaviorSubject(null);
  theme = this.selectedTheme.asObservable();
  constructor() {
    const theme = localStorage.getItem('theme');
    this.setTheme(theme);
  }

  setTheme(theme) {
    this.selectedTheme.next(theme);
  }
}
