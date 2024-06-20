import { LotsService } from './../../services/lots.service';
import { LotComponentsFlowCreateModel, LotFlowCreateLotEnum } from './../../models/lot-components-flow-create.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ILotWeignotesModel } from '../../models/lot-weignotes.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelModalComponent } from '../confirm-cancel-modal/confirm-cancel-modal.component';

@Component({
    selector: 'app-lot-create',
    templateUrl: './lot-create.component.html',
    styleUrls: ['./lot-create.component.scss'],
})
export class LotCreateComponent {
    @BlockUI('lot-create-wrapper') blockUIWrapper: NgBlockUI;

    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public selectedTabIndex: number = 0;
    public isEnabledNotesSelectionTab: boolean = false;
    public urlBackToList: string = '/weight-note';
    public filterStatus: ILotWeignotesModel;
    public createNew: boolean = false;
    public weighNotes: ILotWeignotesModel;
    public isNext: boolean = true;
    public isComplete: boolean = false;
    public queryParams: any = {}
    public currentComponet: LotComponentsFlowCreateModel = {
        component: LotFlowCreateLotEnum.filtersComponent,
        nextComponent: LotFlowCreateLotEnum.flowProductionComponent,
        prevComponent: LotFlowCreateLotEnum.initialComponent,
        haveNextStep: true,
        haveBackButton: false
    }
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _lotService: LotsService,
        private _dialog: MatDialog
    ) {
        let params: any = this._activatedRoute.snapshot.queryParams;
        if ('true' == params?.isFromLotList) {
            this.urlBackToList = '/routes/weight-note?tab=lots';
        }
        if ('true' == params?.isFromWorkflow) {
            this.selectedTabIndex = 1;
        }
        if ('true' == params?.isFromNoteList) {
            this.urlBackToList+='?production='+( params.production ?? 'false')
            this.queryParams = { isFromNoteList : true,  production: ( params.production ?? 'false')}
        }
    }
    /**
     * Navigate to before list view
     */
    public onBackToList(): void {
        this._router.navigateByUrl(this.urlBackToList);
    }

    /**
     * On change validation status of the results filter component
     * @param isValid status
     */
    public onEventFormFilterStatusChange(filters: {
        isValid: boolean;
        data: ILotWeignotesModel;
    }): void {
        this.isEnabledNotesSelectionTab = filters.isValid;
        this.filterStatus = filters.data;
        this.isComplete = filters.isValid;
    }

    public onEventActionSelected(action: number): void {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.NEXT:
                this.isComplete = false;
                this.callNextComponent();
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL:
                if (this.currentComponet.component === LotFlowCreateLotEnum.createLotComponent) {
                    this.cancelCreation();
                } else {
                    if(this.queryParams?.isFromNoteList){
                        this._router.navigate(['/routes/weight-note'],{ queryParams :this.queryParams});
                    }else
                        this._router.navigateByUrl('/routes/weight-note?tab=lots');
                }
                break;
            case CONSTANTS.CRUD_ACTION.CREATE:
                this._lotService.callFunctionCreateLot(true);
                break;
        }
    }
    private cancelCreation() {
        this._dialog.open(ConfirmCancelModalComponent, {
            autoFocus: false,
            disableClose: true,
        });
    }
    private callNextComponent(): void {
        let newComponent: LotComponentsFlowCreateModel = {
            component: this.currentComponet.nextComponent,
            prevComponent: this.currentComponet.component,
            haveNextStep: true,
            haveBackButton: true
        }
        switch (this.currentComponet.component) {
            case LotFlowCreateLotEnum.filtersComponent:
                newComponent.nextComponent = LotFlowCreateLotEnum.createLotComponent;
                this.selectedTabIndex = 1;
                break;
            case LotFlowCreateLotEnum.flowProductionComponent:
                newComponent.nextComponent = LotFlowCreateLotEnum.createLotComponent;
                newComponent.haveNextStep = false;
                this.createNew = true;
                this.isComplete = true;
                break;
            case LotFlowCreateLotEnum.createLotComponent:
                newComponent.haveNextStep = false
                break;
        }
        this.currentComponet = newComponent;
    }

    public onBackEvent() {
        let newComponent: LotComponentsFlowCreateModel = {
            component: this.currentComponet.prevComponent,
            nextComponent: this.currentComponet.component,
            haveNextStep: true,
            haveBackButton: true
        }
        switch (this.currentComponet.component) {
            case LotFlowCreateLotEnum.flowProductionComponent:
                newComponent.prevComponent = LotFlowCreateLotEnum.initialComponent;
                this.selectedTabIndex = 0;
                this.isComplete = true;
                break;
            case LotFlowCreateLotEnum.createLotComponent:
                newComponent.prevComponent = LotFlowCreateLotEnum.filtersComponent;
                this.selectedTabIndex = 1;
                this.createNew = false;
                break;
        }
        this.currentComponet = newComponent;
    }

    public onTabClick(tab: any): void {
        this.selectedTabIndex = tab.index;
        if (this.selectedTabIndex === 0) {
            this.isComplete = true;
            this.currentComponet.component = LotFlowCreateLotEnum.filtersComponent;
            this.currentComponet.nextComponent = LotFlowCreateLotEnum.flowProductionComponent;
            this.currentComponet.haveBackButton = false;
            this.currentComponet.haveNextStep = true;
        } else {
            this.currentComponet.component = LotFlowCreateLotEnum.flowProductionComponent;
            this.currentComponet.nextComponent = LotFlowCreateLotEnum.createLotComponent;
            this.currentComponet.prevComponent = LotFlowCreateLotEnum.filtersComponent;
            this.currentComponet.haveNextStep = true;
            this.currentComponet.haveBackButton = true;
        }
    }

    public onEventBackTab(): void {
        this.selectedTabIndex = 0;
    }

    public onEventCreateNewLot(weighNotes: ILotWeignotesModel): void {
        this.weighNotes = weighNotes;
        this.isComplete = true;
    }

    public onEventbackToList() {
        this.createNew = false;
    }
}
