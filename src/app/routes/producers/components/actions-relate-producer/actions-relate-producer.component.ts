import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { PaginationModel, Paginator } from 'src/app/shared/utils/models/paginator.model';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { ThemeService } from 'src/theme/theme.service';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { IProducerRelatedModel, ProducerRelatedModel } from '../../models/producer-related.model';
import { RequestRelatedModel } from '../../models/request-related.model';
import {
    RelatedProducersService
} from '../../services/related-producers/related-producers.service';

@Component({
  selector: 'app-actions-relate-producer',
  templateUrl: './actions-relate-producer.component.html',
  styleUrls: ['./actions-relate-producer.component.css']
})

export class ActionsRelateProducerComponent implements OnInit, OnDestroy {

  @Input() producerId: number = null;
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshEvent: EventEmitter<boolean> = new EventEmitter();
  @BlockUI('producers-relate-list') blockUIProducersRelateList: NgBlockUI;
  @BlockUI('producers-relate-modal') blockUIProducersRealateModal: NgBlockUI;

  public countSelectedItems = 0;
  public isSelectedAll = false;
  public producers: Array<ProducerRelatedModel> = [];
  public isSearch = false;
  private paginator: Paginator;
  private cachePaginator: Paginator;
  private cacheProducers: Array<ProducerRelatedModel> = [];
  private subscription: Subscription = new Subscription();
  public unselectedProducers: Array<ProducerRelatedModel> = []
  public searchControl = {
    value: '',
    isDisabled: false,
    isFocus: false,
    isSubmit: false,
    isLoading: false
  };
  public isDarkTheme: boolean;
  public isButtonSubmitDisabled: boolean;
  public blockTemplateModal = BlockModalUiComponent;

  constructor(
    private themeService: ThemeService,
    private producerService: RelatedProducersService,
    private notifierService: NotifierService,
    private i18nPipe: I18nPipe,
    private alertService: AlertService,
    private errorHandler: ResponseErrorHandlerService
  ) {
    this.themeService.theme.subscribe(theme => this.isDarkTheme = ('dark' === theme));
  }

  ngOnInit() {
    this.getProducers();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onChangeSearchInput(): void {
    let searchText: string = this.searchControl.value.replace(/^\s+|\s+$/gm, '');
    if (0 == searchText.length) {
      this.onCleanSearch();
    }
  }

  public onSearch(): void {
    if (!this.isSearch) {
      this.isSearch = true;
      this.cachePaginator = this.paginator
      this.cacheProducers = this.producers;
    }
    this.producers.forEach(p => {
      const temp = this.cacheProducers.find(x => x.id === p.id);
      if (temp) {
        temp.isSelected = p.isSelected;
      } else {
        this.cacheProducers.push(p);
      }
    });
    this.producers = [];
    this.paginator.currentPage = 1;
    this.searchControl.isSubmit = true;
    this.searchControl.isLoading = true;
    this.getProducers(this.searchControl.value);
  }

  public onCleanSearch(): void {
    this.searchControl.isSubmit = false;
    this.isSearch = false;
    this.restoreState();
    this.paginator = this.cachePaginator
    this.producers = this.cacheProducers;
    this.cacheProducers = [];
    this.searchControl.value = '';
    this.getProducers();
  }

  public onScroll(event: any): void {
    let offsetScroll: number = event.target.scrollHeight - (event.target.offsetHeight + event.target.scrollTop);
    if (
      (this.paginator.lastPage > this.paginator.currentPage) &&
      (offsetScroll < 5)
    ) {
      this.paginator.currentPage++;
      this.getProducers(this.searchControl.value === '' ? null : this.searchControl.value)
    }
  }

  public cancel(): void {
    this.closeEvent.emit(true);
  }

  public submitData(): void {
    this.blockUIProducersRelateList.start();
    this.isButtonSubmitDisabled = true;
    let selectedProducers = this.producers.filter((p) => p.isSelected);
    let body = {};
    if(this.isSelectedAll) {
      body = {
        producer_id: this.producerId,
        relatedProducers: [],
        notRelated: this.unselectedProducers.map(p => new RequestRelatedModel(this.producerId, p.id))
      }
    } else {
      body = {
        relatedProducers: selectedProducers.map(p => new RequestRelatedModel(this.producerId, p.id))
      }
    }
    this.subscription.add(      
      this.producerService.relateProducers(body).subscribe(
        (response: any) => {
          if (response.status) {
            this.blockUIProducersRelateList.stop();
            this.notifierService.notify('success', this.i18nPipe.transform('success-related-producers'));
            this.isButtonSubmitDisabled = true;
            this.refreshEvent.emit(true);
          }
        },
        error => {
          let message: string = this.errorHandler.handleError(error, 'producer')
          this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), message);
          this.blockUIProducersRelateList.stop();
          this.refreshEvent.emit(false);
        }
      ),
    )
  }

  public onSelect(producer: ProducerRelatedModel): void {
    producer.isSelected = !producer.isSelected;
    if(this.isSelectedAll) {
      let findIndexProducer = this.unselectedProducers.findIndex(p => p.id == producer.id)
      if(findIndexProducer < 0) {
        this.unselectedProducers.push(producer)
      } else {
        this.unselectedProducers.splice(findIndexProducer)
      }
    }
    this.updateCountSelected();
  }

  public onSelectAll() {
    if(!this.isSearch) {
      this.isSelectedAll = !this.isSelectedAll;
      this.producers.forEach(p => p.isSelected = this.isSelectedAll);
      this.countSelectedItems = this.isSelectedAll ? this.paginator.totalItems : 0;
      if(!this.isSelectedAll) {
        this.unselectedProducers = []
      }
    } else {
      this.producers.forEach(p => p.isSelected = !p.isSelected);
      this.updateCountSelected()
    }
  }

  private restoreState() {
    this.producers.forEach(p => {
      const temp = this.cacheProducers.find(x => x.id === p.id);
      if (temp) {
        temp.isSelected = p.isSelected;
      } else {
        if (p.isSelected) {
          this.cacheProducers.push(p);
        }
      }
    });
  }

  private updateCountSelected() {
    let concatArray: Array<ProducerRelatedModel> = [...new Set([...this.cacheProducers, ...this.producers])];
    let count = this.isSelectedAll ? 
      (this.isSearch ? this.cachePaginator.totalItems : this.paginator.totalItems) - this.unselectedProducers.length 
      : concatArray.filter(p => p.isSelected).length;
    this.countSelectedItems = count
  }

  private getProducers(textSearch: string = '') {
    this.blockUIProducersRelateList.start();
    this.isButtonSubmitDisabled = true;
    if (this.searchControl.isSubmit) {
      this.searchControl.isLoading = true;
    }
    this.searchControl.isDisabled = true;
    this.subscription.add(
      this.producerService.fetchProducer(this.paginator ? this.paginator.currentPage : 1, this.producerId, textSearch).subscribe(
        (response: any) => {
          this.paginator = new Paginator(response.data as PaginationModel);
          response?.data?.data?.forEach((item: any) => {
            let producer: IProducerRelatedModel = new ProducerRelatedModel(item, true);
            producer.isSelected = this.isSelectedAll;
            const listElement = this.producers.find(x => x.id === producer.id);
            if (!listElement) {
              const cacheElement = this.cacheProducers.find(x => x.id === producer.id);
              if (!cacheElement) {
                this.producers.push(producer);
              } else {
                this.producers.push(cacheElement);
              }
            }
          });
          this.searchControl.isDisabled = false;
          this.searchControl.isLoading = false;
          this.updateCountSelected()
          this.blockUIProducersRelateList.stop();
        }, 
        (error) => {
          let message: string = this.errorHandler.handleError(error, 'producer')
          this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), message);
          this.searchControl.isDisabled = false;
          this.searchControl.isLoading = false;
          this.blockUIProducersRelateList.stop();
        }
      )
    );
  }

}
