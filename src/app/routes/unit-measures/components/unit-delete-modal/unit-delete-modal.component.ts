import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UnitMeasureModel } from '../../models/unit-measure.model';

@Component({
    selector: 'app-unit-delete-modal',
    templateUrl: './unit-delete-modal.component.html',
    styleUrls: ['./unit-delete-modal.component.css'],
})
export class UnitDeleteModalComponent implements OnInit {
    @Input() unit: UnitMeasureModel;
    @Output() cancelClicked: EventEmitter<boolean> = new EventEmitter();
    @Output() deleteClicked: EventEmitter<
        UnitMeasureModel
    > = new EventEmitter();
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    constructor() {}

    ngOnInit() {}
    public onButtonClicked(action: number) {
        switch (action) {
            case this.ACTIONS.CANCEL:
                this.cancelClicked.emit(true);
                break;
            case this.ACTIONS.DELETE:
                this.deleteClicked.emit(this.unit);
                break;
            default:
                break;
        }
    }
}
