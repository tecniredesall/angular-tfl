import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransformationTypesComponent } from './transformation-types.component';

describe('TransformationTypesComponent', () => {
  let component: TransformationTypesComponent;
  let fixture: ComponentFixture<TransformationTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransformationTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
