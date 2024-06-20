import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-not-results-found',
    templateUrl: './not-results-found.component.html',
    styleUrls: ['./not-results-found.component.scss'],
})
export class NotResultsFoundComponent implements OnInit {
    @Input() showSubtitle = true;
    @Input() imgName = 'search-empty';
    @Input() customMessage:string = null;
    @Input() buttonLink: {
        symbol: string,
        link: string,
        label: string
    };
    constructor() { }

    ngOnInit() { }
}
