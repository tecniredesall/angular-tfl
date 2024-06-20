import { Component, Input, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { take } from 'rxjs/operators';
import { I18nPipe } from '../../i18n/i18n.pipe';
import { FederatedService } from '../../services/federated-sync/federated.service';
import { AlertService } from '../../utils/alerts/alert.service';
import { CONSTANTS } from '../../utils/constants/constants';
import { ResponseErrorHandlerService } from '../../utils/response-error-handler/response-error-handler.service';

@Component({
  selector: 'app-update-worker-data',
  templateUrl: './update-worker-data.component.html',
  styleUrls: ['./update-worker-data.component.scss']
})
export class UpdateWorkerSyncDataComponent implements OnInit {
  @Input() isSyncStarted: boolean = false;
  @Input() action: string = CONSTANTS.WORKER_SYNC_ACTIONS.FEDERATION_DATA;

  constructor(private _i18nPipe: I18nPipe,
    private _responseErrorHandlerService: ResponseErrorHandlerService,
    private _federatedService: FederatedService,
    private _notifier: NotifierService,
    private _alert: AlertService) { }

  ngOnInit() {
  }
  public onUpdateFederatedData(event) {
    event.stopPropagation();
    this.isSyncStarted = true;
    this._federatedService.updateFedeatedData(this.action)
      .pipe(take(1))
      .subscribe(
        (result) => {
          this._notifier.notify('success',
            this._i18nPipe.transform('updated-data-sent-success'))
        },
        (error) => {
          this.isSyncStarted = false;
          const message: string = this._responseErrorHandlerService.handleError(
            error,
            'worker-sync'
          );
          this._alert.error(message);
        }
      );
  }
}

