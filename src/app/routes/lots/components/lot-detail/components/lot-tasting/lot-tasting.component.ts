import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { LotsService } from 'src/app/routes/lots/services/lots.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { FileDownloadService } from 'src/app/shared/services/file-download/file-download.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import * as FileSaver from 'file-saver';
import * as printJS from 'print-js';

@Component({
  selector: 'silosys-lot-tasting',
  templateUrl: './lot-tasting.component.html',
  styleUrls: ['./lot-tasting.component.scss']
})


export class LotTastingComponent implements OnInit {

  @Input() lot: any;
  @Input() disabledTasting: boolean = false;

  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

  public PERMISSIONS = CONSTANTS.PERMISSIONS;
  public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
  public isDisabledPrint = false;

  @Input() catationList = [];
  @BlockUI('lot-tasting') blockUI: NgBlockUI;
  readonly REPORT_ACTIONS = CONSTANTS.FILE_REPORT_ACTIONS;
  private file: any;
  constructor(
    private router: Router,
    private _i18nPipe: I18nPipe,
    private _alert: AlertService,
    private _lotService: LotsService,
    private _fileDownLoader: FileDownloadService,
    private _errorHandler: ResponseErrorHandlerService) { }
  public panelOpened = false;

  ngOnInit(): void {
  }

  onPanelOpened() {
    this.panelOpened = !this.panelOpened;
  }

  newTasting() {
    this.router.navigate(['/routes/tasting/new-tasting/', this.lot.folio, this.lot.id]);
  }

  public async actionPDF($event: Event, format: string, action: string, transitionId: string) {
    $event.stopPropagation();
    if (!this.isDisabledPrint) {
      this.blockUI.start();
      try {
        if (format === this.REPORT_ACTIONS.FORMAT.PDF) {
          await this.getReportCatation(format, transitionId);
          const byteArray = new Uint8Array(
            atob(this.file)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          let blob = new Blob([byteArray], {
            type: 'application/pdf',
          });
          const url = window.URL.createObjectURL(blob);
          if (action == this.REPORT_ACTIONS.DOWNLOAD) {
            FileSaver.saveAs(url, 'report.pdf');
          } else {
            printJS({
              printable: this.file,
              type: 'pdf',
              base64: true,
              onError: (error) => {
                let message: string = this._errorHandler.handleError(error, 'print');
                this._alert.errorTitle(
                  this._i18nPipe.transform('error-msg'),
                  message
                );
              }
            });
          }
          this.blockUI.stop();
        } else if (format === this.REPORT_ACTIONS.FORMAT.CSV) {
          await this.getReportCatation(format, transitionId);
          this._fileDownLoader.downloadFromURL(
            this.file,
            `${this._i18nPipe.transform(
              'purchase-orders-list-file'
            )}.csv`
          );
          this.blockUI.stop();
        } else {
          await this.getReportCatation(format, transitionId);
          this.blockUI.stop();
        }
      } catch (error) {
        this.blockUI.stop();
      }
    }
  }

  private async getReportCatation(format: string, transitionId: string) {
    try {
      const langSelecter: string = localStorage.getItem('lang');
      let result = await this._lotService.getReportCatation(format, transitionId, null, langSelecter);
      this.file = (format === this.REPORT_ACTIONS.FORMAT.PDF
        || format === this.REPORT_ACTIONS.FORMAT.CSV)
        ? result.data : null;
    } catch (error) {
      let message: string = this._errorHandler.handleError(error, 'lot');
      this._alert.errorTitle(
        this._i18nPipe.transform('error-msg'),
        message
      );
      throw error;
    }
  }

}
