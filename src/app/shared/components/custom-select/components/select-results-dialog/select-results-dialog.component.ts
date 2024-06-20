import { Component, Inject, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ISelectModalDataSettings } from 'src/app/shared/models/select-modal-data-settings';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-select-results-dialog',
    templateUrl: './select-results-dialog.component.html',
    styleUrls: ['./select-results-dialog.component.scss']
})
export class SelectResultsDialogComponent implements OnDestroy {
    @BlockUI('select-results') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public onSearchEmmiter = new EventEmitter();
    public onScrollEmmiter = new EventEmitter();
    public onNewItem = new EventEmitter();
    public items: Array<any>
    public isFocusOnInputSearch = true;
    public searchText: string = '';
    public updateData$ = new Subject();
    public isLoading: boolean = false;
    public associateBlocks = [];
    public dissociatedBlocks = [];
    private destroy$ = new Subject();
    private _timeout: any;
    readonly PERMISSIONS_TYPE = CONSTANTS.PERMISSION_TYPES

    constructor(public dialogRef: MatDialogRef<SelectResultsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ISelectModalDataSettings) {
        this.items = data.items;
        this.isLoading = data.isLoading;
        this._updateBlocksData();
        this.updateData$.pipe(takeUntil(this.destroy$)).subscribe(
            (data: any) => {
                this.items = data;
                this.blockUI.stop();
                this._updateBlocksData();
                this.data.groupByItems = this._GroupBy();
            }
        );
    }
    private _updateBlocksData(): void {
        if (this.data.isBlockItems) {
            this.associateBlocks = [];
            this.dissociatedBlocks = [];
            this.items.forEach(element => {
                if (this.data.farmId && element.farmId == this.data.farmId) {
                    this.associateBlocks.push(element)
                } else {
                    this.dissociatedBlocks.push(element)
                }
            });

        }
    }
    private _GroupBy() {
        return this.items.reduce((r, a) => {
            r[a[this.data.groupBy]] = r[a[this.data.groupBy]] || [];
            r[a[this.data.groupBy]].push(a);
            return r;
        }, Object.create(null));
    }
    /**
     * typing search event
     */
    public onSearchEvent() {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.blockUI.start();
            this.data.items = [];
            this.onSearchEmmiter.emit(this.searchText);
        }, 500);
    }
    /**
    * Clear search input value
    */
    public clearSearchInput(): void {
        this.blockUI.start();
        this.searchText = '';
        this.onSearchEmmiter.emit('');
    }
    /**
     * on scroll event emit
     * @param event
     */
    public onScrollEvent(event): void {
        if ((event.target.offsetHeight + event.target.scrollTop + 1) >= event.target.scrollHeight) {
            this.blockUI.start();
            this.onScrollEmmiter.emit();
        }
    }

    public onSelectItem(item: any) {
        this.dialogRef.close(item)
    }

    public addItem() {
        this.onNewItem.emit()
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
