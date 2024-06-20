import { convertQQtoLb } from './../../shared/utils/functions/convert-qq-to-lb';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { FeatureFlagsService } from 'src/app/shared/services/feature-flags/feature-flags.service';

@Component({
    selector: 'app-weight-note',
    templateUrl: './weight-note.component.html',
    styleUrls: ['./weight-note.component.scss']
})
export class WeightNoteComponent implements AfterViewInit {

    @BlockUI('weight-note-lots-layout') blockUI: NgBlockUI;

    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public selectedTabIndex: number = -1;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _featureFlagsService: FeatureFlagsService,
        private _cdRef: ChangeDetectorRef
    ) {
    }

    ngAfterViewInit(): void {
        let params: any = this._activatedRoute.snapshot.queryParams;
        this.selectedTabIndex = (this._featureFlagsService.isFeatureFlagEnabled('lots') && 'lots' == params?.tab) ? 1 : 0;
        this._cdRef.detectChanges();
    }

    public onTabClick(event: MatTabChangeEvent): void {
    }

}

