import { NotifierService } from 'angular-notifier';
import { conformToMask } from 'angular2-text-mask';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { of, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { deepCompareIsEqual } from 'src/app/shared/utils/functions/object-compare';
import { titleCaseWord } from 'src/app/shared/utils/functions/titlecase';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import {
    Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { ProducersService } from '../../services/producer/producers.service';
import { TIProducerModel, TIProducerRequestModel, TProducerModel } from 'src/app/shared/models/sil-producer';
import { InternationalPhoneConfigurationEnum } from 'src/app/shared/utils/models/international-phones-configuration.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorWorkerComponent } from '../error-worker/error-worker.component';

@Component({
    selector: 'app-producer-edit',
    templateUrl: './producer-edit.component.html',
    styleUrls: ['./producer-edit.component.scss'],
})
export class ProducerEditComponent implements OnInit, OnDestroy {
    @BlockUI('hello') blockUI: NgBlockUI;
    @HostBinding('class') hostClasses =
        'sil-overflow-container sil-overflow-container--padded';
    @HostBinding('class.profile') porfileViewStyle = false;
    @HostBinding('class.sil-overflow-container--in-modal') inModal = false;
    @Output() producerEvent: EventEmitter<{
        action: number;
        data: any; // IProducer
    }> = new EventEmitter();
    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    @Output() goToReferenceData = new EventEmitter<boolean>();
    @Input() externalUse = false;
    @Input() createSubject: Subject<boolean> = new Subject();
    @Input() isFromNewProducer = false;
    @Input() producer: TIProducerModel;
    @Input() federatedId: string;

    public producerPaylod: TIProducerModel;
    public form: UntypedFormGroup;
    public action: number;
    public maxDate: Date = new Date();
    public maxBirthdate: moment.Moment = moment().subtract(CONSTANTS.MIN_AGE, 'years');
    public originalFormAction: number;
    public formHasChanges: boolean = false;
    public componentOwner: string;
    public producerTypeList = Array<any>();
    public viewMore: boolean = false;
    public dateFormatInput: string = CONSTANTS.DATE_FORMATS.PRODUCER.LOCALE.es;
    public dateFormatLabel: string = CONSTANTS.DATE_FORMATS.PRODUCER.LOCALE.es;
    public isDisabledPhone: boolean = false;
    public originalProducer : TIProducerModel;
    public realoadAddress:boolean = false;
    readonly CONSTANTS = CONSTANTS;
    readonly ACTIONS = CONSTANTS.CRUD_ACTION;
    readonly COMP_OWNERS = CONSTANTS.PRODUCER_FORM_OWNER;
    readonly ID_NUMBERS = CONSTANTS.INTERNATIONAL_ID_NUMBERS;
    readonly PERMISSIONS = CONSTANTS.PERMISSIONS;
    readonly PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;

    private originalFormValue: any;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private addressDestroy$: Subject<boolean> = new Subject<boolean>();
    public numberMaskProducerNumber: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: false,
        allowDecimal: false,
        integerLimit: CONSTANTS.MAX_LENGTH_PRODUCER_EXTERNAL_ID,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: true,
    });
    public numberMaskRTN: any = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: false,
        allowDecimal: false,
        integerLimit: this.ID_NUMBERS.RTN.MIN_LENGTH,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: true,
    });
    public formAddress: UntypedFormGroup;

    constructor(
        private _i18n: I18nPipe,
        private _router: Router,
        private _dialog: MatDialog,
        private _alert: AlertService,
        private _route: ActivatedRoute,
        private _formBuilder: UntypedFormBuilder,
        private _i18nService: I18nService,
        private _notifier: NotifierService,
        private _producerService: ProducersService,
        private _responseErrorHandlerService: ResponseErrorHandlerService
    ) {
        this._i18nService.lang
            .pipe(takeUntil(this.destroy$))
            .subscribe(language => {
                this.dateFormatInput = CONSTANTS.DATE_FORMATS.PRODUCER.LOCALE[language];
                this.dateFormatLabel = CONSTANTS.DATE_FORMATS.PRODUCER.LABEL[language];
            })
    }

    public ngOnInit(): void {
        this.blockUI.start();
        if (this.isFromNewProducer) {
            this.createSubject.pipe(takeUntil(this.destroy$))
                .subscribe(() => this.postNewProducers(this.producerPaylod))
        }
        this.inModal = this.externalUse; // For host binding modal classes
        // Only load list and labels when language is ready
        // TODO language guard
        this._i18nService.lang.pipe(filter((l) => !!l), takeUntil(this.destroy$)).subscribe(() => {
            this.producerTypeList = this.getProducerList();
        });
        // Initialize form and form behaviour
        this._route.url
            .pipe(
                takeUntil(this.destroy$),
                tap((r) => {
                    // Set form behaviour (action type, owner, profile view styles)
                    this.action = this.setFormAction(r);
                    this.originalFormAction = this.setFormAction(r);
                    this.componentOwner = this.setComponentOwner();
                    this.porfileViewStyle =
                        this.originalFormAction === this.ACTIONS.READ
                            ? true
                            : false;
                }),
                switchMap(() => this._route.paramMap), // get route params for later use
                switchMap((p) =>
                    this.action !== this.ACTIONS.CREATE
                        ? this._producerService // Create new or load from backend
                            .getProducer(Number(p.get('id')))
                            .pipe(map((v) => new TProducerModel(v[0])))
                        : of(this.producer)
                ),
                tap((p) => {
                    this.producerPaylod = p
                    this.originalProducer = new TProducerModel(p)
                })
            )
            .subscribe(
                (u: TIProducerModel) => {
                    u
                        ? this.setProducerForm(u) // Set form or navigate back if null
                        : this._router.navigate(['routes', 'producers']);
                    this.blockUI.stop();
                },
                (e) => {
                    this.blockUI.stop();
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        this._i18n.transform('unidentified-problem')
                    );
                }
            );
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.addressDestroy$.next(true);
        this.addressDestroy$.complete();
    }

    public onAdressFormReady(form: UntypedFormGroup): void {
        this.formAddress = form;
        this.addressDestroy$.next(true)
        this.formAddress.valueChanges.pipe(takeUntil(this.addressDestroy$)).subscribe(() => {
            this.form.patchValue({
                ...this.formAddress.getRawValue(),
            });
            this.form.markAsDirty();
        });
    }

    public onAdittionalFormReady(form: UntypedFormGroup): void {
        const item = this.form;
        // Subscribe to additional changes
        form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            item.patchValue({
                ...form.getRawValue(),
            });
            item.markAsDirty();
        });
    }

    /**
     * Returns form action enum from activated route
     * @param url url segment to get route name from
     */
    private setFormAction(url: UrlSegment[]): number {
        const uri = url.toString();

        return uri.includes('edit')
            ? this.ACTIONS.UPDATE
            : uri.includes('profile')
                ? this.ACTIONS.READ
                : this.ACTIONS.CREATE;
    }

    /**
     * Return component owner name from current url
     */
    private setComponentOwner(): string {
        const url = this._router.url;
        return url.includes('producers')
            ? CONSTANTS.PRODUCER_FORM_OWNER.PRODUCERS
            : CONSTANTS.PRODUCER_FORM_OWNER.WEGHT_NOTES;
    }

    /**
     * Sets producer form group and form changes handler
     * @param producer producer data as received from API
     */
    private setProducerForm(producer: TIProducerModel): void {

        this.form = this.getProducerForm(producer);
        if (this.action === this.ACTIONS.UPDATE) {
            this.form.markAllAsTouched();
            this.form.get('externalId').disable();
        }
        this.onCountryChanged(producer.phoneCountry ?? InternationalPhoneConfigurationEnum.DEFAULT_COUNTRY);
        this.originalFormValue = this.form.getRawValue();
        this.setFormChangesHandler();
    }

    /**
     * Subscribe to form changes, validate form differences and prepare payload
     */
    private setFormChangesHandler(): void {
        this.form.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                map((f) =>
                    deepCompareIsEqual(this.originalFormValue, f)
                        ? null
                        : this.form.getRawValue()
                )
            )
            .subscribe((v) => {
                const newValue =
                    this.action === this.ACTIONS.UPDATE
                        ? this.form.value
                        : v ? Object.assign(v) : {};
                if (!v) {
                    // Form is the same as original reset values
                    this.form.markAsPristine();
                    if (this.action === this.ACTIONS.UPDATE) {
                        this.producerPaylod = {
                            ...this.producerPaylod,
                            ...this.originalFormValue,
                        };
                    } else {
                        this.producerPaylod = {
                            ...this.producerPaylod,
                            ...this.originalFormValue,
                        };
                    }
                } else {
                    this.formHasChanges = !deepCompareIsEqual(this.originalFormValue, v);
                    // Form is different
                    if (this.action === this.ACTIONS.UPDATE) {
                        this.producerPaylod = {
                            ...this.producerPaylod,
                            ...newValue,
                        };
                    } else {
                        this.producerPaylod = {
                            ...this.producerPaylod,
                            ...newValue,
                        };
                    }
                }
            });
    }

    /**
     * Returns a form group for producer object, to be added to a form array
     * @param producer producer data
     */
    private getProducerForm(producer: TIProducerModel): UntypedFormGroup {
        let form = this._formBuilder.group({
            id: [producer.id],
            age: [producer.age],
            identity: [
                producer.identity ?
                    conformToMask(
                        producer.identity,
                        CONSTANTS.IDENTITY_MASK,
                        { guide: false }
                    ).conformedValue : producer.identity,
                [
                    Validators.required,
                    Validators.minLength(CONSTANTS.IDENTITY_MASK.length),
                ]
            ],
            name: [
                producer.name,
                [
                    Validators.required,
                    Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
                    Validators.maxLength(CONSTANTS.MAX_LENGTH_PRODUCER_NAME),
                ],
            ],
            paternalLast: [
                producer.paternalLast,
                [
                    Validators.required,
                    Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
                    Validators.maxLength(
                        CONSTANTS.MAX_LENGTH_PRODUCER_FATHER_LAST_NAME
                    ),
                ],
            ],
            birthdate: [
                producer.birthdate,
                Validators.required
            ],
            associationDate: [
                producer.associationDate,
                Validators.required
            ],
            email: [
                producer.email,
                [
                    Validators.email,
                    Validators.maxLength(
                        CONSTANTS.MAX_LENGTH_EMAIL
                    ),
                ]
            ],
            phone: [
                producer.phone
                    ? this.applyPhoneMask(producer.phoneCountry, producer.phone)
                    : '',
                [
                    Validators.pattern(
                        CONSTANTS.INTERNATIONAL_PHONES[producer.phoneCountry].REGEXP
                    ),
                ],
            ],
            phoneCountry: [producer.phoneCountry],
            rtn: [
                producer.rtn,
                [
                    Validators.minLength(this.ID_NUMBERS.RTN.MIN_LENGTH),
                    Validators.pattern(this.ID_NUMBERS.RTN.PATTERN),
                ]
            ],
            type: [producer.type, [Validators.required]],
            productorTypeName: [
                this.mapProductorTypeFromValue(Number(producer.type)),
            ],
            externalId: [producer.externalId],
            ihcafeCarnet: [
                producer.ihcafeCarnet,
                [
                    Validators.pattern(CONSTANTS.IHCAFE_PATTERN),
                    Validators.maxLength(
                        CONSTANTS.MAX_LENGTH_PRODUCER_CARNET_IHCAFE
                    ),
                ],
            ],
            country: [producer.countryId, Validators.required],
            state: [producer.stateId, Validators.required],
            city: [producer.cityId, Validators.required],
            village: [producer.townId],
            zip_code: [producer.zipCode, Validators.pattern(CONSTANTS.ZIP_CODE_REGEXP)],
            address: [producer.address, [Validators.required,
                Validators.pattern(CONSTANTS.ADDRESS_PATTERN),
                Validators.maxLength(CONSTANTS.MAX_LENGTH_ADDRESS)]],
            scholarshipId: [producer.scholarshipId],
            maritalStatusId: [producer.maritalStatusId],
            professionId: [producer.professionId],
            contactPhone: [
                producer.contactPhone
                    ? this.applyPhoneMask(producer.contactPhoneCountry, producer.contactPhone)
                    : '',
            ],
            contactPhoneCountry: [producer.contactPhoneCountry],
            contactName: [
                producer.contactName,
                [
                    Validators.pattern(CONSTANTS.ALPHABET_REGEXP),
                    Validators.maxLength(
                        CONSTANTS.MAX_LENGTH_PRODUCER_FATHER_LAST_NAME
                    ),
                ]
            ],
            gender: [producer.gender]
        });
        if ((!this.isFromNewProducer && producer.federated) || (this.isFromNewProducer && this.federatedId)) {
            form.get('identity').value != '' ? form.get('identity').disable() : form.get('identity').enable();
            form.get('email').value != '' ? form.get('email').disable() : form.get('email').enable();
            if (form.get('phone').value != '') {
                this.isDisabledPhone = true;
                form.get('phone').disable()
            }
        }
        this.formReady.emit(form);
        return form;
    }

    /**
     * Switch from profile view to edit view
     */
    public onEditButtonClick(): void {
        this.action = this.ACTIONS.UPDATE;
        this.form.get('externalId').disable();
        this.realoadAddress = false;
        this.form.get('externalId').disable();
    }

    public onBackToList(): void {
        this._router.navigate(['routes', 'producers']);
    }

    /**
     * Sanitize a international phone number string
     * @param phone string value
     */
    private sanitizeInternationalPhoneNumber(phone: string): string {
        return phone ? phone.replace(/[^0-9\+]/gm, '') : phone;
    }

    private applyPhoneMask(country: string, phone: string): string {
        return conformToMask(
            this.sanitizeInternationalPhoneNumber(phone),
            CONSTANTS.INTERNATIONAL_PHONES[country].MASK,
            { guide: false }
        ).conformedValue;
    }

    /**
     * Change mask to phone input
     * @param country phone value
     */
    private changePhoneMask(country: string): void {
        const phoneControl = this.form.get('phone');
        const phoneRegExp: RegExp =
            CONSTANTS.INTERNATIONAL_PHONES[country].REGEXP;
        const phoneValue: string = this.applyPhoneMask(
            country,
            phoneControl.value
        );
        this.form.get('phoneCountry').setValue(country);
        phoneControl.clearValidators();
        phoneControl.setValidators(Validators.pattern(phoneRegExp));
        phoneControl.setValue(phoneValue);
        phoneControl.updateValueAndValidity();
    }

    /**
     * Sets a default value phone for a country selected
     * @param country phone selected
     */
    public onCountryChanged(country: string): void {
        if (country !== this.form.get('phoneCountry').value) {
            this.changePhoneMask(country);
        }
    }

    /**
     * Returns a numerical value for a string producer type entered by th user or a string value if number
     * @param type string or numbwe value entered by the user
     */
    private mapProductorTypeFromValue(type: string | number): number | string {
        const SUPPLIER = String(this._i18n.transform('supplier'));
        const ASSOCIATE = String(this._i18n.transform('associate'));
        const CLIENT = String(this._i18n.transform('client'));
        if (typeof type === 'string') {
            type = type.toLocaleLowerCase();
            return type === ASSOCIATE.toLowerCase()
                ? 1
                : type === SUPPLIER.toLowerCase()
                    ? 2
                    : type === CLIENT.toLowerCase()
                        ? 3
                        : null;
        } else if (typeof type === 'number') {
            return type === 1 ? 'associate' : type === 2 ? 'supplier' : type === 3 ? 'client' : null;
        }
    }

    /**
     * Handle component actions
     * @param action action emitted by form template
     */
    public onActionSelected(action: number): void {
        switch (action) {
            case this.ACTIONS.CANCEL:
                if (this.componentOwner === this.COMP_OWNERS.PRODUCERS) {
                    switch (this.originalFormAction) {
                        case this.ACTIONS.UPDATE:
                        case this.ACTIONS.CREATE:
                            this._router.navigate(['routes', 'producers']);
                            break;
                        default:
                            this.action = this.ACTIONS.READ;
                            // Reset form un case something changed
                            this.realoadAddress = true;
                            this.setProducerForm(this.originalProducer);
                            break;
                    }
                } else {
                    this.producerEvent.emit({
                        action: this.ACTIONS.CANCEL,
                        data: null,
                    });
                }

                break;
            case this.ACTIONS.UPDATE:
                this.putProducer(this.producerPaylod);
                break;
            case this.ACTIONS.CREATE:
                this.postNewProducers(this.producerPaylod);
                break;
            default:
                break;
        }
    }

    public postNewProducers(producer: TIProducerModel): void {
        const payload = this.setPayloadForEdit(producer);
        this.blockUI.start();
        this._producerService
            .createProducers(payload)
            .pipe(
                take(1)
            )
            .subscribe(
                (r) => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('t-success-created-producers')
                    );
                    if (this.componentOwner === this.COMP_OWNERS.PRODUCERS) {
                        this._router.navigate(['routes', 'producers']);
                    } else if (
                        this.componentOwner === this.COMP_OWNERS.WEGHT_NOTES
                    ) {
                        this.producerEvent.emit({
                            action: this.ACTIONS.CREATE,
                            data: r.data[0],
                        });
                    }
                },
                (error: HttpErrorResponse) => {
                    this.blockUI.stop();
                    if (error.error.message === "worker_error" && error.error.has_apps) {
                        let message: string =
                            error.error.data.email ?
                                'worker-error-email-duplicated'
                                :
                                error.error.data.phone ?
                                    'worker-error-phone-duplicated'
                                    :
                                    'worker-error-phone-and-email-duplicated'
                        this._dialog.open(ErrorWorkerComponent, { data: message }).afterClosed()
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(
                                () => this.goToReferenceData.emit(this.form.getRawValue())
                            )
                    } else {
                        const message: string = this._responseErrorHandlerService.handleError(
                            error,
                            't-producer'
                        );
                        this._alert.errorTitle(this._i18n.transform('error-msg'), message);
                    }
                }
            );
    }

    public putProducer(producer: TIProducerModel): void {
        const payload = this.setPayloadForEdit(producer);
        this.blockUI.start();
        this._producerService
            .updateProducer(payload)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('t-success-edited-producer')
                    );
                    this._router.navigate(['routes', 'producers']);
                },
                (error: HttpErrorResponse) => {
                    this.blockUI.stop();
                    if (error.error.message === "worker_error") {
                        let message: string =
                            error.error.data.email ?
                                'worker-error-email-duplicated'
                                :
                                error.error.data.phone ?
                                    'worker-error-phone-duplicated'
                                    :
                                    'worker-error-phone-and-email-duplicated'
                        this._dialog.open(ErrorWorkerComponent, { data: message });
                    } else {
                        const message: string = this._responseErrorHandlerService
                            .handleError(error, 't-producer');
                        this._alert.errorTitle(this._i18n.transform('error-msg'), message);
                    }
                }
            );
    }

    /**
     * Strips down a porducer object to only send needed value to backend
     * @param producer producer payload to strip down
     */
    public setPayloadForEdit(producer: TIProducerModel): TIProducerRequestModel {
        return {
            id: producer.id,
            federated_id: this.federatedId,
            name: titleCaseWord(producer.name),
            paternal_last: titleCaseWord(producer.paternalLast),
            external_id: producer.externalId,
            email: producer.email,
            contact: titleCaseWord(producer.contactName),
            phone: this.sanitizeInternationalPhoneNumber(producer.phone),
            phone_contact: this.sanitizeInternationalPhoneNumber(producer.contactPhone),
            calling_code: producer.phone != '' ? CONSTANTS.INTERNATIONAL_PHONES[producer.phoneCountry].PREFIX : null,
            phone_contact_code: producer.contactPhone != '' ? CONSTANTS.INTERNATIONAL_PHONES[producer.contactPhoneCountry].PREFIX : null,
            tax_identifier: producer.rtn
                ? producer.rtn.toUpperCase()
                : null,
            ihcafe_carnet: producer.ihcafeCarnet
                ? producer.ihcafeCarnet.toUpperCase()
                : null,
            productor_type: producer.type,
            country_id: producer.country,
            state_id: producer.state,
            city_id: producer.city,
            town_id: this.formAddress.get('village')?.value,
            address: producer.address,
            scholarship_id: producer.scholarshipId,
            marital_status_id: producer.maritalStatusId,
            profession_id: producer.professionId,
            population_identifier: producer.identity.replace(/\s/g, ''),
            date_birth: producer.birthdate,
            association_date: producer.associationDate,
            gender: producer.gender,
            zip_code: this.formAddress.get('zip_code')?.value,
        };
    }

    /**
     * Get producer type select list object
     */
    private getProducerList(): Array<any> {
        return [
            {
                name: this._i18n.transform('associate'),
                value: 1,
            },
            {
                name: this._i18n.transform('supplier'),
                value: 2,
            },
            {
                name: this._i18n.transform('client'),
                value: 3,
            },
        ];
    }
}
