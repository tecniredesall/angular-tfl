import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { filter, map, take } from 'rxjs/operators';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import {
    toLowerNoDigitsNoSigns
} from 'src/app/shared/utils/functions/string-to-lowercase-only-letters';

import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UnitMeasureModel } from './models/unit-measure.model';
import { UnitMeasuresService } from './services/units-measure.service';

@Component({
    selector: 'app-unit-measurements',
    templateUrl: './unit-measures.component.html',
    styleUrls: ['./unit-measures.component.scss'],
})
export class UnitMeasuresComponent implements OnInit {
    @HostBinding('class') hostClasses = 'sil-overflow-container';
    public units: UnitMeasureModel[] = [];
    public unitToDelete: UnitMeasureModel;
    public unitToSearch: string;
    public ACTIONS = CONSTANTS.CRUD_ACTION;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public columnSortState = {
        name: false,
        abbreviation: false,
        convertions: false,
    };
    @BlockUI('hello') blockUI: NgBlockUI;
    constructor(
        private _unitMeasureService: UnitMeasuresService,
        private _router: Router,
        private _notifier: NotifierService,
        private _alert: AlertService,
        private _i18n: I18nPipe
    ) { }

    public ngOnInit() {
        this.setUnits();
    }
    /**
     * Set units data loaded from API
     */
    private setUnits() {
        this.blockUI.start();
        this._unitMeasureService
            .getUnitMeasures()
            .pipe(
                take(1), // For unsub. (only one emition is needed)
                filter((u) => !!u), // Filter undefined values
                map((u: any) => u.data as Array<UnitMeasureModel>) // Return data as typed array
            )
            .subscribe(
                (u) => (this.units = u),
                (e) => {
                    this._alert.showAlert(e.status, e.message);
                    this.blockUI.stop();
                },
                () => this.blockUI.stop()
            );
    }
    /**
     * Handles a row action click event
     * @param action constant value for action clicked
     * @param index optional row index to get data from array
     */
    public onActionClicked(action: number, name?: string) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this._router.navigate([
                    'routes',
                    'unit-measures',
                    'edit',
                    name.toLowerCase(),
                ]);
                break;
            case CONSTANTS.CRUD_ACTION.CREATE:
                this._router.navigate(['routes', 'unit-measures', 'new']);
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.unitToDelete = this.units.find(
                    (u) => u.name.toLowerCase() === name.toLowerCase()
                );
                break;
            case CONSTANTS.CRUD_ACTION.CANCEL:
                this.unitToDelete = null;
                break;
            default:
                break;
        }
    }
    /**
     * Handles unit search events
     * @param text text to search for
     */
    public onSearchUnitMeasure(text: string) {
        this.unitToSearch = text;
    }
    /**
     * Handles request for unit measure deletion
     * @param unit unit to be deleted
     */
    public onDeleteUnitMeasure(unit: UnitMeasureModel) {
        this.unitToDelete = null; // Close warning modal
        this.blockUI.start();
        this._unitMeasureService
            .deleteUnitMeasure(unit.measurement_unit_id)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.blockUI.stop();
                    this._notifier.notify(
                        'success',
                        this._i18n.transform('success-delete-unit')
                    );
                    this.setUnits();
                },
                (err) => {
                    this.blockUI.stop();
                    const message = err.error.data.measurement_unit_id
                        ? 'unit-converter-associated'
                        : 'unit-measure-delete-error';
                    this._alert.showAlert(404, this._i18n.transform(message));
                }
            );
    }
    /**
     * Sorts grid data ascend or descend depending on current sort state
     * @param colum column for sorting
     */
    public sortData(column: string) {
        switch (column) {
            case 'name':
            case 'abbreviation':
                this.columnSortState[column] = !this.columnSortState[column];
                this.units = this.units.sort((a, b) => {
                    if (
                        toLowerNoDigitsNoSigns(a[column]) <
                        toLowerNoDigitsNoSigns(b[column])
                    ) {
                        return this.columnSortState[column] ? -1 : 1;
                    }
                    if (
                        toLowerNoDigitsNoSigns(a[column]) >
                        toLowerNoDigitsNoSigns(b[column])
                    ) {
                        return this.columnSortState[column] ? 1 : -1;
                    }
                    return 0;
                });
                break;
            case 'convertions':
                this.columnSortState.convertions = !this.columnSortState
                    .convertions;
                this.units = this.units.sort((a, b) =>
                    this.columnSortState.convertions
                        ? a.units_converter.length - b.units_converter.length
                        : b.units_converter.length - a.units_converter.length
                );
                break;
            default:
                break;
        }
    }
}
