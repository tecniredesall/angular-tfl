import { Farm } from './../../../seals/models/certification-farms.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take, timeout, filter } from 'rxjs/operators';
import { TBlockModel, TIBlockModel } from 'src/app/routes/t-blocks/models/block.model';
import { TBlockService } from 'src/app/routes/t-blocks/services/block.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import { ActionDataTypeEnum } from '../../models/action-data-type.enum';
import { IActionDataModel } from '../../models/action-data.model';

@Component({
    selector: 'app-actions-modal',
    templateUrl: './actions-modal.component.html',
    styleUrls: ['./actions-modal.component.css'],
})
export class ActionsModalComponent implements OnInit {
    public actionDataTypeEnum: any = ActionDataTypeEnum;
    public shouldShowViewMode: boolean;
    public shouldShowEditMode: boolean;
    public shouldShowFederateList: boolean;
    public shouldShowFederateEditMode: boolean;
    public finishRequest: boolean = true;
    public federatedItems: any = [];
    @BlockUI('panel-actions-producer') blockUIPanel: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    constructor(
        public dialogRef: MatDialogRef<ActionsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IActionDataModel,
        private _blockService: TBlockService
    ) { }

    public ngOnInit() {
        if (this.data.action === ActionDataTypeEnum.Blocks) {
            this.finishRequest = false;
            if (!this.data.isEdit) {
                this.blockUIPanel.start();
                this._getFederateBlocks();
            } else {
                this._setActionsForBlocks();
            }
        }
    }
    public close() {
        this.dialogRef.close({ refresh: false });
    }

    public emit() {
        this.dialogRef.close({ refresh: true });
    }

    public onNewItem() {
        this.shouldShowFederateList = false;
        this.shouldShowEditMode = true;
    }

    public onShowFederatedForm(federatedItems: any) {
        this.shouldShowFederateList = false;
        this.shouldShowFederateEditMode = true;
        this.federatedItems = federatedItems;
    }

    public onBackToList(items: any) {
        this.shouldShowFederateEditMode = false;
        this.shouldShowFederateList = true;
        this.federatedItems = items;
    }

    private _getFederateBlocks() {
        this._blockService
            .getFederatedBlocks(
                this.data.producer.identity,
                this.data.producer.email,
                this.data.producer.phone,
                this.data.producer.phoneCountry
            )
            .pipe(take(1))
            .subscribe(
                (blocks: any[]) => {
                    if (blocks.length > 0) {
                        const fedBlocks = blocks.map((b) =>
                            (b.apps as Array<any>).map(
                                (i) => new TBlockModel(i, b.federated_id)
                            )
                        );
                        const flatArray: TIBlockModel[] = []
                            .concat(...fedBlocks);
                        flatArray.forEach(fa => {
                            if (fa.farm) {
                                const isComplete = fa.farm.name !== null
                                    && fa.farm.countryId !== null
                                    && fa.farm.stateId !== null
                                    && fa.farm.cityId !== null
                                    && fa.farm.address !== null;
                                if (!isComplete) {
                                    fa.farm = null;
                                    fa.farmName = null;
                                    fa.farmId = null;
                                }
                            }
                        });
                        this.data.blocks = flatArray;
                    } else {
                        this.data.blocks = [];
                    }
                    this._setActionsForBlocks();
                },
                () => {
                    this.data.blocks = [];
                    this._setActionsForBlocks();
                }
            );
    }

    private _setActionsForBlocks() {
        this.shouldShowViewMode = this.data.isReadOnly;
        this.shouldShowFederateList =
            !this.data.isEdit && this.data.blocks.length > 0;
        this.shouldShowEditMode =
            (!this.data.isEdit && this.data.blocks.length === 0) ||
            (this.data.isEdit && !this.shouldShowFederateList);
        this.shouldShowFederateEditMode = false;
        this.blockUIPanel.stop();
        this.finishRequest = true;
    }

}
