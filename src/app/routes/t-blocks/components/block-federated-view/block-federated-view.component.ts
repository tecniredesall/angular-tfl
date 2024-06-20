import { TFarmModel } from 'src/app/routes/t-farms/models/farm.model';

import { Component, Input, OnInit } from '@angular/core';

import { TBlockModel } from '../../models/block.model';

@Component({
    selector: 'app-block-federated-view',
    templateUrl: './block-federated-view.component.html',
    styleUrls: ['./block-federated-view.component.scss'],
})
export class BlockFederatedViewComponent implements OnInit {
    @Input() block: TBlockModel;
    public farm: TFarmModel;
    constructor() {}

    ngOnInit() {
        this.farm = this.block.farm;
    }
}
