import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { TransformationTypesModel } from 'src/app/shared/utils/models/transformation-types.model';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-transformation-delete-modal',
    templateUrl: './transformation-delete-modal.component.html',
    styleUrls: ['./transformation-delete-modal.component.css'],
})
export class TransformationDeleteModalComponent implements OnInit {
    @Input() transformation: TransformationTypesModel;
    @Output() cancelClicked: EventEmitter<boolean> = new EventEmitter();
    @Output() deleteClicked: EventEmitter<
        TransformationTypesModel
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
                this.deleteClicked.emit(this.transformation);
                break;
            default:
                break;
        }
    }
}
