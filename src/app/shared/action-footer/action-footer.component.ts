import { ResizedEvent } from 'angular-resize-event';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CONSTANTS } from '../utils/constants/constants';

@Component({
    selector: 'app-action-footer',
    templateUrl: './action-footer.component.html',
    styleUrls: ['./action-footer.component.css'],
})
export class ActionFooterComponent {
    @Input() isNextMode: boolean = false;
    @Input() isEdit: boolean = false;
    @Input() isButtonSubmitDisabled: boolean = false;
    @Input() buttonSubmitText: string = null;
    @Input() buttonCancelText: string = null;
    @Input() isVisibleDeleteButton: boolean = true;
    @Input() isButtonCancelDisabled: boolean = false;
    @Output() onActionSelected: EventEmitter<number> = new EventEmitter();

    public responsiveClass: string = 'action-footer-lg';
    public isVisibletextButtonDelete: boolean = true;

    constructor() {}

    public handleResponsive(event: ResizedEvent): void {
        if (event.newWidth < 275) {
            this.responsiveClass = 'action-footer-xs';
            this.isVisibletextButtonDelete = true;
        } else if (event.newWidth < 430) {
            this.responsiveClass = 'action-footer-sm';
            this.isVisibletextButtonDelete = true;
        } else if (event.newWidth < 488) {
            this.responsiveClass = 'action-footer-md';
            this.isVisibletextButtonDelete = false;
        } else {
            this.responsiveClass = 'action-footer-lg';
            this.isVisibletextButtonDelete = true;
        }
    }

    public delete(): void {
        this.onActionSelected.emit(CONSTANTS.CRUD_ACTION.DELETE);
    }

    public submit(): void {
        if (this.isNextMode) {
            this.onActionSelected.emit(CONSTANTS.CRUD_ACTION.NEXT);
        } else {
            this.onActionSelected.emit(
                this.isEdit
                    ? CONSTANTS.CRUD_ACTION.UPDATE
                    : CONSTANTS.CRUD_ACTION.CREATE
            );
        }
    }

    public cancel(): void {
        this.onActionSelected.emit(CONSTANTS.CRUD_ACTION.CANCEL);
    }
}
