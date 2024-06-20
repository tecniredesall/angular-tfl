import { NotifierService } from 'angular-notifier';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockModalUiComponent } from 'src/app/shared/block/block-modal.component';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { IAssociatesModel } from '../../models/associates.model';
import {
    RelatedProducersService
} from '../../services/related-producers/related-producers.service';

declare const $: any;

@Component({
    selector: 'app-related-producers-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.css'],
})
export class ListViewRelatedProducersComponent implements OnChanges {
    @BlockUI('delete-related-producers') blockUI: NgBlockUI;
    @Input() producers: Array<any> = [];
    @Output() deleteEvent = new EventEmitter();

    public deleteRelatedProducer: IAssociatesModel;
    public blockTemplate: BlockModalUiComponent;
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public orderStatusAsc: {
        name: boolean;
    } = {
        name: false,
    };

    constructor(
        private i18n: I18nPipe,
        private relatedProducersService: RelatedProducersService,
        private notifierService: NotifierService
    ) {
        this.blockTemplate = BlockModalUiComponent;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.producers.firstChange) {
            this.orderStatusAsc = {
                name: false,
            };
        }
        this.sortRelated('name');
    }

    public deleteRelation(producerRelatedModel: IAssociatesModel) {
        this.deleteRelatedProducer = producerRelatedModel;
        $('#deleteRelatedProducerModal').modal('show');
    }

    public onCancelDeleteRelation() {
        this.deleteRelatedProducer = null;
        $('#deleteRelatedProducerModal').modal('hide');
    }

    public onConfirmDeleteRelation() {
        this.blockUI.start();
        this.relatedProducersService
            .deleteProducerRelation(this.deleteRelatedProducer.id)
            .subscribe(
                (response) => {
                    this.blockUI.stop();
                    this.onCancelDeleteRelation();
                    this.notifierService.notify(
                        'success',
                        this.i18n.transform(
                            't-producer-related-list-delete-confirmation'
                        )
                    );
                    this.deleteEvent.emit();
                },
                (error) => {
                    this.blockUI.stop();
                    this.notifierService.notify(
                        'error',
                        this.i18n.transform(error.message)
                    );
                }
            );
    }

    public onSearch(search: string) {
        if (search.trim() !== '') {
            return this.producers.filter((p) => {
                return p.name.toLowerCase().includes(search.toLowerCase());
            });
        }
    }

    public onClearSearch() {
        return this.producers;
    }

    public sortRelated(propertie: string): void {
        for (const key in this.orderStatusAsc) {
            if (
                Object.prototype.hasOwnProperty.call(this.orderStatusAsc, key)
            ) {
                if (propertie != key) {
                    this.orderStatusAsc[key] = true;
                }
            }
        }

        this.orderStatusAsc[propertie] = !this.orderStatusAsc[propertie];

        this.producers = this.producers.sort((a, b) => {
            let aValue: any = a[propertie];
            let bValue: any = b[propertie];

            if (aValue < bValue) {
                return this.orderStatusAsc[propertie] ? -1 : 1;
            }

            if (aValue > bValue) {
                return this.orderStatusAsc[propertie] ? 1 : -1;
            }

            return 0;
        });
    }
}
