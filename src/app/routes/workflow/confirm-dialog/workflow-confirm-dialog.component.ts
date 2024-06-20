import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './workflow-confirm-dialog.component.html',
  styleUrls: ['./workflow-confirm-dialog.component.css']
})
export class WorkflowConfirmDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<WorkflowConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  submit() {
    if(this.data.canDelete) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }
}
