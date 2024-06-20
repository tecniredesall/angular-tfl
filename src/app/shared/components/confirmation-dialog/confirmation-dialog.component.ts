import { ITRDialogSettings } from './../../models/tr-dialog-settings';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONSTANTS } from '../../utils/constants/constants';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  readonly ACTIONS = CONSTANTS.CRUD_ACTION;
  public reason : string = ''
  constructor( private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public settings: ITRDialogSettings) { }

  ngOnInit() {
  }

  public onActionFooterSelected(action):void {
   this.settings.withReason ? this.dialogRef.close({action, reason: this.reason}) : this.dialogRef.close(action);
  }
}
