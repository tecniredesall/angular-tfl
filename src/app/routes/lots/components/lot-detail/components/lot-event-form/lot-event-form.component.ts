import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import {
    LotListWeightNoteGrouper
} from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { LotEventsService } from 'src/app/routes/lots/services/lot-events/lot-events.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { PaginationModel } from 'src/app/shared/utils/models/paginator.model';

import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-lot-event-form',
    templateUrl: './lot-event-form.component.html',
    styleUrls: ['./lot-event-form.component.scss'],
})
export class LotEventFormComponent implements OnInit, OnDestroy, OnChanges {
    @BlockUI('hello') blockUI: NgBlockUI;
    @Output() reloadLot = new EventEmitter();
    @Input() lot: LotListWeightNoteGrouper;
    @Input() canEdit: boolean = true;

    public form: UntypedFormGroup;
    public events: Array<any> = [];
    public pagination: PaginationModel;
    private destroy$ = new Subject();
    public pageLoading = false;
    public readonly PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public readonly PERMISSIONS = CONSTANTS.PERMISSIONS;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private lotEventService: LotEventsService,
        private _i18n: I18nPipe,
        private _alert: AlertService,
        private paginationService: PaginationService
    ) { }

    ngOnInit() {
        this.paginationService.pagination$
            .pipe(
                takeUntil(this.destroy$),
                filter((p) => !!p)
            )
            .subscribe((p) => (this.pagination = p));
        this.setForm(this.lot);
        this.loadLotEvents(this.lot.id)
            .pipe(take(1))
            .subscribe(
                (p) => {
                    this.blockUI.stop();
                    this.events = p;
                },
                () => {
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.paginationService.clearPagination();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.lot && !changes.lot.isFirstChange()) {
            this.lot = changes.lot.currentValue;
            this.setForm(this.lot);
        }
    }

    public setForm(lot: LotListWeightNoteGrouper) {
        this.form = this.formBuilder.group({
            lotId: lot.id,
            damage: [
                {
                    value: lot.damage,
                    disabled: lot.damage || !this.canEdit,
                },
            ],
            note: [
                { value: '', disabled: !this.canEdit },
                [Validators.required, Validators.maxLength(150), Validators.pattern(CONSTANTS.NO_BLANK_START)],
            ],
        });
    }

    public loadLotEvents(id: string) {
        return this.lotEventService.getLotEvents(id);
    }

    public onLoadNextPage(page: string) {
        this.pageLoading = true;
        this.lotEventService
            .getLotEvents(this.lot.id, page)
            .pipe(take(1))
            .subscribe(
                (p) => {
                    this.events = [...this.events, ...p];
                    this.pageLoading = false;
                },
                () => (this.pageLoading = false)
            );
    }

    public onPostEvent() {
        const event = {
            lot_id: this.form.get('lotId').value,
            damage: this.form.get('damage').value,
            note: this.form.get('note').value,
        };

        if (event.damage !== true) delete event.damage;

        this.blockUI.start();
        this.lotEventService
            .postLotEvent(event)
            .pipe(
                take(1),
                switchMap(() => this.loadLotEvents(this.lot.id))
            )
            .subscribe(
                (p) => {
                    this.blockUI.stop();
                    this.events = p;
                    this.form = null;
                    this.reloadLot.emit(true);
                },
                () => {
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }

    public onDeleteEvent(id: string) {
        this.blockUI.start();
        this.lotEventService
            .deleteLotEvent(id)
            .pipe(
                take(1),
                switchMap(() => this.loadLotEvents(this.lot.id))
            )
            .subscribe(
                (p) => {
                    this.blockUI.stop();
                    this.events = p;
                    this.reloadLot.emit(true);
                },
                () => {
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }
}
