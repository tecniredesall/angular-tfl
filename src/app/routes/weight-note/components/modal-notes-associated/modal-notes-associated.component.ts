import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { IReceivingNoteListModel, IWNPurchaseOrderModel } from '../../models/receiving-note-list.model';
import { IWNProductionModel } from '../../models/wn-production.model';

@Component({
  selector: 'app-modal-notes-associated',
  templateUrl: './modal-notes-associated.component.html',
  styleUrls: ['./modal-notes-associated.component.scss']
})
export class ModalNotesAssociatedComponent implements OnInit {

  public associated: IWNPurchaseOrderModel;
  readonly MODAL_ASSOCIATED_NOTE_TYPE = CONSTANTS.MODAL_ASSOCIATED_NOTE_TYPE;

  constructor(
    private _dialogRef: MatDialogRef<ModalNotesAssociatedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      note: IReceivingNoteListModel,
      weightNote: IWNProductionModel,
      modalAssociatedNoteType: number
    }
  ) { }

  ngOnInit() {
    switch(this.data.modalAssociatedNoteType) {
      case this.MODAL_ASSOCIATED_NOTE_TYPE.WEIGHT_NOTE:
        this.associated = this.data.note.associated.find(a => {
          return a.weightNotes.find((w: any) => w.folio == this.data.weightNote.transactionInId)
        })
        break
      case this.MODAL_ASSOCIATED_NOTE_TYPE.PRODUCTION_WEIGHT_NOTE:
        this.associated = this.data.weightNote.associated;
        break;
    }
  }

  public close() {
    this._dialogRef.close();
  }

}
