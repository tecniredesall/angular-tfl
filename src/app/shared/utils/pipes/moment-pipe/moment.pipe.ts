import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18nService } from 'src/app/shared/i18n/i18n.service';

@Pipe({
  name: 'momentPipe',
  pure: false
})
export class MomentPipe implements PipeTransform, OnDestroy {

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

  transform(value: moment.Moment, dateFormat: string): string {
    return moment(value).locale(this.language).format(dateFormat);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
