import { Component, EventEmitter, HostBinding, OnInit, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-csv-actions-dropdown',
    templateUrl: './csv-actions-dropdown.component.html',
    styleUrls: ['./csv-actions-dropdown.component.scss'],
})
export class CsvActionsDropdownComponent implements OnInit {
    @HostBinding('class.dropdown') isDropdown = true;
    @Output() public uploadFile: EventEmitter<any> = new EventEmitter();
    @Output() public downloadLayout: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('csvReader') csvReader: any;
    constructor() {}

    ngOnInit() {}
    public onOpenFileExplorer(): void {
        this.csvReader.nativeElement.click();
    }
    public onFileUpload(event: any): void {
        this.uploadFile.emit(event);
        this.csvReader.nativeElement.value = '';
    }
    public onDownloadTemplate() {
        this.downloadLayout.emit(true);
    }
}
