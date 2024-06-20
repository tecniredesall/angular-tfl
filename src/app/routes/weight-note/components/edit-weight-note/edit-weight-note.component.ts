import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICommentModel } from 'src/app/shared/models/comment.model';
import { DeleteWeightNoteComponent } from '../delete-weight-note/delete-weight-note.component';

@Component({
  selector: 'app-edit-weight-note',
  templateUrl: './edit-weight-note.component.html',
  styleUrls: ['./edit-weight-note.component.scss']
})
export class EditWeightNoteComponent{

  public reasonEdit = new UntypedFormControl('', Validators.required);
  public comments: ICommentModel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ICommentModel[],
    private _dialogRef: MatDialogRef<DeleteWeightNoteComponent>,
  ) {
    this.comments = Array.from(this.data);
    this.comments = this.comments.length > 3 ? this.comments.slice(0, 3) : this.comments;
  }

  public cancel() {
    this._dialogRef.close();
  }

  public editWeightNote() {
    this._dialogRef.close(this.reasonEdit.value);
  }

  public showMore() {
    this.comments = Array.from(this.data);
  }

  public showLess() {
    this.comments = this.comments.length > 3 ? this.comments.slice(0, 3) : this.comments;
  }
}
