import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { CONSTANTS } from '../../../../../shared/utils/constants/constants';
import { IFarmFederateModel } from '../../../models/farm-federate.model';
@Component({
    selector: 'app-federate-farm-list',
    templateUrl: './federate-farm-list.component.html',
    styleUrls: ['./federate-farm-list.component.scss',
        './../../../../producers/components/actions-relate-producer/actions-relate-producer.component.css']
})
export class FederateFarmListComponent implements OnInit, OnChanges {
    @Input() seller: TProducerModel;
    @Input() federatedFarms: Array<IFarmFederateModel> = [];
    @Output() cancelEmiter = new EventEmitter();
    @Output() createFarmEventEmmiter = new EventEmitter();
    @Output() addFederatedEmiter = new EventEmitter<Array<IFarmFederateModel>>();
    public searchControl = {
        value: '',
        isDisabled: false,
        isFocus: false,
        isSubmit: false,
        isLoading: false
    };
    public federatedFarmsSelected: Array<IFarmFederateModel> = [];
    public federatedFarmsOriginal: Array<IFarmFederateModel> = []
    public showDetailFarm: boolean = false;
    public orderStatusAsc = {
        name: false
    }
    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.federatedFarms) {
            this.federatedFarms.sort((a, b) => (a.farm['name'] > b.farm['name']) ? 1 : -1)
            if (changes.federatedFarms.currentValue !== changes.federatedFarms.previousValue) {
                this.federatedFarms = changes.federatedFarms.currentValue;
                this.federatedFarmsSelected = this.federatedFarms.filter(x => x.selected=== true);
            }
        }
    }

    ngOnInit() {
        this.federatedFarmsOriginal = Array.from(this.federatedFarms);
    }

    public onClearSearchInput(): void {
        this.federatedFarms = Array.from(this.federatedFarmsOriginal);
        this.searchControl.value = '';
    }

    public searchFilter(): void {
        this.federatedFarms = this.federatedFarmsOriginal
            .filter(
                x => x.farm.name.toLowerCase()
                    .includes(this.searchControl.value.toLowerCase()));
    }

    public onChangeStatusFarm(farm: IFarmFederateModel) {
        farm.selected = !farm.selected;
        farm.edit = false;
        if (farm.selected) {
            this.federatedFarmsSelected.push(farm);
        } else {
            const indexItem = this.federatedFarmsSelected.findIndex(x => x.farm.id === farm.farm.id);
            this.federatedFarmsSelected.splice(indexItem, 1);
        }
    }
    public onActionFooterSelected(action) {
        switch (action) {
            case CONSTANTS.CRUD_ACTION.CANCEL: {
                this.cancelEmiter.emit();
                break;
            }
            case CONSTANTS.CRUD_ACTION.CREATE: {
                this.addFederatedEmiter.emit(this.federatedFarmsSelected);
                break;
            }
        }
    }
    public onCreateFarmFromForm() {
        this.createFarmEventEmmiter.emit();
    }

    public sortFarm(property: string) {
        this.orderStatusAsc[property] = !this.orderStatusAsc[property];
        this.federatedFarms.sort((a, b) => this.orderStatusAsc[property] ? 
            (a.farm[property] < b.farm[property]) ? 1 : -1 : (a.farm[property] > b.farm[property]) ? 1 : -1)
    }
}
