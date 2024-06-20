import { ResizedEvent } from 'angular-resize-event';
import { Subscription } from 'rxjs';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { sortAlphanumerical } from 'src/app/shared/utils/functions/sortFunction';

import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ModalDeleteFarmComponent } from '../modal-delete-farm/modal-delete-farm.component';
import { TFarmModel, TIFarmModel } from '../models/farm.model';

declare const $: any;

@Component({
    selector: 'tfarms-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnDestroy, OnInit, OnChanges {
    @Input() farms: Array<TIFarmModel> = [];
    @Output() editEvent: EventEmitter<TIFarmModel> = new EventEmitter();
    @Output() readEvent: EventEmitter<TIFarmModel> = new EventEmitter();
    @Output() deleteEvent = new EventEmitter();

    public responsiveClass: string;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public orderStatusAsc: {
        name: boolean;
        extension: boolean;
        blocksLength: boolean;
    } = {
            name: true,
            extension: true,
            blocksLength: true,
        };

    private _subscription: Subscription = new Subscription();
    private dialogRef: MatDialogRef<ModalDeleteFarmComponent, any> = null;
    public readonly ACTIONS = CONSTANTS.CRUD_ACTION;
    constructor(public _dialog: MatDialog) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.farms.firstChange) {
            this.orderStatusAsc = {
                name: true,
                extension: true,
                blocksLength: true,
            };
            this.sortFarms('name');
        }
    }

    ngOnInit(): void {
        this.sortFarms('name');
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    public openEdit(farm: TFarmModel): void {
        this.editEvent.emit(farm);
    }

    public sortFarms(propertie: string): void {
        for (const key in this.orderStatusAsc) {
            if (
                Object.prototype.hasOwnProperty.call(this.orderStatusAsc, key)
            ) {
                if (propertie !== key) {
                    this.orderStatusAsc[key] = true;
                }
            }
        }

        this.orderStatusAsc[propertie] = !this.orderStatusAsc[propertie];

        this.farms = this.farms.sort((a, b) => {
            let aValue: any =
                'blocksLength' === propertie ? a.blocks.length : a[propertie];

            let bValue: any =
                'blocksLength' === propertie ? b.blocks.length : b[propertie];

            if ('extension' === propertie) {
                aValue = null === aValue ? -1 : aValue;
                bValue = null === bValue ? -1 : bValue;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLocaleLowerCase();
                return sortAlphanumerical(
                    aValue,
                    bValue,
                    this.orderStatusAsc[propertie]
                );
            } else {
                if (aValue < bValue) {
                    return this.orderStatusAsc[propertie] ? -1 : 1;
                }

                if (aValue > bValue) {
                    return this.orderStatusAsc[propertie] ? 1 : -1;
                }
                return 0;
            }
        });
    }

    public openModalDelete(farm: TFarmModel): void {
        this.dialogRef = this._dialog.open(ModalDeleteFarmComponent, {
            autoFocus: false,
            disableClose: true,
            data: farm,
        });

        this._subscription.add(
            this.dialogRef.afterClosed().subscribe((response) => {
                this.dialogRef = null;

                if (response.refresh) {
                    this.deleteEvent.emit();
                }
            })
        );
    }

    public onResizePrincipalContainer(event: ResizedEvent): void {
        if (event.newWidth < 420) {
            this.responsiveClass = 'farms-list-view-xs';
        } else if (event.newWidth < 575) {
            this.responsiveClass = 'farms-list-view-sm';
        } else if (event.newWidth < 690) {
            this.responsiveClass = 'farms-list-view-md';
        } else {
            this.responsiveClass = 'farms-list-view-lg';
        }
    }

    /**
     * Handles all component action emition
     * @param action constant value for action clicked
     * @param index optional row index to get data from array
     */
    public onActionClicked(action: number, farm: TFarmModel) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this.openEdit(farm);
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                // This opens warning
                this.openModalDelete(farm);
                break;
            case CONSTANTS.CRUD_ACTION.READ:
                this.readEvent.emit(farm);
                break;
            default:
                break;
        }
    }
}
