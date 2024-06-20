import { NotifierService } from 'angular-notifier';
import { ResizedEvent } from 'angular-resize-event';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { take, timeout } from 'rxjs/operators';
import { TBlockService } from 'src/app/routes/t-blocks/services/block.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { TIProducerModel, TProducerModel } from 'src/app/shared/models/sil-producer';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { removeAccents } from 'src/app/shared/utils/functions/remove-accents';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { WindowEventsService } from 'src/app/shared/window-events/window-events.service';
import { ThemeService } from 'src/theme/theme.service';

import { HttpErrorResponse } from '@angular/common/http';
import {
    Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { TBlockModel, TIBlockModel } from '../../../t-blocks/models/block.model';
import { TIFarmModel } from '../../../t-farms/models/farm.model';
import { ActionDataTypeEnum } from '../../models/action-data-type.enum';
import { ActionDataModel, IActionDataModel } from '../../models/action-data.model';
import { ActionsProducerTypeEnum } from '../../models/actions-producer-type.enum';
import { IAssociatesModel } from '../../models/associates.model';
import {
    IInputDataActionsProducerModel, InputDataActionsProducerModel
} from '../../models/input-data-actions-producer.model';
import {
    InternationalPhoneConfigurationEnum
} from '../../models/international-phones-configuration.enum';
import { IOutputDataActionsProducerModel } from '../../models/output-data-actions-producer.model';
import {
    IRequestProducerEditModel, RequestProducerEditModel
} from '../../models/request-producer-edit.model';
import { ProducersService } from '../../services/producer/producers.service';
import { ActionsModalComponent } from '../actions-modal/actions-modal.component';
import {
    ListViewRelatedProducersComponent
} from '../list-view-related-producers/list-view.component';

@Component({
    selector: 'app-producer-profile-related-data',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    @ViewChild('relatedProducersListView')
    relatedProducersListView: ListViewRelatedProducersComponent;
    @Input() producerId: number = null;
    @Input() isEditMode: boolean = false;
    @Input() action: number;
    @Input() set producerWasDeleted(value: boolean) {
        this.wasMadeChanges = value;

        if (value) {
            this.backToListViewProducers();
        }

        this._producerWasDeleted = value;
    }

    get producerWasDeleted(): boolean {
        return this._producerWasDeleted;
    }

    @Output() eventBackToListView: EventEmitter<boolean> = new EventEmitter();
    @Output()
    eventDeleteProducer: EventEmitter<TIProducerModel> = new EventEmitter();

    public producer: TProducerModel = new TProducerModel();
    public templateBlockModalUiComponent: BlockModalUiComponent =
        BlockModalUiComponent;
    public selectionTab: ActionDataTypeEnum = ActionDataTypeEnum.Farms;
    public inputDataEditProducer: IInputDataActionsProducerModel = null;
    public isDarkTheme: boolean = false;
    public showingEdition: boolean = false;
    public isDisabledBtnSaveEditProducer: boolean = true;
    public isFooterEditMobile: boolean = false;
    public InternationalPhoneConfiguration: any =
        InternationalPhoneConfigurationEnum;
    public search = '';
    public farms: Array<TIFarmModel> = [];
    public blocks: Array<TIBlockModel> = [];
    public associates: Array<IAssociatesModel> = [];
    public actionDataTypeEnum: any = ActionDataTypeEnum;
    public isInputSearchFocused: boolean = false;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;

    public mainHeaderStyle: {
        button: any;
    } = {
        button: {},
    };

    public headerRelationStyle: {
        tabsContainer: any;
        actionsContainer: any;
        tabContainer: any;
    } = {
        tabsContainer: {},
        actionsContainer: {},
        tabContainer: {},
    };

    private _subscription: Subscription = new Subscription();
    private wasMadeChanges: boolean = false;
    private outputDataEditProducer: IOutputDataActionsProducerModel = null;
    private _producerWasDeleted: boolean = false;
    private dialogRef: MatDialogRef<ActionsModalComponent, any> = null;
    private dialogMaxWidth: number = 740;
    private dialogWidth: number = 0;

    @BlockUI('panel-producers-profile') blockUIPanel: NgBlockUI;

    constructor(
        private _themeService: ThemeService,
        private producerService: ProducersService,
        public dialog: MatDialog,
        private _alertService: AlertService,
        private _i18nPipe: I18nPipe,
        private _notifierService: NotifierService,
        private _responseErrorHandlerService: ResponseErrorHandlerService,
        private _windowEventsService: WindowEventsService,
        private _blockService: TBlockService
    ) {
        this._subscription.add(
            this._themeService.theme.subscribe((theme) => {
                this.isDarkTheme = 'dark' === theme;
            })
        );

        this._subscription.add(
            this._windowEventsService.onResizeEvent.subscribe((event: any) => {
                let widthDocument: number =
                    document.documentElement.clientWidth;

                let margin: number = widthDocument < 500 ? 60 : 120;

                this.dialogWidth =
                    widthDocument < this.dialogMaxWidth + margin
                        ? widthDocument - margin
                        : this.dialogMaxWidth;

                if (null != this.dialogRef) {
                    this.dialogRef.updateSize(this.dialogWidth + 'px');
                }
            })
        );
    }

    ngOnInit(): void {
        this.showingEdition = this.isEditMode;
        this.fetchProducer(true);
    }

    public fetchProducer(onInit: boolean): void {
        this.blockUIPanel.start();
        this._subscription.add(
            this.producerService.fetchProducer(this.producerId).subscribe(
                (response: TProducerModel) => {
                    this.search = '';
                    this.producer = response;
                    this.farms = [...this.producer.farms];
                    this.blocks = [...this.producer.allBlocks];
                    this.associates = [...this.producer.associates];
                    this.blockUIPanel.stop();

                    if (onInit && this.isEditMode) {
                        this.showEditProducerView();
                    }
                },
                (error) => {
                    this.showingEdition = false;
                    this.blockUIPanel.stop();
                    this._alertService.error(
                        this._i18nPipe.transform('error-ocurred')
                    );
                }
            )
        );
    }

    public addFarm(): void {
        let actionDialogData: IActionDataModel = new ActionDataModel({
            action: ActionDataTypeEnum.Farms,
            isEdit: false,
            producer: this.producer,
            allowedBlocks: [...this.producer.blocksWithoutFarm],
        });

        this.openDialog(actionDialogData);
    }

    public addBlock(): void {
       this.showAddBlockModal();
    }

    public showAddBlockModal(foundBlocks?: TBlockModel[]): void {
        let actionDialogData: IActionDataModel = new ActionDataModel({
            action: ActionDataTypeEnum.Blocks,
            isEdit: false,
            producerId: this.producer.id,
            producer: this.producer,
            blocks: foundBlocks ?? [],
        });

        this.openDialog(actionDialogData);
    }

    public linkProducers(): void {
        let actionDialogData: IActionDataModel = new ActionDataModel({
            action: ActionDataTypeEnum.Associates,
            isEdit: false,
            producerId: this.producer.id,
        });

        this.openDialog(actionDialogData);
    }

    public onEditFarm(farm: TIFarmModel): void {
        let actionDialogData: IActionDataModel = new ActionDataModel({
            action: ActionDataTypeEnum.Farms,
            isEdit: true,
            producerId: this.producer.id,
            producer: this.producer,
            farm: farm,
            allowedBlocks: [
                ...this.producer.blocksWithoutFarm.concat(farm.blocks),
            ],
        });
        this.openDialog(actionDialogData);
    }
    public onShowDetails(farm: TIFarmModel): void {
        let actionDialogData: IActionDataModel = new ActionDataModel({
            action: ActionDataTypeEnum.Farms,
            isEdit: true,
            producerId: this.producer.id,
            producer: this.producer,
            farm: farm,
            isReadOnly: true,
            allowedBlocks: [
                ...this.producer.blocksWithoutFarm.concat(farm.blocks),
            ],
        });
        this.openDialog(actionDialogData);
    }

    public onViewBlock(block: TIBlockModel) {
        let actionDialogData: IActionDataModel = new ActionDataModel({
            action: ActionDataTypeEnum.Blocks,
            isEdit: true,
            producerId: this.producer.id,
            blocks: [block],
            isReadOnly: true,
            producer: this.producer,
        });
        this.openDialog(actionDialogData);
    }

    public onEditBlock(block: TIBlockModel): void {
        let actionDialogData: IActionDataModel = new ActionDataModel({
            action: ActionDataTypeEnum.Blocks,
            isEdit: true,
            producerId: this.producer.id,
            producer: this.producer,
            blocks: [block],
        });
        this.openDialog(actionDialogData);
    }

    public openDialog(data: IActionDataModel) {
        this.dialogRef = this.dialog.open(ActionsModalComponent, {
            autoFocus: false,
            disableClose: true,
            height: 'auto',
            width: this.dialogWidth + 'px',
            maxWidth: this.dialogMaxWidth + 'px',
            data: data,
        });

        this._subscription.add(
            this.dialogRef.afterClosed().subscribe((response) => {
                this.dialogRef = null;

                if (response.refresh) {
                    this.wasMadeChanges = true;

                    this.fetchProducer(false);
                }
            })
        );
    }

    public backToListViewProducers(): void {
        this.eventBackToListView.emit(this.wasMadeChanges);
    }

    public showEditProducerView(): void {
        this.inputDataEditProducer = new InputDataActionsProducerModel({
            actionType: ActionsProducerTypeEnum.Edit,
            producer: this.producer,
            index: 0,
        });
        this.showingEdition = true;
    }

    public eventChangeDataEditProductor(
        stateProducerEdited: IOutputDataActionsProducerModel
    ): void {
        this.outputDataEditProducer = stateProducerEdited;

        this.isDisabledBtnSaveEditProducer =
            !stateProducerEdited.isValid ||
            !stateProducerEdited.dataWasModified;
    }

    public saveProducerEdit(): void {
        this.blockUIPanel.start();

        this.isDisabledBtnSaveEditProducer = true;

        let requestData: IRequestProducerEditModel =
            new RequestProducerEditModel(this.outputDataEditProducer.producer);

        this._subscription.add(
            this.producerService.updateProducer(requestData).subscribe(
                (response: any) => {
                    let newData: TIProducerModel = new TProducerModel(
                        response.data.data[0]
                    );

                    this.producer.name = newData.name;
                    this.producer.paternalLast = newData.paternalLast;
                    this.producer.maternalLast = newData.maternalLast;
                    this.producer.phone = newData.phone;
                    this.producer.phoneCountry = newData.phoneCountry;

                    this.isDisabledBtnSaveEditProducer = false;

                    this.wasMadeChanges = true;

                    this.hideProducerEditView();

                    this.blockUIPanel.stop();

                    this._notifierService.notify(
                        'success',
                        this._i18nPipe.transform('t-success-edited-producer')
                    );
                },
                (error: HttpErrorResponse) => {
                    let message: string =
                        this._responseErrorHandlerService.handleError(
                            error,
                            't-producer'
                        );
                    this._alertService.error(message);
                    this.isDisabledBtnSaveEditProducer = false;
                    this.blockUIPanel.stop();
                }
            )
        );
    }

    public onClearSearchInput(): void {
        this.search = '';

        this.searchFilter();
    }

    public searchFilter() {
        const search = removeAccents(this.search.toLowerCase().trim());
        if (search !== '') {
            switch (this.selectionTab) {
                case ActionDataTypeEnum.Farms:
                    this.farms = this.producer.farms.filter((farm) => {
                        return removeAccents(farm.name.toLowerCase()).includes(
                            search
                        );
                    });
                    break;
                case ActionDataTypeEnum.Blocks:
                    this.blocks = this.producer.allBlocks.filter((block) => {
                        return (
                            removeAccents(block.name ? block.name.toLowerCase() : '').includes(
                                search
                            ) ||
                            removeAccents(block.farmName ? block.farmName.toLowerCase() : ''
                            ).includes(search) ||
                            removeAccents(block.varietyName ?
                                block.varietyName.toLowerCase() : ''
                            ).includes(search)
                        );
                    });
                    break;
                case ActionDataTypeEnum.Associates:
                    this.associates =
                        this.relatedProducersListView?.onSearch(search);
                    break;
            }
        } else {
            this.farms = [...this.producer.farms];
            this.blocks = [...this.producer.allBlocks];
            this.associates = [...this.producer.associates];
        }
    }

    public onDeleteFarm() {
        this.wasMadeChanges = true;
        this.fetchProducer(false);
    }

    public onDeleteBlock() {
        this.wasMadeChanges = true;
        this.fetchProducer(false);
    }

    public onDeleteRelation() {
        this.wasMadeChanges = true;
        this.fetchProducer(false);
    }

    public hideProducerEditView(): void {
        this.showingEdition = false;
        this.inputDataEditProducer = null;
        this.outputDataEditProducer = null;
        this.isDisabledBtnSaveEditProducer = true;
    }

    public submitDelete(): void {
        this.eventDeleteProducer.emit(this.producer);
    }

    public onResizeProfilePanel(event: ResizedEvent): void {
        this.isFooterEditMobile = event.newWidth < 530;

        if (event.newWidth < 389) {
            this.mainHeaderStyle.button = {
                width: '100%',
                margin: '6px 0 0 0',
            };
        } else {
            this.mainHeaderStyle.button = { width: '80px', margin: '0' };
        }
    }

    public onSelectTab(tab: ActionDataTypeEnum): void {
        this.selectionTab = tab;
    }

    public onResizeRelationHeader(event: ResizedEvent): void {
        if (event.newWidth < 480) {
            this.headerRelationStyle = {
                tabsContainer: { width: '100%', padding: 0 },
                actionsContainer: { width: '100%', margin: '20px 0 0 0' },
                tabContainer: { width: '100%', margin: '0 0 16px 0' },
            };
        } else if (event.newWidth < 1055) {
            this.headerRelationStyle = {
                tabsContainer: { width: '100%', padding: 0 },
                actionsContainer: { width: '100%', margin: '20px 0 0 0' },
                tabContainer: { width: 'auto', margin: '0 30px 0 0' },
            };
        } else {
            this.headerRelationStyle = {
                tabsContainer: { width: '50%' },
                actionsContainer: { width: '50%' },
                tabContainer: { width: 'auto', margin: '0 30px 0 0' },
            };
        }
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
