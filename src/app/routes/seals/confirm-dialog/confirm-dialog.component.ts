import { NotifierService } from 'angular-notifier';

import { Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BlockService } from '../../../shared/block/block.service';
import { I18nPipe } from '../../../shared/i18n/i18n.pipe';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { SealModel } from '../../../shared/utils/models/seal.model';
import { SealsService } from '../seals.service';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent {
    @ViewChild('loaderComponent', { read: ViewContainerRef, static: true })
    entry: ViewContainerRef;
    viewName = 'confirm-dialog';
    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SealModel,
        private alertSvc: AlertService,
        private i18nPipe: I18nPipe,
        private sealsSvc: SealsService,
        private notifierSvc: NotifierService,
        private blockService: BlockService
    ) {}

    public deleteSeal(): void {
        this.blockService.startModal(this.entry, this.viewName);

        this.sealsSvc.deleteSeal(this.data.certification_id).subscribe(
            (response: any) => {
                if (response.status) {
                    this.blockService.stop(this.viewName);

                    this.dialogRef.close(true);

                    this.notifierSvc.notify(
                        'success',
                        this.i18nPipe.transform('seal-delete-success')
                    );
                } else {
                    this.blockService.stop(this.viewName);

                    this.alertSvc.errorTitle(
                        this.i18nPipe.transform('error-msg'),
                        this.i18nPipe.transform('unidentified-problem')
                    );
                }
            },
            (error) => {
                this.blockService.stop(this.viewName);

                this.alertSvc.errorTitle(
                    this.i18nPipe.transform('error-msg'),
                    this.i18nPipe.transform('unidentified-problem')
                );
            }
        );
    }
}
