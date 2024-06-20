import { ResizedEvent } from 'angular-resize-event';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import { CONSTANTS } from '../utils/constants/constants';


@Component({
    selector: 'silosys-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements AfterViewInit ,  AfterContentInit {
    @Input() title: string = '';
    @Input() isDisabledSearchInput: boolean = false;
    @Input() showSearchInput: boolean = true;
    @Input() searchValue: string = '';
    @Input() searchInputPlaceholder: string = '';
    @Input() showExportCSVButton: boolean = false;
    @Input() isDisableExportCSVButton: boolean = false;
    @Input() showNewButton: boolean = true;
    @Input() permissionTag = CONSTANTS.PERMISSIONS.ALL;
    @Input() permissionType = CONSTANTS.PERMISSION_TYPES.CREATE;
    @Output() eventSearchInput: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventExportCSV: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew: EventEmitter<any> = new EventEmitter<any>();
    @Output() loadComponentComplete: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('mainHeaderContainer') mainHeader: ElementRef;
    public isInputSearchFocused: boolean = false;
    public responsiveClass: string = '';
    private thMediumWidth: number = 900;
    private thSmallWidth: number = 702;
    private thExtraSmallWidth: number = 360;

    constructor(private ref: ChangeDetectorRef) {
    }

    ngAfterContentInit(): void {
       this.handleComponentComplete();
    }


    ngAfterViewInit() {
        this.handleResponsive(this.mainHeader.nativeElement.offsetWidth);
        this.ref.detectChanges();
    }

    public onMainHeaderResized(event: ResizedEvent): void {
        this.handleResponsive(event.newWidth);
    }

    private handleResponsive(width: number): void {
        if (width < this.thExtraSmallWidth) {
            this.responsiveClass = 'main-header--xs';
        }
        else if (width < this.thSmallWidth) {
            this.responsiveClass = 'main-header--sm';
        }
        else if (width < this.thMediumWidth) {
            this.responsiveClass = 'main-header--md';
        }
        else {
            this.responsiveClass = 'main-header--lg';
        }
    }

    private handleComponentComplete(){
        setTimeout(()=>{this.loadComponentComplete.emit("loadComponentComplete");},500)

    }

    public clearSearchInput(): void {
        this.searchValue = '';
        this.eventSearchInputContentChanged();
    }

    public eventSearchInputContentChanged(): void {
        this.eventSearchInput.emit(this.searchValue);
    }

    public exportCSV(): void {
        this.eventExportCSV.emit(null);
    }

    public createNew(): void {
        this.eventNew.emit(null);
    }
}
