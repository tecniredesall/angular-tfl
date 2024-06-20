import { ResizedEvent } from 'angular-resize-event';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ThemeService } from 'src/theme/theme.service';

import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges
} from '@angular/core';

import { ActionDataModel, IActionDataModel } from '../../models/action-data.model';

@Component({
    selector: 'app-producer-action-farm',
    templateUrl: './producer-action-farm.component.html',
    styleUrls: ['./producer-action-farm.component.css']
})
export class ProducerActionFarmComponent implements OnDestroy, OnChanges {

    @Input() data: IActionDataModel = new ActionDataModel();

    @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();

    @Output() refreshEvent: EventEmitter<boolean> = new EventEmitter();


    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public maxWidthHeaderLine: number;

    public style: {
        paddingLeftContainer: number,
        paddingRightContainer: number,
        paddingTopContainer: number,
        paddingBottomContainer: number,
        widthHeaderLine: string
    };

    public isDarkTheme: boolean;


    private _subscription: Subscription = new Subscription();

    constructor(
        private _themeService: ThemeService
    ) {

        this._subscription.add(
            this._themeService.theme.subscribe(theme => {
                this.isDarkTheme = ('dark' === theme);
            })
        );

        this.initializeValues();

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.hasOwnProperty('data') && this.data) {

            this.initializeValues();

        }

    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public onCancelEvent(): void {
        this.closeEvent.emit(true);
    }

    public onRefreshEvent(): void {
        this.refreshEvent.emit(true);
    }

    public handleResponsive(event: ResizedEvent): void {

        if (event.newWidth < 285) {

            this.style.paddingLeftContainer = 8;
            this.style.paddingRightContainer = 8;
            this.style.paddingTopContainer = 8;
            this.style.paddingBottomContainer = 8;

        }
        else if (event.newWidth < 450) {

            this.style.paddingLeftContainer = 12;
            this.style.paddingRightContainer = 12;
            this.style.paddingTopContainer = 12;
            this.style.paddingBottomContainer = 12;

        }
        else {

            this.style.paddingLeftContainer = 20;
            this.style.paddingRightContainer = 20;
            this.style.paddingTopContainer = 40;
            this.style.paddingBottomContainer = 10;

        }

        this.style.widthHeaderLine = event.newWidth < this.style.paddingLeftContainer + this.style.paddingRightContainer + this.maxWidthHeaderLine + 30 ?
            '100%' :
            this.maxWidthHeaderLine + 'px';

    }

    private initializeValues(): void {

        this.maxWidthHeaderLine = 284;

        this.style = {
            paddingLeftContainer: 20,
            paddingRightContainer: 20,
            paddingTopContainer: 40,
            paddingBottomContainer: 10,
            widthHeaderLine: '0'
        };

    }

    public onEditButtonClick() {
        this.data.isReadOnly = false;
    }

}
