import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SealsService } from '../seals.service';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { rotate, rotateUp } from '../../../shared/utils/animations/rotate.animation';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { SealCreateModel } from '../models/seal-create.model';
import { SealSeller } from '../models/seal-seller.model';
import { SealFarm } from '../models/seal-farm.model';
import { ThemeService } from 'src/theme/theme.service';
import { SealActionTypeEnum } from '../models/seal-action-type.enum';
import { NotifierService } from 'angular-notifier';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { Subscription } from 'rxjs';
import { ISealFarmProducerModel, ISealProducerModel, ISealProducerPaginatorModel } from '../models/seal-producer.model';

declare const $: any;

@Component({
  selector: 'app-seals-modal',
  templateUrl: './seals-modal.component.html',
  styleUrls: ['./seals-modal.component.css'],
  animations: [rotate, rotateUp]
})
export class SealsModalComponent implements OnInit, OnDestroy {

  @BlockUI('producers-list') blockUIProducersList: NgBlockUI;
  @BlockUI('producers-modal') blockUIProducersModal: NgBlockUI;

  public blockTemplateModal: BlockModalUiComponent;
  public searchControl: {
    value: string,
    isDisabled: boolean,
    isFocus: boolean,
    isSubmit: boolean,
    isLoading: boolean
  };
  public sellers: Array<SealSeller>;
  public totalSelectedFarms: number;
  public isLoadingMore: boolean;
  public isSellersListOrderReversed: boolean;
  public isButtonSubmitDisabled: boolean;
  public maxNumberSelectedFarms: number;
  public isDarkTheme: boolean;

  private selectedSellers: Array<SealSeller>;
  private currentPageListSellers: number;
  private totalPagesListSellers: number;
  private subscripcionEventoGetSellers: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { actionType: SealActionTypeEnum, seal: SealCreateModel },
    private sealSvc: SealsService,
    private alertSvc: AlertService,
    private dialogRef: MatDialogRef<SealsModalComponent>,
    private themeService: ThemeService,
    private notifierService: NotifierService,
    private i18nPipe: I18nPipe
  ) {
    this.themeService.theme.subscribe(theme => {
      this.isDarkTheme = ('dark' === theme);
    });
    this.blockTemplateModal = BlockModalUiComponent;
    this.searchControl = {
      value: '',
      isDisabled: true,
      isFocus: false,
      isSubmit: false,
      isLoading: false
    };
    this.sellers = [];
    this.totalSelectedFarms = 0;
    this.isLoadingMore = false;
    this.isSellersListOrderReversed = false;
    this.isButtonSubmitDisabled = true;
    this.maxNumberSelectedFarms = 50;

    this.selectedSellers = [];
    this.currentPageListSellers = 1;
    this.totalPagesListSellers = 1;
    this.subscripcionEventoGetSellers = new Subscription();
  }

  ngOnInit() {
    let previousRelatedSellers: Array<SealSeller> = JSON.parse(JSON.stringify(this.data.seal.related_sellers));
    previousRelatedSellers.forEach((seller: SealSeller) => {
      seller.isShowing = false;
      seller.isDisabled = true;
      seller.numberSelectedFarms = seller.farms.length;
      seller.farms.forEach((farm: SealFarm) => {
        farm.isRemoving = false;
        farm.isSelected = true;
        farm.isDisabled = true;
      });
      this.selectedSellers.push(new SealSeller(seller));
    });

  }

  ngAfterViewInit() {
    this.getSellers().then((response: boolean) => { });
  }

  ngOnDestroy() {
    this.subscripcionEventoGetSellers.unsubscribe();
  }

  public onScroll(event: any): void {
    let offsetScroll: number = event.target.scrollHeight - (event.target.offsetHeight + event.target.scrollTop);
    if (
      (this.totalPagesListSellers > this.currentPageListSellers)
      &&
      (offsetScroll < 5)
    ) {
      this.getMore();
    }
  }

  private processSellerResponse(response: Array<ISealProducerModel>): void {
    let tmpSeller: SealSeller = null;
    let tmpFarm: SealFarm = null;
    let idxSellerSelected: number = -1;
    let idxFarmSelected: number = -1;
    let idxSellerExistent: number = -1;
    let idxFarmExistent: number = -1;
    response.forEach((respSeller: ISealProducerModel) => {
      idxSellerSelected = this.selectedSellers.findIndex((r: SealSeller) => respSeller.id == r.id);
      tmpSeller = new SealSeller({
        id: respSeller.id,
        name: respSeller.fullName,
        farms: [],
        isShowing: false,
        isDisabled: (idxSellerSelected > -1) ? this.selectedSellers[idxSellerSelected].isDisabled : false,
        numberSelectedFarms: (idxSellerSelected > -1) ? this.selectedSellers[idxSellerSelected].numberSelectedFarms : 0
      });
      respSeller.farms.forEach((farm: ISealFarmProducerModel) => {
        idxFarmSelected = (idxSellerSelected > -1) ?
          this.selectedSellers[idxSellerSelected].farms.findIndex((rf: SealFarm) => farm.id == rf.id && rf.isSelected) :
          -1;
        tmpFarm = new SealFarm({
          id: farm.id,
          name: farm.name,
          isRemoving: false,
          isSelected: (idxFarmSelected > -1),
          isDisabled: (idxFarmSelected > -1) ? this.selectedSellers[idxSellerSelected].farms[idxFarmSelected].isDisabled : false
        });
        idxFarmExistent = tmpSeller.farms.findIndex((f: SealFarm) => tmpFarm.id === f.id);
        if (-1 === idxFarmExistent) {
          tmpSeller.farms.push(tmpFarm);
        }
      });
      idxSellerExistent = this.sellers.findIndex((s: SealSeller) => tmpSeller.id === s.id);
      if (-1 === idxSellerExistent) {
        tmpSeller.farms = sortByStringValue(tmpSeller.farms, 'name');
        this.sellers.push(tmpSeller);
      }
    });
    this.isSellersListOrderReversed = false;
    this.sellers = sortByStringValue(this.sellers, 'name');
  }

  private getSellers(textSearch: string = ''): Promise<boolean> {
    return new Promise((resolve: any) => {
      this.blockUIProducersList.start();
      this.isButtonSubmitDisabled = true;
      if (this.searchControl.isSubmit) {
        this.searchControl.isLoading = true;
      }
      this.sellers = [];
      this.searchControl.isDisabled = true;
      this.subscripcionEventoGetSellers.add(
        this.sealSvc.getSellers(
          this.currentPageListSellers,
          textSearch.length > 0 ? textSearch : null
        ).subscribe(
          (response: ISealProducerPaginatorModel) => {
            let statusResponse: boolean;
            if (response) {
              this.processSellerResponse(response.producers);
              if (0 == textSearch.length) {
                this.totalPagesListSellers = response.lastPage;
              }
              statusResponse = true;
            }
            else {
              this.alertSvc.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
              statusResponse = false;
            }
            this.searchControl.isDisabled = false;
            if (this.searchControl.isSubmit) {
              this.searchControl.isLoading = false;
            }
            this.blockUIProducersList.stop();
            this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();
            return resolve(statusResponse);
          },
          (error) => {
            this.searchControl.isDisabled = false;
            if (this.searchControl.isSubmit) {
              this.searchControl.isLoading = false;
            }
            this.blockUIProducersList.stop();
            this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();
            this.alertSvc.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
            return resolve(false);
          }
        )
      );
    });
  }

  private getMore(): void {
    if (!this.searchControl.isSubmit && !this.isLoadingMore && this.sellers.length > 0) {
      this.isLoadingMore = true;
      this.searchControl.value = '';
      this.searchControl.isDisabled = true;
      this.currentPageListSellers++;
      this.subscripcionEventoGetSellers.add(
        this.sealSvc.getSellers(this.currentPageListSellers).subscribe(
          (response: ISealProducerPaginatorModel) => {
            if (response) {
              this.processSellerResponse(response.producers);
              this.searchControl.isDisabled = false;
              this.isLoadingMore = false;
            }
            else {
              this.alertSvc.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
            }
          },
          (error) => {
            this.searchControl.isDisabled = false;
            this.isLoadingMore = false;
            this.alertSvc.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
          }
        )
      );
    }
  }

  public submitSearch(isOnInputEvent: boolean = false): void {
    if (!this.searchControl.isDisabled) {
      this.searchControl.value = this.searchControl.value.replace(/^\s+|\s+$/gm, '');
      if (isOnInputEvent && 0 == this.searchControl.value.length) {
          this.clearSearch();
      }
      else if (!isOnInputEvent){
        if (this.searchControl.value.length > 0) {
          this.searchControl.isSubmit = true;
          this.getSellers(this.searchControl.value).then((response: boolean) => { });
        }
        else if (this.searchControl.isSubmit) {
          this.clearSearch();
        }
      }
    }
  }

  public clearSearch(): void {

    if (!this.searchControl.isDisabled) {

      this.searchControl.value = '';

      if (this.searchControl.isSubmit) {

        this.currentPageListSellers = 1;

        this.searchControl.isSubmit = false;

        this.searchControl.isLoading = false;

        this.getSellers().then((response: boolean) => { });

      }

    }

  }

  public toggleSellers() {

    this.blockUIProducersList.start();

    this.isButtonSubmitDisabled = true;

    this.isSellersListOrderReversed = !this.isSellersListOrderReversed;

    this.sellers = (this.isSellersListOrderReversed) ?
      sortByStringValue(this.sellers, 'name', false) :
      sortByStringValue(this.sellers, 'name');

    this.blockUIProducersList.stop();

    this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();

  }

  public toggleFarm(seller: SealSeller, farm: SealFarm): void {
    if (!farm.isDisabled) {
      let offsetTotalSelectedFarms: number = !farm.isSelected ? 1 : -1;
      if (this.totalSelectedFarms + offsetTotalSelectedFarms <= this.maxNumberSelectedFarms) {
        this.isButtonSubmitDisabled = true;
        farm.isSelected = !farm.isSelected;
        if (farm.isSelected) {
          seller.numberSelectedFarms++;
          this.totalSelectedFarms++;
        }
        else {
          seller.numberSelectedFarms--;
          this.totalSelectedFarms--;
        }
        let idxSelectedExistent: number = this.selectedSellers.findIndex((s: SealSeller) => seller.id == s.id);
        if (-1 == idxSelectedExistent && seller.numberSelectedFarms > 0) {
          // if seller NOT exist in selected list
          this.selectedSellers.push(new SealSeller(seller));
        }
        else if (idxSelectedExistent > -1) {
          // if seller exist in selected list
          if (seller.numberSelectedFarms > 0) {
            this.selectedSellers[idxSelectedExistent] = new SealSeller(seller);
          }
          else {
            this.selectedSellers.splice(idxSelectedExistent, 1);
          }
        }
        this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();
      }
    }
  }

  public selectAllFarmsFromSeller(seller: SealSeller): void {
    if (!seller.isDisabled) {
      this.isButtonSubmitDisabled = true;
      seller.farms.forEach((farm: SealFarm) => {
        if (!farm.isSelected) {
          this.toggleFarm(seller, farm);
        }
      });
      this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();
    }
  }

  public unselectAllFarms(seller: SealSeller): void {
    if (!seller.isDisabled) {
      this.isButtonSubmitDisabled = true;
      seller.farms.forEach((farm: SealFarm) => {
        if (farm.isSelected) {
          this.toggleFarm(seller, farm);
        }
      });
      this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();
    }
  }

  public showFincas(seller: SealSeller): void {
    seller.isShowing = !seller.isShowing;
  }

  private filterDataSelectedSellers(): Array<SealSeller> {

    let selSellers: Array<SealSeller> = JSON.parse(JSON.stringify(this.selectedSellers));

    selSellers.forEach((seller: SealSeller) => {
      seller.farms = seller.farms.filter((farm: SealFarm) => farm.isSelected);
    });

    selSellers.forEach((seller: SealSeller) => {

      seller.isShowing = false;
      seller.isDisabled = false;
      seller.numberSelectedFarms = 0;

      seller.farms.forEach((farm: SealFarm) => {
        farm.isRemoving = false;
        farm.isSelected = false;
        farm.isDisabled = false;
      });

    });


    return selSellers;

  }

  private getIsDisabledBtnSubmit(): boolean {

    return (0 == this.getArrayFarmIdRelated().length);

  }

  private getArrayFarmIdRelated(): Array<any> {

    let relatedFarms: Array<{ farm_id: number }> = [];

    this.selectedSellers.forEach((seller: SealSeller) => {

      seller.farms.forEach((farm: SealFarm) => {

        if (farm.isSelected && !farm.isDisabled) {
          relatedFarms.push({ farm_id: farm.id });
        }

      });

    });

    return relatedFarms;

  }

  public submitData(): void {

    this.blockUIProducersModal.start();

    this.isButtonSubmitDisabled = true;

    let selSellers: Array<SealSeller> = this.filterDataSelectedSellers();

    switch (this.data.actionType) {

      case SealActionTypeEnum.Create:

        this.blockUIProducersModal.stop();

        this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();

        this.dialogRef.close(selSellers);

        break;

      case SealActionTypeEnum.Edit:

        let certificationFarmsData: any = {
          user_id: this.data.seal.user_id,
          certification_id: this.data.seal.certification_id,
          related: this.getArrayFarmIdRelated()
        }

        this.sealSvc.addRelatedFarms(certificationFarmsData).subscribe(
          (responseFarm: any) => {
            if (responseFarm.status && responseFarm.data) {
              this.blockUIProducersModal.stop();
              this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();
              this.dialogRef.close(selSellers);
              this.notifierService.notify('success', this.i18nPipe.transform('success-related-farms-to-create-seal'));
            }
            else {
              this.blockUIProducersModal.stop();
              this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();
              this.dialogRef.close(null);
              this.notifierService.notify('error', this.i18nPipe.transform('error-related-farms-to-create-seal'));
            }
          },
          (error) => {
            this.blockUIProducersModal.stop();
            this.isButtonSubmitDisabled = this.getIsDisabledBtnSubmit();
            this.dialogRef.close(null);
            this.notifierService.notify('error', this.i18nPipe.transform('error-related-farms-to-create-seal'));
          }
        );

        break;
      default:
        break;

    }

  }

  public cancel(): void {
    this.dialogRef.close(null);
  }

}
