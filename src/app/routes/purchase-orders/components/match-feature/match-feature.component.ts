import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { WNCharacteristicModel } from '../../../weight-note/models/wn-characteristic.model';
import {
    ContractFeaturesModel, FeaturesModel, IContractFeaturesModel
} from '../../models/contract-features.model';
import { MatchFeatureRequestModel } from '../../models/match-feature-request.model';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';

@Component({
    selector: 'app-match-feature',
    templateUrl: './match-feature.component.html',
    styleUrls: ['./match-feature.component.scss']
})
export class MatchFeatureComponent implements OnInit {
    @Input() contractId: string;
    @Output() cancelAction = new EventEmitter();
    @Output() success = new EventEmitter();
    @BlockUI('match-feature') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public contractFeatures: IContractFeaturesModel;
    public isComplete = false;
    private _viewInParam = [CONSTANTS.SHOW_CHARACTERISTICS.PURCHASE_ORDER, CONSTANTS.SHOW_CHARACTERISTICS.WEIGHT_NOTE]

    constructor(private _purchaseService: PurchaseOrdersService,
        private _i18nPipe: I18nPipe,
        private _notifier: NotifierService,
        private _alertService: AlertService,
        private _errorHandlerService: ResponseErrorHandlerService) { }

    ngOnInit() {
        this.getFeatures();
    }
    private getFeatures() {
        this.blockUI.start();
        this._purchaseService.getCharacteristics(this._viewInParam)
            .pipe(take(1))
            .subscribe(
                result => {
                    if (result) {
                        this.getContractCharacteristics(result);
                    }
                },
                (error: HttpErrorResponse) => {
                    this.blockUI.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'match-features')
                    );
                }
            );
    }
    private getContractCharacteristics(characteristics) {
        this._purchaseService.getContractsCharacteristics(this.contractId)
            .pipe(take(1))
            .subscribe(
                (result) => {
                    this.contractFeatures = new ContractFeaturesModel(result.data, characteristics);
                    this.buildSettingsSelected();
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'match-features')
                    );
                }
            );
    }
    private buildSettingsSelected() {
        this.contractFeatures.features.forEach(feature => {
            if (feature.idTransformationFeature) {
                this.isComplete = true;
                feature.selected = feature.availableFeatures.find(x => x.id == feature.idTransformationFeature);
                const notFeatureSelected = this.contractFeatures.features.filter(cf => cf.idTrumodityFeature !== feature.idTrumodityFeature);
                notFeatureSelected.forEach(notSelected => {
                    const currentFeature = notSelected.availableFeatures.find(af => af.id === feature.idTransformationFeature);
                    currentFeature.disabled = true;
                });
            }
        });
    }
    public setFeature(transformationfeature: WNCharacteristicModel, trumodityFeature: FeaturesModel) {
        trumodityFeature.selected = transformationfeature;
        trumodityFeature.idTransformationFeature = transformationfeature.id;
        this.contractFeatures.features.forEach(ft => {
            if (ft.idTrumodityFeature === trumodityFeature.idTrumodityFeature) {
                ft = trumodityFeature;
            } else {
                ft.availableFeatures.forEach(tf => {
                    if (tf.id === transformationfeature.id) {
                        tf.disabled = true;
                    } else {
                        tf.disabled = false;
                    }
                })
            }
            ft.availableFeatures = [...ft.availableFeatures];
        });
        this.isComplete = true;
        this.buildSettingsSelected();
    }

    public onEventMathFeature(action: any) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.CREATE:
                this.matchFeatures();
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL: {
                this.cancelAction.emit();
            }
        }
    }
    private matchFeatures() {
        this.blockUI.start();
        let matchModel: MatchFeatureRequestModel = new MatchFeatureRequestModel(this.contractFeatures);
        this._purchaseService.matchContractFeatures(matchModel)
            .pipe(take(1))
            .subscribe(
                () => {
                    this._notifier.notify('success', this._i18nPipe.transform('success-match-characteristics'));
                    this.blockUI.stop();
                    this.success.emit();
                },
                error => {
                    this.blockUI.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'match-features')
                    );
                }
            );
    }
}
