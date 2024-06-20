import { Component, OnInit } from '@angular/core';
import { ILotListWeightNoteGrouper, LotListWeightNoteGrouper } from '../../models/lot-list-weight-note-grouper.model';
import { LotsService } from '../../services/lots.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { pipe, Observable, forkJoin } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { NotifierService } from 'angular-notifier';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';

@Component({
    selector: 'app-lot-merge',
    templateUrl: './lot-merge.component.html',
    styleUrls: ['./lot-merge.component.scss']
})
export class LotMergeComponent implements OnInit {
    @BlockUI('lot-merge') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public lots: Array<ILotListWeightNoteGrouper> = [];
    public currentLot: ILotListWeightNoteGrouper = new LotListWeightNoteGrouper();
    public selectedLots: Array<ILotListWeightNoteGrouper> = [];
    public isAllSelected: boolean = false;
    public columnOrder: string = 'created';
    public columnAscState: any = {}
    public configuration: ITRConfiguration = new TRConfiguration();
    public addedQuantity: number = 0;
    public totalQuantity: number = 0;
    public isCompletedLotsSelection: boolean = false;
    public isFromKanban = false;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;
    constructor(
        private _lotService: LotsService,
        private _activateRoute: ActivatedRoute,
        private _i18n: I18nPipe,
        private _alert: AlertService,
        private _errorHandler: ResponseErrorHandlerService,
        private _router: Router,
        private _purchaseService: PurchaseOrdersService,
    ) {
        let queryPams = this._activateRoute.snapshot.queryParams;
        this.isFromKanban = queryPams?.isFromKanban == 'true';
    }

    ngOnInit() {
        this.blockUI.start();
        this._purchaseService
            .getConfiguration()
            .pipe(
                take(1),
                switchMap((c) => {
                    this.configuration = c;
                    return this._getAvailableLots();
                })
            )
            .subscribe(
                ([lots, lot]) => {
                    this.blockUI.stop();
                    this.lots = lots;
                    this.currentLot = lot;
                },
                error => {
                    this.blockUI.stop();
                    let message = this._errorHandler.handleError(error, 'lot');
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }

    private _getAvailableLots(): Observable<any> {
        return this._activateRoute.params.pipe(
            switchMap((r) => {
                return forkJoin([this._lotService.getLotsAvailableForMerge(r['id'], this.configuration, this.DECIMAL_DIGITS),
                this._lotService.getLot(r['id'],
                    { baseMeasurementUnitFactor: this.configuration.baseMeasurementUnitFactor, decimalPlaces: this.DECIMAL_DIGITS })])
            })
        )
    }

    public onSetLotsSelected(lots: Array<ILotListWeightNoteGrouper>): void {
        this.selectedLots = lots;
        this.addedQuantity = this.selectedLots.map(l => l.weightQQ)
            .reduce((x, y) => x + y, 0);
        this.totalQuantity = this.currentLot.weightQQ + this.addedQuantity;
    }
    public onActionSelected(action) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.NEXT: {
                this.isCompletedLotsSelection = true;
                break;
            }
            case CONSTANTS.CRUD_ACTION.CANCEL: {
                this._router.navigateByUrl('/routes/weight-note/lots/lot/' + this.currentLot.id );
                break;
            }
        }

    }
    public setCompletedSelectionstatus() {
        this.isCompletedLotsSelection = false;
    }
}
