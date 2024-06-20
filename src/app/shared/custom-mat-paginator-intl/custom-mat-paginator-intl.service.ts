import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { I18nService } from '../i18n/i18n.service';
import { I18nPipe } from '../i18n/i18n.pipe';

@Injectable()
export class CustomMatPaginatorIntlService extends MatPaginatorIntl {

  constructor(private _i18nService: I18nService, private _i18n: I18nPipe) {

    super();

    this._i18nService.lang.subscribe(
      (result: any) => {
        this.translateLabels();
      }
    );

    this.translateLabels();

  }

  /**
   * Translate mat paginator labels
   */
  public translateLabels(): void {

    this.firstPageLabel = this._i18n.transform('first-page-label');
    this.itemsPerPageLabel = this._i18n.transform('items-per-page-label');
    this.lastPageLabel = this._i18n.transform('last-page-label');
    this.nextPageLabel = this._i18n.transform('next-page-label');
    this.previousPageLabel = this._i18n.transform('previous-page-label');

    this.changes.next();

  }

  /**
   * Get mat paginator range label
   */
  getRangeLabel = (page: number, pageSize: number, length: number) => {

    if (length == 0 || pageSize == 0) {
      return `0 / ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} / ${length}`;

  }

}