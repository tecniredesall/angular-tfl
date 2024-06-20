import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';
import { URIS_CONFIG } from 'src/app/shared/config/uris-config';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { MainHeaderComponent } from 'src/app/shared/main-header/main-header.component';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    toLowerNoDigitsNoSigns
} from 'src/app/shared/utils/functions/string-to-lowercase-only-letters';
import { PaginationModel } from 'src/app/shared/utils/models/paginator.model';
import { TransformationTypesModel } from 'src/app/shared/utils/models/transformation-types.model';

import { AfterViewInit, Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { TransformationTypesService } from './services/transformation-types.service';

@Component({
    selector: 'app-transformation-types',
    templateUrl: './transformation-types.component.html',
    styleUrls: ['./transformation-types.component.scss'],
})
export class TransformationTypesComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MainHeaderComponent) private _header: MainHeaderComponent;
    @HostBinding('class') hostClasses = 'sil-overflow-container';
    public transformationToSearch: string;
    public transFormationToDelete: TransformationTypesModel;
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public transformations: TransformationTypesModel[] = [];
    public pagination: PaginationModel;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    private baseUri = `${localStorage.getItem('uri-owner')}${URIS_CONFIG.API_TRANSFORMATIONS
        }`;
    private currentUri: string;
    public columnSort = {
        name: false,
    };
    @BlockUI('hello') blockUI: NgBlockUI;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _router: Router,
        private _transformationsService: TransformationTypesService,
        private _notifier: NotifierService,
        private _alert: AlertService,
        private _i18n: I18nPipe
    ) { }

    public ngOnInit() {
        this.currentUri = this.baseUri;
        this.setTransormations(this.currentUri);
    }

    public ngAfterViewInit() {
        // Manual subscription to search input event
        // Prevents multiple requests and gives time for user to type
        this._header.eventSearchInput
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                debounceTime(500),
                filter(() => !this.blockUI.isActive)
            )
            .subscribe((text: string) => {
                if (text) {
                    this.transformationToSearch = text;
                    this.setTransormations(`${this.currentUri}?q=${text}`);
                } else {
                    this.setTransormations(this.baseUri);
                }
            });
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
    }

    private setTransormations(uri: string) {
        this.blockUI.start();
        this._transformationsService
            .getTransformationTypes(uri)
            .pipe(
                take(1),
                filter((t) => !!t),
                map((t: any) => t.data)
            )
            .subscribe(
                (t) => {
                    this.pagination = { ...t };
                    this.transformations = t.data;
                },
                (e) => {
                    this.blockUI.stop();
                    this._alert.showAlert(e.status, e.message);
                },
                () => this.blockUI.stop()
            );
    }
    /**
     * Handles a row action click event
     * @param action constant value for action clicked
     * @param index optional row index to get data from array
     */
    public onActionClicked(action: number, name?: string) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this._router.navigate([
                    'routes',
                    'transformation-types',
                    'edit',
                    name.toLowerCase(),
                ]);
                break;
            case CONSTANTS.CRUD_ACTION.CREATE:
                this._router.navigate([
                    'routes',
                    'transformation-types',
                    'new',
                ]);
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.transFormationToDelete = this.transformations.find(
                    (u) => u.name.toLowerCase() === name.toLowerCase()
                );
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL:
                this.transFormationToDelete = null;
                break;
            default:
                break;
        }
    }
    /**
     * Handle page events
     * @param event the page event data to be requested
     */
    public onPaginatorEvent(event: PageEvent) {
        if (event.pageIndex === 0) {
            this.currentUri = this.pagination.first_page_url;
        } else if (event.pageIndex === this.pagination.last_page) {
            this.currentUri = this.pagination.last_page_url;
        } else if (event.pageIndex > event.previousPageIndex) {
            this.currentUri = this.pagination.next_page_url;
        } else {
            this.currentUri = this.pagination.prev_page_url;
        }

        const uri = this.transformationToSearch
            ? `${this.currentUri}?q=${this.transformationToSearch}`
            : this.currentUri;
        this.setTransormations(uri);
    }
    /**
     * Sorts grid data ascend or descend depending on current sort state
     * @param colum column for sorting
     */
    public sortData(column: string) {
        this.columnSort[column] = !this.columnSort[column];
        this.transformations = this.transformations.sort((a, b) => {
            if (
                toLowerNoDigitsNoSigns(a[column]) <
                toLowerNoDigitsNoSigns(b[column])
            ) {
                return this.columnSort[column] ? -1 : 1;
            }
            if (
                toLowerNoDigitsNoSigns(a[column]) >
                toLowerNoDigitsNoSigns(b[column])
            ) {
                return this.columnSort[column] ? 1 : -1;
            }
            return 0;
        });
    }

    public onTransformationDelete(transformation: TransformationTypesModel) {
        this.transFormationToDelete = null;
        this.blockUI.start();
        this._transformationsService
            .deleteTransformationTypes(transformation.transformation_type_id)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('success-delete-transformation')
                    );
                    this._router.navigate(['routes', 'transformation-types']);
                    this.setTransormations(this.currentUri);
                },
                (err) => {
                    this.blockUI.stop();
                    const message = err.error.data.reference[0]
                        .transformation_type_id
                        ? this._i18n
                            .transform('transformation-associated')
                            .replace('[value]', transformation.name)
                        : this._i18n.transform('transformation-delete-error');
                    this._alert.showAlert(404, this._i18n.transform(message));
                }
            );
    }
}
