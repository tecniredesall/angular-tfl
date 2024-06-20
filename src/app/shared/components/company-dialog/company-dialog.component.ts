import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CompanyModel, ICompanyRequestModel } from '../../models/company.model';
import { ResponseErrorHandlerService } from '../../utils/response-error-handler/response-error-handler.service';
import { AlertService } from '../../utils/alerts/alert.service';
import { I18nPipe } from '../../i18n/i18n.pipe';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotifierService } from 'angular-notifier';
import { BlockModalUiComponent } from '../../block/block-modal.component';

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.scss']
})
export class CompanyDialogComponent {
    @BlockUI('company-dialog') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;
    public companyForm: UntypedFormGroup = new UntypedFormGroup({
        name: new UntypedFormControl(
            '',
            [
                Validators.required,
                Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
                Validators.maxLength(CONSTANTS.MAX_LENGTH_PRODUCER_NAME)
            ]
        ),
        legalIdentity: new UntypedFormControl(
            '',
            [
                Validators.required,
                Validators.minLength(CONSTANTS.IDENTITY_MASK.length)
            ]
        ),
        legalName: new UntypedFormControl(
            '',
            [
                Validators.required,
                Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
                Validators.maxLength(CONSTANTS.MAX_LENGTH_PRODUCER_NAME)
            ]
        ),
        legalLastname: new UntypedFormControl(
            '',
            [
                Validators.required,
                Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
                Validators.maxLength(CONSTANTS.MAX_LENGTH_PRODUCER_NAME)
            ]
        ),
    });

    readonly IDENTITY_MASK = CONSTANTS.IDENTITY_MASK;
    readonly CONSTANTS = CONSTANTS;

    constructor(
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _companyService: CompanyService,
        private _notifierService: NotifierService,
        private _handleError: ResponseErrorHandlerService,
        private _dialogRef: MatDialogRef<CompanyDialogComponent>
    ) { }

    public onActionFooter(action: number) {
        switch(action){
            case CONSTANTS.CRUD_ACTION.CANCEL:
                this._dialogRef.close();
                break;
            case CONSTANTS.CRUD_ACTION.CREATE:
                this._createCompany();
                break;
            default:
                break;
        }
    }

    private _createCompany() {
        this.blockUI.start();
        let company: ICompanyRequestModel = new CompanyModel(this.companyForm.value).getRequest();
        this._companyService.postCompany(company)
        .pipe(take(1))
        .subscribe(
            (response: any) => {
                this._notifierService.notify('success', this._i18nPipe.transform('success-company-create'));
                this.blockUI.stop();
                this._dialogRef.close(new CompanyModel(response?.data))
            },
            (error: HttpErrorResponse) => {
                let message: string = this._handleError.handleError(error, 'company');
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                this.blockUI.stop();
            }
        )
    }

}
