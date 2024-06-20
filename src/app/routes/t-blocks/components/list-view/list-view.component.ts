import { ResizedEvent } from 'angular-resize-event';
import { Subscription } from 'rxjs';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { sortAlphanumerical } from 'src/app/shared/utils/functions/sortFunction';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { TBlockModel, TIBlockModel } from '../../models/block.model';
import { ModalDeleteBlockComponent } from '../modal-delete-block/modal-delete-block.component';

@Component({
    selector: 'tblocks-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnDestroy, OnInit {
    @Input() blocks: Array<TIBlockModel> = [];
    @Output() editEvent: EventEmitter<TIBlockModel> = new EventEmitter();
    @Output() viewEvent: EventEmitter<TIBlockModel> = new EventEmitter();
    @Output() deleteEvent = new EventEmitter();

    public responsiveClass: string;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public orderStatusAsc: {
        name: boolean;
        farmName: boolean;
        varietyName: boolean;
        height: boolean;
        extension: boolean;
    } = {
            name: true,
            farmName: false,
            varietyName: false,
            height: false,
            extension: false,
        };

    private _subscription: Subscription = new Subscription();
    private dialogRef: MatDialogRef<ModalDeleteBlockComponent, any> = null;

    constructor(public _dialog: MatDialog) { }
    ngOnInit() {
        this.blocks = this.blocks.sort((a, b) => {
            let aValue: any = a['name'];
            let bValue: any = b['name'];
            return sortAlphanumerical(
                aValue.toLowerCase().replace(' ', ''),
                bValue.toLowerCase().replace(' ', ''),
                true
            );
        });
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    public openEdit(block: TIBlockModel) {
        this.editEvent.emit(block);
    }

    public onViewBlock(block: TIBlockModel) {
        this.viewEvent.emit(block);
    }

    public deleteBlock(block: TIBlockModel) {
        this.dialogRef = this._dialog.open(ModalDeleteBlockComponent, {
            autoFocus: false,
            disableClose: true,
            data: block,
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
            this.responsiveClass = 'blocks-list-view-xs';
        } else if (event.newWidth < 575) {
            this.responsiveClass = 'blocks-list-view-sm';
        } else if (event.newWidth < 690) {
            this.responsiveClass = 'blocks-list-view-md';
        } else if (event.newWidth < 800) {
            this.responsiveClass = 'blocks-list-view-lg';
        } else {
            this.responsiveClass = 'blocks-list-view-xlg';
        }
    }

    public sortBlocks(propertie: string): void {
        for (const key in this.orderStatusAsc) {
            if (
                Object.prototype.hasOwnProperty.call(this.orderStatusAsc, key)
            ) {
                if (propertie !== key) {
                    this.orderStatusAsc[key] = false;
                }
            }
        }
        this.orderStatusAsc[propertie] = !this.orderStatusAsc[propertie];
        this.blocks = this.blocks.sort((a, b) => {
            let aValue: any = a[propertie] || '';
            let bValue: any = b[propertie] || '';

            if ('height' === propertie || 'extension' === propertie) {
                aValue = null === aValue ? -1 : aValue;
                bValue = null === bValue ? -1 : bValue;
                if (aValue < bValue) {
                    return this.orderStatusAsc[propertie] ? -1 : 1;
                }
                if (aValue > bValue) {
                    return this.orderStatusAsc[propertie] ? 1 : -1;
                }
            } else {
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortAlphanumerical(
                        aValue.toLowerCase().replace(' ', ''),
                        bValue.toLowerCase().replace(' ', ''),
                        this.orderStatusAsc[propertie]
                    );
                }
            }
            return 0;
        });
    }

    /**
     * Handles all component action emition
     * @param action constant value for action clicked
     * @param index optional row index to get data from array
     */
    public onActionClicked(action: number, block: TBlockModel) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.UPDATE:
                this.openEdit(block);
                break;
            case CONSTANTS.CRUD_ACTION.DELETE:
                this.deleteBlock(block);
                break;
            default:
                break;
        }
    }
}
