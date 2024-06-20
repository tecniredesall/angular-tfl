import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { from, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { CSVActionsService } from 'src/app/shared/utils/csv-actions/csv-actions.service';
import { findInArrayByPropName } from 'src/app/shared/utils/functions/findInArrayByPropName';
import { deepCompareIsEqual } from 'src/app/shared/utils/functions/object-compare';
import { TransformationTypesModel } from 'src/app/shared/utils/models/transformation-types.model';
import {
    ResponseErrorHandlerService
} from 'src/app/shared/utils/response-error-handler/response-error-handler.service';
import {
    validatorDuplicateDataFormArray
} from 'src/app/shared/validators/validator-duplicate-data-form-array';

import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TransformationTypesService } from '../../services/transformation-types.service';

@Component({
    selector: 'app-transformation-type-edit',
    templateUrl: './transformation-type-edit.component.html',
    styleUrls: ['./transformation-type-edit.component.scss'],
})
export class TransformationTypeEditComponent implements OnInit, OnDestroy {
    @BlockUI('hello') blockUI: NgBlockUI;
    @HostBinding('class') hostClasses =
        'sil-overflow-container sil-overflow-container--padded';
    public get itemsFormArray(): UntypedFormArray {
        return this.form.get('items') as UntypedFormArray;
    }
    private transformation: TransformationTypesModel;
    private bulkTransformationModel: {
        items: TransformationTypesModel[];
    };
    private transformations: TransformationTypesModel[];
    public action: number;
    public form: UntypedFormGroup;
    private originalForm: any;
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private csvTemplateProperties = [
        {
            property: 'name',
            column: this._i18n.transform('transformation-name'),
        },
    ];

    constructor(
        private _transformationsService: TransformationTypesService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _formBuilder: UntypedFormBuilder,
        private _notifier: NotifierService,
        private _alert: AlertService,
        private _i18n: I18nPipe,
        private _csvService: CSVActionsService,
        private _errorHandler: ResponseErrorHandlerService
    ) { }

    ngOnInit() {
        this.transformations = this._transformationsService.transformations;
        this._route.url
            .pipe(
                take(1), // For unsub. (only 1 emition is needed)
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
                                this.transformations,
                                'name',
                                p.get('name')
                            )
                            : new TransformationTypesModel() // Create a new unit
                ), // Set local unit data
                tap((t) => (this.transformation = t))
            )
            .subscribe((t) =>
                t
                    ? this.setForm(t)
                    : this._router.navigate(['routes', 'transformation-types'])
            );
    }
    public ngOnDestroy() {
        this.destroy$.next(true);
    }
    /**
     * Sets form data from a transformation object
     * @param transformation transformation data
     */
    private setForm(transformation: TransformationTypesModel) {
        this.form = this._formBuilder.group({
            items: this._formBuilder.array(
                [this.getTransformationControl(transformation)],
                validatorDuplicateDataFormArray('name')
            ),
        });
        this.originalForm = this.form.value;
        this.setformChangesHandler();
    }
    private getTransformationControl(
        transformation:
            | TransformationTypesModel
            | { transformation_type_id: string; name: string }
    ) {
        return this._formBuilder.group({
            id: [transformation.transformation_type_id],
            name: [transformation.name, Validators.required],
        });
    }
    /**
     * Adds a form control into form array
     * @param transformation transformation value to be added
     */
    private addTransformationToFormArray(
        transformation:
            | TransformationTypesModel
            | { transformation_type_id: string; name: string }
    ) {
        this.itemsFormArray.push(this.getTransformationControl(transformation));
    }
    /**
     * Handles form changes and adds them to current unit object
     */
    private setformChangesHandler() {
        this.form.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                map((f) =>
                    deepCompareIsEqual(this.originalForm, f)
                        ? null
                        : this.form.getRawValue()
                )
            )
            .subscribe((v) => {
                const newValue =
                    this.action === this.ACTIONS.UPDATE
                        ? this.form.get('items').value[0]
                        : v;
                if (!v) {
                    // Form is the same as original reset values
                    this.form.markAsPristine();
                    if (this.action === this.ACTIONS.UPDATE) {
                        this.transformation = {
                            ...this.transformation,
                            ...this.originalForm.items[0],
                        };
                    } else {
                        this.bulkTransformationModel = {
                            ...this.bulkTransformationModel,
                            ...this.originalForm,
                        };
                    }
                } else {
                    // Form is different
                    if (this.action === this.ACTIONS.UPDATE) {
                        this.transformation = {
                            ...this.transformation,
                            ...newValue,
                        };
                    } else {
                        this.bulkTransformationModel = {
                            ...this.bulkTransformationModel,
                            ...newValue,
                        };
                    }
                }
            });
    }
    /**
     * Handle click return to list component route
     */
    public onActionSelected(action: number) {
        switch (action) {
            case this.ACTIONS.CANCEL:
                this._router.navigate(['routes', 'transformation-types']);
                break;
            case this.ACTIONS.UPDATE:
                this.putTransformationUpdate(this.transformation);
                break;
            case this.ACTIONS.CREATE:
                this.postNewTransformations(this.bulkTransformationModel);
                break;
            default:
                break;
        }
    }
    public onTransformationAction(action: number, index: number) {
        switch (action) {
            case this.ACTIONS.DELETE:
                this.action === this.ACTIONS.UPDATE
                    ? this.deleteTransformation(this.transformation)
                    : this.removeTransformationForm(index);
                break;
            case this.ACTIONS.CREATE:
                this.addTransformationToFormArray(
                    new TransformationTypesModel()
                );
                break;
            default:
                break;
        }
    }

    private removeTransformationForm(index: number) {
        this.itemsFormArray.removeAt(index);
    }

    private postNewTransformations(transformations: {
        items: TransformationTypesModel[];
    }) {
        this.blockUI.start();
        this._transformationsService
            .saveTransformationTypes(transformations)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('success-transformation-create')
                    );
                    this._router.navigate(['routes', 'transformation-types']);
                },
                (err) => {
                    this.blockUI.stop();
                    const message = err.error.data.duplicate
                        ? this._i18n
                            .transform(`transformation-is-repeated`)
                            .replace(
                                '[value]',
                                err.error.data.duplicate.join(', ')
                            )
                        : 'transformation-creation-error';
                    this._alert.showAlert(404, this._i18n.transform(message));
                }
            );
    }

    private deleteTransformation(transformation: TransformationTypesModel) {
        this.blockUI.start();
        this._transformationsService
            .deleteTransformationTypes(transformation.transformation_type_id)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('success-delete-transformation')
                    );
                    this._router.navigate(['routes', 'transformation-types']);
                },
                (err) => {
                    this.blockUI.stop();
                    if (err.status == 403) {
                        const message = this._errorHandler.handleError(
                            err,
                            'transformation-type'
                        );
                        this._alert.error(message);
                    } else {
                        const message = err.error.data.reference[0]
                            .transformation_type_id
                            ? this._i18n
                                .transform('transformation-associated')
                                .replace('[value]', transformation.name)
                            : this._i18n.transform(
                                'transformation-delete-error'
                            );
                        this._alert.errorTitle(
                            this._i18n.transform('error-msg'),
                            message
                        );
                    }
                }
            );
    }

    private putTransformationUpdate(transformation: TransformationTypesModel) {
        this.blockUI.start();
        this._transformationsService
            .editTransformationTypes(this.transformation)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('success-transformation-edit')
                    );
                    this._router.navigate(['routes', 'transformation-types']);
                },
                (err) => {
                    this.blockUI.stop();
                    if (err.status == 403) {
                        const message = this._errorHandler.handleError(
                            err,
                            'transformation-type'
                        );
                        this._alert.error(message);
                    } else {
                        const message = err.error.data.name
                            ? String(
                                this._i18n.transform(
                                    'transformation-is-repeated'
                                )
                            ).replace('[value]', transformation.name)
                            : String(
                                this._i18n.transform(
                                    'transformation-update-error'
                                )
                            ).replace('[value]', transformation.name);
                        this._alert.errorTitle(
                            this._i18n.transform('error-msg'),
                            message
                        );
                    }
                }
            );
    }

    public onUploadCsvFile(event: any) {
        this.blockUI.start();
        this.itemsFormArray.clear();
        this.transformation = new TransformationTypesModel();
        this.setForm(new TransformationTypesModel());
        from(
            this._csvService.uploadFile(
                event,
                this.csvTemplateProperties,
                () => true
            )
        )
            .pipe(
                take(1),
                map((r) =>
                    r?.map((t) => ({
                        transformation_type_id: null,
                        name: t?.name,
                    }))
                )
            )
            .subscribe((t) => {
                if (t?.length > 0) {
                    this.itemsFormArray.clear();
                    t.forEach((i) => this.addTransformationToFormArray(i));
                    this.form.markAllAsTouched();
                    this.form.markAsDirty();
                }
                this.blockUI.stop();
            });
    }
    public onDownloadTemplate() {
        this._csvService.downloadLayout(
            this._i18n.transform('transformation-types'),
            this.csvTemplateProperties
        );
    }
}
