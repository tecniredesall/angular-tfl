import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TProducerModel } from 'src/app/shared/models/sil-producer';
import { FarmFederateModel, IFarmFederateModel } from '../../models/farm-federate.model';

@Component({
    selector: 'app-federate-farm',
    templateUrl: './federate-farm.component.html',
    styleUrls: ['./federate-farm.component.scss']
})
export class FederateFarmComponent implements OnInit {
    @Input() seller: TProducerModel;
    @Input() federatedFarms: Array<IFarmFederateModel> = [];
    @Output() closeEvent = new EventEmitter();
    @Output() emitEvent = new EventEmitter();
    @Output() createFarmEventEmiter = new EventEmitter();
    public federatedFarmsSelected: Array<IFarmFederateModel> = [];
    public showDetails: boolean = false;
    constructor() { }

    ngOnInit() {
    }

    public onCancelEvent() {
        this.closeEvent.emit();
    }
    public onShowFederatedFarmSelected(items: Array<FarmFederateModel>): void {
        this.federatedFarmsSelected = items;
        this.showDetails = true;

    }
    public onBackEmiterEvent(items: Array<FarmFederateModel>) {
        this.showDetails = true;
        this.federatedFarms.forEach(
            item => {
                item.selected = false;
            }
        );
        items.forEach(farm => {
            const index = this.federatedFarms.findIndex(x => x.farm.id === farm.farm.id);
            this.federatedFarms[index].selected = true;
        });
        setTimeout(() => {
            this.showDetails = false;
        }, 500);
    }
    public updateFarmsAdded() {
        this.emitEvent.emit();
    }
    public createFarmEvent() {
        this.createFarmEventEmiter.emit();
    }
}
