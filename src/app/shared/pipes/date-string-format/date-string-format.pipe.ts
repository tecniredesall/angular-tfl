import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18nService } from 'src/app/shared/i18n/i18n.service';

@Pipe({
  name: 'dateStringFormat',
  pure: false
})
export class DateStringFormatPipe implements PipeTransform, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private language: string;

  constructor(private _i18nService: I18nService) {
    this._i18nService.lang
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((result: any) => {
        this.language = 'es' == result ? 'es' : 'en';
      });
  }

  transform(value: string, inputDateFormat: string, outputDateFormat: string, capitalizeFirtsLetter: boolean = false): string {
    let result: string = moment(value, inputDateFormat).locale(this.language).format(outputDateFormat);
    if (capitalizeFirtsLetter && result?.length > 0) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
