import {
    ContractTrumodityModel
} from 'src/app/routes/purchase-orders/models/contract-trumodity.model';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-contract-changed-modal',
    templateUrl: './contract-changed-modal.component.html',
    styleUrls: ['./contract-changed-modal.component.scss'],
})
export class ContractChangedModalComponent implements OnInit {
    public contract: ContractTrumodityModel;

    constructor(
        public dialogRef: MatDialogRef<ContractChangedModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ContractTrumodityModel
    ) {
        this.contract = this.data;
    }

    ngOnInit() {}

    public onCancelClicked() {
        this.dialogRef.close({ contract: null });
    }

    public onAcceptClicked() {
        this.dialogRef.close({ contract: this.contract });
    }
}
