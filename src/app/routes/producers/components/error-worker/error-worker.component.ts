import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-worker',
  templateUrl: './error-worker.component.html',
  styleUrls: ['./error-worker.component.scss']
})
export class ErrorWorkerComponent {

  constructor(
    private _dialogRef: MatDialogRef<ErrorWorkerComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) { }

  public goToReferenceData() {
    this._dialogRef.close();
  }

}
