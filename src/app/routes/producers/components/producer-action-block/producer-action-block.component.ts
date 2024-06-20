import { ResizedEvent } from 'angular-resize-event';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ThemeService } from 'src/theme/theme.service';

import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges
} from '@angular/core';

import { TBlockModel } from '../../../t-blocks/models/block.model';
import {
    IInputDataActionsBlockModel, InputDataActionsBlockModel
} from '../../../t-blocks/models/input-data-actions-block.model';
import { ActionDataModel, IActionDataModel } from '../../models/action-data.model';

@Component({
  selector: 'app-producer-action-block',
  templateUrl: './producer-action-block.component.html',
  styleUrls: ['./producer-action-block.component.css']
})
export class ProducerActionBlockComponent implements OnChanges, OnDestroy {

  @Input() data: IActionDataModel = new ActionDataModel();

  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();

  @Output() refreshEvent: EventEmitter<boolean> = new EventEmitter();


  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

  public inputActionBlock: IInputDataActionsBlockModel;

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

      if (this.data.isEdit) {

        this.inputActionBlock = new InputDataActionsBlockModel({
          isFromBlockModule: false,
          isEdit: true,
          block: this.data.blocks,
          producerId: this.data.producerId
        });

        this.inputActionBlock.block[0].seller = this.data.producerId;

      }
      else {

        this.inputActionBlock = new InputDataActionsBlockModel({
          isFromBlockModule: false,
          isEdit: false,
          block: [new TBlockModel({seller: this.data.producerId})],
          producerId: this.data.producerId
        });

      }

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

      this.style.paddingLeftContainer = 50;
      this.style.paddingRightContainer = 50;
      this.style.paddingTopContainer = 40;
      this.style.paddingBottomContainer = 40;

    }

    this.style.widthHeaderLine = event.newWidth < this.style.paddingLeftContainer + this.style.paddingRightContainer + this.maxWidthHeaderLine + 30 ?
      '100%' :
      this.maxWidthHeaderLine + 'px';

  }

  private initializeValues(): void {

    this.inputActionBlock = null;

    this.maxWidthHeaderLine = 284;

    this.style = {
      paddingLeftContainer: 50,
      paddingRightContainer: 50,
      paddingTopContainer: 40,
      paddingBottomContainer: 40,
      widthHeaderLine: '0'
    };

  }

}
