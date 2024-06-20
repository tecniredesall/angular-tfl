import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {

  public message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalConfirmComponent>,
    private _i18n: I18nPipe,
  ) { }

  ngOnInit() {
    this.message = this._i18n.transform('associate-farm-block');
    this.message = this.message.replace('[value]', this.data.name)
  }

  public cancel() {
    this.dialogRef.close(false)
  }

  public confirm() {
    this.dialogRef.close(true)
  }

}
