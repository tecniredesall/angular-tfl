import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnitMeasureEditComponent } from './unit-measure-edit.component';

describe('UnitMeasureEditComponent', () => {
  let component: UnitMeasureEditComponent;
  let fixture: ComponentFixture<UnitMeasureEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitMeasureEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitMeasureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
