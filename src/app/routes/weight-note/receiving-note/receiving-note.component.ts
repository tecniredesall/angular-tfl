import { takeUntil } from 'rxjs/operators';
import { WeightService } from './../services/weight.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-receiving-note',
    templateUrl: './receiving-note.component.html',
    styleUrls: ['./receiving-note.component.scss'],
})
export class ReceivingNoteComponent  implements OnDestroy , OnInit{
    public searchText: string;
    public isOpen: boolean = false;
    public params = {};
    public PERMISSIONS = CONSTANTS.PERMISSIONS;
    public PERMISSION_TYPES = CONSTANTS.PERMISSION_TYPES;
    public isOpenFilter: boolean = false;
    public countFilter: number = 0;
    public isProductionNote: boolean = false;
    readonly RECEIVING_NOTE_STATUS: any = CONSTANTS.RECEIVING_NOTE_STATUS;
    readonly WEIGHT_NOTE_STATUS: any = CONSTANTS.WEIGHT_NOTE_STATUS;
    readonly RECEIVING_NOTE_PRODUCTION_STATUS: any = CONSTANTS.RECEIVING_NOTE_PRODUCTION_STATUS;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _weightService: WeightService

    ) {
        let params: Params = this._activatedRoute.snapshot?.queryParams;
        this.isProductionNote = !!('true' == params?.production);

    }
    ngOnInit(): void {
        this._weightService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe((params:any) => {
           this.searchText = params
        })
    }
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public onOpenFilter() {
        this.isOpenFilter = true;
    }

    public onCloseFilter(value: boolean) {
        this.isOpenFilter = value
    }

    public onCountSelectedFilters(countSelectedFilters: number) {
        this.countFilter = countSelectedFilters
    }

    /**
     * Select Note list to display input or production
     * @param isProcessedList   if isProcessedList is true show production notes
     */
    public selectNoteList(isProcessedList: boolean): void {
        if (this.isProductionNote != isProcessedList) {
            this.isProductionNote = isProcessedList;
            this.searchText = '';
            this._weightService.searchTerm$.next('')
            this.countFilter =isProcessedList ? localStorage.getItem('weightNotesFilters') 
            ? JSON.parse(localStorage.getItem('weightNotesFilters'))?.numFilters 
            : 0 : 0;
        }
    }

}
