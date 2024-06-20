import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild, OnInit, OnDestroy, AfterContentInit, AfterViewInit } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CONSTANTS } from '../../utils/constants/constants';
import { removeAccents } from '../../utils/functions/remove-accents';
import { SelectResultsDialogComponent } from './components/select-results-dialog/select-results-dialog.component';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { deepCompareIsEqual, isObject } from '../../utils/functions/object-compare';
import { ISelectModalDataSettings } from '../../models/select-modal-data-settings';

@Component({
    selector: 'custom-select',
    templateUrl: './custom-select.component.html',
    styleUrls: ['./custom-select.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomSelectComponent),
        multi: true
    }],
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class CustomSelectComponent implements OnInit, OnChanges, ControlValueAccessor, OnDestroy {
    @Input() items: Array<any> = [];
    @Input() label: string = null;
    @Input() addLabel: string;
    @Input() bindLabel: string;
    @Input() isLoading: boolean;
    @Input() emptyLabel: string;
    @Input() emptyImage: string;
    @Input() placeholder: string;
    @Input() searchPlaceholder: string;
    @Input() isBlockItems: boolean = false;
    @Input() permissionTag = CONSTANTS.PERMISSIONS.ALL;
    @Input() permissionType = CONSTANTS.PERMISSION_TYPES.CREATE;
    @Input() isVisibleRequiredMark: boolean = true;
    @Input() clearable: boolean = false;
    @Input() farmId: number;
    @Input() bindValue: string = null;
    @Input() groupBy: string = null;
    @Input() isEnableNewItem: boolean = false;
    @Output() onNew = new EventEmitter();
    @Output() onSearch = new EventEmitter();
    @Output() onSelect = new EventEmitter();
    @Output() onNextPage = new EventEmitter();
    @Output() onClose = new EventEmitter();
    @Output() clear = new EventEmitter();

    @ViewChild('controlLabel', { static: false }) controlLabel: ElementRef;
    @ViewChild('inputSelect') inputSelect: HTMLInputElement;
    @HostListener('scroll', ['$event'])

    public groupByItems: Array<any> = [];
    public searchText: string = '';
    public isOpenSelect = false;
    public associateBlocks = [];
    public dissociatedBlocks = [];
    public cacheItems = [];
    public isDisabled: boolean = false;
    public initialSearchText: string = this.searchText;
    public selectedItem: any = null;
    public innerWidth: number;
    public TABLET_WIDTH_SCREEN = CONSTANTS.WIDTH_SCREEN.TABLET;
    public destroyListenerModalSelect$ = new Subject();
    private onChange = (value: any) => { };
    private onTouch = () => { };
    private _dialogSelect: MatDialogRef<SelectResultsDialogComponent>;

    constructor(
        private _el: ElementRef,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.cacheItems = Array.from(this.items);
        this.innerWidth = window.innerWidth;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isBlockItems) {
            this.associateBlocks = [];
            this.dissociatedBlocks = [];
            this.items.forEach(element => {
                if (this.farmId && element.farmId == this.farmId) {
                    this.associateBlocks.push(element)
                } else {
                    this.dissociatedBlocks.push(element)
                }
            });

        }
        if (changes.items && changes.items.previousValue !== changes.items.currentValue) {
            this.cacheItems = Array.from(changes.items.currentValue);
            let value = this.items.find(i => i[this.bindValue] == this.searchText);
            if (value) {
                this.searchText = this.bindLabel ? value[this.bindLabel] : value;
            }
            this._updateModalData();
            if (this.groupBy !== null) {
                this.groupByItems = this._groupBy();
            }

        }
        if (changes.isLoading && changes.isLoading.currentValue !== changes.isLoading.previousValue) {
            if (this._dialogSelect && this._dialogSelect.componentInstance) {
                this._dialogSelect.componentInstance.isLoading = changes.isLoading.currentValue;
            }
        }

    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.innerWidth = window.innerWidth;
    }


    public onChangeInputSearch(value): void {
        if (value == '') {
            this.searchText = '';
            this.clear.emit();
        }
    }

    public onClick(event: any): void {
        if (!this._el.nativeElement.contains(event.target) || (this.controlLabel && this.controlLabel.nativeElement.contains(event.target))) {
            this.closeSelect();
        }
    }

    public onFocusEvent(): void {
        if (this.innerWidth > CONSTANTS.WIDTH_SCREEN.TABLET) {
            this.openSelect();
        }
    }

    public openSelect(): void {
        if (this.innerWidth > CONSTANTS.WIDTH_SCREEN.TABLET) {
            if (!this.isDisabled && !this.isOpenSelect) {
                this.isOpenSelect = true;
            }
        } else {
            this._openSelectDialog();
        }
    }

    private _groupBy() {
        return this.items.reduce((r, a) => {
            r[a[this.groupBy]] = r[a[this.groupBy]] || [];
            r[a[this.groupBy]].push(a);
            return r;
        }, Object.create(null));
    }

    private _updateModalData() {
        if (this.innerWidth <= CONSTANTS.WIDTH_SCREEN.TABLET) {
            if (this._dialogSelect && this._dialogSelect.componentInstance) {
                this._dialogSelect.componentInstance.items = this.items;
                this._dialogSelect.componentInstance.updateData$.next(this.items);
            }
        }
    }

    private _openSelectDialog(): void {
        let dialogData: ISelectModalDataSettings = {
            items: this.items,
            bindLabel: this.bindLabel,
            isLoading: this.isLoading,
            emptyLabel: this.emptyLabel,
            emptyImage: this.emptyImage,
            placeholder: this.placeholder,
            label: this.label,
            searchPlaceholder: this.searchPlaceholder,
            isBlockItems: this.isBlockItems,
            farmId: this.farmId,
            groupBy: this.groupBy,
            groupByItems: this.groupByItems,
            isEnableNewItem: this.isEnableNewItem,
            addLabel: this.addLabel,
            permissionTag: this.permissionTag
        }
        this._dialogSelect = this._dialog
            .open(SelectResultsDialogComponent, {
                autoFocus: false,
                disableClose: true,
                width: '570px',
                data: dialogData
            });
        this._dialogSelect.componentInstance.onSearchEmmiter
            .pipe(takeUntil(this.destroyListenerModalSelect$))
            .subscribe(
                (searchValue: string) => {
                    this.searchText = searchValue;
                    this.search();
                }
            );
        this._dialogSelect.componentInstance.onScrollEmmiter
            .pipe(takeUntil(this.destroyListenerModalSelect$))
            .subscribe(
                () => {
                    this.onNextPage.emit();
                }
            );
        this._dialogSelect.componentInstance.onNewItem
            .pipe(takeUntil(this.destroyListenerModalSelect$))
            .subscribe(
                () => {
                    this.onNew.emit();
                }
            );
        this._dialogSelect.afterClosed()
            .pipe(take(1))
            .subscribe(
                result => {
                    this.searchText = result ? this.searchText : '';
                    this.search(true);
                    this.select(result ?? this.selectedItem);
                }
            );
    }

    public closeSelect(): void {
        if (!this.isDisabled && this.isOpenSelect) {
            this.isOpenSelect = false;
            this.onSearch.emit('');
            this.onClose.emit();
        }
    }

    private filterItems(elements: Array<any>): Array<any> {
        if (elements) {
            let text: string = removeAccents(this.searchText.toLowerCase());
            return elements.filter((e: any) => removeAccents(
                this.bindLabel ? e[this.bindLabel].toLowerCase() : e.toLowerCase()
            ).includes(text));
        }
        return elements;
    }

    public search(isCloseComboBoxDialog = false) {
        if (this.isBlockItems) {
            this.associateBlocks = this.filterItems(this.associateBlocks);
            this.dissociatedBlocks = this.filterItems(this.dissociatedBlocks);
        }
        else {
            if (isCloseComboBoxDialog) {
                this.items = Array.from(this.cacheItems);
            } else {
                this.items = this.filterItems(this.cacheItems);
            }
            this._updateModalData();
        }
        if (this.groupBy !== null) {
            this.groupByItems = this._groupBy();
        }
        this.onSearch.emit(isCloseComboBoxDialog ? '' : this.searchText);
    }

    public toogleSelect(event: any) {
        event.stopPropagation();
        if (!this.isDisabled) {
            if (this.isOpenSelect) {
                this.closeSelect();
            }
            else {
                this.openSelect();
            }
        }
    }

    public onScroll(event: any) {
        if ((event.target.offsetHeight + event.target.scrollTop + 1) >= event.target.scrollHeight) {
            this.onNextPage.emit();
        }
    }

    public select(item: any) {
        if (
            !this.selectedItem ||
            isObject(item) && !deepCompareIsEqual(this.selectedItem, item) ||
            typeof item === 'string' && this.selectedItem != item
        ) {
            this._setItemEmitResult(item);
        }
        else {
            this.searchText = this.bindLabel ? this.selectedItem[this.bindLabel] : this.selectedItem;
            this.closeSelect();
        }
    }

    private _setItemEmitResult(item: any) {
        this.searchText = this.bindLabel ? item[this.bindLabel] : item;
        this.selectedItem = { ...item };
        this.initialSearchText = this.searchText;
        this.closeSelect();
        if (!this.isDisabled) {
            this.onTouch();
        }
        this.onChange(this.bindValue ? item[this.bindValue] : item);
        this.onSelect.emit(item);
    }

    public addItem() {
        this.closeSelect();
        this.onNew.emit();
    }

    public onClearEvent(event: any): void {
        event.stopPropagation();
        this.searchText = '';
        this.clear.emit();
    }

    public writeValue(value: any): void {
        if (this.items.length > 0) {
            let valueId = isObject(value) ? value?.id : value;
            let findItem = valueId ? this.items.find(item => item.id == valueId) : null;
            this.searchText = findItem ?
                (this.bindLabel ? findItem[this.bindLabel] : findItem)
                : value ?
                    (this.bindLabel ? value[this.bindLabel] : value)
                    : '';
            this.selectedItem = { ...value };
            this.initialSearchText = this.searchText;
        }
        else if (value) {
            this.searchText = (isObject(value) ? value[this.bindLabel] : value) ?? '';
            this.selectedItem = { ...value };
            this.initialSearchText = this.searchText;
        }
        this._updateModalData();
        this.groupByItems = this._groupBy();
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    ngOnDestroy(): void {
        this.destroyListenerModalSelect$.next(true);
        this.destroyListenerModalSelect$.complete();
    }
}
