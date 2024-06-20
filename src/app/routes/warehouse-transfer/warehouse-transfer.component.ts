import { AfterViewInit, Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';

@Component({
    selector: 'app-warehouse-transfer',
    templateUrl: './warehouse-transfer.component.html',
    styleUrls: ['./warehouse-transfer.component.scss']
})
export class WarehouseTransferComponent implements AfterViewInit {

    @BlockUI('warehouse-transfer-layout') blockUI: NgBlockUI;

    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public selectedTabIndex: number = 0;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
        const queryParams = this._activatedRoute.snapshot.queryParams;
        this.selectedTabIndex = queryParams.in  === 'true' ? 1 : 0;
        this._updateRoute();
    }

    ngAfterViewInit(): void {}

    private _updateRoute(): void {
        this._router.navigate(['.'], {
            relativeTo: this._activatedRoute,
            queryParams: {
                in : this.selectedTabIndex === 0 ? 'false' : 'true',
            },
        });        
    }

    public onTabClick(tab: MatTabChangeEvent): void {
        this.selectedTabIndex = tab.index;
        this._updateRoute();
    }

}

