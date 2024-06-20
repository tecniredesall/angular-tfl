import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-confirm-cancel-modal',
    templateUrl: './confirm-cancel-modal.component.html',
    styleUrls: ['./confirm-cancel-modal.component.scss'],
})
export class ConfirmCancelModalComponent {
    constructor(private _route: Router) {}

    public onEventCancelCreation(): void {
        this._route.navigateByUrl('/routes/weight-note?tab=lots');
    }
}
