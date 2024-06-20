import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

@Injectable()
export class CustomDateAdapterService extends MomentDateAdapter implements OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private language: string = 'en';

  constructor(
    @Inject('component') private component: string,
    private _i18nService: I18nService,
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string
  ) {
    super(dateLocale);
    this._i18nService.lang
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((result: any) => {
        this.language = 'es' == result ? 'es' : 'en';
      });
  }

  public parse(value: any, parseFormat: string | string[]): Moment | null {
    if (!value) {
      return null
    }
    return moment(value, CONSTANTS.DATE_FORMATS[this.component].LOCALE[this.language]);
  }

  public format(date: Moment, displayFormat: string): string {
    let format: string = '';
    if (
      CONSTANTS.DATE_FORMATS[this.component].ADAPTER.display.dateInput == displayFormat ||
      CONSTANTS.DATE_FORMATS[this.component].ADAPTER.parse.dateInput == displayFormat
    ) {
      format = CONSTANTS.DATE_FORMATS[this.component].LOCALE[this.language];
    }
    else {
      format = displayFormat;
    }
    return date.locale(this.language).format(format);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}