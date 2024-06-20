import { NotifierService } from 'angular-notifier';
import { ResizedEvent } from 'angular-resize-event';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, Subscription } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { deepCompareIsEqual } from 'src/app/shared/utils/functions/object-compare';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import {
    validatorDuplicateDataFormArray
} from 'src/app/shared/validators/validator-duplicate-data-form-array';
import { ThemeService } from 'src/theme/theme.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import {
    Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { TIBlockModel } from '../../t-blocks/models/block.model';
import { ModalDeleteFarmComponent } from '../modal-delete-farm/modal-delete-farm.component';
import { TFarmModel, TIFarmModel } from '../models/farm.model';
import {
    TIRequestActionFarmModel, TRequestActionFarmModel
} from '../models/request-action-farm.model';
import { FarmService } from '../services/farm.service';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { AddressModel, IAddressModel } from 'src/app/shared/models/address.model';
import { UnitMeasureModel } from '../../unit-measures/models/unit-measure.model';
import { UnitMeasuresService } from '../../unit-measures/services/units-measure.service';
import { IFarmFederateModel } from '../models/farm-federate.model';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';

declare const $: any;

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'tfarms-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
    @BlockUI('farm-action-container') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    @Output() closeEvent = new EventEmitter();
    @Output() emitEvent = new EventEmitter<TFarmModel>();
    @Output() emitReadonlyEvent = new EventEmitter();
    @Input() farm: TFarmModel = new TFarmModel();
    @Input() seller: TProducerModel;
    @Input() action: number;
    @Input() isEdit = false;
    @Input() isMultiple = true;
    @Input() isFromModal = false;
    @Input() allowedBlocks: Array<TIBlockModel> = [];
    @Input() isReadonly: boolean = false;
    private _subscription: Subscription = new Subscription();
    public isDarkTheme: boolean;
    public hasFederatedData = true;
    public federatedFarms: Array<IFarmFederateModel> = [];
    public isFisnishRequest: boolean = false;
    constructor(
        private _themeService: ThemeService,
        public _dialog: MatDialog,
        private _farmService: FarmService,
        private alertService: AlertService,
        private handleErrors: ResponseErrorHandlerService,
        private i18n: I18nPipe
    ) {
        this._subscription.add(
            this._themeService.theme.subscribe((theme) => {
                if (theme) {
                    this.isDarkTheme = 'dark' === theme;
                }
            })
        );
    }
    ngOnInit(): void {
        this.farm = JSON.parse(JSON.stringify(this.farm));
        if (!this.isEdit) {
            this.getFederatedFarms();
        } else {
            this.hasFederatedData = false;
        }
    }
    onRefreshData(item): void {
        this.emitEvent.emit(item);
    }
    public cancel() {
        this.closeEvent.emit();
    }
    public onEditFormEvent(): void {
        this.isReadonly = false;
        this.emitReadonlyEvent.emit(true);
    }
    private getFederatedFarms(): void {
        this.blockUI.start();
        this._farmService.getFarmFederatedByProducer(this.seller.identity, this.seller.email, this.seller.phone, this.seller.phoneCountry).subscribe(
            result => {
                this.isFisnishRequest = true;
                this.federatedFarms = result;
                this.hasFederatedData = this.federatedFarms.length > 0;
                this.blockUI.stop();
            },
            error => {
                this.isFisnishRequest = true;
                this.blockUI.stop();
                this.hasFederatedData = false;
            }
        );
    }
    public onCreateFarmEvent() {
        this.hasFederatedData = false;
    }
}
