import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IActionDataModel } from 'src/app/routes/producers/models/action-data.model';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { sortAlphanumerical } from 'src/app/shared/utils/functions/sortFunction';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { TBlockModel } from '../../models/block.model';
import { IInputDataActionsBlockModel } from '../../models/input-data-actions-block.model';

@Component({
    selector: 'app-block-federated-list',
    templateUrl: './block-federated-list.component.html',
    styleUrls: ['./block-federated-list.component.scss'],
})
export class BlockFederatedListComponent implements OnInit, OnDestroy {
    @Input() data: IInputDataActionsBlockModel | IActionDataModel = null;
    @Input() blocks: TBlockModel[];
    @Input() selectedBlocks: TBlockModel[] = [];
    @Output() eventCancel: EventEmitter<boolean> = new EventEmitter();
    @Output() eventRefresh = new EventEmitter();
    @Output() showFederatedForm: EventEmitter<TBlockModel[]> =
        new EventEmitter();
    @Output() newBlock = new EventEmitter();
    public blockSearchInput = new UntypedFormControl('');
    public producer: TProducerModel;
    public filteredBlocks: TBlockModel[] = [];

    public orderStatusAsc: {
        name: boolean;
        farmName: boolean;
    } = {
            name: true,
            farmName: false,
        };

    private _destroy$ = new Subject();

    constructor() { }

    ngOnInit() {
        this.producer = (this.data as IActionDataModel).producer;
        this.blocks = this.setSelectedBlocks(
            this.blocks,
            this.selectedBlocks ?? []
        );
        this.blocks = this.blocks.sort((a, b) => {
            let aValue: any = a['name'];
            let bValue: any = b['name'];
            return sortAlphanumerical(
                aValue.toLowerCase().replace(' ', ''),
                bValue.toLowerCase().replace(' ', ''),
                true
            );
        });
        this.filteredBlocks = this.blocks as TBlockModel[];

        this.blockSearchInput.valueChanges
            .pipe(takeUntil(this._destroy$))
            .subscribe((v) => {
                if (!v) {
                    this.filteredBlocks = this.blocks as TBlockModel[];
                }
            });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
    }

    public setSelectedBlocks(
        blocks: TBlockModel[],
        federatedBlocks: TBlockModel[]
    ) {
        blocks.forEach((b) => {
            const found = federatedBlocks.find((f) => f.id === b.id);
            if (found) {
                b.isSelected = true;
            }
        });
        return blocks;
    }
    public onClearBlockSearch() {
        this.blockSearchInput.setValue('');
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

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortAlphanumerical(
                    aValue.toLowerCase().replace(' ', ''),
                    bValue.toLowerCase().replace(' ', ''),
                    this.orderStatusAsc[propertie]
                );
            }
            return 0;
        });
    }
    public onAddClick() {
        this.showFederatedForm.emit(this.selectedBlocks);
    }
    public onCancelClick() {
        this.eventCancel.emit();
    }
    public onCheckChanged(value: MatCheckboxChange, block: TBlockModel) {
        this.blocks[
            this.blocks.findIndex((b) => b.id === block.id)
        ].isSelected = value.checked;
        if (value.checked) {
            this.selectedBlocks.push(block);
        } else {
            this.selectedBlocks = this.selectedBlocks.filter(
                (b) => b.id !== block.id
            );
        }
    }
    public onNewBlock() {
        this.newBlock.emit();
    }
    public onSearchClick() {
        this.filteredBlocks = (this.blocks as TBlockModel[]).filter((b) =>
            b.name
                .toLowerCase()
                .includes(this.blockSearchInput.value.toLowerCase())
        );
    }
}
