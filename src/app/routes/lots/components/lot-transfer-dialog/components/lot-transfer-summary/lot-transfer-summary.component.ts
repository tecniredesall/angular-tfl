import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ILotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';

@Component({
    selector: 'app-lot-transfer-summary',
    templateUrl: './lot-transfer-summary.component.html',
    styleUrls: ['./lot-transfer-summary.component.scss']
})
export class LotTransferSummaryComponent implements OnInit {
    @Input() lot: ILotListWeightNoteGrouper;
    @Input() summary: {
        totalWeightQQ: number,
        lotWeightQQ: number,
        rejectedWeightQQ: number,
        conversionMeasurementUnitAbbreviation: string
    };
    @Output() actionSelected: EventEmitter<any> = new EventEmitter();
    public lotWeightCurrent: number = 0;
    readonly DECIMAL_DIGITS: number = localStorage.getItem('decimals') ? JSON.parse(localStorage.getItem('decimals')).general : 2;
    public percentageRejected: number = 0;
    constructor() { }

    ngOnInit() {
        this.percentageRejected = (this.summary.rejectedWeightQQ * 100) / this.summary.totalWeightQQ
    }
    public onEventTransferLot(action) {
        this.actionSelected.emit(action);
    }

}
