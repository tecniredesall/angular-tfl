import { NotifierService } from 'angular-notifier';
import { ResizedEvent } from 'angular-resize-event';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { forkJoin, Subscription } from 'rxjs';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { TIProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { deepCompareIsEqual } from 'src/app/shared/utils/functions/object-compare';
import { convertStringToNumber } from 'src/app/shared/utils/functions/string-to-number';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ThemeService } from 'src/theme/theme.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { HttpErrorResponse } from '@angular/common/http';
import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { VarietyService } from '../../../t-blocks/services/variety.service';
import { TIFarmModel } from '../../../t-farms/models/farm.model';
import { FarmService } from '../../../t-farms/services/farm.service';
import { TBlockModel, TIBlockModel } from '../../models/block.model';
import {
    DataActionsBlockModel, IDataActionsBlockModel
} from '../../models/data-actions-block.model';
import { IInputDataActionsBlockModel } from '../../models/input-data-actions-block.model';
import {
    TIRequestCreateBlockModel, TRequestCreateBlockModel
} from '../../models/request-create-block.model';
import {
    TIRequestEditBlockModel, TRequestEditBlockModel
} from '../../models/request-edit-block.model';
import { TIVarietyModel } from '../../models/variety.model';
import { TBlockService } from '../../services/block.service';
import { ModalDeleteBlockComponent } from '../modal-delete-block/modal-delete-block.component';

@Component({
    selector: 'app-actions-block',
    templateUrl: './actions-block.component.html',
    styleUrls: ['./actions-block.component.scss'],
})
export class ActionsBlockComponent implements OnChanges, OnDestroy {
    @Input() data: IInputDataActionsBlockModel = null;
    @Input() isMultiple = true;
    @Input() isFromWeightNote = false;
    @Output() eventCancel: EventEmitter<boolean> = new EventEmitter();
    @Output() eventRefresh = new EventEmitter();
    @BlockUI('action-block-container') blockUI: NgBlockUI;

    public ALPHANUMERIC_REGEXP: RegExp = CONSTANTS.ALPHANUMERIC_REGEXP;
    public MAX_LENGTH_BLOCK_NAME: number = CONSTANTS.MAX_LENGTH_BLOCK_NAME;
    public actionData: Array<IDataActionsBlockModel>;
    public dataWasMadeModified: boolean;
    public isVisibletextButtonDelete: boolean;
    public style: {
        containerButtonSubmit: {
            width: string;
            padding: string;
            margin: string;
        };
        containerButtonCancel: {
            width: string;
            padding: string;
            margin: string;
        };
        containerButtonDelete: {
            width: string;
            padding: string;
            margin: string;
        };
    };
    public producers: {
        isLoading: boolean;
        data: Array<TIProducerModel>;
    };
    public farms: {
        isLoading: boolean;
        data: Array<TIFarmModel>;
    };
    public varieties: {
        isLoading: boolean;
        data: Array<TIVarietyModel>;
    };
    public duplicates = [];
    public heightNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 13,
        requireDecimal: false,
        allowNegative: true,
        allowLeadingZeroes: false,
    });
    public extensionNumberMask: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 13,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false,
    });
    public isDarkTheme: boolean;
    private _subscription: Subscription = new Subscription();
    private idxItem: number;
    private dialogRef: MatDialogRef<ModalDeleteBlockComponent, any>;

    constructor(
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _themeService: ThemeService,
        private _farmsService: FarmService,
        private _varietyService: VarietyService,
        private _responseErrorHandlerService: ResponseErrorHandlerService,
        private _blockService: TBlockService,
        private _notifierService: NotifierService,
        public _dialog: MatDialog
    ) {
        this._subscription.add(
            this._themeService.theme.subscribe((theme) => {
                this.isDarkTheme = 'dark' === theme;
            })
        );
        this.initializeValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('data') && this.data) {
            this.initializeValues();
            this.data.block.forEach((b: TIBlockModel) => {
                this.actionData.push(
                    new DataActionsBlockModel({
                        originalBlock: b,
                        currentBlock: b,
                        index: this.idxItem,
                    })
                );
                this.idxItem++;
            });
            this.getCatalogues();
        }
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public eventChangeFormData(): void {
        if (this.data.isEdit) {
            const originalBlock: TIBlockModel = new TBlockModel(
                this.actionData[0].originalBlock
            );
            delete originalBlock.farmName;
            delete originalBlock.varietyName;
            const currentBlock: TIBlockModel = new TBlockModel(
                this.actionData[0].currentBlock
            );
            delete currentBlock.farmName;
            delete currentBlock.varietyName;
            if (null != currentBlock.height) {
                currentBlock.height =
                    '' === currentBlock.height.toString()
                        ? null
                        : convertStringToNumber(currentBlock.height.toString());
            }
            if (null != currentBlock.extension) {
                currentBlock.extension =
                    '' === currentBlock.extension.toString()
                        ? null
                        : convertStringToNumber(
                              currentBlock.extension.toString()
                          );
            }
            this.dataWasMadeModified = !deepCompareIsEqual(
                originalBlock,
                currentBlock
            );
        } else {
            this.duplicates = this.checkDuplicates();
        }
    }

    private checkDuplicates() {
        return this.actionData
            .map((v, i) =>
                this.actionData.find(
                    (d, y) =>
                        d.currentBlock.name === v.currentBlock.name && i !== y
                )
            )
            .filter((v) => !!v)
            .map((v, i) => i);
    }

    public addBlockItem(): void {
        if (!this.data.isEdit) {
            const item: IDataActionsBlockModel = new DataActionsBlockModel();
            item.index = this.idxItem;
            if (!this.data.isFromBlockModule) {
                item.originalBlock.seller = this.data.producerId;
                item.currentBlock.seller = this.data.producerId;
            }
            this.idxItem++;
            this.actionData.push(item);
        }
    }

    public removeBlockItem(item: IDataActionsBlockModel): void {
        const idxItem = this.actionData.findIndex(
            (b: IDataActionsBlockModel) => b.index === item.index
        );
        if (idxItem > -1) {
            this.actionData.splice(idxItem, 1);
        }
        this.duplicates = this.checkDuplicates();
    }

    public cancel(): void {
        this.eventCancel.emit(true);
    }

    public delete(): void {
        if (this.data.isEdit) {
            this.dialogRef = this._dialog.open(ModalDeleteBlockComponent, {
                autoFocus: false,
                disableClose: true,
                data: this.actionData[0].originalBlock,
            });
            this._subscription.add(
                this.dialogRef.afterClosed().subscribe((response) => {
                    this.dialogRef = null;
                    if (response.refresh) {
                        this.eventRefresh.emit();
                    }
                })
            );
        }
    }

    public submit(): void {
        this.blockUI.start();
        if (this.data.isEdit) {
            this.submitEditBlock();
        } else {
            this.submitCreateBlock();
        }
    }

    public getCatalogues(): void {
        if (
            this.data.isEdit ||
            (!this.data.isEdit && this.data.isFromBlockModule)
        ) {
            this.blockUI.start();
        }
        this._subscription.add(
            forkJoin([
                this._farmsService.getFarmsByProducer(this.data.producerId),
                this._varietyService.fetchVariety(),
            ]).subscribe(
                ([farms, varieties]) => {
                    this.farms = {
                        isLoading: false,
                        data: farms,
                    };

                    this.varieties = {
                        isLoading: false,
                        data: varieties,
                    };

                    if (
                        this.data.isEdit ||
                        (!this.data.isEdit && this.data.isFromBlockModule)
                    ) {
                        this.blockUI.stop();
                    }
                },
                (error: HttpErrorResponse) => {
                    this.farms = {
                        isLoading: false,
                        data: [],
                    };
                    this.varieties = {
                        isLoading: false,
                        data: [],
                    };
                    const message: string = this._responseErrorHandlerService.handleError(
                        error,
                        't-blocks'
                    );
                    this._alertService.error(message);
                    if (
                        this.data.isEdit ||
                        (!this.data.isEdit && this.data.isFromBlockModule)
                    ) {
                        this.blockUI.stop();
                    }
                }
            )
        );
    }

    public handleResponsive(event: ResizedEvent): void {
        if (event.newWidth < 275) {
            this.style.containerButtonSubmit = {
                width: '100%',
                padding: '0',
                margin: '0 0 16px 0',
            };
            this.style.containerButtonCancel = {
                width: '100%',
                padding: '0',
                margin: '0',
            };
            this.style.containerButtonDelete = {
                width: '100%',
                padding: '0',
                margin: '0 0 16px 0',
            };
            this.isVisibletextButtonDelete = true;
        } else if (event.newWidth < 430) {
            this.style.containerButtonSubmit = {
                width: 'auto',
                padding: '0',
                margin: '0',
            };
            this.style.containerButtonCancel = {
                width: 'auto',
                padding: '0 16px',
                margin: '0',
            };
            this.style.containerButtonDelete = {
                width: '40px',
                padding: '0',
                margin: '0',
            };
            this.isVisibletextButtonDelete = false;
        } else if (event.newWidth < 488) {
            this.style.containerButtonSubmit = {
                width: '160px',
                padding: '0',
                margin: '0',
            };
            this.style.containerButtonCancel = {
                width: '192px',
                padding: '0 16px',
                margin: '0',
            };
            this.style.containerButtonDelete = {
                width: '40px',
                padding: '0',
                margin: '0',
            };
            this.isVisibletextButtonDelete = false;
        } else {
            this.style.containerButtonSubmit = {
                width: '160px',
                padding: '0',
                margin: '0',
            };
            this.style.containerButtonCancel = {
                width: '176px',
                padding: '0 16px 0 0',
                margin: '0',
            };
            this.style.containerButtonDelete = {
                width: 'auto',
                padding: '0 16px 0 0',
                margin: '0',
            };
            this.isVisibletextButtonDelete = true;
        }
    }

    private submitEditBlock(): void {
        const requestData: TIRequestEditBlockModel = new TRequestEditBlockModel(
            this.actionData[0].currentBlock
        );
        this._subscription.add(
            this._blockService.editBlock(requestData).subscribe(
                (response: any) => {
                    this._notifierService.notify(
                        'success',
                        this._i18nPipe.transform('t-success-block-edited')
                    );
                    this.blockUI.stop();
                    this.eventRefresh.emit();
                },
                (error: HttpErrorResponse) => {
                    const message = this._responseErrorHandlerService.handleError(
                        error,
                        't-blocks'
                    );
                    this.blockUI.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            )
        );
    }

    private submitCreateBlock(): void {
        const requestData: Array<TIRequestCreateBlockModel> = [];
        this.actionData.forEach((item: IDataActionsBlockModel) => {
            requestData.push(new TRequestCreateBlockModel(item));
        });
        this._subscription.add(
            this._blockService.createBlock({ items: requestData }).subscribe(
                (response: any) => {
                    const msg =
                        requestData.length > 1
                            ? 't-success-blocks-created'
                            : 't-success-block-created';
                    this._notifierService.notify(
                        'success',
                        this._i18nPipe.transform(msg)
                    );
                    this.blockUI.stop();
                    this.eventRefresh.emit(response.data[0]);
                },
                (error: HttpErrorResponse) => {
                    const message = this._responseErrorHandlerService.handleError(
                        error,
                        't-blocks'
                    );
                    this.blockUI.stop();
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }
            )
        );
    }

    private initializeValues(): void {
        this.actionData = [];
        this.dataWasMadeModified = false;
        this.isVisibletextButtonDelete = false;
        this.style = {
            containerButtonSubmit: { width: '0', padding: '0', margin: '0' },
            containerButtonCancel: { width: '0', padding: '0', margin: '0' },
            containerButtonDelete: { width: '0', padding: '0', margin: '0' },
        };
        this.producers = {
            isLoading: true,
            data: [],
        };
        this.farms = {
            isLoading: true,
            data: [],
        };
        this.varieties = {
            isLoading: true,
            data: [],
        };
        this.idxItem = 0;
        this.dialogRef = null;
    }
}
