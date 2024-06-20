import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  date = new Date();
  year = this.date.getUTCFullYear();
  month = this.date.getUTCMonth();
  day = this.date.getUTCDay();
  hour = this.date.getUTCHours();
  min = this.date.getUTCMinutes();
  sec = this.date.getUTCSeconds();

  getUTCDate() {
    return new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.min, this.sec) );
  }

}
