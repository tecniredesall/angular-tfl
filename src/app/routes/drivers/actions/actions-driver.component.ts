import { NotifierService } from 'angular-notifier';
import { ResizedEvent } from 'angular-resize-event';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { trimSpaces } from 'src/app/shared/utils/functions/trim-spaces';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { I18nPipe } from '../../../shared/i18n/i18n.pipe';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { CSVActionsService } from '../../../shared/utils/csv-actions/csv-actions.service';
import { ICSVProperty } from '../../../shared/utils/models/csv-properties.model';
import { validatorDuplicateDataFormArray } from '../../../shared/validators/validator-duplicate-data-form-array';
import { ModalDeleteDriverComponent } from '../modal-delete-driver/modal-delete-driver.component';
import { ITDriverActionInputModel, TDriverActionInputModel } from '../models/driver-action-input.model';
import { DriverActionRequestModel, IDriverActionRequestModel } from '../models/driver-action-request.model';
import { ITDriverModel, TDriverModel } from '../models/driver.model';
import { DriversService } from '../services/drivers.service';
import { conformToMask } from 'angular2-text-mask';
import { take, takeUntil } from 'rxjs/operators';
import { ICompanyModel } from 'src/app/shared/models/company.model';
import { IPaginator } from 'src/app/shared/models/paginator.model';
import { CompanyDialogComponent } from 'src/app/shared/components/company-dialog/company-dialog.component';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { arrayUnique } from 'src/app/shared/utils/functions/array-unique';

@Component({
    selector: 'app-actions-driver',
    templateUrl: './actions-driver.component.html',
    styleUrls: ['./actions-driver.component.scss'],
})
export class ActionDriversComponent implements OnDestroy {
    @Input() data: ITDriverActionInputModel = new TDriverActionInputModel();
    @Output() eventActionSelected: EventEmitter<any> = new EventEmitter();

    @BlockUI('action-driver-container') blockUI: NgBlockUI;
    @ViewChild('csvReader') csvReader: any;

    public CONSTANTS: any = CONSTANTS;
    public isEdit: boolean;
    public drivers: UntypedFormArray;
    public initialEditDriverValue: any;
    public dataWasMadeModified: boolean;
    public headerLineClass: string;
    public responsiveClass: string;
    public types = [
        { id: CONSTANTS.DRIVER_TYPE.OWNER, name: 'drive-type-owner' },
        { id: CONSTANTS.DRIVER_TYPE.THIRD, name: 'drive-type-third' }
    ];
    public transportCompanies = [];

    private dialogRef: MatDialogRef<ModalDeleteDriverComponent, any> = null;
    private destroy$: Subject<boolean> = new Subject();
    private _transportCompanyPaginator: IPaginator;

    readonly DRIVER_TYPE = CONSTANTS.DRIVER_TYPE;

    constructor(
        private _dialog: MatDialog,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _driversService: DriversService,
        private _companyService: CompanyService,
        private _notifierService: NotifierService,
        private _csvActionsService: CSVActionsService,
        private _errorHandlerService: ResponseErrorHandlerService,
    ) {
        this.initializeValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('data') && this.data) {
            this.initializeValues();
            this.isEdit = CONSTANTS.ACTIONS_MODE.EDIT == this.data.action;
            let driverForm: UntypedFormGroup = this.createForm();
            driverForm.patchValue({
                name: this.data.driver.name,
                paternalLast: this.data.driver.paternalLast,
                license: this.data.driver.license,
                fullName: this.data.driver.fullName,
                identity: conformToMask(
                    this.data.driver.identity,
                    CONSTANTS.IDENTITY_MASK,
                    { guide: false }
                ).conformedValue,
                typeId: this.data.driver.typeId,
                transportCompanyId: this.data.driver.transportCompanyId
            });

            if (this.isEdit) {
                this.initialEditDriverValue = driverForm.value;
                delete this.initialEditDriverValue.fullName;
                driverForm.valueChanges
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((data: any) => {
                        delete data.fullName;
                        this.dataWasMadeModified =
                            JSON.stringify(this.initialEditDriverValue) !=
                            JSON.stringify(data);
                    })
                this._getTransportCompanies(null, this.data.driver.transportCompany, 0);
            } else {
                this._getTransportCompanies()
            }
            this.drivers.push(driverForm);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private _getTransportCompanies(url?: string, company?: ICompanyModel, indexItem?: number) {
        this._companyService.getTransportCompanies(url)
            .pipe(take(1))
            .subscribe(
                (response: { data: ICompanyModel[], paginator: IPaginator }) => {
                    let transportCompanies = response.data;
                    this.transportCompanies = arrayUnique(this.transportCompanies.concat(transportCompanies), 'id');
                    this._transportCompanyPaginator = response.paginator;
                    if(company) {
                        let findCompany = this.transportCompanies.find(t => t.id == company.id);
                        if(!findCompany) {
                            this.transportCompanies.push(company);
                        }
                        this.drivers.at(indexItem).patchValue({ transportCompanyId: company.id });
                        this.drivers.at(indexItem).updateValueAndValidity();
                    }
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._errorHandlerService.handleError(error, 't-drivers');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
    }

    public paginationDrivers() {
        if (this._transportCompanyPaginator.nextPageUrl) {
            this._getTransportCompanies(this._transportCompanyPaginator.nextPageUrl)
        }
    }

    private initializeValues(): void {
        this.isEdit = false;
        this.drivers = new UntypedFormArray(
            [],
            validatorDuplicateDataFormArray('license', 'fullName', 'identity')
        );
        this.initialEditDriverValue = new TDriverModel();
        this.dataWasMadeModified = false;
        this.headerLineClass = 'ad-partial-header-line';
        this.responsiveClass = 'actions-driver-lg';
    }

    private createForm(): UntypedFormGroup {
        let formGroup: UntypedFormGroup = new UntypedFormGroup({
            name: new UntypedFormControl('', [
                Validators.required,
                Validators.maxLength(CONSTANTS.MAX_LENGTH_DRIVER_NAME),
                Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
            ]),
            paternalLast: new UntypedFormControl('', [
                Validators.required,
                Validators.maxLength(CONSTANTS.MAX_LENGTH_DRIVER_PATERNAL_LAST),
                Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
            ]),
            identity: new UntypedFormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(CONSTANTS.IDENTITY_MASK.length)
                ],
            ),
            license: new UntypedFormControl('', [
                Validators.required,
                Validators.maxLength(CONSTANTS.MAX_LENGTH_DRIVER_LICENSE),
                Validators.pattern(CONSTANTS.LICENSE_REGEXP),
            ]),
            fullName: new UntypedFormControl(''),
            typeId: new UntypedFormControl(null, Validators.required),
            transportCompanyId: new UntypedFormControl(null)
        });

        formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: any) =>
            this.setFullNameValue(formGroup)
        )

        return formGroup;
    }

    private setFullNameValue(formGroup: UntypedFormGroup): void {
        let fullName: string = '';
        let values: any = formGroup.value;
        values.name = trimSpaces(values.name);
        values.paternalLast = trimSpaces(values.paternalLast);
        if ('' != values.name && '' != values.paternalLast) {
            fullName = values.name;
            if (values.paternalLast.length > 0) {
                fullName += ` ${values.paternalLast}`;
            }
        }
        formGroup.get('fullName').setValue(fullName, { emitEvent: false });
    }

    public onEventContainerResized(event: ResizedEvent): void {
        this.responsiveClass =
            event.newWidth < 535 ? 'actions-driver-xs' : 'actions-driver-lg';

        if (this.data.isFromExternalModule) {
            this.headerLineClass =
                event.newWidth < 284
                    ? 'ad-full-header-line'
                    : 'ad-partial-header-line';
        } else {
            this.headerLineClass = 'ad-full-header-line';
        }
    }

    public addItem(): void {
        this.drivers.push(this.createForm());
    }

    public removeItem(index: number): void {
        this.drivers.removeAt(index);
    }

    public onActionFooterSelected(action: number): void {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.deleteDriver();
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL:
                this.cancel();
                break;

            case CONSTANTS.CRUD_ACTION.UPDATE:
            case CONSTANTS.CRUD_ACTION.CREATE:
                this.submit();
                break;

            default:
                break;
        }
    }

    public cancel(): void {
        this.eventActionSelected.emit({
            action: CONSTANTS.CRUD_ACTION.CANCEL,
            driver: {},
        });
    }

    public deleteDriver(): void {
        this.dialogRef = this._dialog.open(ModalDeleteDriverComponent, {
            autoFocus: false,
            disableClose: true,
            data: this.data.driver,
        });
        this.dialogRef.afterClosed().pipe(take(1)).subscribe((response) => {
            this.dialogRef = null;
            if (response.refresh) {
                this.eventActionSelected.emit({
                    action: CONSTANTS.CRUD_ACTION.DELETE,
                    driver: {},
                });
            }
        })
    }

    public submit(): void {
        if (this.isEdit) {
            this.submitEdit();
        } else {
            this.submitCreate();
        }
    }

    private submitCreate(): void {
        this.blockUI.start();

        let data: Array<IDriverActionRequestModel> = [];

        this.drivers.value.forEach((value: any) => {
            data.push(new DriverActionRequestModel(new TDriverModel(value)));
        });

        this.createDriver(data);
    }

    private createDriver(data: Array<IDriverActionRequestModel>): void {
        this._driversService.saveDrivers(data).pipe(take(1)).subscribe(
            (response: any) => {
                let msg: string =
                    data.length > 1
                        ? 'success-drivers-create'
                        : 'success-driver-create';

                this._notifierService.notify(
                    'success',
                    this._i18nPipe.transform(msg)
                );

                this.blockUI.stop();

                this.eventActionSelected.emit({
                    action: CONSTANTS.CRUD_ACTION.CREATE,
                    driver: response.data,
                });
            },
            (error: HttpErrorResponse) => {
                let message: string = this._errorHandlerService.handleError(
                    error,
                    't-drivers'
                );

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );

                this.blockUI.stop();
            }
        )
    }

    private submitEdit(): void {
        this.blockUI.start();
        let driverData: ITDriverModel = new TDriverModel(this.drivers.value[0]);
        driverData.id = this.data.driver.id;
        let data: IDriverActionRequestModel = new DriverActionRequestModel(
            driverData
        );
        this._driversService.editDrivers(data).pipe(take(1)).subscribe(
            (response: any) => {
                this._notifierService.notify(
                    'success',
                    this._i18nPipe.transform('success-driver-edit')
                );

                this.blockUI.stop();

                this.eventActionSelected.emit({
                    action: CONSTANTS.CRUD_ACTION.UPDATE,
                    driver: response,
                });
            },
            (error: HttpErrorResponse) => {
                let message: string = this._errorHandlerService.handleError(
                    error,
                    't-drivers'
                );

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    message
                );

                this.blockUI.stop();
            }
        )
    }

    public downloadLayout(): void {
        this._csvActionsService.downloadLayout(
            this._i18nPipe.transform('drivers'),
            this.generateProperties()
        );
    }

    public openFileExplorer(): void {
        this.csvReader.nativeElement.click();
    }

    public uploadFile(event: any): void {
        this.blockUI.start();

        this.drivers.clear();

        this.drivers.push(this.createForm());

        let properties: Array<ICSVProperty> = this.generateProperties();

        this._csvActionsService
            .uploadFile(event, properties, this.validateDriverFromCSV)
            .then((response: Array<ITDriverModel>) => {
                this.csvReader.nativeElement.value = '';

                if (null != response) {
                    let data: Array<IDriverActionRequestModel> = [];

                    response.forEach((d: ITDriverModel) => {
                        data.push(new DriverActionRequestModel(d));
                    });

                    this.createDriver(data);
                } else {
                    this.blockUI.stop();
                }
            });
    }

    private validateDriverFromCSV = (drivers: Array<any>): boolean => {
        let driversLoaded: UntypedFormArray = new UntypedFormArray(
            [],
            validatorDuplicateDataFormArray('license', 'fullName', 'identity')
        );

        let msg: string = '';

        let dataValid: boolean = true;

        for (let d = 0; d < drivers.length; d++) {
            let driver: ITDriverModel = new TDriverModel(drivers[d]);

            let driverForm: UntypedFormGroup = this.createForm();

            driverForm.patchValue({
                name: driver.name,
                identity: driver.identity,
                paternalLast: driver.paternalLast,
                license: driver.license,
                fullName: driver.fullName,
                typeId: driver.typeId,
                transportCompanyId: driver.transportCompanyId
            });

            driversLoaded.push(driverForm);

            let identityControl: AbstractControl = driverForm.get('identity');
            let nameControl: AbstractControl = driverForm.get('name');
            let paternalLastControl: AbstractControl = driverForm.get('paternalLast');
            let licenseControl: AbstractControl = driverForm.get('license');
            let fullNameControl: AbstractControl = driverForm.get('fullName');
            let typeControl: AbstractControl = driverForm.get('typeId');
            let transportCompanyIdControl: AbstractControl = driverForm.get('transportCompanyId');

            if (identityControl.hasError('required')) {
                msg = this._i18nPipe.transform('t-drivers-identity-required');

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (nameControl.hasError('required')) {
                msg = this._i18nPipe.transform('t-drivers-name-required');

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (nameControl.hasError('pattern')) {
                msg = this._i18nPipe
                    .transform('t-drivers-name-invalid-pattern')
                    .replace('[value]', driver.name);

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (nameControl.hasError('maxlength')) {
                msg = this._i18nPipe
                    .transform('t-drivers-name-invalid-length')
                    .replace('[value]', driver.name)
                    .replace('[length]', CONSTANTS.MAX_LENGTH_DRIVER_NAME);

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (paternalLastControl.hasError('required')) {
                msg = this._i18nPipe.transform(
                    't-drivers-father-last-required'
                );

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (paternalLastControl.hasError('pattern')) {
                msg = this._i18nPipe
                    .transform('t-drivers-father-last-invalid-pattern')
                    .replace('[value]', driver.paternalLast);

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (paternalLastControl.hasError('maxlength')) {
                msg = this._i18nPipe
                    .transform('t-drivers-father-last-invalid-length')
                    .replace('[value]', driver.paternalLast)
                    .replace(
                        '[length]',
                        CONSTANTS.MAX_LENGTH_DRIVER_PATERNAL_LAST
                    );

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (licenseControl.hasError('required')) {
                msg = this._i18nPipe.transform('t-drivers-license-required');

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (licenseControl.hasError('pattern')) {
                msg = this._i18nPipe
                    .transform('t-drivers-license-invalid-pattern')
                    .replace('[value]', driver.license);

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (licenseControl.hasError('maxlength')) {
                msg = this._i18nPipe
                    .transform('t-drivers-license-invalid-length')
                    .replace('[value]', driver.license)
                    .replace('[length]', CONSTANTS.MAX_LENGTH_DRIVER_LICENSE);

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (licenseControl.hasError('duplicate')) {
                msg = this._i18nPipe
                    .transform('t-drivers-license-value-duplicate')
                    .replace('[value]', driver.license);

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (fullNameControl.hasError('duplicate')) {
                msg = this._i18nPipe
                    .transform('t-drivers-fullname-value-duplicate')
                    .replace('[value]', driver.fullName);

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (identityControl.hasError('duplicate')) {
                msg = this._i18nPipe
                    .transform('t-drivers-identity-value-duplicate')
                    .replace('[value]', driver.identity);

                this._alertService.errorTitle(
                    this._i18nPipe.transform('error-msg'),
                    msg
                );

                dataValid = false;
            } else if (typeControl.hasError('required')) {
                msg = this._i18nPipe.transform('drivers-type-required');
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            } else if (typeControl.value == this.DRIVER_TYPE.THIRD && transportCompanyIdControl.value == '') {
                msg = this._i18nPipe.transform('drivers-company-name-required');
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }
            if (!dataValid) {
                break;
            }
        }

        return dataValid;
    };

    private generateProperties(): Array<ICSVProperty> {
        return [
            {
                property: 'identity',
                column: `${this._i18nPipe.transform('producer-identity')}*`,
            },
            {
                property: 'name',
                column: `${this._i18nPipe.transform('name')}*`,
            },
            {
                property: 'paternalLast',
                column: `${this._i18nPipe.transform('last-names')}*`,
            },
            {
                property: 'license',
                column: `${this._i18nPipe.transform('license')}*`,
            },
            {
                property: 'typeId',
                column: `${this._i18nPipe.transform('driver-type')}*`,
            },
            {
                property: 'transportCompanyId',
                column: `${this._i18nPipe.transform('company-name')}`,
            },
        ];
    }

    public onNewCompany(indexItem: number) {
        let dialog = this._dialog.open(CompanyDialogComponent);
        dialog.afterClosed().pipe(take(1)).subscribe(
            (company: ICompanyModel) => {
                if (company) {
                    this.transportCompanies = [];
                    this._getTransportCompanies(null, company, indexItem);
                }
            }
        )
    }
}
