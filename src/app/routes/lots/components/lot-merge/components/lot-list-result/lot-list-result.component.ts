import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ILotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { sortBykey } from 'src/app/shared/utils/functions/sortFunction';
import { ITRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { reverseSortByKey } from '../../../../../../shared/utils/functions/sortFunction';

@Component({
    selector: 'app-lot-list-result',
    templateUrl: './lot-list-result.component.html',
    styleUrls: ['./lot-list-result.component.scss']
})
export class LotListResultComponent implements OnInit {
    @Input() lots: Array<ILotListWeightNoteGrouper> = [];
    @Input() configuration: ITRConfiguration;
    @Input() isOnlyView: boolean = false;
    @Output() selectLots = new EventEmitter();
    @ViewChild(MatAccordion) accordion: MatAccordion;
    public columnOrder: string = 'createdDate';
    public columnAscState: any = {}
    public selectedLots: Array<ILotListWeightNoteGrouper> = [];
    public isAllSelected: boolean = false;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;
    readonly RECEIVING_NOTE_STATUS: any = CONSTANTS.RECEIVING_NOTE_STATUS;
    constructor() { }

    ngOnInit() {
        this.selectedLots = this.lots.filter(l => l.isSelected);
    }
    public onToggle(): void {
        let isClosedAllPanels: boolean =
            -1 ==
            this.lots.findIndex(
                (l: ILotListWeightNoteGrouper) => l.opened
            );
        if (isClosedAllPanels) {
            this.accordion.openAll();
        } else {
            this.accordion.closeAll();
        }
    }
    public sortData(column: string): void {
        for (const key in this.columnAscState) {
            if (
                Object.prototype.hasOwnProperty.call(
                    this.columnAscState,
                    key
                ) &&
                column !== key
            ) {
                this.columnAscState[key] = true;
            }
        }
        this.columnOrder = column;
        this.columnAscState[column] = !this.columnAscState[column];
        this.lots = this.columnAscState[column] ? sortBykey(this.lots, column) : reverseSortByKey(this.lots, column);
    }
    public onOpenedPanelEvent(index: number): void {
        this.lots[index].opened = !this.lots[index].opened;
    }

    public onToggleSelectLot(lot: ILotListWeightNoteGrouper) {
        lot.isSelected = !lot.isSelected;
        const indexLotInArray = this.selectedLots.findIndex(l => l.id === lot.id);
        indexLotInArray !== -1 ? this.selectedLots.splice(indexLotInArray, 1) : this.selectedLots.push(lot);
        this.isAllSelected = this.selectedLots.length == this.lots.length;
        this.selectLots.emit(this.selectedLots);

    }
    public onToggleSelectAll() {
        this.isAllSelected = !this.isAllSelected;
        this.selectedLots = this.isAllSelected ? [...this.lots] : [];
        this.lots.forEach(lot => { lot.isSelected = this.isAllSelected });
        this.selectLots.emit(this.selectedLots);
    }
}


