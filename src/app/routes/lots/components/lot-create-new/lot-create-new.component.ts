import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { accurateDecimalSum } from 'src/app/shared/utils/functions/accurate-decimal-operation';
import { TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { convertQQtoLb } from '../../../../shared/utils/functions/convert-qq-to-lb';
import { ILotListWeightNote } from '../../models/lot-list-weight-note.model';
import { LotRequestAtionCreateModel } from '../../models/lot-request-ation-create.model';
import { ILotWarehouseModel } from '../../models/lot-warehouse.model';
import { ILotWeignotesModel } from '../../models/lot-weignotes.model';
import { LotsService } from '../../services/lots.service';

@Component({
    selector: 'app-lot-create-new',
    templateUrl: './lot-create-new.component.html',
    styleUrls: ['./lot-create-new.component.scss'],
})
export class LotCreateNewComponent implements OnInit, OnDestroy {
    @Output() backToList: EventEmitter<void> = new EventEmitter();
    @Input() weightNotes: ILotWeignotesModel;
    @Input() factor: ILotWeignotesModel;
    @BlockUI('create-new') blockUILot: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public weigthTotal: number = 0;
    public totalProducers: string[] = [];
    readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;
    readonly DECIMAL_DIGITS: number = JSON.parse(
        localStorage.getItem('decimals')
    ).general;
    public weightNotesSelected: ILotListWeightNote[] = [];
    public configuration: TRConfiguration;
    private _localStorageKey: string = 'new-lot-filter-status';
    private _localStorageWNKey: string = 'weight-notes-selected';
    private _localStorageCommKey: string = 'selected-commodity';
    private _storageKeyBaseUnit: string = 'base-unit-abbrviation';
    public baseUnitAbbreviation = localStorage.getItem(this._storageKeyBaseUnit) ? localStorage.getItem(this._storageKeyBaseUnit) : '';
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public warehouses: string = '';
    public warehousesSelected: ILotWarehouseModel[] = [];
    constructor(
        private _lotsService: LotsService,
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _notifier: NotifierService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _router: Router,
    ) {
        this._lotsService.action$.pipe(takeUntil(this.destroy$))
            .subscribe(
                result => {
                    if (result) {
                        this.createLot();
                    }
                }
            );
    }


    ngOnInit() {
        const model = {
            base_measurement_unit_abbreviation: this.baseUnitAbbreviation,
            base_measurement_unit_factor: this.weightNotes.factorConvertion
        }
        this.configuration = new TRConfiguration(model);
        this.weightNotes.notes.forEach(note => {
            const weightNote: ILotListWeightNote = {
                id: note.receptionId,
                createdDate: note.startDate,
                creatorUser: note.creationName,
                netWeightQQ: note.netQQ,
                sellerName: note.producerName,
                transactionInId: note.transactionInId,
                seals: note.certifications
            }
            this.weightNotesSelected.push(weightNote);
            const wh: ILotWarehouseModel = {
                id: note.virtualTankId,
                name: note.virtualTank
            };
            if (this.warehousesSelected.length === 0) {
                this.warehousesSelected.push(wh);
            } else {
                const existWarehouse = this.warehousesSelected.find(x => x.id === note.virtualTankId);
                if (!existWarehouse) {
                    this.warehousesSelected.push(wh);
                }
            }
        });
        this._setWareHousesLabel();
        this.getNetWeightTotal();
    }
    private _setWareHousesLabel() {
        const totalWareHoseSelected = this.warehousesSelected.length;
        if (totalWareHoseSelected > 2) {
            this.warehouses = `warehouses`;

        } else {
            this.warehousesSelected.forEach(
                (wh, index) => {
                    if (index == 0) {
                        this.warehouses += wh.name;
                    } else {
                        this.warehouses += `, ${wh.name}`
                    }
                }
            );
        }
    }
    /**
     * calculate total weight
     */
    private getNetWeightTotal(): void {
        let totalsNet = [];
        this.weightNotes.notes.forEach((wn) => {
            let existProducer = this.totalProducers.find(
                (pn) => pn === wn.producerName
            );
            if (!existProducer) {
                this.totalProducers.push(wn.producerName);
            }
            totalsNet.push(wn.netQQ);
        });
        this.weigthTotal = accurateDecimalSum(totalsNet, this.DECIMAL_DIGITS);
    }
    /**
     * Show error message notification
     * @param error object data
     */
    private showErrorMessage(error: HttpErrorResponse): void {
        let message = this._errorHandlerService.handleError(error, 'lots');
        this._alertService.errorTitle(
            this._i18nPipe.transform('error-msg'),
            message
        );
    }
    /**
     * create new lot
     */
    private createLot() {
        this.blockUILot.start();
        const lotModel = new LotRequestAtionCreateModel(
            this.weightNotes.notes,
            this.weightNotes.params.productionFlow.id,
            this.weightNotes.params.commodityType.id,
            this.warehousesSelected,
        );
        lotModel.weight = convertQQtoLb(this.weigthTotal);
        lotModel.create = true;
        let data = {
            lots: [lotModel]
        }
        this._lotsService
            .createLot(data)
            .pipe(take(1))
            .subscribe(
                (result) => {
                    let msg = this._i18nPipe
                        .transform('t-success-created-lot')
                        .replace('[value]', result.data[0]);
                    this._notifier.notify('success', msg);
                    localStorage.removeItem(this._localStorageKey);
                    localStorage.removeItem(this._localStorageWNKey);
                    localStorage.removeItem(this._localStorageCommKey);
                    this.blockUILot.stop();
                    this._router.navigateByUrl('/routes/weight-note?tab=lots');
                    this._lotsService.callFunctionCreateLot(false);
                },
                (error) => {
                    this.showErrorMessage(error);
                    this.blockUILot.stop();
                }
            );
    }
    ngOnDestroy(): void {
        this._lotsService.callFunctionCreateLot(false);
        this.destroy$.next(true);
    }
}
