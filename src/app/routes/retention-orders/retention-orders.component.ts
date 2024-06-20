import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { WeightService } from '../weight-note/services/weight.service';
import { RetentionOrdersService } from './services/retention-orders.service';

@Component({
  selector: 'sst-retention-orders',
  templateUrl: './retention-orders.component.html',
  styleUrls: ['./retention-orders.component.scss']
})
export class RetentionOrdersComponent implements OnInit ,AfterViewInit  {
    @BlockUI('weight-note-lots-layout') blockUI: NgBlockUI;

    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public searchText: string;
    public isOpen: boolean = false;
    public params = {};
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public isOpenFilter: boolean = false;
    public countFilter: number = 0;
    public isProductionNote: boolean = false;
    readonly RECEIVING_NOTE_STATUS: any = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly WEIGHT_NOTE_STATUS: any = CONSTANTS.WEIGHT_NOTE_STATUS;
    readonly RECEIVING_NOTE_PRODUCTION_STATUS: any = CONSTANTS.RECEIVING_NOTE_PRODUCTION_STATUS;
    readonly RETENTION_ORDER_STATUS: any = CONSTANTS.RETENTION_ORDER_STATUS;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _weightService: WeightService,
        private _retentionOrdersService: RetentionOrdersService,

    ) {
        let params: Params = this._activatedRoute.snapshot?.queryParams;
        this.isProductionNote = !!('true' == params?.production);

    }
    ngAfterViewInit(): void {

    }

    ngOnInit(): void {
        this._initSearch()
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public onOpenFilter() {
        this.isOpenFilter = true;
    }

    public onCloseFilter(value: boolean) {
        this.isOpenFilter = value
    }

    public onCountSelectedFilters(countSelectedFilters: number) {
        this.countFilter = countSelectedFilters
    }

    public onComponentReady(){
        this.countFilter = 0
    }
    /**
     * Select Note list to display input or production
     * @param isProcessedList   if isProcessedList is true show production notes
     */
    public selectNoteList(isProcessedList: boolean): void {
        if (this.isProductionNote != isProcessedList) {
            this.isProductionNote = isProcessedList;
            this.searchText = '';
            this.countFilter = 0;
            this._weightService.searchTerm$.next('')
        }
    }

    private _initSearch(): void {
        this.searchText = ''
        this._retentionOrdersService.searchTerm$.pipe(takeUntil(this.destroy$))
            .subscribe((filter) => {
                this.searchText = filter ?? '';
            })
    }
}
