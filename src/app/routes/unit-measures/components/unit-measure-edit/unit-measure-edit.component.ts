import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, tap, filter, findIndex } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { findInArrayByPropName } from 'src/app/shared/utils/functions/findInArrayByPropName';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';

import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { deepCompareIsEqual } from '../../../../shared/utils/functions/object-compare';
import { UnitConvertion, UnitMeasureModel } from '../../models/unit-measure.model';
import { UnitMeasuresService } from '../../services/units-measure.service';
import {
    validatorDuplicateDataFormArray
} from 'src/app/shared/validators/validator-duplicate-data-form-array';
import { threadId } from 'worker_threads';

@Component({
    selector: 'app-unit-measure-edit',
    templateUrl: './unit-measure-edit.component.html',
    styleUrls: ['./unit-measure-edit.component.scss'],
})
export class UnitMeasureEditComponent implements OnInit, OnDestroy {
    @HostBinding('class') hostClasses =
        'sil-overflow-container sil-overflow-container--padded';
    @BlockUI('hello') blockUI: NgBlockUI;
    private unit: UnitMeasureModel;
    public baseMeasureLabel = `1 ${this._i18n.transform('units-base')}`;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public units: UnitMeasureModel[];
    public action: number;
    public form: UntypedFormGroup;
    private originalFormValue: any;
    public ACTIONS = CONSTANTS.CRUD_ACTION;

    constructor(
        private _unitMeasuresService: UnitMeasuresService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _formBuilder: UntypedFormBuilder,
        private _notifier: NotifierService,
        private _alert: AlertService,
        private _i18n: I18nPipe,
        private _errorHandler: ResponseErrorHandlerService
    ) { }

    public ngOnInit() {
        //this._unitMeasuresService.unitMeasures.forEach(x=> x.disabled =true);
        this.units = this._unitMeasuresService.unitMeasures
        if (this.units) {
            this._route.url
                .pipe(
                    takeUntil(this.destroy$), // For unsub. (only 1 emition is needed)
                    tap(
                        // Set action to determine labels en events
                        (r) =>
                        (this.action = r.toString().includes('new')
                            ? this.ACTIONS.CREATE
                            : this.ACTIONS.UPDATE)
                    ),
                    switchMap(() => this._route.paramMap), // Get unit index for router params
                    map(
                        (p) =>
                            this.action === this.ACTIONS.UPDATE
                                ? // Return unit data
                                findInArrayByPropName(
                                    this.units,
                                    'name',
                                    p.get('name')
                                )
                                : new UnitMeasureModel() // Create a new unit
                    ), // Set local unit data
                    tap((u) => (this.unit = u))
                )
                .subscribe((u) =>
                    u
                        ? this.setForm(u)
                        : this._router.navigate(['routes', 'unit-measures'])
                );
        } else {
            this._router.navigate(['routes', 'unit-measures']);
        }
    }
    public ngOnDestroy() {
        this.destroy$.next(true);
    }
    /**
     * Sets the form for a unit to be edited or be created
     * @param unit unit data to init form with
     */
    public setForm(unit: UnitMeasureModel) {
        this.form = this._formBuilder.group({
            measurement_unit_id: [unit.measurement_unit_id],
            name: [unit.name, Validators.required],
            abbreviation: [unit.abbreviation, Validators.required],
            units_converter: this._formBuilder.array(
                unit.units_converter.map((c) => this.getConvertionsFormGroup(c)),
                validatorDuplicateDataFormArray('conversion_measurement_unit_id')
            ),
        });
        this.originalFormValue = this.form.value;
        this.baseMeasureLabel = this.getBaseMeasureLabel(unit);
        this.setformChangesHandler();
    }

    /**
     * @return a form group to add into an form array for creating conversions section
     * @param c unit convertion object
     */
    public getConvertionsFormGroup(
        c: UnitConvertion,
        isNew = false
    ): UntypedFormGroup {
        return this._formBuilder.group({
            unit_converter_id: [c.unit_converter_id],
            factor: [c.factor, Validators.required],
            conversion_measurement_unit_id: [
                {
                    value: c.conversion_measurement_unit_id,
                    disabled: !isNew,
                },
                Validators.required,
            ],
        });
    }
    /**
     * Handles form changes and adds them to current unit object
     */
    private setformChangesHandler() {
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
                if (!v) {
                    this.form.markAsPristine();
                    this.unit = { ...this.unit, ...this.originalFormValue };
                    this.baseMeasureLabel = this.getBaseMeasureLabel(this.unit);
                } else {
                    this.unit = { ...this.unit, ...v };
                    this.baseMeasureLabel = this.getBaseMeasureLabel(this.unit);
                }
            });
    }
    /**
     * Return a literal string to create a label
     * @param unit base unit to get label from
     * @returns string like  1 name (abb) or null if values undefined
     */
    public getBaseMeasureLabel(unit: UnitMeasureModel): string {
        return this.unit.name && this.unit.abbreviation
            ? `1 ${unit.name} (${unit.abbreviation})`
            : `1 ${this._i18n.transform('units-base')}`;
    }
    /**
     * Handle click return to list component route
     */
    public onActionSelected(action: number) {
        switch (action) {
            case this.ACTIONS.CANCEL:
                this._router.navigate(['routes', 'unit-measures']);
                break;
            case this.ACTIONS.UPDATE:
                this.putUnitMeasureUpdate(this.unit);
                break;
            case this.ACTIONS.CREATE:
                this.unit.user_id = localStorage.getItem('token-data')
                    ? JSON.parse(localStorage.getItem('token-data')).session
                    : 0;
                this.postNewUnitMeasure(this.unit);
                break;
            default:
                break;
        }
    }
    /**
     * Handle button to click to ddd convertion to form object
     */
    public onAddConvertion() {
        const newConvertion = new UnitConvertion();
        (this.form.get('units_converter') as UntypedFormArray).push(
            this.getConvertionsFormGroup(newConvertion, true)
        );
    }

    /**
     * Check if a control has an error to show
     * @param control control name to look for
     * @param error error to look for
     * @returns true if control has error
     */
    public controlHasError(control: string, error: string): boolean {
        return this.form
            ? this.form.get(control).touched &&
            this.form.get(control).hasError(error)
            : false;
    }
    /**
     * Handles reques for convertion delete
     * @param index index of from group to get id for deletion
     */
    public onDeleteConvertion(index: number) {
        const formArray = this.form.get('units_converter') as UntypedFormArray;
        const id = formArray.at(index).get('unit_converter_id').value;
        this.blockUI.start();
        this._unitMeasuresService
            .deleteConvertion(id)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    formArray.removeAt(index);
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('success-convertion-removed')
                    );
                },
                (err) => {
                    this.blockUI.stop();
                    let message =
                        err.status == 403
                            ? this._errorHandler.handleError(
                                err,
                                'unit-measures'
                            )
                            : this._i18n.transform(
                                'unit-conversion-delete-error'
                            );
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }
    /**
     * Handles request to update a unit
     * @param unit unit object to be updated
     */
    private putUnitMeasureUpdate(unit: UnitMeasureModel) {
        this.blockUI.start();
        this._unitMeasuresService
            .editUnitMeasure(unit)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('success-unit-edit')
                    );
                    this._router.navigate(['routes', 'unit-measures']);
                },
                (err) => {
                    this.blockUI.stop();
                    let message: string;
                    if (err.status == 403) {
                        message = this._errorHandler.handleError(
                            err,
                            'unit-measures'
                        );
                    } else {
                        message = err.error.data.name
                            ? String(
                                this._i18n.transform('unit-is-repeated')
                            ).replace('[value]', unit.name)
                            : String(
                                this._i18n.transform('unit-update-error')
                            ).replace('[value]', unit.name);
                    }
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }

    /**
     * Handles request to create a unit
     * @param unit unit to be created
     */
    private postNewUnitMeasure(unit: UnitMeasureModel) {
        this.blockUI.start();
        this._unitMeasuresService
            .saveUnitMeasure(unit)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('success-unit-create')
                    );
                    this._router.navigate(['routes', 'unit-measures']);
                },
                (err) => {
                    this.blockUI.stop();
                    const message = err.error.data.name
                        ? String(
                            this._i18n.transform('unit-is-repeated')
                        ).replace('[value]', unit.name)
                        : String(
                            this._i18n.transform('unit-create-error')
                        ).replace('[value]', unit.name);
                    this._alert.errorTitle(
                        this._i18n.transform('error-msg'),
                        message
                    );
                }
            );
    }
}
