import { Subject } from 'rxjs';

import { Directive, OnDestroy } from '@angular/core';

@Directive({
    selector: '[appSubscriptionManager]',
})
export class SubscriptionManagerDirective implements OnDestroy {
    public destroy$ = new Subject();
    ngOnDestroy() {
        this.destroy$.next(true);
    }

    constructor() {}
}
