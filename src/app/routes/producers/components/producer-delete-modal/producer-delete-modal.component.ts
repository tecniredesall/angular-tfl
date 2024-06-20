import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TIProducerModel } from 'src/app/shared/models/sil-producer';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

@Component({
    selector: 'app-producer-delete-modal',
    templateUrl: './producer-delete-modal.component.html',
    styleUrls: ['./producer-delete-modal.component.css'],
})
export class ProducerDeleteModalComponent {
    @Input() producer: TIProducerModel;
    @Output() cancelClicked: EventEmitter<boolean> = new EventEmitter();
    @Output() deleteClicked: EventEmitter<TIProducerModel> = new EventEmitter();
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    constructor() {}

    public onButtonClicked(action: number) {
        switch (action) {
            case this.ACTIONS.CANCEL:
                this.cancelClicked.emit(true);
                break;
            case this.ACTIONS.DELETE:
                this.deleteClicked.emit(this.producer);
                break;
            default:
                break;
        }
    }
}
