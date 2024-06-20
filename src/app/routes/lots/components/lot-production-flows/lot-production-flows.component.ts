import { takeUntil } from 'rxjs/operators';
import { CONSTANTS } from './../../../../shared/utils/constants/constants';
import { ILotFilterStatusModel } from './../../models/lot-filter-status.model';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ILotProductionFlowModel } from '../../models/lot-production-flow.model';
import { LotsService } from '../../services/lots.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ILotWeignotesModel } from '../../models/lot-weignotes.model';
import { IWeightModel } from '../../models/weigth-note.model.ts';

@Component({
  selector: 'app-lot-production-flows',
  templateUrl: './lot-production-flows.component.html',
  styleUrls: ['./lot-production-flows.component.scss']
})
export class LotProductionFlowsComponent implements OnInit, OnDestroy {
  @BlockUI('spinner-production-flows') blockUIProductionFlows: NgBlockUI;
  public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

  @Input() dataWeightNotes: ILotWeignotesModel;
  @Output() eventCreateNewLot = new EventEmitter<ILotWeignotesModel>();
  @Output() eventBackTab = new EventEmitter<void>();

  public productionFlows: Array<ILotProductionFlowModel> = [];
  public productionFlow: ILotProductionFlowModel;
  public urlBackToListSaved: string;
  private localStorageKey: string = 'new-lot-filter-status';
  private localStorageWNKey: string = 'weight-notes-selected';
  readonly LOT_TYPES: any = CONSTANTS.LOT_TYPES;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _lotsService: LotsService,
    private _alertService: AlertService,
    private _errorHandlerService: ResponseErrorHandlerService,
    private _i18nPipe: I18nPipe,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }



  ngOnInit() {
    let params: any = this._activatedRoute.snapshot.queryParams;
    if ('true' == params?.isFromWorkflow) {
      this.setStoredValuesToFilter();
    }
    this.getProductionFlows(
      this.dataWeightNotes.params.commodity.id,
      this.dataWeightNotes.params.commodityType.id);
  }
  /**
     * Get stored values and set to form 
     */
  private setStoredValuesToFilter(): void {
    let storeFiltersData: any = localStorage.getItem(this.localStorageKey);
    let storeWeightsData: any = localStorage.getItem(this.localStorageWNKey);
    if (storeFiltersData && storeWeightsData) {
      let filterStatus: ILotFilterStatusModel = JSON.parse(storeFiltersData);
      let weightNotes: Array<IWeightModel> = JSON.parse(storeWeightsData);
      this.dataWeightNotes = {
        notes: weightNotes,
        params: filterStatus
      }
      this.urlBackToListSaved = filterStatus.urlBackToList;
    }
  }
  /**
 * Production flows request
 * @param commodityId selected
 * @param commodityTypeId selected
 */
  private getProductionFlows(commodityId: number, commodityTypeId: string): void {
    this._lotsService.getProductionFlows(commodityId, commodityTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: Array<ILotProductionFlowModel>) => {
          this.productionFlows = response;
          this.blockUIProductionFlows.stop();
          if(this.dataWeightNotes.params.productionFlow) {
            this.onClickProductionFlowCard(this.dataWeightNotes.params.productionFlow);
          };
        },
        (error: HttpErrorResponse) => {
          this.blockUIProductionFlows.stop();
          let message = this._errorHandlerService.handleError(error, 'production-flows');
          this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
        }
      );
  }
  /**
 * On navigate to create workflow item
 */
  public navigateToCreateWorkflowView(): void {
    this.saveFilterStatusInLocalStorage();
    localStorage.setItem('selected-commodity', JSON.stringify({
      id: this.dataWeightNotes.params.commodity.id,
      name: this.dataWeightNotes.params.commodity.name
    }));
    this._router.navigateByUrl('/workflow?isFromNewLot=true');
  }

  /**
   * Save status object of form in local storage
   */
  private saveFilterStatusInLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.dataWeightNotes.params));
    localStorage.setItem(this.localStorageWNKey, JSON.stringify(this.dataWeightNotes.notes));
  }
  /**
   * select production flow
   * @param flow flow selected
   */
  public onClickProductionFlowCard(flow: ILotProductionFlowModel) {
    if (flow.totalProcess > 0) {
      this.productionFlow = flow;
      this.dataWeightNotes.params.productionFlow = this.productionFlow;
      this.eventCreateNewLot.emit(this.dataWeightNotes);
    }
  }
  public onBackToList(): void {
    this.eventBackTab.emit();
  }

  /**
   * destroy subscription
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
