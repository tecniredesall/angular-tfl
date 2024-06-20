import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransformationDeleteModalComponent } from './transformation-delete-modal.component';

describe('TransformationDeleteModalComponent', () => {
  let component: TransformationDeleteModalComponent;
  let fixture: ComponentFixture<TransformationDeleteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransformationDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
