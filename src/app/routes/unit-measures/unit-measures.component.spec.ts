import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnitMeasuresComponent } from './unit-measures.component';

describe('UnitMeasuresComponent', () => {
    let component: UnitMeasuresComponent;
    let fixture: ComponentFixture<UnitMeasuresComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UnitMeasuresComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UnitMeasuresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
