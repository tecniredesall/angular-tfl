import { Component, Input, OnChanges } from '@angular/core';
import { take } from 'rxjs/operators';
import { LotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { LotsService } from 'src/app/routes/lots/services/lots.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { IPaginator } from 'src/app/shared/models/paginator.model';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ILotHistoryModel } from '../../../../models/lot-history.model';

@Component({
  selector: 'app-lot-history',
  templateUrl: './lot-history.component.html',
  styleUrls: ['./lot-history.component.scss']
})
export class LotHistoryComponent implements OnChanges {

  @Input() lot: LotListWeightNoteGrouper;
  public history: ILotHistoryModel[] = [];
  public pagination: IPaginator;
  public isLoadingHistory = false;
  public TYPES = CONSTANTS.LOT_HISTORY_TYPES;

  constructor(
    private _i18nPipe: I18nPipe,
    private _lotService: LotsService,
    private _alertService: AlertService,
    private _handlerError: ResponseErrorHandlerService,
  ) { }

  ngOnChanges() {
    this.history = [];
    this.getHistory(null, this.getParamsRequest());
  }

  public getHistory(uri: string = null, params: any = {}) {
    this.isLoadingHistory = true;
    this._lotService.getLotsHistory(uri, params)
      .pipe(take(1))
      .subscribe(
        (response: {items: ILotHistoryModel[], paginator: IPaginator}) => {
          this.history = this.history.concat(response.items);
          this.pagination = response.paginator;
          this.isLoadingHistory = false;
        },
        error => {
          let message = this._handlerError.handleError(error, 'lots');
          this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
          this.isLoadingHistory = false;
        }
      );
  }

  public onScroll(event: Event) {
    if(this.pagination.totalItems > this.pagination.itemsPerPage){
      const nativeElement = event.target as HTMLElement;
      const scrollHeight = nativeElement.scrollHeight;
      const scrollY = nativeElement.scrollTop + nativeElement.offsetHeight;
      if (scrollY >= scrollHeight && !this.isLoadingHistory) {
        if(this.pagination.nextPageUrl) {
          this.isLoadingHistory = true;
          this.getHistory(this.pagination.nextPageUrl, this.getParamsRequest());
        }
      }
    }
  }

  private getParamsRequest(): any {
    let params: any = {};
    params.lot_id = this.lot.id;
    return params;
  }

}
