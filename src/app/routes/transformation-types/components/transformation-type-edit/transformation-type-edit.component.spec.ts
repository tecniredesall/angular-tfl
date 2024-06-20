import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransformationTypeEditComponent } from './transformation-type-edit.component';

describe('TransformationTypeEditComponent', () => {
  let component: TransformationTypeEditComponent;
  let fixture: ComponentFixture<TransformationTypeEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransformationTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
