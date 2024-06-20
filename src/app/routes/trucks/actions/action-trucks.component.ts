import { Component, OnInit, Output, EventEmitter, Input, ViewChild, OnDestroy } from '@angular/core';
import { TrucksModel, TruksRequestModel, ITrucksModel } from '../models/trucks.model';
import { TrucksService } from '../services/trucks.service';
import { AlertService } from '../../../shared/utils/alerts/alert.service';
import { I18nPipe } from '../../../shared/i18n/i18n.pipe';
import { NotifierService } from 'angular-notifier';
import { CONSTANTS } from "../../../shared/utils/constants/constants";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { ThemeService } from 'src/theme/theme.service';
import { Subject, Subscription } from 'rxjs';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ResponseErrorHandlerService } from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import { CSVActionsService } from 'src/app/shared/utils/csv-actions/csv-actions.service';
import { ICSVProperty } from 'src/app/shared/utils/models/csv-properties.model';
import { validatorDuplicateDataFormArray } from 'src/app/shared/validators/validator-duplicate-data-form-array';
import { take, takeUntil } from 'rxjs/operators';
import { IVehicleTypeModel } from '../models/vehicle-type.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ICompanyModel } from 'src/app/shared/models/company.model';
import { CompanyDialogComponent } from 'src/app/shared/components/company-dialog/company-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from 'src/app/shared/services/company/company.service';
import { IPaginator } from 'src/app/shared/models/paginator.model';
import { arrayUnique } from 'src/app/shared/utils/functions/array-unique';

@Component({
    selector: 'app-action-trucks',
    templateUrl: './action-trucks.component.html',
    styleUrls: ['./action-trucks.component.scss']
})
export class ActionTrucksComponent implements OnInit, OnDestroy {
    @Output() eventRefresh = new EventEmitter();
    @Output() closeModal = new EventEmitter();
    @Output() success = new EventEmitter();
    @Input() currentTruck: TrucksModel = new TrucksModel(null);
    @Input() isEdit = false;
    @Input() isFromExternalModule = false;

    @ViewChild('csvReader') csvReader: any;
    @BlockUI('actions-trucks') blockUI: NgBlockUI;
    public templateBlockModalUiComponent: BlockModalUiComponent = BlockModalUiComponent;

    public theme: string;
    public dataTruck: TrucksModel;
    public formTrucks = new UntypedFormArray([], validatorDuplicateDataFormArray('license'))
    public isDarkTheme = false;
    public CONSTANTS: any = CONSTANTS;
    public dataWasMadeModified: boolean;
    public serviceTypes = [
        {id: CONSTANTS.TRANSPORT_SERVICE_TYPE.OWNER, name: 'drive-type-owner'},
        {id: CONSTANTS.TRANSPORT_SERVICE_TYPE.THIRD, name: 'drive-type-third'}
    ];
    public vehicleTypes: Array<IVehicleTypeModel>;
    public transportCompanies: ICompanyModel[] = [];
    private token: any;
    private destroy$ = new Subject();
    private _transportCompanyPaginator: IPaginator;
    readonly TRANSPORT_SERVICE_TYPE = CONSTANTS.TRANSPORT_SERVICE_TYPE;

    constructor(
        private _dialog: MatDialog,
        private _i18nPipe: I18nPipe,
        private _alertService: AlertService,
        private _trucksService: TrucksService,
        private _companyService: CompanyService,
        private _notifierService: NotifierService,
        private _csvActionsService: CSVActionsService,
        private _handlerError: ResponseErrorHandlerService,
    ) {
        this.token = localStorage.getItem('token-data') ? JSON.parse(localStorage.getItem('token-data')) : 0;
    }

    ngOnInit() {
        this._getVehicleType();
        if (this.isEdit) {
            this.dataTruck = JSON.parse(JSON.stringify(this.currentTruck));
            let form: UntypedFormGroup = this.createForm();
            form.patchValue({
                name: this.dataTruck.name,
                license: this.dataTruck.license,
                vehicleTypeId: this.dataTruck.vehicleTypeId,
                serviceTypeId: this.dataTruck.serviceTypeId,
                transportCompanyId: this.dataTruck.transportCompanyId
            })
            this.formTrucks.push(form)
            form.valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => {
                    let initialData = { name: this.dataTruck.name, license: this.dataTruck.license, vehicleTypeId: this.dataTruck.vehicleTypeId }
                    this.dataWasMadeModified = !(JSON.stringify(data) == JSON.stringify(initialData))
                })
            this._getTransportCompanies(null, this.dataTruck.transportCompany, 0)
        } else {
            this._getTransportCompanies();
            this.formTrucks.push(this.createForm())
        }
    }

    private _getVehicleType() {
        this.blockUI.start()
        this._trucksService.getVehicleType()
            .pipe(take(1))
            .subscribe(
                (data: Array<IVehicleTypeModel>) => {
                    this.vehicleTypes = data;
                    this.blockUI.stop()
                },
                error => {
                    this.blockUI.stop()
                    let message = this._handlerError.handleError(error, 'trucks')
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message)
                }
            );
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
                        this.formTrucks.at(indexItem).patchValue({ transportCompanyId: company.id });
                        this.formTrucks.at(indexItem).updateValueAndValidity();
                    }
                },
                (error: HttpErrorResponse) => {
                    let message: string = this._handlerError.handleError(error, 't-trucks');
                    this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message);
                }
            )
    }

    public paginationTransportCompanies() {
        if (this._transportCompanyPaginator.nextPageUrl) {
            this._getTransportCompanies(this._transportCompanyPaginator.nextPageUrl)
        }
    }

    public createForm(): UntypedFormGroup {
        let formTruck = new UntypedFormGroup({
            name: new UntypedFormControl('', [
                Validators.required,
                Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
                Validators.maxLength(CONSTANTS.MAX_LENGTH_TRUCK_NAME)]
            ),
            license: new UntypedFormControl('', [
                Validators.required, Validators.pattern(/^\S/),
                Validators.pattern(CONSTANTS.LICENSE_REGEXP),
                Validators.maxLength(CONSTANTS.MAX_LENGTH_TRUCK_LICENSE)
            ]),
            vehicleTypeId: new UntypedFormControl(null, Validators.required),
            serviceTypeId: new UntypedFormControl(null, Validators.required),
            transportCompanyId: new UntypedFormControl(null)
        })
        return formTruck
    }

    public openFileExplorer(): void {
        this.csvReader.nativeElement.click()
    }

    private generateProperties(): Array<ICSVProperty> {
        return [
            {
                property: 'name',
                column: this._i18nPipe.transform('brand') + '*',
            },
            {
                property: 'license',
                column: this._i18nPipe.transform('plate') + '*',
            },
            {
                property: 'vehicleTypeId',
                column: this._i18nPipe.transform('vehicle-type') + '*',
            },
            {
                property: 'serviceTypeId',
                column: this._i18nPipe.transform('truck-service-type') + '*',
            },
            {
                property: 'transportCompanyId',
                column: this._i18nPipe.transform('company-name') + '*',
            },
        ];
    }

    public downloadLayout(): void {
        this._csvActionsService.downloadLayout(this._i18nPipe.transform('vehicles'), this.generateProperties());
    }

    public uploadFile(event: any): void {
        this.blockUI.start();
        this.formTrucks.clear();
        this.formTrucks.push(this.createForm());
        let properties: Array<ICSVProperty> = this.generateProperties();
        this._csvActionsService.uploadFile(event, properties, this.validateTruckFromCSV).then(
            (response: Array<any>) => {
                this.csvReader.nativeElement.value = '';
                if (response) {
                    const findTransportCompanyID = response.map(item => {
                        const foundTruck = this.transportCompanies.find(truck => truck.name === item.transportCompanyId);
                        if (foundTruck) {
                            return { ...item, transportCompanyId: foundTruck.id };
                        }
                        return item;
                    });                    
                    const data = findTransportCompanyID.map((item) => new TruksRequestModel(item));
                    this.createTrucks(data)
                }
                else {
                    this.blockUI.stop();
                }
            }
        );
    }

    public addItem() {
        this.formTrucks.push(this.createForm());
    }

    private validateTruckFromCSV = (trucks: Array<any>): boolean => {
        let trucksLoaded: UntypedFormArray = new UntypedFormArray([], validatorDuplicateDataFormArray('license'));
        let msg: string = '';
        let dataValid: boolean = true;
        for (let d = 0; d < trucks.length; d++) {
            let truck = trucks[d];
            let truckForm: UntypedFormGroup = this.createForm();
            truckForm.patchValue({
                name: truck.name,
                license: truck.license,
                vehicleTypeId: truck.vehicleTypeId,
                serviceTypeId: truck.serviceTypeId,
                transportCompanyId: truck.transportCompanyId
            });
            trucksLoaded.push(truckForm);
            let nameControl: AbstractControl = truckForm.get('name');
            let licenseControl: AbstractControl = truckForm.get('license');
            let vehicleTypeId: AbstractControl = truckForm.get('vehicleTypeId');

            if (nameControl.hasError('required')) {
                msg = this._i18nPipe.transform('trucks-name-required');
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }
            else if (nameControl.hasError('pattern')) {
                msg = this._i18nPipe.transform('trucks-name-invalid-pattern')
                    .replace('[value]', truck.name);
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }

            else if (nameControl.hasError('maxlength')) {
                msg = this._i18nPipe.transform('trucks-name-invalid-length')
                    .replace('[value]', truck.name)
                    .replace('[length]', CONSTANTS.MAX_LENGTH_TRUCK_NAME)
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }

            else if (licenseControl.hasError('required')) {
                msg = this._i18nPipe.transform('trucks-plate-required');
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }

            else if (licenseControl.hasError('pattern')) {
                msg = this._i18nPipe.transform('trucks-plate-invalid-pattern')
                    .replace('[value]', truck.license);
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }

            else if (licenseControl.hasError('maxlength')) {
                msg = this._i18nPipe.transform('trucks-plate-invalid-length')
                    .replace('[value]', truck.license)
                    .replace('[length]', CONSTANTS.MAX_LENGTH_TRUCK_LICENSE)
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }

            else if (licenseControl.hasError('duplicate')) {
                msg = this._i18nPipe.transform('t-trucks-plate-duplicate')
                    .replace('[value]', truck.license);
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }
            else if (vehicleTypeId.hasError('required')) {
                msg = this._i18nPipe.transform('vehicle-type-required');
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }
            else if (this._hasUnknownProperties(truck)) {
                msg = this._i18nPipe.transform('vehicle-type-unknown-property')
                    .replace('[vehicleType]', truck.vehicleTypeId);
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), msg);
                dataValid = false;
            }

            if (!dataValid) {
                break;
            }
        }
        return dataValid;
    }

    private _hasUnknownProperties(truck: ITrucksModel): boolean {
        const index = this.vehicleTypes
            .findIndex(x => x.type.toLowerCase().trim() === String(truck.vehicleTypeId).toLowerCase().trim());
        if (index !== -1) {
            truck.vehicleTypeId = this.vehicleTypes[index].id;
            return false;
        } else {
            return true;
        }
    }

    public cancel(): void {
        this.closeModal.emit();
    }

    public editTrucks(): void {
        const data = new TruksRequestModel(this.formTrucks.value[0], this.dataTruck.truckId);
        this.blockUI.start();
        this._trucksService.editTrucks(data).pipe(take(1)).subscribe(
            () => {
                this.blockUI.stop();
                this._notifierService.notify('success', this._i18nPipe.transform('success-truck-edit'));
                this.success.emit();
            },
            e => {
                let message = this._handlerError.handleError(e, 'trucks')
                this.blockUI.stop()
                this._alertService.errorTitle(this._i18nPipe.transform('error-msg'), message)
            }
        );
    }

    public createTrucks(data: Array<any>): void {
        this.blockUI.start()
        data.forEach(d => d.user_id = this.token.session);
        this._trucksService.saveTrucks({ items: data }).pipe(take(1)).subscribe(
            (response) => {
                this.blockUI.stop()
                let message = data.length > 1 ? 'success-trucks-create' : 'success-truck-create';
                this._notifierService.notify('success', this._i18nPipe.transform(message));
                this.success.emit(CONSTANTS.CRUD_ACTION.CREATE);
                if (this.isFromExternalModule) {
                    this.eventRefresh.emit(response['data'])
                }
            },
            (error: HttpErrorResponse) => {
                if (400 == error.status || 406 == error.status) {
                    if (error.error.hasOwnProperty('data')) {
                        const data = Array.from(error.error.data);                        
                        let license = '';
                        data.forEach(
                            item => {
                                if (item.hasOwnProperty('reference')) {
                                    license = item['reference']['license'];
                                }
                            }
                        );
                        this._alertService.errorTitle(this._i18nPipe.transform('error-msg'),
                        this._i18nPipe.transform('trucks-license-validation-duplicate').replace('[value]', license));
                    }else {
                        this._alertService.showAlert(error.status, error.message);
                    }
                } else {
                    let message: string = this._handlerError.handleError(
                        error,
                        'trucks'
                    );
                    this._alertService.errorTitle(
                        this._i18nPipe.transform('error-msg'),
                        message
                    );
                }


            }

        );
    }

    public removeItem(index: number): void {
        this.formTrucks.removeAt(index)
    }

    public deleteTrucksRegister(): void {
        this.blockUI.start();
        this._trucksService.deleteTrucks(this.dataTruck.truckId).pipe(take(1)).subscribe(
            () => {
                this.blockUI.stop();
                this._notifierService.notify('success', this._i18nPipe.transform('success-delete-truck'));
                this.success.emit();
            },
            error => {
                this.blockUI.stop();
                const message: string = this._handlerError.handleError(error, 'trucks');
                this._alertService.error(message)
            }
        );
    }

    public submit(): void {
        if (this.isEdit) {
            this.editTrucks();
        }
        else {
            const data = this.formTrucks.value.map((item) => new TruksRequestModel(item));
            this.createTrucks(data);
        }
    }

    public onActionFooterSelected(action: number): void {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.deleteTrucksRegister();
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

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
