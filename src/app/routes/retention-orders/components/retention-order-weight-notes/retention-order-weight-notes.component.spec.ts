import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionOrderWeightNotesComponent } from './retention-order-weight-notes.component';

describe('RetentionOrderWeightNotesComponent', () => {
  let component: RetentionOrderWeightNotesComponent;
  let fixture: ComponentFixture<RetentionOrderWeightNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetentionOrderWeightNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionOrderWeightNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
