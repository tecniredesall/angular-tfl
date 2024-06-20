import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {
    Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';

import { PaginationModel } from '../../utils/models/paginator.model';

@Directive({
    selector: '[appScrollPagination]',
})
export class ScrollPaginationDirective implements OnInit, OnDestroy {
    @Input() pagination: PaginationModel;
    @Output() loadNextPage = new EventEmitter();
    private destroy$ = new Subject();

    constructor(private elRef: ElementRef) {}

    public ngOnInit() {
        fromEvent(this.elRef.nativeElement, 'scroll')
            .pipe(
                takeUntil(this.destroy$),
                filter(() => {
                    const nativeElement = this.elRef
                        .nativeElement as HTMLElement;
                    const scrollHeight = nativeElement.scrollHeight;
                    const scrollY =
                        nativeElement.scrollTop + nativeElement.offsetHeight;
                    return scrollY >= scrollHeight;
                }),
                filter(
                    () =>
                        this.pagination.current_page < this.pagination.last_page
                )
            )
            .subscribe(() =>
                this.loadNextPage.emit(this.pagination.next_page_url)
            );
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
    }
}
