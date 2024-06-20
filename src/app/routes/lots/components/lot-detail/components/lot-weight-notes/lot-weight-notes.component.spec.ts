import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LotWeightNotesComponent } from './lot-weight-notes.component';

describe('LotWeightNotesComponent', () => {
  let component: LotWeightNotesComponent;
  let fixture: ComponentFixture<LotWeightNotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotWeightNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotWeightNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
