import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
    ITDriverActionInputModel, TDriverActionInputModel
} from '../../drivers/models/driver-action-input.model';
import { TDriverModel } from '../../drivers/models/driver.model';
import {
    IOutputDataActionsProducerModel, OutputDataActionsProducerModel
} from '../../producers/models/output-data-actions-producer.model';
import { TBlockModel } from '../../t-blocks/models/block.model';
import { InputDataActionsBlockModel } from '../../t-blocks/models/input-data-actions-block.model';

@Component({
  selector: 'app-modal-new',
  templateUrl: './modal-new.component.html',
  styleUrls: ['./modal-new.component.scss']
})
export class ModalNewComponent implements OnInit, OnDestroy {

  @BlockUI('action-driver-container') blockUIPanel: NgBlockUI;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
  public OPTIONS_MODAL = CONSTANTS.OPTIONS_MODAL_WEIGHT_NOTE;
  public dataBlocks: InputDataActionsBlockModel;
  public outputDataCreateProducer: IOutputDataActionsProducerModel = new OutputDataActionsProducerModel();
  public actionDriver: ITDriverActionInputModel = new TDriverActionInputModel({
    action: CONSTANTS.ACTIONS_MODE.NEW,
    driver: new TDriverModel(),
    isFromExternalModule: true
  });
  private _subscription: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalNewComponent>,
  ) { }

  ngOnInit() {
    if (this.data.element == this.OPTIONS_MODAL.BLOCK) {
      this.dataBlocks = new InputDataActionsBlockModel({
        isFromBlockModule: false,
        isEdit: false,
        block: [new TBlockModel({ seller: this.data.producerId, farmId: this.data.farm ? this.data.farm.id : null })],
        producerId: this.data.producerId
      });
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public onCancelEvent() {
    this.dialogRef.close(false);
  }

  public onEmitEvent(event: any) {
    this.dialogRef.close(event);
  }

  public eventChangeDataCreateProductor(stateCreatingProducer: IOutputDataActionsProducerModel): void {
    this.outputDataCreateProducer = stateCreatingProducer;
  }

  public onActionProducerSelected(data: any): void {
    switch (data.action) {
      case CONSTANTS.CRUD_ACTION.CANCEL:
        this.onCancelEvent();
        break;
      case CONSTANTS.CRUD_ACTION.CREATE:
        this.dialogRef.close(data.data)
        break;
      default:
        break;
    }
  }

  public onActionDriverSelected(event: any): void {
    switch (event.action) {
      case CONSTANTS.CRUD_ACTION.CANCEL:
        this.onCancelEvent();
        break;
      case CONSTANTS.CRUD_ACTION.CREATE:
        this.onEmitEvent(event.driver);
        break;
      default:
        break;
    }
  }

}
