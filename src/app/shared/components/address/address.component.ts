import { AddressModel } from 'src/app/shared/models/address.model';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CountryLookupsService } from '../../services/country-lookups/country-lookups.service';
import { CONSTANTS } from '../../utils/constants/constants';
import { I18nService } from '../../i18n/i18n.service';
import { IPaginator } from '../../models/paginator.model';
import { deepCompareIsEqual } from '../../utils/functions/object-compare';


@Component({
    selector: 'app-address-component',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit , OnChanges{
    @Input() item: AddressModel;
    @Input() action: number;
    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    @Input() reloadComponent: boolean = false;

    public form: UntypedFormGroup;
    public countries = [];
    public addressFields = [];
    public catalogsFields = [];
    public globalLanguage: string;
    public currentLanguage: string;
    public lookups: { [key: string]: any[] } = {};
    public pagination: { [key: string]: IPaginator } = {};
    public loadingState: { [key: string]: boolean } = { countries: false };
    private _timeout: any;
    private _countryCode: string;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cancelRequestCatalog$: Subject<boolean> = new Subject<boolean>();
    readonly countryPropName = `name_${localStorage.getItem('lang')}`;
    readonly ACTIONS = CONSTANTS.CRUD_ACTION;
    readonly CONSTANTS = CONSTANTS;

    constructor(
        private i18nService: I18nService,
        private formBuilder: UntypedFormBuilder,
        private countryLookups: CountryLookupsService,
    ) {
        this.i18nService.lang.pipe(takeUntil(this.destroy$)).subscribe(
            (locale: string) => {
                this.globalLanguage = locale;
                this.currentLanguage = this.globalLanguage === 'en' ? this.globalLanguage : `es_${this._countryCode}`;
            }
        )
    }

    public ngOnInit() {
        this.getCountries();
    }

    ngOnChanges(changes: SimpleChanges): void {
         if(changes.item?.currentValue && (changes.item.currentValue.country != changes.item.previousValue?.country))
            this.getCountries();

         if(this.form && changes.item?.currentValue && changes.item?.previousValue
            && !deepCompareIsEqual(changes.item?.currentValue, changes.item.previousValue)
            && changes.reloadComponent?.currentValue)
         {
            this.getCountries();
         }
    }


    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.cancelRequestCatalog$.next(true);
        this.cancelRequestCatalog$.complete();
    }

    private setForm(item: any) {
        this.form = this.formBuilder.group({
            country: [item.country, Validators.required],
            address: [
                item.address,
                [
                    Validators.required,
                    Validators.pattern(CONSTANTS.ADDRESS_PATTERN),
                    Validators.maxLength(CONSTANTS.MAX_LENGTH_ADDRESS)
                ]
            ],
            countryName:[item.countryName || null],
            stateName:[item.stateName || null],
            cityName:[item.cityName || null],
            villageName:[item.villageName || null]
        });
        this.formReady.emit(this.form);
        if(item.country) {
            const country = this.countries.find(c => c.id === item.country);
            this.setCountry(country, item);
        }
        this._validateAddressValue();
    }

    public onDropdownReachedEnd(field: any) {
        const catalog = field.extras.catalog;
        let page = this.pagination[catalog].currentPage;
        page ++;
        if(page <= this.pagination[catalog].totalPages) {
            this.getDynamicCatalog(
                field.extras.uri,
                field.extras.catalog,
                field.name,
                field.extras?.dependency_key,
                page
            );
        }
    }

    public onDropdownSearch(query: any, field: any) {
        const term: string = query?.term ?? '';
        this.loadingState[field.name] = true;
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            const catalog = field.extras.catalog;
            const page = 1
            this.lookups[catalog] = [];
            this.cancelRequestCatalog$.next(true);
            this.getDynamicCatalog(
                field.extras.uri,
                field.extras.catalog,
                field.name,
                field.extras?.dependency_key,
                page,
                term
            );
        }, 300);

    }

    public onValueChanged(value: any, control: string) {
        this.form.get(control).setValue(value.id);
    }

    private getCountries() {
        this.loadingState.countries = true;
        this.countryLookups
            .getCountries()
            .pipe(take(1))
            .subscribe((c) => {
                this.loadingState.countries = false;
                this.countries = c;
                this.setForm(this.item);
            });
    }

    public setCountry(country: any , item: AddressModel) {
        this.resetDynamicForm();
        if(country) {
            this._countryCode = country.alpha2code.toLowerCase();
            this.currentLanguage = this.globalLanguage === 'en' ? this.globalLanguage : `es_${this._countryCode}`;
            this.form.get(`countryName`).setValue( this.countries.find((c:any)=> c.id ==this.form.get('country').value)[`name_${this.globalLanguage}`]);
            this.countryLookups.getFormCountry( country.id )
                .pipe( take(1), takeUntil(this.cancelRequestCatalog$) )
                .subscribe(
                    (response: any) => {
                        this.addressFields = response.data[0].section.fields;
                        this.addressFields.shift();
                        for (let i = 0; i < this.addressFields.length; i++) {
                            const field = this.addressFields[i];
                            const fieldName = field.name;
                            this.form.addControl(fieldName, new UntypedFormControl(item ? item[fieldName] : null))
                            const required = field.rules.find((r: any) => !!r.rule.required);
                            field.required = !!required;
                            for (let i = 0; i < field.rules.length; i++) {
                                const rule = field.rules[i].rule;
                                const ruleKey = Object.keys(rule)[0];
                                const ruleValue = Object.values(rule)[0];
                                if(typeof ruleValue === 'boolean') {
                                    this.form.get(fieldName).setValidators( Validators[ruleKey] )
                                } else {
                                    this.form.get(fieldName).setValidators( Validators[ruleKey](ruleValue) )
                                }

                            }
                            const page = 1;
                            if( field.extras?.is_catalog ) {
                                this.form.get(fieldName).disable();
                                this.getDynamicCatalog(
                                    field.extras.uri,
                                    field.extras.catalog,
                                    field.name,
                                    field.extras?.dependency_key,
                                    page
                                );
                            }
                        }
                    }
                )
        }
    }

    public resetDynamicForm() {
        this.loadingState = {
            countries: false,
        };
        this.lookups = {};
        this.pagination = {};
        this.addressFields = [];
        this.form = this.formBuilder.group({
            country: [this.form.get('country').value, Validators.required],
            address: [
                this.form.get('address').value,
                [
                    Validators.required,
                    Validators.pattern(CONSTANTS.ADDRESS_PATTERN),
                    Validators.maxLength(CONSTANTS.MAX_LENGTH_ADDRESS)
                ]
            ],
            countryName:[this.form.get('countryName').value || null],
            stateName:[this.form.get('stateName').value || null],
            cityName:[this.form.get('cityName').value || null],
            villageName:[this.form.get('villageName').value || null]

        });
        this._validateAddressValue();
        this.formReady.emit(this.form);

    }

    public setDynamicControl(field: any) {        
        this.form.get(`${field.name}Name`).setValue(this.lookups[field.extras.catalog]?.find(
            (item) => item.id == this.form.get(field.name).value)?.name ?? '');
        const fieldDepends = this.addressFields.filter( f => f.extras?.dependency_key == field.name);
        for (let i = 0; i < fieldDepends.length; i++) {
            const field = fieldDepends[i];
            if( field.extras.is_catalog ) {
                const page = 1;
                this.lookups[field.extras.catalog] = [];
                this.form.get(field.name).reset();
                this.getDynamicCatalog(
                    field.extras.uri,
                    field.extras.catalog,
                    field.name,
                    field.extras?.dependency_key,
                    page
                );
                this.setDynamicControl(field);
            }
        }

    }

    public getDynamicCatalog(url: string, catalog: string, fieldName: string, dependencyKey: string, page: number, search?: string) {

        const dependencyKeyValue = this.form.get(dependencyKey).value;
        if( dependencyKeyValue ) {
            const uri = url.replace( `{{${dependencyKey}}}`, dependencyKeyValue);
            this.countryLookups.getCatalog( uri, page, search )
                .pipe( take(1) )
                .subscribe(
                    (response: {data: any[], paginator: IPaginator}) => {
                        const {data, paginator} = response;

                        this.lookups[catalog] = this.lookups[catalog] ? [...this.lookups[catalog], ...data] : data;
                        this.pagination[catalog] = paginator;
                        this.loadingState[fieldName] = false;
                        this.form.get(fieldName).enable();
                        const fieldValue = this.form.get(fieldName)?.value;
                        if ( fieldValue ) {
                            const findItem = this.lookups[catalog].find((i: any) => i.id === fieldValue);
                            if (!findItem) {
                                const uriItem = `${uri}?${fieldName}=${fieldValue}`;
                                this.countryLookups.getItemFromCatalog(uriItem)
                                    .pipe(take(1))
                                    .subscribe(
                                        (response: any[]) => {
                                            if(response.length > 0) {
                                                this.lookups[catalog] = [...this.lookups[catalog], response[0]];
                                            }
                                        }
                                    )
                            }
                        }
                    }
                )
        }
    }

    public getFormError(field: any, rule: any): boolean {
        return this.form.get(field.name).hasError(Object.keys(rule.rule)[0].toLocaleLowerCase());
    }

    private _validateAddressValue(){
        if(this.item?.address){
            this.form.get('address').markAsDirty();
            this.form.updateValueAndValidity();
        }
    }

}
