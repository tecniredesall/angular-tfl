import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-weight-note',
  templateUrl: './delete-weight-note.component.html',
  styleUrls: ['./delete-weight-note.component.scss']
})
export class DeleteWeightNoteComponent {

  public reasonDelete = new UntypedFormControl('', Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<DeleteWeightNoteComponent>,
  ) { }

  public cancel() {
    this._dialogRef.close();
  }

  public deleteWeightNote() {
    this._dialogRef.close(this.reasonDelete.value);
  }

}
