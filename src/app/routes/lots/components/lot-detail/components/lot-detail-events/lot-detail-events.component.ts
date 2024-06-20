import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
    LotListWeightNoteGrouper
} from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
    selector: 'app-lot-detail-events',
    templateUrl: './lot-detail-events.component.html',
    styleUrls: ['./lot-detail-events.component.scss'],
})
export class LotDetailEventsComponent implements OnInit {
    @BlockUI('hello') blockUI: NgBlockUI;
    @Input() lot: LotListWeightNoteGrouper;
    @Input() canEdit: boolean = true;
    @Output() reloadLot = new EventEmitter();

    public form: UntypedFormGroup;
    public events: Array<any> = [];
    constructor() { }

    ngOnInit() { }

    public onReloadLot() {
        this.reloadLot.emit(true);
    }
}
