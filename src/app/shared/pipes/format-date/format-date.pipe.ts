import { formatDate } from '@angular/common';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18nService } from '../../i18n/i18n.service';

@Pipe({
  name: 'formatDate',
  pure: false
})
export class FormatDatePipe implements PipeTransform, OnDestroy {

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

  transform(value: string | number | Date, format: string, capitalizeFirtsLetter: boolean = false): string {
    let result: string = formatDate(value, format, this.language);
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
