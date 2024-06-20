import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ThemeService } from 'src/theme/theme.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { I18nPipe } from '../../../shared/i18n/i18n.pipe';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { SealModel } from '../../../shared/utils/models/seal.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ActionCreateSealModel } from '../models/action-create-seal.model';
import { SealActionTypeEnum } from '../models/seal-action-type.enum';
import { ISealListResponseModel } from '../models/seal-list-response';
import {
    ISealListViewPaginatorModel, SealListViewPaginatorModel
} from '../models/seal-list-view-paginator.model';
import { SealViewEnum } from '../models/seal-view.enum';
import { SealsService } from '../seals.service';

@Component({
    selector: 'app-seals',
    templateUrl: './seals.component.html',
    styleUrls: ['./seals.component.css'],
})
export class SealsComponent implements OnInit, OnDestroy {
    @BlockUI('list-layout') blockUILayout: NgBlockUI;
    @BlockUI('data-list-container') blockUIDataList: NgBlockUI;
    @ViewChild('paginator') paginator: MatPaginator;
    public templateBlockModalUiDataList: BlockModalUiComponent = BlockModalUiComponent;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public sealsPaginator: ISealListViewPaginatorModel = new SealListViewPaginatorModel();
    public searchText: string = '';
    public viewOptions: any = SealViewEnum;
    public optionView: SealViewEnum = SealViewEnum.Principal;
    public createSealData: ActionCreateSealModel = null;
    public isRunningSearch: boolean = false;
    public isDarkTheme: boolean;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;

    private subscripcionEventGetSeals: Subscription = new Subscription();
    private refTimeoutSearch: any = null;
    private _searchSubscription: Subscription = new Subscription();

    constructor(
        private dialog: MatDialog,
        private sealsSvc: SealsService,
        private alertService: AlertService,
        private sanitization: DomSanitizer,
        private themeService: ThemeService,
        private i18nPipe: I18nPipe
    ) {
        this.themeService.theme.subscribe((theme) => {
            this.isDarkTheme = 'dark' === theme;
        });
    }

    /**
     * Callback method that is invoked immediately after the default change detector has checked
     */
    ngOnInit() {
        this.getSeals(null, false, false);
    }

    /**
     * Callback method that is invoked immediately before a component is destroyed.
     */
    ngOnDestroy() {
        this.subscripcionEventGetSeals.unsubscribe();
        this._searchSubscription.unsubscribe();
    }

    /**
     * Method for get seal list items
     * @param uri of the endpoint for get items
     * @param isSearch indicates if the method is invoked on search
     * @param onPageChange indicates if the method is invoked on page change event
     */
    private getSeals(
        uri: string,
        isSearch: boolean,
        onPageChange: boolean
    ): void {
        this.blockUILayout.start();
        this.subscripcionEventGetSeals.add(
            this.sealsSvc.getSeals(uri).subscribe(
                (response: ISealListResponseModel) => {
                    if (response) {
                        this.setSealsPaginatorConfig(response);
                        if (null == uri) {
                            this.paginator.pageIndex = 0;
                            if (!isSearch && !onPageChange) {
                                this.searchText = '';
                            }
                        }
                    } else {
                        if (onPageChange) {
                            this.paginator.pageIndex = this.sealsPaginator.currentPage;
                        }
                        this.alertService.errorTitle(
                            this.i18nPipe.transform('error-msg'),
                            this.i18nPipe.transform('unidentified-problem')
                        );
                    }
                    this.blockUILayout.stop();
                },
                (error: HttpErrorResponse) => {
                    this.blockUILayout.stop();
                    if (error.status != 403) {
                        this.alertService.errorTitle(
                            this.i18nPipe.transform('error-msg'),
                            this.i18nPipe.transform('unidentified-problem')
                        );
                        if (onPageChange) {
                            this.paginator.pageIndex = this.sealsPaginator.currentPage;
                        }
                    }
                }
            )
        );
    }

    /**
     * Method for generate the source image of the a seal item
     * @param seal item
     */
    private generateSourceImage(seal: SealModel): SafeUrl {
        if (
            seal.image !== null &&
            seal.image !== undefined &&
            seal.image !== '' &&
            seal.image
        ) {
            return this.sanitization.bypassSecurityTrustUrl(seal.image);
        }
        return 'assets/img/svg/empty-image.svg';
    }

    /**
     * Method for show create seal view
     */
    public newSeal(): void {
        this.createSealData = {
            actionType: SealActionTypeEnum.Create,
        };
        this.optionView = SealViewEnum.Create;
    }

    /**
     * Method for show edit seal view
     * @param seal to edit
     */
    public editSeal(seal: SealModel): void {
        this.createSealData = {
            actionType: SealActionTypeEnum.Edit,
            sealId: seal.certification_id,
        };
        this.optionView = SealViewEnum.Create;
    }

    /**
     * Method for show delete seal confirmation view
     * @param seal to delete
     */
    public deleteSeal(seal: SealModel): void {
        if (0 === seal.related_farms) {
            const dialog = this.dialog.open(ConfirmDialogComponent, {
                width: '450px',
                data: seal,
                autoFocus: false,
                disableClose: true,
            });
            dialog.afterClosed().subscribe((res: boolean) => {
                if (res) {
                    this.searchText = '';
                    this.sealsPaginator = new SealListViewPaginatorModel();
                    this.getSeals(null, false, false);
                }
            });
        } else {
            this.alertService.warning(
                this.i18nPipe.transform('empty-farms-first')
            );
        }
    }

    /**
     * Method that is invoked on cancel operation for create seal
     */
    public cancelEventCreate(): void {
        this.optionView = SealViewEnum.Principal;
        this.createSealData = null;
    }

    /**
     * Method that is invoked after create o edit a seal
     */
    public refreshEventCreate(): void {
        this.searchText = '';
        this.optionView = SealViewEnum.Principal;
        this.createSealData = null;
        this.sealsPaginator = new SealListViewPaginatorModel();
        this.getSeals(null, false, false);
    }

    /**
     * Method that is invoked on change page event
     * @param event paginator control
     */
    public eventPaginator(event: PageEvent): void {
        if (this.sealsPaginator.currentPage != event.pageIndex) {
            let uri: string = null;
            if (this.sealsPaginator.currentPage + 1 == event.pageIndex) {
                uri = this.sealsPaginator.nextPageUrl;
            } else if (this.sealsPaginator.currentPage - 1 == event.pageIndex) {
                uri = this.sealsPaginator.prevPageUrl;
            } else if (0 == event.pageIndex) {
                uri = this.sealsPaginator.firstPageUrl;
            } else if (this.sealsPaginator.totalPages - 1 == event.pageIndex) {
                uri = this.sealsPaginator.lastPageUrl;
            }
            this.getSeals(uri, this.searchText.length > 0, true);
        }
    }

    /**
     * Method for set seals items to paginator object model
     * @param response object with pagination data received from the API
     */
    private setSealsPaginatorConfig(response: ISealListResponseModel): void {
        response.seals.forEach((seal: SealModel) => {
            seal.image = this.generateSourceImage(seal);
        });
        this.sealsPaginator = new SealListViewPaginatorModel({
            seals: response.seals,
            totalItems: response.total,
            itemsPerPage: response.perPage,
            itemsPerPageOptions: [response.perPage],
            totalPages: response.lastPage,
            firstPageUrl: response.firstPageUrl,
            lastPageUrl: response.lastPageUrl,
            nextPageUrl: response.nextPageUrl,
            prevPageUrl: response.prevPageUrl,
            currentPage: response.currentPage - 1,
        });
    }

    /**
     * Method that is invoked on search event
     * @param text to search
     */
    public searchSeals(text: string): void {
        let queryParams: any = { q: text };
        if (!this.blockUIDataList.isActive) {
            this.blockUIDataList.start();
        }
        if (null != this.refTimeoutSearch) {
            clearTimeout(this.refTimeoutSearch);
        }
        this._searchSubscription.unsubscribe();
        this._searchSubscription = new Subscription();
        this.searchText = text;
        this.isRunningSearch = true;
        this.sealsPaginator = new SealListViewPaginatorModel();
        if (this.searchText.length > 0) {
            this.refTimeoutSearch = setTimeout(() => {
                this._searchSubscription.add(
                    this.sealsSvc.getSeals(null, queryParams).subscribe(
                        (response: ISealListResponseModel) => {
                            if (response) {
                                this.paginator.pageIndex = 0;
                                this.setSealsPaginatorConfig(response);
                                this.isRunningSearch = false;
                                this.blockUIDataList.stop();
                            } else {
                                this.isRunningSearch = false;
                                this.alertService.errorTitle(
                                    this.i18nPipe.transform('error-msg'),
                                    this.i18nPipe.transform(
                                        'unidentified-problem'
                                    )
                                );
                                this.blockUIDataList.stop();
                            }
                        },
                        (error) => {
                            this.isRunningSearch = false;
                            this.alertService.errorTitle(
                                this.i18nPipe.transform('error-msg'),
                                this.i18nPipe.transform('unidentified-problem')
                            );
                            this.blockUIDataList.stop();
                        }
                    )
                );
            }, 600);
        } else {
            this.paginator.pageIndex = 0;
            this.isRunningSearch = false;
            this.blockUIDataList.stop();
            this.getSeals(null, false, false);
        }
    }
}
