import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { warehouseTransferService } from '../../services/warehouse-transfer.service';

@Component({
    selector: 'app-warehouse-transfer-header',
    templateUrl: './warehouse-transfer-header.component.html',
    styleUrls: ['./warehouse-transfer-header.component.scss'],
})
export class WarehouseTransferHeaderComponent implements OnDestroy, OnInit {
    @Input() isListIn: boolean;
    public searchText: string;
    public isOpen: boolean = false;
    public params = {};
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public isOpenFilter: boolean = false;
    public countFilter: number = 0;
    readonly WEIGHT_NOTE_STATUS: any = CONSTANTS.WEIGHT_NOTE_STATUS;
    readonly RECEIVING_NOTE_PRODUCTION_STATUS: any = CONSTANTS.RECEIVING_NOTE_PRODUCTION_STATUS;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public urlCreation: string = "";

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _weightService: warehouseTransferService

    ) {
        let params: Params = this._activatedRoute.snapshot?.queryParams;
    }
    ngOnInit(): void {
        this._weightService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
            this.searchText = params
        })


        if (this.isListIn)
            this.countFilter = localStorage.getItem('warehouseTransferListInFilters')
                ? JSON.parse(localStorage.getItem('warehouseTransferListInFilters'))?.numFilters
                : 0;
        else
            this.countFilter = localStorage.getItem('warehouseTransferListOutFilters')
                ? JSON.parse(localStorage.getItem('warehouseTransferListOutFilters'))?.numFilters
                : 0;

        const isOut: string = this.isListIn ? "in" : "out";
        this.urlCreation = `create-output-transfer/${isOut}`;
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

}
