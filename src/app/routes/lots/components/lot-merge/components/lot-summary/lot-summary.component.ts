import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ILotListWeightNoteGrouper, LotListWeightNoteGrouper } from '../../../../models/lot-list-weight-note-grouper.model';
import { ITRConfiguration, TRConfiguration } from '../../../../../../shared/utils/models/configuration.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { Router } from '@angular/router';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { LotsService } from 'src/app/routes/lots/services/lots.service';
import { take } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-lot-summary',
    templateUrl: './lot-summary.component.html',
    styleUrls: ['./lot-summary.component.scss']
})
export class LotSummaryComponent implements OnInit {
    @Input() lotsForMerge: Array<ILotListWeightNoteGrouper> = [];
    @Input() currentLot: ILotListWeightNoteGrouper = new LotListWeightNoteGrouper();
    @Input() configuration: ITRConfiguration = new TRConfiguration();
    @Output() backToList: EventEmitter<void> = new EventEmitter();
    @BlockUI('merge-lot') blockUILot: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public featuredWeigthTotal: number = 0;
    public netWeigthTotal: number = 0;
    public totalWeighNotes: number = 0;
    public sellers: string[] = [];
    readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    constructor(private _i18npipe: I18nPipe,
                private _alert: AlertService,
                private _errorHandler: ResponseErrorHandlerService,
                private _router: Router,
                private _lotService: LotsService,
                private _notifierService: NotifierService) { }

    ngOnInit() {
        this._setTotals();
    }

    private _setTotals(): void {
        this.lotsForMerge.forEach(lot => {
            this.featuredWeigthTotal += lot.weightQQ;
            this.netWeigthTotal += lot.netWeightQQ;
            lot.sellers.forEach(s => {
                let existSeller = this.sellers.find(seller => seller == s);
                if (!existSeller) {
                    this.sellers.push(s);
                }
            });
            this.totalWeighNotes += lot.weightNotes.length;
        });
        this.featuredWeigthTotal += this.currentLot.weightQQ;
        this.netWeigthTotal += this.currentLot.netWeightQQ;
        this.totalWeighNotes += this.currentLot.weightNotes.length;
        this._setSellersTotal();
    }

    private _setSellersTotal(){
        this.currentLot.sellers.forEach(s=> this.sellers.indexOf(s) === -1 ? this.sellers.push(s) : null )
    }

    public onActionSelected(action: number) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.CREATE: {
                this._mergeLots();
                break
            };
            case CONSTANTS.CRUD_ACTION.CANCEL: {
                this._router.navigateByUrl('/routes/weight-note/lots/lot/' + this.currentLot.id );
                break;
            }
        }

    }
    public onBackLotsAvailable(){
        this.backToList.emit();
    }
    private _mergeLots(): void {
        this.blockUILot.start();
        const lotsRequest: Array<string> = this.lotsForMerge.map((item) => item.id);
        lotsRequest.push(this.currentLot.id);
        this._lotService.mergeLots({lots: lotsRequest})
                        .pipe(take(1))
                        .subscribe(
                            (result) => {
                                this.blockUILot.stop();
                                const mergedLots: Array<string> = this.lotsForMerge.map((item) => item.folio);
                                const successMsg = this._i18npipe.transform('lot-merge-seccess-msg')
                                .replace('lotOrigin', this.currentLot.folio)
                                .replace('mergedLots', mergedLots);
                                this._notifierService.notify( 'success', successMsg);
                                this._router.navigateByUrl('/routes/weight-note/lots/lot/' + result.data['id'] );

                            },
                            error => {
                                this.blockUILot.stop();
                                let message = this._errorHandler.handleError(error, 'lot-merge');
                                this._alert.errorTitle(
                                    this._i18npipe.transform('error-msg'),
                                    message
                                );
                            }
                        );
    }

}
