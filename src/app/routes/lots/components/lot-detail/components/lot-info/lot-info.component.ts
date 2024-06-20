import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { map, take, takeUntil } from 'rxjs/operators';
import { WorkflowService } from 'src/app/routes/workflow/services/workflow.service';
import { ITRConfiguration } from 'src/app/shared/utils/models/configuration.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { LotListWeightNoteGrouper } from '../../../../models/lot-list-weight-note-grouper.model';
import { KanbanService } from 'src/app/routes/kanban/services/kanban.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ILotProcessModel, LotProcessModel } from 'src/app/routes/lots/models/lot-process.model';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LotsService } from '../../../../services/lots.service';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';

@Component({
    selector: 'app-lot-info',
    templateUrl: './lot-info.component.html',
    styleUrls: ['./lot-info.component.scss'],
})
export class LotInfoComponent implements OnInit, OnDestroy {
    @BlockUI() blockUI: NgBlockUI;
    @Input() lot: LotListWeightNoteGrouper;
    @Input() isFromKanban: boolean = false;
    @Input() configuration: ITRConfiguration;
    @Input() isFromTransition = false;
    @Input() canEdit = true;
    @Output() change = new EventEmitter<LotListWeightNoteGrouper>();
    public processes: ILotProcessModel[] = [];
    public currentProcessId: string;
    public catationList = [];
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private idLote;
    readonly DECIMAL_DIGITS: number = JSON.parse(localStorage.getItem('decimals')).general;
    readonly CONSTANTS = CONSTANTS;

    constructor(
        private router: Router,
        private _dialog: MatDialog,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _kanbanService: KanbanService,
        private _workflowService: WorkflowService,
        private _notifierService: NotifierService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _lotService: LotsService,
        private _Activatedroute: ActivatedRoute,
        private _permissionsService : PermissionsService
    ) {

        this._Activatedroute.paramMap.subscribe(params => {
            this.idLote = params.get('id')
        });
    }

    ngOnInit() {
        this.getReportProcessingOrder(this.idLote)
        if (this.lot) {
            this.currentProcessId = this.lot.processId;
            this.loadProcessList(this.lot.workflowId);
        }
    }

    private async getReportProcessingOrder(transitionId: string) {
        try {
            let result = await this._lotService.getCatacionDetail(transitionId);
            this.catationList = result.data.sort((a, b) => (a.folio - b.folio))
        } catch (error) {
            const message = this._errorHandlerService.handleError(error, 'kanban').replace('value', this.lot.folio);
            this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
            this.blockUI.stop()
        }
    }

    private loadProcessList(id: string) {
        this._workflowService
            .getWorkflowProcesses(id)
            .pipe(
                take(1),
                map(
                    (r: any) => {
                        return r.map((d: any) => new LotProcessModel(d, false))
                    }
                ),
            )
            .subscribe((processes: ILotProcessModel[]) => {
                processes.push(new LotProcessModel({
                    processId: 'pending_process',
                    processName: 'kanban-dashboard-process-pending',
                    style: '#70889E',
                    level: -1,
                }, false))
                const currentProcessLevel = this.lot.processId ? processes.find((v) => v.id === this.lot.processId).level : -1;
                this.processes = processes.filter((p) => p.level == currentProcessLevel || p.level == currentProcessLevel + 1).map(p => {
                    return { ...p, disabled: p.level <= currentProcessLevel }
                });
            });
    }

    public onProcessChange(item: { name: string; id: string; color: string }) {
        const newProcess = this.processes.find((p) => p.id === item.id);
        this.lot.processId = newProcess.id;
        this.lot.processColor = newProcess.color;
        this.lot.process = newProcess.name;
        this.router.navigateByUrl(
            `/routes/kanban/transition/${this.lot.id}?isFromDetail=true&isFromKanban=${this.isFromKanban}&processId=${this.lot.processId}&isEdit=false`
        );
    }

    public finalizeLot(): void {
        this.router.navigateByUrl(`/routes/kanban/transition/${this.lot.id}?isFromDetail=false&isFromKanban=true&isEdit=false&commodity=${this.lot.commodityId}`);
    }

    get canTransition(){
        return this._permissionsService.checkValidity( this.PERMISSIONS.LOT_REPROCESS, this.PERMISSION_TYPES.UPDATE)
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
