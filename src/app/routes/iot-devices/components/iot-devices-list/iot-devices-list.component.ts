import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil, tap } from 'rxjs/operators';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { IPaginator, Paginator } from 'src/app/shared/models/paginator.model';
import { FileDownloadService } from 'src/app/shared/services/file-download/file-download.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { IotDevicesModel } from '../../models/iot-devices.model';
import { IotDevicesService } from '../../services/iot-devices/iot-devices.service';
import {
    IotDevicesDeleteModalComponent
} from '../iot-devices-delete-modal/iot-devices-delete-modal.component';

@Component({
    selector: 'app-iot-devices-list',
    templateUrl: './iot-devices-list.component.html',
    styleUrls: ['./iot-devices-list.component.scss'],
})
export class IotDevicesListComponent implements OnInit, OnDestroy {
    @BlockUI('iots-list-layout') blockUI: NgBlockUI;
    @ViewChild('paginator') paginator: MatPaginator;
    private deleteIotDevicesModalRef: MatDialogRef<IotDevicesDeleteModalComponent, any> = null;
    public templateBlockModalUiComponent: BlockModalUiComponent =
        BlockModalUiComponent;
    public iots: IotDevicesModel[] = [];
    public searchText: string = '';
    public pagination: Paginator = new Paginator();
    public columnOrder: string = 'created_at';
    public columnAscState: any = {
        created_at: false,
        model: true,
        brand: true,
    };
    private currentLanguage: string = localStorage.getItem('lang');
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private searchTerm$: Subject<string> = new Subject<string>();
    private cancelIotDevicessRequest$: Subject<boolean> = new Subject<boolean>();
    private cancelExportRequest$: Subject<boolean> = new Subject<boolean>();
    public PERMISSION_TAG = CONSTANTS.PERMISSIONS.IOTS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;

    constructor(
        private _i18nPipe: I18nPipe,
        private _i18nService: I18nService,
        private _iotService: IotDevicesService,
        private _alertService: AlertService,
        private _fileDownloader: FileDownloadService,
        private _errorHandlerService: ResponseErrorHandlerService,
        private _router: Router,
        private _notifier: NotifierService,
        private _dialog: MatDialog
    ) {
        this._i18nService.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe((l) => (this.currentLanguage = l));
    }

    ngOnInit() {
        this.searchTerm$
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                tap((e) => {
                    this.cancelIotDevicessRequest$.next(true);
                    if (!this.blockUI.isActive) this.blockUI.start();
                }),
                debounceTime(500)
            )
            .subscribe(
                (search: string) => {
                    this.getIotDevices(null, this.getParamsRequestIots());
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'iot-device')
                    );
                    this.blockUI.stop();
                }
            );
        this.getIotDevices(null, this.getParamsRequestIots());
    }

    private getIotDevices(url: string = null, params: any = {}): void {
        if (!this.blockUI.isActive) this.blockUI.start();
        this._iotService
            .getIotDevices(url, params)
            .pipe(takeUntil(this.cancelIotDevicessRequest$), take(1))
            .subscribe(
                (response: { data: IotDevicesModel[]; pagination: IPaginator }) => {
                    this.iots = response.data;
                    this.pagination = response.pagination;
                    this.setPaginatorIndexOnResponse();
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'iot-device')
                    );
                    this.blockUI.stop();
                }
            );
    }
    private setPaginatorIndexOnResponse(): void {
        if (this.paginator) {
            this.paginator.pageIndex = this.pagination.currentPage
                ? this.pagination.currentPage - 1
                : 0;
        }
    }
    public sortData(column: string): void {
        for (const key in this.columnAscState) {
            if (
                Object.prototype.hasOwnProperty.call(
                    this.columnAscState,
                    key
                ) &&
                column !== key
            ) {
                this.columnAscState[key] = true;
            }
        }
        this.columnOrder = column;
        this.columnAscState[column] = !this.columnAscState[column];
        this.getIotDevices(null, this.getParamsRequestIots());
    }

    public onTypeSearchInput(event: any): void {
        this.searchText = event;
        this.searchTerm$.next(trimSpaces(this.searchText));
    }

    public eventPaginator(event: PageEvent): void {
        let selectedPage: number = event.pageIndex + 1;
        if (this.pagination.currentPage != selectedPage) {
            let uri: string = null;
            if (this.pagination.currentPage + 1 == selectedPage) {
                uri = this.pagination.nextPageUrl;
            } else if (this.pagination.currentPage - 1 == selectedPage) {
                uri = this.pagination.previousPageUrl;
            } else if (1 == selectedPage) {
                uri = this.pagination.firstPageUrl;
            } else if (this.pagination.totalPages == selectedPage) {
                uri = this.pagination.lastPageUrl;
            }
            this.getIotDevices(uri, this.getParamsRequestIots());
        }
    }

    private getParamsRequestIots(): Object {
        let params: any = {};
        if (this.searchText?.length > 0) {
            params.q = trimSpaces(this.searchText);
        }
        if (this.columnOrder) {
            params.order = this.columnOrder;
            params.sort = this.columnAscState[this.columnOrder]
                ? 'asc'
                : 'desc';
        }
        return params;
    }

    public onDownloadCsv() {
        if (!this.blockUI.isActive) this.blockUI.start();
        this.cancelExportRequest$.next(true);
        let params = this.getParamsRequestIots();
        params['lang'] = this.currentLanguage;
        this._iotService
            .exportIotDevicess(params)
            .pipe(takeUntil(this.cancelExportRequest$), take(1))
            .subscribe(
                (url) => {
                    this._fileDownloader.downloadFromURL(
                        url,
                        `${this._i18nPipe.transform('iot-devices-list-file')}.csv`
                    );
                    this.blockUI.stop();
                },
                (error: HttpErrorResponse) => {
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'iot-devices')
                    );
                    this.blockUI.stop();
                }
            );
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.searchTerm$.next();
        this.searchTerm$.complete();
        this.cancelIotDevicessRequest$.next(true);
        this.cancelIotDevicessRequest$.complete();
        this.cancelExportRequest$.next(true);
        this.cancelExportRequest$.complete();
    }

    public onActionClicked(action: number, iotdevices: IotDevicesModel) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this.onEditIotDevices(iotdevices.id);
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.openDeleteIotDevicesDialog(iotdevices);
                break;
            default:
                break;
        }
    }

    public onEditIotDevices(id: string) {
        this._router.navigate(['/routes/iot-devices/edit', id]);
    }

    public onNewIotDevices() {
        this._router.navigate(['/routes/iot-devices/new']);
    }

    public onToggleIotDevicesStatus(iotDevice: IotDevicesModel) {
        iotDevice.isActive = !iotDevice.isActive;
        this._iotService
            .patchIotDevicesStatus(iotDevice.id)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18nPipe.transform('iot-devices-updated-iot-devices')
                    );
                },
                (error: HttpErrorResponse) => {
                    iotDevice.isActive = !iotDevice.isActive;
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        this._errorHandlerService.handleError(error, 'iot-devices')
                    );
                    this.blockUI.stop();
                }
            );
    }

    public openDeleteIotDevicesDialog(iotdevices: IotDevicesModel) {
        this.deleteIotDevicesModalRef = this._dialog.open(
            IotDevicesDeleteModalComponent,
            {
                autoFocus: false,
                disableClose: true,
                data: iotdevices.model || iotdevices.description,
            }
        );
        this.deleteIotDevicesModalRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((response: any) => {
                this.deleteIotDevicesModalRef = null;
                if (response.delete) {
                    this.deleteIotDevices(iotdevices.id);
                }
            });
    }

    public deleteIotDevices(id: string) {
        this._iotService.deleteIotDevices(id).pipe(take(1)).subscribe(
            (r) => {
                this.blockUI.stop();
                this._notifier.notify(
                    'success',
                    this._i18nPipe.transform('iot-devices-deleted-iot-devices')
                );
                this.getIotDevices(null, this.getParamsRequestIots())
            },
            (err) => {
                this.blockUI.stop();
                let message: string =
                    this._errorHandlerService.handleError(
                        err,
                        'iot-device'
                    );
                message = this._i18nPipe.transform(message);
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );
            }
        )
    }
}
