import { ILotListWeightNote } from 'src/app/routes/lots/models/lot-list-weight-note.model';
import {
    reverseSortByKey, sortAlphanumerical, sortBykey
} from 'src/app/shared/utils/functions/sortFunction';
import { TRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { MatDialog } from '@angular/material/dialog';
import { LotSplitDialogComponent } from '../../../lot-split-dialog/lot-split-dialog.component';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

@Component({
    selector: 'app-lot-weight-notes',
    templateUrl: './lot-weight-notes.component.html',
    styleUrls: ['./lot-weight-notes.component.scss'],
})
export class LotWeightNotesComponent implements OnChanges {
    @Input() public standAlone = false;
    @Input() public weightNotes: ILotListWeightNote[] = [];
    @Input() public configuration = new TRConfiguration();
    @Input() public lot: LotListWeightNoteGrouper;
    @Input() public isFromTransition = false;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    public columnAscState = {
        creation: false,
        id: false,
        producer: false,
        weight: false,
    };
    public panelOpened = false;
    public isAllowLotActions = false;
    public isFromKanban = false;
    public readonly PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public readonly PERMISSIONS = CONSTANTS.PERMISSIONS;
    constructor(
        private _dialog: MatDialog,
        private _route: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        let queryPams = this._activatedRoute.snapshot.queryParams;
        this.isFromKanban = queryPams?.isFromKanban == 'true';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.lot?.currentValue) {
            this.setAllowActions();
        }
    }

    public setAllowActions() {
        if(this.lot.status == CONSTANTS.LOT_STATUS.IN_PROGRESS) {
            this.isAllowLotActions = !!this.lot.currentTransition.transitionAt;
        }
    }

    public onPanelOpened() {
        this.panelOpened = !this.panelOpened;
    }

    public sortData(column: string) {
        switch (column) {
            case 'creation':
                this.columnAscState.creation = !this.columnAscState.creation;
                this.weightNotes = this.weightNotes.sort((a, b) =>
                    this.columnAscState.creation
                        ? a.createdDate.toDate().getTime() -
                        b.createdDate.toDate().getTime()
                        : b.createdDate.toDate().getTime() -
                        a.createdDate.toDate().getTime()
                );
                break;
            case 'id':
                this.columnAscState.id = !this.columnAscState.id;
                this.weightNotes = this.columnAscState.id
                    ? sortBykey(this.weightNotes, 'transactionInId')
                    : reverseSortByKey(this.weightNotes, 'transactionInId');
                break;
            case 'producer':
                this.columnAscState.producer = !this.columnAscState.producer;
                this.weightNotes = this.weightNotes.sort((a, b) =>
                    sortAlphanumerical(
                        a.sellerName,
                        b.sellerName,
                        this.columnAscState.producer
                    )
                );
                break;
            case 'weight':
                this.columnAscState.weight = !this.columnAscState.weight;
                this.weightNotes = this.columnAscState.weight
                    ? sortBykey(this.weightNotes, 'netWeightQQ')
                    : reverseSortByKey(this.weightNotes, 'netWeightQQ');
                break;
            default:
                break;
        }
    }

    public onSplitOpenDialog($event: Event) {
        $event.stopPropagation();
        this._dialog.open(LotSplitDialogComponent, {
            autoFocus: false,
            disableClose: true,
            data: {lot: this.lot, configuration: this.configuration},

        }).afterClosed().pipe(
            take(1)
        ).subscribe((result: any) => {
            if (result) {
                const route = this.isFromKanban ?
                    `/routes/kanban/dashboard/${this.lot.workflowId}?commodity=${this.lot.commodityId}` :
                    '/routes/weight-note?tab=lots';
                this._route.navigateByUrl(route);
            }
        });
    }
}
