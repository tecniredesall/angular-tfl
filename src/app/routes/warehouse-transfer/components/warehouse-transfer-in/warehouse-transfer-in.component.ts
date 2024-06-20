import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ITRDialogSettings } from 'src/app/shared/models/tr-dialog-settings';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { warehouseTransferService } from '../../services/warehouse-transfer.service';

@Component({
  selector: 'sst-warehouse-transfer-in',
  templateUrl: './warehouse-transfer-in.component.html',
  styleUrls: ['./warehouse-transfer-in.component.scss']
})
export class WarehouseTransferInComponent implements OnInit {
  readonly ACTIONS = CONSTANTS.CRUD_ACTION;
  constructor(private dialogRef: MatDialogRef<WarehouseTransferInComponent>,
    @Inject(MAT_DIALOG_DATA) public settings: ITRDialogSettings,
    private _WarehouseTransferService: warehouseTransferService) { }
  public warehouseMovementsOut = [];
  public selectLot = false;
  ngOnInit(): void {
    this.getMovementsWarehouse();
  }
  public movement = [];

  public selectMovement(element) {
    this.selectLot = true;
    this.movement = element;
  }

  public getMovementsWarehouse() {
    this._WarehouseTransferService.getWarehouseTransfer(CONSTANTS.PROCESS_FLOW.OUT, CONSTANTS.WAREHOUSE_MOVEMENT_OPERATION.CLOSE).pipe(take(1)).subscribe((resp: any) => {

      resp.data.forEach((item) => {
        const padStart = (item.transaction_id).toString().padStart(5, '0');
        item['transaction_idx'] = padStart;
      });
      this.warehouseMovementsOut = resp.data;
    });
  }

  public onActionFooterSelected(action): void {
    const movement = this.movement;
    this.dialogRef.close({ action, movement });
  }
}
