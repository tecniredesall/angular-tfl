import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
@Component({
    selector: 'app-iot-devices-delete-modal',
    templateUrl: './iot-devices-delete-modal.component.html',
    styleUrls: ['./iot-devices-delete-modal.component.scss'],
})
export class IotDevicesDeleteModalComponent implements OnInit {
    public ACTIONS = CONSTANTS.CRUD_ACTION;

    constructor(
        public dialogRef: MatDialogRef<IotDevicesDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string,

    ) {}

    ngOnInit() {}
    public onButtonClicked(action: number) {
        switch (action) {
            case this.ACTIONS.CANCEL:
              this.dialogRef.close({ delete: false });
              break;
            case this.ACTIONS.DELETE:
              this.dialogRef.close({ delete: true });
              break;
            default:
                break;
        }
    }
}
