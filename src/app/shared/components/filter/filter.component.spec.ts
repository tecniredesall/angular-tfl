import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { I18nPipe } from '../../i18n/i18n.pipe';
import { I18nService } from '../../i18n/i18n.service';
import { ITRFilter, TRFilter } from '../../models/filter-data.model';
import { SharedModule } from '../../shared.module';
import { AlertService } from '../../utils/alerts/alert.service';

import { FiltersComponent } from './filter.component';
export class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({ action: true }),
        };
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

    fit('should create', () => {
        expect(component).toBeTruthy();
    });

    fit('should get 1 count number filters when selected "productionStatus" param', () => {
        let newForm: ITRFilter = {
            date: { start: null, end: null },
            productionStatus: {
                selected: [1],
                lookups: { OPEN: 1, CLOSED: 2, DELETED: 3 },
            },
            seals: undefined,
            status: undefined
        };

        component.setForm(newForm);
        const numFilter = component.checkCountSelectedFilters();
        fixture.detectChanges();

        // assertions
        expect(numFilter).toEqual(1);
    });

    fit('should get 3 count number filters when selected "productionStatus", "paymentStatus" & "status" params', () => {
        let newForm: ITRFilter = {
            date: { start: null, end: null },
            productionStatus: {
                selected: [1],
                lookups: { OPEN: 1, CLOSED: 2, DELETED: 3 },
            },
            paymentStatus: {
                selected: [1],
                lookups: { OPEN: 1, CLOSED: 2, DELETED: 3 },
            },
            status: {
                selected: [1],
                lookups: { OPEN: 1, CLOSED: 2, DELETED: 3 },
            },
            seals: undefined,
        };

        component.setForm(newForm);
        const numFilter = component.checkCountSelectedFilters();
        fixture.detectChanges();

        // assertions
        expect(numFilter).toEqual(3);
    });
});
