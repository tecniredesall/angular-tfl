import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-table-action-button-group',
    templateUrl: './table-action-button-group.component.html',
    styleUrls: ['./table-action-button-group.component.scss'],
})
export class TableActionButtonGroupComponent implements OnInit {
    @Input() disableDelete: boolean;
    @Input() permissionTag = CONSTANTS.PERMISSIONS.ALL;
    @Input() permissionType;
    @Input() actionLabels: {
        edit?: string,
        delete?: string
    } = {
            edit: 'edit',
            delete: 'delete'
        };
    @Output() actionClicked: EventEmitter<number> = new EventEmitter();
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public showOptions = false;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;

    constructor() { }
    public ngOnInit() {
        if (this.actionLabels) {
            this.actionLabels.edit = this.actionLabels.edit ?? 'edit';
            this.actionLabels.delete = this.actionLabels.delete ?? 'delete';
        } else {
            this.actionLabels = {
                edit: 'edit',
                delete: 'delete'
            };
        }
    }
    public onShowOptions() {
        this.showOptions = !this.showOptions;
    }

    public onActionClicked(action: number, event: any): void {
        event.stopPropagation();
        this.actionClicked.emit(action);
    }
}
