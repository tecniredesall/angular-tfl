import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AlertService} from '../../../shared/utils/alerts/alert.service';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {WarehouseService} from '../warehouse.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  view: any;
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alertSvc: AlertService,
    private i18nPipe: I18nPipe,
    private warehouseService: WarehouseService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    if (this.data.type === 'tank') {
      this.view = {
        id: this.data.data.tid,
        name: this.data.data.tname,
      };
    } else {
      this.view = {
        id: this.data.data.production_tank_id,
        name: this.data.data.name
      };
    }
  }

  deleteTank(id) {
    this.warehouseService.deleteTank(id).subscribe(deleted => {
      this.notifierService.notify('success', this.i18nPipe.transform('warehouse-delete-success'));
      this.dialogRef.close(true);
    });
  }

  deleteSubTank(id) {
    this.warehouseService.deleteSubTank(id).subscribe(deleted => {
      this.notifierService.notify('success', this.i18nPipe.transform('warehouse-delete-success'));
      this.dialogRef.close(true);
    });
  }

  submit() {
    if (this.data.type === 'tank') {
      this.deleteTank(this.view.id);
    } else {
      this.deleteSubTank(this.view.id);
    }
  }
}
