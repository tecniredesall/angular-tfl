import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { KanbanService } from 'src/app/routes/kanban/services/kanban.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { IWorkflowModel } from 'src/app/shared/models/workflow.models';
import { IProductionTypeModel, ProductionTypeModel } from 'src/app/shared/models/production-type.model';
import { Paginator } from 'src/app/shared/models/paginator.model';
import { debounceTime, distinctUntilChanged, take, takeUntil, tap } from 'rxjs/operators';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { Subject } from 'rxjs/internal/Subject';
import { PageEvent } from '@angular/material/paginator';
import { ThemeService } from 'src/theme/theme.service';
import { ICommodityModel } from 'src/app/routes/workflow/models/commodity.model';
import { ResizedEvent } from 'angular-resize-event';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    @BlockUI('kanban-home') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public tabs: IProductionTypeModel[] = [new ProductionTypeModel({ name: 'All', id: '0' })]
    public workflows: IWorkflowModel[] = []
    public searchText = '';
    public pagination: Paginator = new Paginator();
    public isDarkTheme = false;
    public selectedIndexTab = this.tabs[0].id;
    public productionTypes: IProductionTypeModel[] = [];
    public originalWorkflows: IWorkflowModel[] = []
    public isInputSearchFocused = false;
    public commodities: ICommodityModel[] = [];
    public selectedCommodity: ICommodityModel;
    public responsiveClass = 'kanban__home__flows__body--lg';
    public isLoadingCommodities = true;
    public commodityId: number;
    readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private searchTerm$: Subject<string> = new Subject<string>();
    private productionTypeFilter: string = '0';

    constructor(
        private _i18nPipe: I18nPipe,
        private _themeService: ThemeService,
        private _alertService: AlertService,
        private _kanbanService: KanbanService,
        private _handlerError: ResponseErrorHandlerService,
    ) {
        this._themeService.theme
            .pipe(takeUntil(this.destroy$))
            .subscribe((theme) => (this.isDarkTheme = 'dark' === theme))
    }

    ngOnInit() {
        this.searchTerm$.pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged(),
            tap((e) => {
                if (!this.blockUI.isActive) {
                    this.blockUI.start();
                }
            }),
            debounceTime(500)
        ).subscribe(
            (term: string) => {
                this.getWorkflows(null, this.getParamsRequest());
            },
            error => {
                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    this._handlerError.handleError(error, 'lots')
                );
                this.blockUI.stop();
            }
        );

        this.getProductionTypes();
        this.getCommodities();
    }


    private getCommodities() {
        this.blockUI.start();
        this.isLoadingCommodities = true;
        this._kanbanService.getCommodities()
            .pipe(take(1))
            .subscribe((response: ICommodityModel[]) => {
                this.commodities = response;
                if (this.commodities.length > 0) {
                    this.selectCommodity(this.commodities[0]);
                } else {
                    this.blockUI.stop();
                }
                this.isLoadingCommodities = false;
            },
                (e) => {
                    let message = this._handlerError.handleError(e, 'workflow');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop();
                });
    }

    public selectCommodity(commodity: ICommodityModel) {
        this.selectedCommodity = commodity;
        this.selectedIndexTab = this.tabs[0].id;
        this.getWorkflows(null, this.getParamsRequest());
        this.searchText = '';
        this.commodityId = commodity.id;
    }

    public filterWorkflows(index: number) {
        const tab = this.tabs[index];
        this.productionTypeFilter = tab.id;
        this.getWorkflows(null, this.getParamsRequest());
    }

    public onSearch() {
        this.searchTerm$.next(this.searchText);
    }

    public onClearSearch() {
        this.searchText = '';
        this.searchTerm$.next(this.searchText);
    }

    public getProductionTypes() {
        this.blockUI.start();
        this._kanbanService.getProductionTypes()
            .pipe(take(1))
            .subscribe(
                (response: IProductionTypeModel[]) => {
                    this.productionTypes = response;
                    this.tabs = this.tabs.concat(this.productionTypes);
                    this.blockUI.stop();
                },
                error => {
                    let message = this._handlerError.handleError(error, 'kanban');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop()
                }
            );
    }

    public getWorkflows(uri: string = null, params: any = {}) {
        if (!this.blockUI.isActive) {
            this.blockUI.start();
        }
        this._kanbanService.getWorkflows(uri, params, this.selectedCommodity.id)
            .pipe(take(1))
            .subscribe(
                (response: { data: IWorkflowModel[], paginator: Paginator }) => {
                    this.workflows = response.data;
                    this.pagination = response.paginator;
                    this.originalWorkflows = this.workflows;
                    this.blockUI.stop()
                },
                error => {
                    let message = this._handlerError.handleError(error, 'workflow');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                    this.blockUI.stop()
                }
            )
    }

    public eventPaginator(event: PageEvent): void {
        let selectedPage: number = event.pageIndex + 1;
        if (this.pagination.currentPage != selectedPage) {
            let uri: string = null;
            if (this.pagination.currentPage + 1 == selectedPage) {
                uri = this.pagination.nextPageUrl;
            }
            else if (this.pagination.currentPage - 1 == selectedPage) {
                uri = this.pagination.previousPageUrl;
            }
            else if (1 == selectedPage) {
                uri = this.pagination.firstPageUrl;
            }
            else if (this.pagination.totalPages == selectedPage) {
                uri = this.pagination.lastPageUrl;
            }
            this.getWorkflows(uri, this.getParamsRequest());
        }
    }

    private getParamsRequest(): any {
        let params: any = {};
        if (this.searchText?.length > 0) {
            params.q = this.searchText;
        }
        if (this.productionTypeFilter != '0') {
            params.production_type_id = this.productionTypeFilter;
        }
        params.top = 10;
        return params;
    }

    public onEventViewResized(event: ResizedEvent): void {
        if (event.newWidth < 576) {
            this.responsiveClass = 'kanban__home__flows__body--xs';
        }
        else if (event.newWidth < 768) {
            this.responsiveClass = 'kanban__home__flows__body--sm';
        }
        else if (event.newWidth < 992) {
            this.responsiveClass = 'kanban__home__flows__body--md';
        }
        else if (event.newWidth < 1200) {
            this.responsiveClass = 'kanban__home__flows__body--lg';
        }
        else {
            this.responsiveClass = 'kanban__home__flows__body--xl';
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
