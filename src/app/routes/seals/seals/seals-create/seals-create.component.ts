import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { SealImage } from '../../models/seal-image.model';
import { SealsService } from '../../seals.service';
import { AlertService } from '../../../../shared/utils/alerts/alert.service';
import { I18nPipe } from '../../../../shared/i18n/i18n.pipe';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SealsModalComponent } from '../../seals-modal/seals-modal.component';
import { rotate, rotateUp } from '../../../../shared/utils/animations/rotate.animation';
import { ActionCreateSealModel } from '../../models/action-create-seal.model';
import { SealActionTypeEnum } from "../../models/seal-action-type.enum";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockUiComponent } from 'src/app/shared/block/block.component';
import { ThemeService } from 'src/theme/theme.service';
import { SealCreateModel } from "../../models/seal-create.model";
import { SealSeller } from '../../models/seal-seller.model';
import { SealFarm } from '../../models/seal-farm.model';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { sortByStringValue } from 'src/app/shared/utils/functions/sortFunction';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

@Component({
  selector: 'app-seals-create',
  templateUrl: './seals-create.component.html',
  styleUrls: ['./seals-create.component.css'],
  animations: [rotate, rotateUp]
})
export class SealsCreateComponent implements OnChanges {

  @Input() data: ActionCreateSealModel = null;
  @Output() cancelEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshEvent: EventEmitter<boolean> = new EventEmitter();

  @BlockUI('container-seals-create') blockUI: NgBlockUI;

  private token: any;
  private initialRelatedFarms: Array<number>;
  private subscripcionEventGetSeal: Subscription;
  private subscripcionEventGetFarm: Subscription;

  public ALPHANUMERIC_REGEXP: RegExp = CONSTANTS.ALPHANUMERIC_REGEXP;
  public blockTemplate: BlockUiComponent;
  public seal: SealCreateModel;
  public isLoading: boolean;
  public title: string;
  public imageLabel: string;
  public isEditting: boolean;
  public isDarkTheme: boolean;
  public isRemovingFarm: boolean;
  public sealActionTypeOptions: any;
  public isDisableActionButtons: boolean;
  public sealNameReference: string;
  public imageWasModified: boolean;

  constructor(
    private sealSvc: SealsService,
    private alertService: AlertService,
    private i18nPipe: I18nPipe,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private notifierService: NotifierService,
    private _errorHandler: ResponseErrorHandlerService
  ) {

    this.initializeValues();

    this.themeService.theme.subscribe(theme => {
      this.isDarkTheme = ('dark' === theme);
    });

  }

  ngOnDestroy() {
    this.subscripcionEventGetSeal.unsubscribe();
    this.subscripcionEventGetFarm.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('data') && this.data) {
      this.blockUI.start();
      this.initializeValues();
      switch (this.data.actionType) {
        case SealActionTypeEnum.Create:
          this.title = 'new-seal';
          this.imageLabel = 'browse-image';
          this.isEditting = false;
          this.isLoading = false;
          this.blockUI.stop();
          break;
        case SealActionTypeEnum.Edit:
          this.title = 'edit-seal';
          this.imageLabel = 'edit-image';
          this.isEditting = true;
          this.seal.certification_id = this.data.sealId;
          this.getSeal(this.data.sealId, false).then((sealDataLoaded: boolean) => {
            this.isLoading = false;
            if (sealDataLoaded) {
              this.getFarms(this.data.sealId).then((responseFarms: boolean) => {
                if (responseFarms) {
                  this.initialRelatedFarms = this.getArrayFarmIdRelated();
                }
                this.blockUI.stop();
              });
            }
          });
          break;
        default:
          setTimeout(() => {
            this.cancelEvent.emit(true);
          }, 0);
          break;
      }
    }
  }

  private initializeValues(): void {
    this.isLoading = true;
    this.token = JSON.parse(localStorage.getItem('token-data')) || 0;
    this.initialRelatedFarms = [];
    this.subscripcionEventGetSeal = new Subscription();
    this.subscripcionEventGetFarm = new Subscription();

    this.blockTemplate = BlockUiComponent;
    this.seal = new SealCreateModel();
    this.title = 'new-seal';
    this.imageLabel = 'browse-image';
    this.isEditting = false;
    this.seal.user_id = this.token.session;
    this.isDarkTheme = false;
    this.isRemovingFarm = false;
    this.sealActionTypeOptions = SealActionTypeEnum;
    this.isDisableActionButtons = false;
    this.sealNameReference = '';
    this.imageWasModified = false;
  }

  private getSeal(id: string, stopBlockUI: boolean = true): Promise<boolean> {
    return new Promise((resolve: any) => {
      this.subscripcionEventGetSeal.add(
        this.sealSvc.getSeal(id).subscribe(
          (response: any) => {
            if (response.data && response.data.length > 0) {
              let sealData: any = response.data[0];
              this.seal.name = sealData.name;
              this.sealNameReference = sealData.name;
              this.seal.image.src = ('' !== sealData.image && null !== sealData.image) ? sealData.image : null;
            }
            else {
              this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
            }
            if (stopBlockUI) {
              this.blockUI.stop();
            }
            return resolve(true);
          },
          (error) => {
            this.blockUI.stop();
            this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
            return resolve(false);
          }
        )
      );
    });
  }

  private getFarms(id: string): Promise<boolean> {
    return new Promise((resolve: any) => {
      this.subscripcionEventGetFarm.add(
        this.sealSvc.getProductorFarms(id).subscribe(
          (response: any) => {
            this.seal.number_related_farms = 0;
            if (response.data && response.data.length > 0) {
              let relatedSellers: Array<SealSeller> = [];
              let fullName: string = '';
              response.data.forEach((seller: any) => {
                fullName = seller.seller_name ?? '';
                if (seller.paternal_last?.length > 0) {
                  fullName += ` ${seller.paternal_last}`;
                }
                if (seller.maternal_last?.length > 0) {
                  fullName += ` ${seller.maternal_last}`;
                }
                let rSeller: SealSeller = new SealSeller({
                  id: seller.seller_id,
                  name: fullName,
                  farms: [],
                  isShowing: false
                });
                seller.certifications_farms.forEach((farm: any) => {
                  rSeller.farms.push(
                    new SealFarm({
                      id: farm.farm_id,
                      name: farm.farm_name
                    })
                  );
                  this.seal.number_related_farms++;
                });
                rSeller.farms = sortByStringValue(rSeller.farms, 'name');
                relatedSellers.push(rSeller);
              });
              this.seal.related_sellers = sortByStringValue(relatedSellers, 'name');
            }
            return resolve(true);
          },
          (error) => {
            this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
            return resolve(false);
          }
        )
      );
    });
  }

  public processFile(imageInput: any): void {
    if (imageInput.files.length > 1) {
      this.alertService.info(this.i18nPipe.transform('multiple-image-selected'));
    }
    else if (imageInput.files.length > 0) {
      this.blockUI.start();
      const file: File = imageInput.files[0];
      if (!file.type.match('image.*')) {
        this.blockUI.stop();
        this.alertService.error(this.i18nPipe.transform('invalid-image-seal-file'));
      }
      else {
        let extensionAllowed = false;
        let fileSize = parseFloat((file.size / 1024 / 1024).toFixed(4));
        const fileExtension = file.type.split('/')[1];
        switch (fileExtension.toLowerCase()) {
          case 'jpg':
          case 'jpeg':
          case 'png':
            extensionAllowed = true;
            break;
          default:
            extensionAllowed = false;
        }
        if (fileSize > 1 || !extensionAllowed) {
          this.blockUI.stop();
          this.alertService.error(this.i18nPipe.transform('image-not-match'));
        }
        else {
          const reader = new FileReader();
          reader.onload = ((event: any) => {
            this.seal.image = new SealImage({ src: event.target.result, file: file });
            this.imageWasModified = true;
            this.blockUI.stop();
          });
          reader.onabort = ((event: any) => {
            this.seal.image = new SealImage();
            this.imageWasModified = true;
            this.blockUI.stop();
          });
          reader.onerror = ((event: any) => {
            this.seal.image = new SealImage();
            this.imageWasModified = true;
            this.blockUI.stop();
          });
          reader.readAsDataURL(file);
        }
      }
    }
  }

  public onFileDropped($event: any): void {
    this.processFile($event);
  }

  public showFarms(seller: SealSeller): void {
    seller.isShowing = !seller.isShowing;
  }

  private getArrayFarmIdRelated(): Array<any> {
    let relatedFarms: Array<{ farm_id: number }> = [];
    this.seal.related_sellers.forEach((seller: SealSeller) => {
      seller.farms.forEach((farm: SealFarm) => {
        relatedFarms.push({ farm_id: farm.id });
      });
    });
    return relatedFarms;
  }

  private removeFarm(seller: SealSeller, farm: SealFarm): void {

    let idxSeller: number = this.seal.related_sellers.findIndex((s: SealSeller) => seller.id === s.id);

    if (idxSeller > -1) {

      let idxFarm: number = this.seal.related_sellers[idxSeller].farms.findIndex((f: SealFarm) => farm.id == f.id);

      if (idxFarm > -1) {

        this.seal.related_sellers[idxSeller].farms.splice(idxFarm, 1);

        this.seal.number_related_farms--;

        if (0 == this.seal.related_sellers[idxSeller].farms.length) {
          this.seal.related_sellers.splice(idxSeller, 1);
        }

      }

    }

  }

  private checkIfExistPendindRemoveFarm(): void {
    let existPendingRemove: boolean = false;
    for (let s = 0; s < this.seal.related_sellers.length; s++) {
      for (let f = 0; f < this.seal.related_sellers[s].farms.length; f++) {
        if (this.seal.related_sellers[s].farms[f].isRemoving) {
          existPendingRemove = true;
          break;
        }
      }
      if (existPendingRemove) {
        break;
      }
    }
    this.isRemovingFarm = existPendingRemove;
  }

  openModal() {

    let dialogParameters: any = (window.innerWidth > 500) ?
      {
        width: '750px',
        disableClose: true,
        data: { actionType: this.data.actionType, seal: this.seal }
      } :
      {
        maxWidth: '100vw !important',
        width: '90vw',
        disableClose: true,
        panelClass: 'full-width-dialog',
        data: { actionType: this.data.actionType, seal: this.seal }
      };


    let dialogRef: MatDialogRef<SealsModalComponent, any> = this.dialog.open(SealsModalComponent, dialogParameters);


    dialogRef.afterClosed().subscribe((response: Array<SealSeller>) => {
      if (response) {
        this.blockUI.start();
        response.forEach((seller: SealSeller) => {
          seller.farms = sortByStringValue(seller.farms, 'name');
        });
        this.seal.related_sellers = sortByStringValue(response, 'name');
        this.seal.number_related_farms = this.getArrayFarmIdRelated().length;
        this.blockUI.stop();
      }
    });

  }

  public submitRemoveFarm(seller: SealSeller, farm: SealFarm): void {

    this.isRemovingFarm = true;

    farm.isRemoving = true;

    switch (this.data.actionType) {
      case SealActionTypeEnum.Create:

        this.removeFarm(seller, farm);

        this.checkIfExistPendindRemoveFarm();

        break;
      case SealActionTypeEnum.Edit:

        this.sealSvc.discardFarmFromSeal(this.data.sealId, farm.id.toString()).subscribe(
          (response: any) => {

            if (response.data) {
              this.removeFarm(seller, farm);
              this.checkIfExistPendindRemoveFarm();
              this.notifierService.notify(
                'success',
                this.i18nPipe.transform('success-removed-farm-for-seal-msg').replace('[field_name]', "'" + farm.name + "'")
              );
            }
            else {
              farm.isRemoving = false;
              this.checkIfExistPendindRemoveFarm();
              this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
            }
          },
          (error) => {

            farm.isRemoving = false;

            this.checkIfExistPendindRemoveFarm();

            this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));

          }
        );

        break;

      default:
        break;
    }

  }

  private submitProcessCreateSeal(): void {
    let certificationData: any = {
      name: this.seal.name,
      image: this.seal.image.src,
      user_id: this.seal.user_id
    };
    this.sealSvc.createSeal(certificationData).subscribe(
      (responseCertification: any) => {
        if (responseCertification.hasOwnProperty('data') && Array.isArray(responseCertification.data)) {
          if (0 === this.seal.related_sellers.length) {
            this.blockUI.stop();
            this.isDisableActionButtons = false;
            this.notifierService.notify('success', this.i18nPipe.transform('success-created-seal-msg'));
            this.refreshEvent.emit(true);
          }
          else {
            this.seal.certification_id = responseCertification.data[0].certification_id;
            let certificationFarmsData: any = {
              user_id: this.seal.user_id,
              certification_id: this.seal.certification_id,
              related: this.getArrayFarmIdRelated()
            }
            this.sealSvc.addRelatedFarms(certificationFarmsData).subscribe(
              (responseFarm: any) => {
                if (responseFarm.status && responseFarm.data) {
                  this.blockUI.stop();
                  this.isDisableActionButtons = false;
                  this.notifierService.notify('success', this.i18nPipe.transform('success-created-seal-msg'));
                  this.refreshEvent.emit(true);
                }
                else {
                  this.blockUI.stop();
                  this.isDisableActionButtons = false;
                  this.notifierService.notify('error', this.i18nPipe.transform('error-related-farms-to-create-seal'));
                  this.refreshEvent.emit(true);
                }
              },
              (error) => {
                this.blockUI.stop();
                this.isDisableActionButtons = false;
                this.notifierService.notify('error', this.i18nPipe.transform('error-related-farms-to-create-seal'));
                this.refreshEvent.emit(true);
              }
            );
          }
        }
        else {
          this.blockUI.stop();
          this.isDisableActionButtons = false;
          this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
        }
      },
      (error) => {
        this.blockUI.stop();
        this.isDisableActionButtons = false;
        if (
          error &&
          error.hasOwnProperty('error') &&
          error.error &&
          error.error.hasOwnProperty('data') &&
          error.error.data &&
          error.error.data.name[0] === 'This name is already registered'
        ) {
          this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('name-already-registered'));
        }
        else {
          let message = this._errorHandler.handleError(error, 'seals');
          this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), message);
        }
      }
    );
  }

  private submitProcessEditSeal(): void {
    let certificationData: any = {
      certification_id: this.seal.certification_id,
      name: this.seal.name,
      image: this.seal.image.src,
      user_id: this.seal.user_id
    };
    this.sealSvc.updateSeal(certificationData).subscribe(
      (responseCertification: any) => {
        if (responseCertification.hasOwnProperty('data') && Array.isArray(responseCertification.data)) {
          this.blockUI.stop();
          this.isDisableActionButtons = false;
          this.notifierService.notify('success', this.i18nPipe.transform('success-updated-seal-msg'));
          this.refreshEvent.emit(true);
        }
        else {
          this.blockUI.stop();
          this.isDisableActionButtons = false;
          this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('unidentified-problem'));
        }
      },
      (error) => {
        this.blockUI.stop();
        this.isDisableActionButtons = false;
        if (
          error &&
          error.hasOwnProperty('error') &&
          error.error &&
          error.error.hasOwnProperty('data') &&
          error.error.data &&
          error.error.data.name[0] === 'This name is already registered'
        ) {
          this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), this.i18nPipe.transform('name-already-registered'));
        }
        else {
          let message = this._errorHandler.handleError(error, 'seals');
          this.alertService.errorTitle(this.i18nPipe.transform('error-msg'), message);
        }
      }
    );
  }

  public submitData(): void {
    this.isDisableActionButtons = true;
    this.blockUI.start();
    switch (this.data.actionType) {
      case SealActionTypeEnum.Create:
        this.submitProcessCreateSeal();
        break;
      case SealActionTypeEnum.Edit:
        this.submitProcessEditSeal();
        break;
      default:
        break;
    }
  }

  public cancel(): void {
    this.blockUI.start();
    let currentRelatedFarms: Array<number> = this.getArrayFarmIdRelated();
    let isFarmRelatedModified: boolean = (JSON.stringify(this.initialRelatedFarms) != JSON.stringify(currentRelatedFarms));
    this.blockUI.stop();
    if (isFarmRelatedModified) {
      this.refreshEvent.emit(true);
    }
    else {
      this.cancelEvent.emit(true);
    }
  }

  public onActionFooterSelected(action: number): void {
    switch (action) {
      case CONSTANTS.CRUD_ACTION.CANCEL:
        this.cancel();
        break;
      case CONSTANTS.CRUD_ACTION.UPDATE:
      case CONSTANTS.CRUD_ACTION.CREATE:
        this.submitData();
        break;
      default:
        break;
    }
  }

}
