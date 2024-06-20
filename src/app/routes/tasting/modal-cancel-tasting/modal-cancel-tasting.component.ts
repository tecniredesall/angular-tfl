import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

@Component({
  selector: 'app-modal-cancel-tasting',
  templateUrl: './modal-cancel-tasting.component.html',
  styleUrls: ['./modal-cancel-tasting.component.scss']
})
export class ModalCancelTastingComponent implements OnInit {
  public ACTIONS = CONSTANTS.CRUD_ACTION;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: string,) { }

  ngOnInit(): void {
  }

  public onButtonClicked(action: number) {
    switch (action) {
      case this.ACTIONS.CANCEL:
        this.dialogRef.close({ cancel: false });
        break;
      case this.ACTIONS.ACCEPT:
        this.dialogRef.close({ cancel: true });
        break;
      default:
        break;
    }
  }

}
