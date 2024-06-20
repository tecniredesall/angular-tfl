import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { ITRFilter, TRFilter } from '../../models/filter-data.model';

import { FiltersComponent } from './filter.component';

export class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({ action: true }),
        };
    }
}

class MockedFilterService {
    private behaviorSubject = new BehaviorSubject(null);

    getObservable(): Observable<any> {
        return this.behaviorSubject.asObservable();
    }

    setObservable(value: any): void {
        this.behaviorSubject.next(value);
    }
}

describe('FiltersComponent', () => {
    let component: FiltersComponent;
    let fixture: ComponentFixture<FiltersComponent>;

    beforeEach(waitForAsync(() => {
        const newForm: ITRFilter = new TRFilter();

        TestBed.configureTestingModule({
            declarations: [FiltersComponent],
            imports: [
                SharedModule,
                HttpClientTestingModule,
                RouterTestingModule,
                BrowserAnimationsModule,
            ],
            providers: [
                I18nService,
                I18nPipe,
                AlertService,
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: MAT_DIALOG_DATA, useValue: newForm },
            ],
        });
        fixture = TestBed.createComponent(FiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should get 1 count number filters when selected "status" param', () => {
        let newForm: ITRFilter = {
            date: { start: null, end: null },
            status: {
                selected: [1],
                lookups: { OPEN: 1, CLOSED: 2, DELETED: 3 },
            },
            origin: [],
            destination: [],
            users: [],
            warehouses: [],
        };

        component.setForm(newForm);
        const numFilter = component.checkCountSelectedFilters();
        fixture.detectChanges();

        // assertions
        expect(numFilter).toEqual(1);
    });

    it('should get 3 count number filters when selected "origin", "destination" & "status" params', () => {
        let newForm: ITRFilter = {
            date: { start: null, end: null },
            status: {
                selected: [1],
                lookups: { OPEN: 1, CLOSED: 2, DELETED: 3 },
            },
            origin: [{ id: 1, name: 'Solcafé Company' }],
            destination: [{ id: 1, name: 'Solcafé Company' }],
            users: [],
            warehouses: [],
        };

        component.setForm(newForm);
        const numFilter = component.checkCountSelectedFilters();
        fixture.detectChanges();

        // assertions
        expect(numFilter).toEqual(3);
    });
});
