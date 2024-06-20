import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LotListWeightNoteGrouper } from '../../models/lot-list-weight-note-grouper.model';
import { LotsService } from '../../services/lots.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import * as printJS from 'print-js';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';

@Component({
    selector: 'app-lot-detail',
    templateUrl: './lot-detail.component.html',
    styleUrls: ['./lot-detail.component.scss'],
})
export class LotDetailComponent implements OnInit, OnDestroy {
    @BlockUI('lot-report-detail') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    @HostBinding('class') hostClasses = 'sil-overflow-container sil-overflow-container--padded';
    public lot: LotListWeightNoteGrouper;
    public canEdit = true;
    public isFromKanban = false;
    public configuration: ITRConfiguration = new TRConfiguration();
    private _currentLanguage: string = localStorage.getItem('lang');
    private destroy$: Subject<boolean> = new Subject();
    private _commodity : number = 0;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly REPORT_TYPE = CONSTANTS.FILE_REPORT_ACTIONS.TYPE;

    constructor(
        private router: Router,
        private _i18n: I18nPipe,
        private _alert: AlertService,
        private route: ActivatedRoute,
        private lotService: LotsService,
        private _i18nService: I18nService,
        private _errorHandler: ResponseErrorHandlerService,
        private _purchaseService: PurchaseOrdersService,
    ) {
        this._i18nService.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((l) => (this._currentLanguage = l));
    }

    ngOnInit() {
        this.blockUI.start();
        this._purchaseService
            .getConfiguration()
            .pipe(
                take(1),
                switchMap((c) => {
                    this.configuration = c;
                    return this.loadLotDetail();
                })
            )
            .subscribe(
                (l) => {
                    this.lot = l;
                    this.canEdit =
                        this.lot.status == CONSTANTS.LOT_STATUS.IN_PROGRESS;
                    this.lot.processId =
                        this.lot.processId ?? 'pending_process';
                    this.lot.processColor = this.lot.processColor ?? '#70889E';
                    this.blockUI.stop();
                },
                (e) => {
                    this.blockUI.stop();
                    let message = this._errorHandler.handleError(e, 'lot');
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public onBackToList() {
        let url = this.isFromKanban
            ? `/routes/kanban/dashboard/${this.lot.workflowId}?commodity=${this._commodity}`
            : '/routes/weight-note?tab=lots';
        if (
            !this.isFromKanban &&
            this.lot.status == CONSTANTS.LOT_STATUS.PROCESSED
        ) {
            url = url + '&subtab=processed';
        }
        this.router.navigateByUrl(url);
    }

    public loadLotDetail(): Observable<LotListWeightNoteGrouper> {
        return this.route.params.pipe(
            tap(
                () => {
                    this.isFromKanban = this.route.snapshot.queryParams.isFromKanban === 'true';
                    this._commodity = this.route.snapshot.queryParams.commodity;
                }
            ),
            switchMap((p) =>
                this.lotService.getLot(p['id'], {
                    baseMeasurementUnitFactor: this.configuration
                        .baseMeasurementUnitFactor,
                    decimalPlaces: this.DECIMAL_DIGITS,
                })
            )
        );
    }

    public onReloadLot() {
        this.blockUI.start();
        this.loadLotDetail()
            .pipe(take(1))
            .subscribe(
                (l) => {
                    this.lot = { ...l };
                    this.lot.processId =
                        this.lot.processId ?? 'pending_process';
                    this.lot.processColor = this.lot.processColor ?? '#70889E';
                    this.blockUI.stop();
                },
                (e) => {
                    this.blockUI.stop();
                    let message = this._errorHandler.handleError(e, 'lot');
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }
    public async onGenerateReportEvent(reportType: number) {
        try {
            this.blockUI.start();
            let report = await this.lotService.getReportLot(this.lot.id, this._currentLanguage, reportType);
            const byteArray = new Uint8Array(
                atob(report)
                    .split('')
                    .map((char) => char.charCodeAt(0))
            );
            let blob = new Blob([byteArray], {
                type: 'application/pdf',
            });
            const url = window.URL.createObjectURL(blob);
            const agent = window.navigator.userAgent.toLowerCase();
            if (agent.indexOf('firefox') > -1) {
                window.open(url);
                this.blockUI.stop();
            } else {
                printJS({
                    printable: report,
                    type: 'pdf',
                    base64: true,
                    onError: (error) => {
                        let message: string = this._errorHandler.handleError(error, 'print');
                        this._alert.errorTitle(
                            this._i18n.transform('error-msg'),
                            message
                        );
                    },
                    onPrintDialogClose: () => {
                        this.blockUI.stop();
                    }
                });
            }
        } catch (error) {
            this.blockUI.stop();
            let message: string = this._errorHandler.handleError(error, 'lot');
            this._alert.errorTitle(
                this._i18n.transform('error-msg'),
                message
            );
            throw error;
        }

    }
}
