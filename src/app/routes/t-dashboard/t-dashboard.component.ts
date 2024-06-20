import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-t-dashboard',
  templateUrl: './t-dashboard.component.html',
  styleUrls: ['./t-dashboard.component.css']
})
export class TDashboardComponent implements OnInit {

  public hasAnalitycs = false;
  // tslint:disable: variable-name
  constructor() { }
  /**
   * init component
   */
  ngOnInit() {
  }

  public getImageTheme(): string {
    const theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : '';
    return theme !== '' ? 'dashboard_dark.png' : 'dashboard.png';
  }

}
