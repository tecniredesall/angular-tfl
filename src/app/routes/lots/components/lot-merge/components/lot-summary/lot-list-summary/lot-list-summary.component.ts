import { Component, Input, OnInit } from '@angular/core';
import { ILotListWeightNoteGrouper } from 'src/app/routes/lots/models/lot-list-weight-note-grouper.model';
import { reverseSortByKey, sortBykey } from 'src/app/shared/utils/functions/sortFunction';
import { ITRConfiguration, TRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Component({
	selector: 'app-lot-list-summary',
	templateUrl: './lot-list-summary.component.html',
	styleUrls: ['./lot-list-summary.component.scss']
})
export class LotListSummaryComponent implements OnInit {
	@Input() lots: Array<ILotListWeightNoteGrouper> = [];
	@Input() configuration: ITRConfiguration = new TRConfiguration();
	public panelOpened = false;
	constructor() { }
	ngOnInit() {
	}
	public onPanelOpened() {
		this.panelOpened = !this.panelOpened;
	}
}
